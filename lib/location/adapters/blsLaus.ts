// SEEN Location V1 — BLS Local Area Unemployment Statistics (LAUS) adapter.
//
// Independent second source for unemployment, cross-checking the ACS
// estimate with BLS's own annual-average time series for the same county.
// Real, documented BLS Public Data API v2 endpoint:
// https://www.bls.gov/developers/api_signature_v2.htm
// LAUS series ID structure: https://www.bls.gov/help/hlpforma.htm#LA
//
// Series ID padding confirmed correct against the live API: a real request
// for LAUCN060370000000003 (Los Angeles County, CA) returned data for that
// exact series ID.
//
// Live-verified: unregistered access returns success but empty data for
// historical years (see fetchLausCountyUnemploymentRate below). With a real
// BLS_API_KEY, the request succeeds but the response body can contain a raw,
// unescaped control character (observed in footnote text), which breaks
// strict JSON.parse — see the sanitization step below.

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
  message?: string[];
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
    const messages = response?.message?.length ? response.message.join(' | ') : '(no message field)';
    throw new BlsLausError(
      `BLS API did not report success (status: ${response?.status ?? 'missing'}). BLS message: ${messages}`,
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

/**
 * Strips raw C0 control characters (0x00-0x1F) from a JSON response body.
 * None are meaningful JSON structure on their own — a raw one embedded
 * inside a string literal (observed from BLS in footnote text) is exactly
 * what makes strict JSON.parse throw "Bad control character in string
 * literal" on an otherwise well-formed response.
 */
export function sanitizeControlCharacters(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x20) {
      result += text[i];
    }
  }
  return result;
}

export async function fetchLausCountyUnemploymentRate(
  stateFips: string,
  countyFips: string,
  year: string,
  // Unregistered BLS API v2 access is limited to roughly the most recent 3
  // years of data — a historical query (e.g. 2018-2022) can come back
  // empty even though the request itself succeeds. A free registration
  // key (https://www.bls.gov/developers/) removes that limit; read from
  // env so adding one later requires no code change.
  apiKey: string | undefined = process.env.BLS_API_KEY,
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
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'SEEN-Location-V1 (contact: seanmphelps@gmail.com)',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new BlsLausError(`BLS API request failed: HTTP ${response.status}`);
  }

  const bodyText = await response.text();
  const sanitized = sanitizeControlCharacters(bodyText);

  let raw: unknown;
  try {
    raw = JSON.parse(sanitized);
  } catch (err) {
    throw new BlsLausError(
      `BLS response was not valid JSON even after control-character sanitization ` +
        `(${err instanceof Error ? err.message : String(err)}). ` +
        `First 300 chars: ${bodyText.slice(0, 300)}`,
    );
  }
  const result = parseBlsResponse(raw, seriesId);

  return {
    result,
    annualAveragePercent: extractAnnualAverage(result, year),
  };
}
