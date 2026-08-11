import { describe, it, expect } from 'vitest';
import {
  buildLausUnemploymentRateSeriesId,
  parseBlsResponse,
  extractAnnualAverage,
  BlsLausError,
} from '../adapters/blsLaus';
import blsFixture from '../fixtures/blsLaus.json';

describe('buildLausUnemploymentRateSeriesId', () => {
  it('builds the documented 20-character LAUS county series ID', () => {
    const id = buildLausUnemploymentRateSeriesId('06', '037');
    expect(id).toBe('LAUCN060370000000003');
    expect(id.length).toBe(20);
  });

  it('pads short state/county FIPS codes', () => {
    expect(buildLausUnemploymentRateSeriesId('6', '37')).toBe('LAUCN060370000000003');
  });
});

describe('parseBlsResponse', () => {
  const seriesId = 'LAUCN060370000000003';

  it('parses a real-shaped BLS API v2 response', () => {
    const result = parseBlsResponse(blsFixture, seriesId);
    expect(result.seriesID).toBe(seriesId);
    expect(result.data).toHaveLength(3);
    expect(result.data[0].value).toBe(4.9);
  });

  it('throws when status is not REQUEST_SUCCEEDED rather than treating it as empty data', () => {
    expect(() => parseBlsResponse({ status: 'REQUEST_NOT_PROCESSED' }, seriesId)).toThrow(
      BlsLausError,
    );
  });

  it('throws when the requested series is absent from the response', () => {
    expect(() =>
      parseBlsResponse(blsFixture, 'LAUCN999990000000003'),
    ).toThrow(/did not include the requested series/);
  });
});

describe('extractAnnualAverage', () => {
  it('picks the M13 (annual average) period for the requested year', () => {
    const result = parseBlsResponse(blsFixture, 'LAUCN060370000000003');
    expect(extractAnnualAverage(result, '2022')).toBe(4.9);
    expect(extractAnnualAverage(result, '2020')).toBe(4.8);
  });

  it('returns null when no annual-average point exists for that year', () => {
    const result = parseBlsResponse(blsFixture, 'LAUCN060370000000003');
    expect(extractAnnualAverage(result, '1999')).toBeNull();
  });
});
