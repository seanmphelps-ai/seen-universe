import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildLocationField } from '../buildLocationField';
import type { LocationInput, LocationField } from '../types';
import geocoderFixture from '../fixtures/censusGeocoder.json';
import acsCountyFixture from '../fixtures/censusAcsCounty.json';
import acsStateFixture from '../fixtures/censusAcsState.json';
import acsNationalFixture from '../fixtures/censusAcsNational.json';
import blsFixture from '../fixtures/blsLaus.json';

const baseInput: LocationInput = {
  label: 'Los Angeles, CA',
  latitude: 34.0522,
  longitude: -118.2437,
  exposureStart: '2018-01-01',
  exposureEnd: '2022-12-31',
  role: 'LIVED',
};

function jsonResponse(body: unknown, ok = true, status = 200) {
  const response = {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
    clone(): Response {
      return jsonResponse(body, ok, status);
    },
  };
  return response as unknown as Response;
}

function installHappyPathFetchMock() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, init?: RequestInit) => {
      if (url.includes('geocoding.geo.census.gov')) {
        return Promise.resolve(jsonResponse(geocoderFixture));
      }
      if (url.includes('api.census.gov')) {
        if (url.includes('for=county')) return Promise.resolve(jsonResponse(acsCountyFixture));
        if (url.includes('for=state')) return Promise.resolve(jsonResponse(acsStateFixture));
        if (url.includes('for=us')) return Promise.resolve(jsonResponse(acsNationalFixture));
      }
      if (url.includes('api.bls.gov')) {
        return Promise.resolve(jsonResponse(blsFixture));
      }
      throw new Error(`Unexpected fetch in test: ${url}`);
    }),
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildLocationField — happy path (fixture-backed, no live network)', () => {
  it('builds a complete LocationField with real-shaped fixture data', async () => {
    installHappyPathFetchMock();
    const field = await buildLocationField(baseInput);

    expect(field.geography?.countyName).toBe('Los Angeles');
    expect(field.adapterFailures).toHaveLength(0);

    const income = field.findings.find((f) => f.conditionId === 'median_household_income');
    expect(income?.rawValue).toBe(76367);
    expect(income?.status).not.toBe('UNKNOWN');
    expect(income?.provenance?.sourceAuthority).toBe('U.S. Census Bureau');

    const bls = field.findings.find((f) => f.conditionId === 'unemployment_rate_bls');
    expect(bls?.rawValue).toBe(4.8);
    expect(bls?.provenance?.sourceAuthority).toBe('U.S. Bureau of Labor Statistics');

    expect(field.unknownConditions).toHaveLength(0);
  });
});

describe('buildLocationField — independent adapter failure', () => {
  it('degrades only BLS to UNKNOWN when BLS fails, leaving Census findings intact', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('geocoding.geo.census.gov')) return Promise.resolve(jsonResponse(geocoderFixture));
        if (url.includes('api.census.gov')) {
          if (url.includes('for=county')) return Promise.resolve(jsonResponse(acsCountyFixture));
          if (url.includes('for=state')) return Promise.resolve(jsonResponse(acsStateFixture));
          if (url.includes('for=us')) return Promise.resolve(jsonResponse(acsNationalFixture));
        }
        if (url.includes('api.bls.gov')) return Promise.resolve(jsonResponse({}, false, 503));
        throw new Error(`Unexpected fetch: ${url}`);
      }),
    );

    const field = await buildLocationField(baseInput);

    const income = field.findings.find((f) => f.conditionId === 'median_household_income');
    expect(income?.status).not.toBe('UNKNOWN');

    const bls = field.findings.find((f) => f.conditionId === 'unemployment_rate_bls');
    expect(bls?.status).toBe('UNKNOWN');
    expect(field.unknownConditions).toContain('unemployment_rate_bls');
    expect(field.adapterFailures.some((f) => f.adapter === 'bls-laus')).toBe(true);
  });

  it('degrades only Census/ACS conditions to UNKNOWN when ACS fails, leaving BLS intact', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('geocoding.geo.census.gov')) return Promise.resolve(jsonResponse(geocoderFixture));
        if (url.includes('api.census.gov')) return Promise.resolve(jsonResponse({}, false, 503));
        if (url.includes('api.bls.gov')) return Promise.resolve(jsonResponse(blsFixture));
        throw new Error(`Unexpected fetch: ${url}`);
      }),
    );

    const field = await buildLocationField(baseInput);

    const income = field.findings.find((f) => f.conditionId === 'median_household_income');
    expect(income?.status).toBe('UNKNOWN');

    const bls = field.findings.find((f) => f.conditionId === 'unemployment_rate_bls');
    expect(bls?.rawValue).toBe(4.8);
    expect(bls?.status).not.toBe('UNKNOWN');
  });

  it('marks every condition UNKNOWN, with no fabricated data, when geography cannot be resolved', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(jsonResponse({ result: { geographies: {} } }))),
    );

    const field = await buildLocationField(baseInput);

    expect(field.geography).toBeNull();
    expect(field.findings.every((f) => f.status === 'UNKNOWN')).toBe(true);
    expect(field.findings.every((f) => f.rawValue === null)).toBe(true);
    expect(field.adapterFailures.some((f) => f.adapter === 'census-geocoder')).toBe(true);
  });
});

describe('buildLocationField — delta against a previous LocationField', () => {
  it('computes directional delta per condition without collapsing to one score', async () => {
    installHappyPathFetchMock();
    const current = await buildLocationField(baseInput);

    const previous: LocationField = {
      ...current,
      findings: current.findings.map((f) => ({
        ...f,
        rawValue: f.rawValue !== null ? f.rawValue * 0.5 : null,
      })),
    };

    const withDelta = await (async () => {
      installHappyPathFetchMock();
      return buildLocationField(baseInput, previous);
    })();

    expect(withDelta.delta).not.toBeNull();
    const incomeDelta = withDelta.delta!.find((d) => d.conditionId === 'median_household_income');
    expect(incomeDelta?.direction).toBe('INCREASED');
    expect(incomeDelta?.previousValue).toBeCloseTo(76367 * 0.5, 2);
    expect(incomeDelta?.currentValue).toBe(76367);
  });

  it('returns delta: null when no previous field is supplied', async () => {
    installHappyPathFetchMock();
    const field = await buildLocationField(baseInput);
    expect(field.delta).toBeNull();
  });
});
