import { describe, it, expect } from 'vitest';
import {
  parseAcsResponse,
  deriveMaterialFieldMetrics,
  CensusAcsError,
  buildAcsUrl,
  redactApiKey,
} from '../adapters/censusAcs';
import countyFixture from '../fixtures/censusAcsCounty.json';
import stateFixture from '../fixtures/censusAcsState.json';
import nationalFixture from '../fixtures/censusAcsNational.json';

describe('buildAcsUrl', () => {
  it('appends the key param when an API key is provided', () => {
    const url = buildAcsUrl('2020', 'for=county:037&in=state:06', 'SECRET123');
    expect(url).toContain('&key=SECRET123');
  });

  it('omits the key param entirely when no key is provided', () => {
    const url = buildAcsUrl('2020', 'for=county:037&in=state:06');
    expect(url).not.toContain('key=');
  });
});

describe('redactApiKey', () => {
  it('replaces a key query param with a redacted placeholder', () => {
    const url = 'https://api.census.gov/data/2020/acs/acs5?get=NAME&for=us:1&key=SECRET123';
    const redacted = redactApiKey(url);
    expect(redacted).not.toContain('SECRET123');
    expect(redacted).toContain('key=[REDACTED]');
  });

  it('is a no-op on a URL with no key param', () => {
    const url = 'https://api.census.gov/data/2020/acs/acs5?get=NAME&for=us:1';
    expect(redactApiKey(url)).toBe(url);
  });
});

describe('parseAcsResponse', () => {
  it('parses a real-shaped county ACS response', () => {
    const row = parseAcsResponse(countyFixture);
    expect(row.name).toBe('Los Angeles County, California');
    expect(row.medianHouseholdIncome).toBe(76367);
    expect(row.povertyPopulation).toBe(1345678);
    expect(row.povertyUniverse).toBe(9876543);
    expect(row.unemployedCount).toBe(312456);
    expect(row.laborForceCount).toBe(5123456);
  });

  it('parses state and national fixtures the same way', () => {
    expect(parseAcsResponse(stateFixture).name).toBe('California');
    expect(parseAcsResponse(nationalFixture).name).toBe('United States');
  });

  it('throws (not silently returns nulls) when the response is not the documented array shape', () => {
    expect(() => parseAcsResponse({ not: 'an array' })).toThrow(CensusAcsError);
    expect(() => parseAcsResponse([])).toThrow(CensusAcsError);
    expect(() => parseAcsResponse([['NAME']])).toThrow(CensusAcsError);
  });

  it('throws when an expected variable is missing from the header (upstream shape change)', () => {
    const broken = [['NAME', 'B19013_001E'], ['Somewhere', '50000']];
    expect(() => parseAcsResponse(broken)).toThrow(/missing expected variable/);
  });

  it('treats ACS negative sentinel values as null, not as real negative numbers', () => {
    const withSentinel = [
      ['NAME', 'B19013_001E', 'B17001_002E', 'B17001_001E', 'B23025_005E', 'B23025_002E'],
      ['Nowhere', '-666666666', '100', '1000', '50', '500'],
    ];
    const row = parseAcsResponse(withSentinel);
    expect(row.medianHouseholdIncome).toBeNull();
  });
});

describe('deriveMaterialFieldMetrics', () => {
  it('computes poverty rate and unemployment rate from raw counts', () => {
    const row = parseAcsResponse(countyFixture);
    const metrics = deriveMaterialFieldMetrics(row);
    expect(metrics.medianHouseholdIncome).toBe(76367);
    expect(metrics.povertyRatePercent).toBeCloseTo((1345678 / 9876543) * 100, 5);
    expect(metrics.unemploymentRatePercent).toBeCloseTo((312456 / 5123456) * 100, 5);
  });

  it('returns null derived metrics when the underlying counts are missing rather than dividing by null', () => {
    const row = {
      name: 'Nowhere',
      medianHouseholdIncome: null,
      povertyPopulation: null,
      povertyUniverse: null,
      unemployedCount: null,
      laborForceCount: null,
    };
    const metrics = deriveMaterialFieldMetrics(row);
    expect(metrics.medianHouseholdIncome).toBeNull();
    expect(metrics.povertyRatePercent).toBeNull();
    expect(metrics.unemploymentRatePercent).toBeNull();
  });
});
