// SEEN Location V1 — historical geography resolution.
//
// Resolves latitude/longitude to a county via the real, public U.S. Census
// Bureau Geocoder API. County-level only (see types.ts for why).
//
// Endpoint and response shape are the real, documented Census Geocoder
// "geographies/coordinates" contract:
// https://geocoding.geo.census.gov/geocoder/Geographies.html
//
// This module cannot be exercised end-to-end from this build session — the
// sandbox blocks outbound requests to geocoding.geo.census.gov. Parsing
// logic is covered by fixture-based unit tests instead. See
// scripts/verify-location-live.ts for the real network round-trip.

import type { HistoricalGeography } from './types';

const GEOCODER_BASE = 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates';

export type CensusGeocoderCountyEntry = {
  STATE: string;
  COUNTY: string;
  NAME: string;
  BASENAME: string;
};

export type CensusGeocoderStateEntry = {
  STATE: string;
  NAME: string;
};

export type CensusGeocoderResponse = {
  result: {
    geographies: {
      Counties?: CensusGeocoderCountyEntry[];
      States?: CensusGeocoderStateEntry[];
    };
  };
};

export function buildGeocoderUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    x: String(longitude),
    y: String(latitude),
    benchmark: 'Public_AR_Current',
    vintage: 'Current_Current',
    layers: 'Counties,States',
    format: 'json',
  });
  return `${GEOCODER_BASE}?${params.toString()}`;
}

export class GeographyResolutionError extends Error {}

export function parseGeocoderResponse(
  raw: unknown,
  latitude: number,
  longitude: number,
  url: string,
  retrievedAt: string,
): HistoricalGeography {
  const response = raw as Partial<CensusGeocoderResponse>;
  const geographies = response?.result?.geographies;

  if (!geographies) {
    throw new GeographyResolutionError(
      'Census Geocoder response missing result.geographies — upstream shape has changed.',
    );
  }

  const county = geographies.Counties?.[0];
  const state = geographies.States?.[0];

  if (!county || !state) {
    throw new GeographyResolutionError(
      `Census Geocoder returned no county/state match for (${latitude}, ${longitude}).`,
    );
  }

  if (!county.STATE || !county.COUNTY || !county.BASENAME || !state.NAME) {
    throw new GeographyResolutionError(
      'Census Geocoder county/state entry missing required fields — upstream shape has changed.',
    );
  }

  return {
    stateFips: county.STATE,
    stateName: state.NAME,
    countyFips: county.COUNTY,
    countyName: county.BASENAME,
    geographicResolution: 'county',
    resolvedFrom: {
      latitude,
      longitude,
      source: 'U.S. Census Bureau Geocoder',
      sourceUrl: url,
      retrievedAt,
    },
  };
}

export async function resolveHistoricalGeography(
  latitude: number,
  longitude: number,
): Promise<HistoricalGeography> {
  const url = buildGeocoderUrl(latitude, longitude);
  const response = await fetch(url);

  if (!response.ok) {
    throw new GeographyResolutionError(
      `Census Geocoder request failed: HTTP ${response.status}`,
    );
  }

  const raw = await response.json();
  return parseGeocoderResponse(raw, latitude, longitude, url, new Date().toISOString());
}
