// City typeahead for the location intake fields (birth / lived / current).
//
// Backed by a bundled ~135k-city dataset (all-the-cities) so suggestions
// are instant and require no external API key. This module is the swap
// seam: it is the only place that knows where suggestions come from. A
// future move to a live geocoder (Mapbox, Google Places) replaces the
// inside of suggestCities() only — the API route and the client input
// never change.

import countries from 'all-the-cities';
import isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

isoCountries.registerLocale(enLocale);

// Friendlier than the ISO registry's formal/legal names for the
// countries people actually type most often.
const COUNTRY_NAME_OVERRIDES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  KR: 'South Korea',
  KP: 'North Korea',
  RU: 'Russia',
  VN: 'Vietnam',
  TW: 'Taiwan',
  LA: 'Laos',
  MD: 'Moldova',
  SY: 'Syria',
  BO: 'Bolivia',
  VE: 'Venezuela',
  IR: 'Iran',
  TZ: 'Tanzania',
};

function countryName(code: string): string {
  return COUNTRY_NAME_OVERRIDES[code] ?? isoCountries.getName(code, 'en') ?? code;
}

export type CitySuggestion = {
  /** Display string for the dropdown, e.g. "Austin, TX, United States". */
  label: string;
  city: string;
  /** US state abbreviation or raw GeoNames admin code; null when not meaningful to show. */
  region: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population: number;
};

type RawCity = (typeof countries)[number];

// Only the US dataset carries a human-readable admin code (postal state
// abbreviation) in this source. Other countries' adminCode is a bare
// GeoNames region number with no bundled name table, so it is omitted
// rather than shown as a meaningless digit string.
function regionFor(entry: RawCity): string | null {
  if (entry.country === 'US' && entry.adminCode) return entry.adminCode;
  return null;
}

function labelFor(entry: RawCity): string {
  const region = regionFor(entry);
  const country = countryName(entry.country);
  return region ? `${entry.name}, ${region}, ${country}` : `${entry.name}, ${country}`;
}

// Sorted once at module load so higher-population matches surface first
// without re-sorting per request.
const SORTED_CITIES: RawCity[] = [...countries].sort((a, b) => b.population - a.population);

const MIN_QUERY_LENGTH = 2;
const DEFAULT_LIMIT = 8;

/**
 * Prefix-matches the query against city names, case-insensitively, and
 * returns the highest-population matches. Falls back to a substring match
 * (still ranked by population) when the prefix search comes up short, so
 * "york" still finds "New York".
 */
export function suggestCities(query: string, limit: number = DEFAULT_LIMIT): CitySuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const prefixMatches: RawCity[] = [];
  const substringMatches: RawCity[] = [];

  for (const entry of SORTED_CITIES) {
    const name = entry.name.toLowerCase();
    if (name.startsWith(trimmed)) {
      prefixMatches.push(entry);
      if (prefixMatches.length >= limit) break;
    } else if (substringMatches.length < limit && name.includes(trimmed)) {
      substringMatches.push(entry);
    }
  }

  const combined = [...prefixMatches, ...substringMatches].slice(0, limit);

  return combined.map((entry) => ({
    label: labelFor(entry),
    city: entry.name,
    region: regionFor(entry),
    country: countryName(entry.country),
    countryCode: entry.country,
    latitude: entry.loc.coordinates[1],
    longitude: entry.loc.coordinates[0],
    population: entry.population,
  }));
}
