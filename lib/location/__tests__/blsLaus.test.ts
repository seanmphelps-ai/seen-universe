import { describe, it, expect } from 'vitest';
import {
  buildLausUnemploymentRateSeriesId,
  parseBlsResponse,
  extractAnnualAverage,
  sanitizeControlCharacters,
  BlsLausError,
} from '../adapters/blsLaus';
import blsFixture from '../fixtures/blsLaus.json';

describe('sanitizeControlCharacters', () => {
  it('removes a raw control character embedded inside a JSON string so it becomes parseable', () => {
    const rawControlChar = String.fromCharCode(0x0b); // vertical tab — observed cause of the live failure
    const malformed = `{"footnotes":[{"text":"note${rawControlChar}here"}]}`;
    expect(() => JSON.parse(malformed)).toThrow();

    const sanitized = sanitizeControlCharacters(malformed);
    expect(() => JSON.parse(sanitized)).not.toThrow();
    expect(JSON.parse(sanitized)).toEqual({ footnotes: [{ text: 'notehere' }] });
  });

  it('leaves ordinary text untouched', () => {
    const text = '{"a":"plain text, nothing weird"}';
    expect(sanitizeControlCharacters(text)).toBe(text);
  });
});

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

  it('redacts the API key from BLS error messages that echo it back (live-observed behavior)', () => {
    const apiKey = 'f0b505d75088441cac8bf73d71a914dd';
    const response = {
      status: 'REQUEST_NOT_PROCESSED',
      message: [`The key:${apiKey}. provided by the User is invalid.`],
    };
    try {
      parseBlsResponse(response, seriesId, apiKey);
      throw new Error('expected parseBlsResponse to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(BlsLausError);
      const message = (err as Error).message;
      expect(message).not.toContain(apiKey);
      expect(message).toContain('[REDACTED]');
    }
  });

  it('still redacts when the key passed in has surrounding whitespace but the echoed message does not (root cause of the live leak)', () => {
    const cleanKey = 'f0b505d75088441cac8bf73d71a914dd';
    const keyWithWhitespace = `${cleanKey}\n`; // e.g. pasted into a dashboard field
    const response = {
      status: 'REQUEST_NOT_PROCESSED',
      message: [`The key:${cleanKey}. provided by the User is invalid.`],
    };
    try {
      parseBlsResponse(response, seriesId, keyWithWhitespace);
      throw new Error('expected parseBlsResponse to throw');
    } catch (err) {
      const message = (err as Error).message;
      expect(message).not.toContain(cleanKey);
      expect(message).toContain('[REDACTED]');
    }
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
