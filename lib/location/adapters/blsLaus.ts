// SEEN Location V1 — BLS Local Area Unemployment Statistics (LAUS) adapter.
//
// Independent second source for unemployment, cross-checking the ACS
// estimate with BLS's own annual-average time series for the same county.
// Real, documented BLS Public Data API v2 endpoint:
// https://www.bls.gov/developers/api_signature_v2.htm
// LAUS series ID structure: https://www.bls.gov/help/hlpforma.htm#LA
//
// IMPORTANT — series ID padding: BLS LAUS county series IDs follow the
// pattern "LAUCN" + state FIPS(2) + county FIPS(3) + zero padding + measure
// code(2), for a documented total length of 20 characters (hence 8 zeros
// of padding here). This adapter has not been exercised against the live
// API from this build session (sandbox network block — see
// scripts/verify-location-live.ts), so this is the best-effort correct
// format from documentation, not something confirmed against a real
// response yet. If the live script gets a shape/empty-series error, check
// this padding first.
//
// Cannot be exercised end-to-end from this build session — the sandbox
// blocks outbound requests to api.bls.gov. Parsing logic is covered by
// fixture-based unit tests. See scripts/verify-location-live.ts for the
// real network round-trip, which will fail loudly (not silently) if this
// series ID format is wrong.

const BLS_BASE = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
const UNEMPLOYMENT_RATE_MEASURE_CODE = '03';
const SERIES_ID_ZERO_PADDING = '0'.repeat(8);

export function buildLausUnemploymentRateSeriesId(stateFips: string, countyFips: string): string {
  return `LAUCN${stateFips.padStart(2, '0')}${countyFips.padStart(3, '0')}${SERIES_ID_ZERO_PADDING}${UNEMPLOYMENT_RATE_MEASURE_CODE}`;
}

export type BlsLausDataPoint = {
  year: string;
  period: string; // "M13" = annual average in BLS's convention
  periodName: string;
  value: number;
};

export type BlsSeriesResult = {
  seriesID: string;
  data: BlsLausDataPoint[];
};

export type BlsApiResponse = {
  status: string;
  Results?: {
    series?: {
      seriesID: string;
      data: { year: string; period: string; periodName: string; value: string }[];
    }[];
  };
};

export class BlsLausError extends Error {}

export function parseBlsResponse(raw: unknown, expectedSeriesId: string): BlsSeriesResult {
  const response = raw as Partial<BlsApiResponse>;

  if (response?.status !== 'REQUEST_SUCCEEDED') {
    throw new BlsLausError(
      `BLS API did not report success (status: ${response?.status ?? 'missing'}) — request may be malformed or rate-limited.`,
    );
  }

  const series = response.Results?.series?.find((s) => s.seriesID === expectedSeriesId);
  if (!series) {
    throw new BlsLausError(
      `BLS response did not include the requested series "${expectedSeriesId}" — series ID format may be wrong, or the geography has no LAUS coverage.`,
    );
  }

  return {
    seriesID: series.seriesID,
    data: series.data.map((point) => ({
      year: point.year,
      period: point.period,
      periodName: point.periodName,
      value: Number(point.value),
    })),
  };
}

/** Annual average is BLS period "M13" in the unadjusted LAUS series. */
export function extractAnnualAverage(result: BlsSeriesResult, year: string): number | null {
  const point = result.data.find((d) => d.year === year && d.period === 'M13');
  return point ? point.value : null;
}

export async function fetchLausCountyUnemploymentRate(
  stateFips: string,
  countyFips: string,
  year: string,
  apiKey?: string,
): Promise<{ result: BlsSeriesResult; annualAveragePercent: number | null }> {
  const seriesId = buildLausUnemploymentRateSeriesId(stateFips, countyFips);

  const body: Record<string, unknown> = {
    seriesid: [seriesId],
    startyear: year,
    endyear: year,
  };
  if (apiKey) body.registrationkey = apiKey;

  const response = await fetch(BLS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new BlsLausError(`BLS API request failed: HTTP ${response.status}`);
  }

  const raw = await response.json();
  const result = parseBlsResponse(raw, seriesId);

  return {
    result,
    annualAveragePercent: extractAnnualAverage(result, year),
  };
}
