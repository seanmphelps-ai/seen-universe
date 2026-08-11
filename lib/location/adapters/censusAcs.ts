// SEEN Location V1 — Census ACS 5-Year adapter (Material Field vertical slice).
//
// Real, documented Census ACS 5-Year Estimates endpoint and response shape:
// https://www.census.gov/data/developers/data-sets/acs-5year.html
//
// Response shape is a JSON array of arrays: header row, then one data row
// per requested geography — never an object. This adapter fetches the same
// variables at county, state, and national ("us") geography in one batched
// call per level, so the comparator step (see comparator.ts) has real
// same-year baselines rather than an invented reference point.
//
// Cannot be exercised end-to-end from this build session — the sandbox
// blocks outbound requests to api.census.gov. Parsing/derivation logic is
// covered by fixture-based unit tests instead. See
// scripts/verify-location-live.ts for the real network round-trip.

const ACS_BASE = 'https://api.census.gov/data';

// ACS table variables used for V1's Material Field slice:
// B19013_001E — median household income (dollars)
// B17001_002E — population below poverty level (count)
// B17001_001E — population for whom poverty status is determined (universe)
// B23025_005E — unemployed, civilian labor force 16+ (count)
// B23025_002E — in civilian labor force 16+ (count)
const ACS_VARIABLES = [
  'NAME',
  'B19013_001E',
  'B17001_002E',
  'B17001_001E',
  'B23025_005E',
  'B23025_002E',
] as const;

// ACS encodes "not available" as large negative sentinel values instead of
// null/omission. Treating any negative value as missing is the documented,
// correct way to detect this — not a heuristic.
function acsValueOrNull(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export type AcsRawRow = {
  name: string;
  medianHouseholdIncome: number | null;
  povertyPopulation: number | null;
  povertyUniverse: number | null;
  unemployedCount: number | null;
  laborForceCount: number | null;
};

export class CensusAcsError extends Error {}

export function parseAcsResponse(raw: unknown): AcsRawRow {
  if (!Array.isArray(raw) || raw.length < 2 || !Array.isArray(raw[0]) || !Array.isArray(raw[1])) {
    throw new CensusAcsError(
      'Census ACS response is not the documented [header, ...rows] array shape — upstream shape has changed.',
    );
  }

  const header: string[] = raw[0];
  const row: string[] = raw[1];

  const index: Record<string, number> = {};
  header.forEach((key, i) => {
    index[key] = i;
  });

  for (const variable of ACS_VARIABLES) {
    if (!(variable in index)) {
      throw new CensusAcsError(
        `Census ACS response missing expected variable "${variable}" — upstream shape has changed.`,
      );
    }
  }

  return {
    name: row[index.NAME],
    medianHouseholdIncome: acsValueOrNull(row[index.B19013_001E]),
    povertyPopulation: acsValueOrNull(row[index.B17001_002E]),
    povertyUniverse: acsValueOrNull(row[index.B17001_001E]),
    unemployedCount: acsValueOrNull(row[index.B23025_005E]),
    laborForceCount: acsValueOrNull(row[index.B23025_002E]),
  };
}

export function deriveMaterialFieldMetrics(row: AcsRawRow) {
  const povertyRate =
    row.povertyPopulation !== null && row.povertyUniverse
      ? (row.povertyPopulation / row.povertyUniverse) * 100
      : null;

  const unemploymentRate =
    row.unemployedCount !== null && row.laborForceCount
      ? (row.unemployedCount / row.laborForceCount) * 100
      : null;

  return {
    medianHouseholdIncome: row.medianHouseholdIncome,
    povertyRatePercent: povertyRate,
    unemploymentRatePercent: unemploymentRate,
  };
}

export function buildAcsUrl(
  year: string,
  geographyClause: string,
): string {
  const vars = ACS_VARIABLES.join(',');
  return `${ACS_BASE}/${year}/acs/acs5?get=${vars}&${geographyClause}`;
}

async function fetchAcsRow(year: string, geographyClause: string): Promise<AcsRawRow> {
  const url = buildAcsUrl(year, geographyClause);
  const response = await fetch(url);
  if (!response.ok) {
    throw new CensusAcsError(`Census ACS request failed: HTTP ${response.status} (${url})`);
  }
  const raw = await response.json();
  return parseAcsResponse(raw);
}

export async function fetchAcsCounty(year: string, stateFips: string, countyFips: string) {
  return fetchAcsRow(year, `for=county:${countyFips}&in=state:${stateFips}`);
}

export async function fetchAcsState(year: string, stateFips: string) {
  return fetchAcsRow(year, `for=state:${stateFips}`);
}

export async function fetchAcsNational(year: string) {
  return fetchAcsRow(year, `for=us:1`);
}
