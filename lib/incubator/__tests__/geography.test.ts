import { describe, it, expect } from 'vitest';
import { parseGeocoderResponse, buildGeocoderUrl, GeographyResolutionError } from '../geography';
import geocoderFixture from '../fixtures/censusGeocoder.json';

describe('buildGeocoderUrl', () => {
  it('builds the real Census Geocoder coordinates endpoint', () => {
    const url = buildGeocoderUrl(34.0522, -118.2437);
    expect(url).toContain('https://geocoding.geo.census.gov/geocoder/geographies/coordinates');
    expect(url).toContain('x=-118.2437');
    expect(url).toContain('y=34.0522');
    expect(url).toContain('layers=Counties%2CStates');
  });
});

describe('parseGeocoderResponse', () => {
  it('parses a real-shaped Census Geocoder response into HistoricalGeography', () => {
    const geography = parseGeocoderResponse(
      geocoderFixture,
      34.0522,
      -118.2437,
      'https://example.test',
      '2026-01-01T00:00:00.000Z',
    );
    expect(geography.stateFips).toBe('06');
    expect(geography.stateName).toBe('California');
    expect(geography.countyFips).toBe('037');
    expect(geography.countyName).toBe('Los Angeles');
    expect(geography.geographicResolution).toBe('county');
  });

  it('throws when geographies is missing (upstream shape change)', () => {
    expect(() =>
      parseGeocoderResponse({ result: {} }, 0, 0, 'url', 'now'),
    ).toThrow(GeographyResolutionError);
  });

  it('throws when no county/state match is found rather than returning a fabricated geography', () => {
    const empty = { result: { geographies: { Counties: [], States: [] } } };
    expect(() => parseGeocoderResponse(empty, 0, 0, 'url', 'now')).toThrow(
      /no county\/state match/,
    );
  });

  it('throws when a matched entry is missing required fields (upstream shape change)', () => {
    const malformed = {
      result: { geographies: { Counties: [{ STATE: '06' }], States: [{ STATE: '06' }] } },
    };
    expect(() => parseGeocoderResponse(malformed, 0, 0, 'url', 'now')).toThrow(
      GeographyResolutionError,
    );
  });
});
