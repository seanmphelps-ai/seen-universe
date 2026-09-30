import { createHash } from 'node:crypto';
import type { WitnessProvider } from '../v2/environmentalWitness';
import type { Observation } from '../v2/types';

const GDELT_DOC = 'https://api.gdeltproject.org/api/v2/doc/doc';
const GDELT_DOC_START = Date.parse('2017-01-01T00:00:00Z');
const MAX_RECORDS = 50;

type GdeltArticle = {
  url?: string;
  title?: string;
  seendate?: string;
  domain?: string;
  language?: string;
  sourcecountry?: string;
};

type GdeltDocResponse = {
  articles?: GdeltArticle[];
};

const MARKER_QUERIES: { markerId: string; query: string }[] = [
  { markerId: 'violent_incident', query: '(shooting OR homicide OR stabbing OR "killed")' },
  { markerId: 'civil_unest_event'.replace('civil_unest_event', 'civil_unrest_event'), query: '(protest OR riot OR unrest)' },
];

function gdeltStamp(isoDate: string, endOfDay: boolean): string {
  const d = isoDate.replaceAll('-', '').slice(0, 8);
  return endOfDay ? `${d}235959` : `${d}000000`;
}

function articleTime(seendate: string | undefined): string | null {
  if (!seendate || seendate.length < 8) return null;
  const y = seendate.slice(0, 4);
  const m = seendate.slice(4, 6);
  const day = seendate.slice(6, 8);
  return `${y}-${m}-${day}T00:00:00.000Z`;
}

function fingerprint(url: string, title: string): string {
  return createHash('sha256').update(`${url}|${title}`).digest('hex').slice(0, 24);
}

async function fetchArticles(query: string, start: string, end: string): Promise<GdeltArticle[]> {
  const params = new URLSearchParams({
    query: `${query} sourcelang:english`,
    mode: 'ArtList',
    maxrecords: String(MAX_RECORDS),
    format: 'json',
    startdatetime: gdeltStamp(start, false),
    enddatetime: gdeltStamp(end, true),
    sort: 'HybridRel',
  });

  const response = await fetch(`${GDELT_DOC}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`GDELT DOC ${response.status}`);
  }

  const text = await response.text();
  if (!text.trim()) return [];

  let parsed: GdeltDocResponse;
  try {
    parsed = JSON.parse(text) as GdeltDocResponse;
  } catch {
    throw new Error('GDELT DOC returned non-JSON.');
  }

  return parsed.articles ?? [];
}

export const gdeltNewsProvider: WitnessProvider = {
  providerId: 'gdelt-doc-2.0',
  sourceFamily: 'GDELT',
  async collect(request) {
    const windowStartMs = Date.parse(request.windowStart);
    const windowEnd = request.windowEnd || new Date().toISOString().slice(0, 10);
    const windowEndMs = Date.parse(windowEnd);

    if (!Number.isFinite(windowStartMs) || !Number.isFinite(windowEndMs)) {
      throw new Error('Invalid exposure window for GDELT collector.');
    }

    if (windowEndMs < GDELT_DOC_START) {
      throw new Error(
        `GDELT DOC 2.0 does not cover ${request.windowStart}–${windowEnd}. Coverage begins 2017.`,
      );
    }

    const queryStart =
      windowStartMs < GDELT_DOC_START ? '2017-01-01' : request.windowStart.slice(0, 10);
    const place = request.location.replace(/["()]/g, ' ').trim();
    const retrievedAt = new Date().toISOString();
    const observations: Observation[] = [];

    for (const lane of [
      { markerId: 'violent_incident', query: '(shooting OR homicide OR stabbing OR killed)' },
      { markerId: 'civil_unrest_event', query: '(protest OR riot OR unrest)' },
    ]) {
      const articles = await fetchArticles(`"${place}" ${lane.query}`, queryStart, windowEnd);
      for (const article of articles) {
        const url = article.url?.trim() || null;
        const title = article.title?.trim() || 'untitled';
        const publishedAt = articleTime(article.seendate);
        const idSeed = url ?? `${title}|${publishedAt ?? ''}`;

        observations.push({
          observationId: `gdelt:${fingerprint(idSeed, lane.markerId)}`,
          provider: 'GDELT DOC 2.0',
          sourceFamily: 'GDELT',
          sourceUrl: url,
          sourceId: url,
          publishedAt,
          retrievedAt,
          requestedGeography: request.location,
          matchedGeography: place,
          geographicResolution: 'place',
          evidenceType: 'ARTICLE',
          markerIds: [lane.markerId],
          direction: 'TOWARD',
          severity: null,
          responseFrame: null,
          eventFingerprint: fingerprint(idSeed, lane.markerId),
          engagement: null,
          localAccountEstimate: null,
          accountId: null,
          confidenceTerms: {
            geo: 0.4,
            source: 0.6,
            recency: 1,
          },
        });
      }
    }

    return observations;
  },
};
