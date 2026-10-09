// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

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

  region: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population: number;
};

type RawCity = (typeof countries)[number];

function regionFor(entry: RawCity): string | null {
  if (entry.country === 'US' && entry.adminCode) return entry.adminCode;
  return null;
}

function labelFor(entry: RawCity): string {
  const region = regionFor(entry);
  const country = countryName(entry.country);
  return region ? `${entry.name}, ${region}, ${country}` : `${entry.name}, ${country}`;
}

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
