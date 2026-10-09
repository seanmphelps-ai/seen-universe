// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

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
      'Census ACS response requires the documented [header, ...rows] array shape.',
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
  apiKey?: string,
): string {
  const vars = ACS_VARIABLES.join(',');
  const keyClause = apiKey ? `&key=${apiKey}` : '';
  return `${ACS_BASE}/${year}/acs/acs5?get=${vars}&${geographyClause}${keyClause}`;
}


export function redactApiKey(url: string): string {
  return url.replace(/([?&]key=)[^&]+/, '$1[REDACTED]');
}

async function fetchAcsRow(
  year: string,
  geographyClause: string,
  apiKey: string | undefined = process.env.CENSUS_API_KEY,
): Promise<AcsRawRow> {
  const url = buildAcsUrl(year, geographyClause, apiKey);
  const safeUrl = redactApiKey(url);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SEEN-Location-V1 (contact: seanmphelps@gmail.com)',
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new CensusAcsError(`Census ACS request failed: HTTP ${response.status} (${safeUrl})`);
  }
  const responseForDiagnostics = response.clone();
  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    const bodyText = await responseForDiagnostics.text().catch(() => '(could not read body)');
    throw new CensusAcsError(
      `Census ACS response was not valid JSON (status ${response.status}, url ${safeUrl}). ` +
        `First 300 chars of body: ${bodyText.slice(0, 300)}`,
    );
  }
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
