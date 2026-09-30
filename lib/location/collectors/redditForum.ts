import { createHash } from 'node:crypto';
import type { WitnessProvider } from '../v2/environmentalWitness';
import type { Observation } from '../v2/types';

const USER_AGENT = 'seen-universe/0.1 (local-forum collector; contact: repo seanmphelps-ai/seen-universe)';

type RedditListingChild = {
  data?: {
    id?: string;
    name?: string;
    title?: string;
    selftext?: string;
    permalink?: string;
    url?: string;
    created_utc?: number;
    subreddit?: string;
    author?: string;
    num_comments?: number;
    score?: number;
  };
};

type RedditListing = {
  data?: {
    children?: RedditListingChild[];
  };
};

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function cityToken(label: string): string {
  return label.split(',')[0]?.trim() || label.trim();
}

function markersFor(text: string): string[] {
  const t = text.toLowerCase();
  const ids: string[] = [];
  if (/(shoot|killed|homicide|stab|assault|gun)/.test(t)) ids.push('violent_incident');
  if (/(protest|riot|unrest)/.test(t)) ids.push('civil_unrest_event');
  if (/(rent|evict|homeless|poverty|broke|can.?t afford)/.test(t)) ids.push('economic_deprivation');
  if (/(layoff|unemploy|hiring freeze|no jobs)/.test(t)) ids.push('labor_instability');
  if (/(flex|status|luxury|influencer)/.test(t)) ids.push('status_competition_signal');
  if (/(mutual aid|go fund me|help my neighbor|community fridge)/.test(t)) ids.push('collective_aid_signal');
  if (/(moving away|get out of|leaving this city|relocat)/.test(t)) ids.push('outmigration_intent');
  if (ids.length === 0) ids.push('outmigration_intent');
  return [...new Set(ids)];
}

async function redditJson(url: string): Promise<RedditListing> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    throw new Error(`Reddit ${response.status} for ${url}`);
  }
  return (await response.json()) as RedditListing;
}

export const redditForumProvider: WitnessProvider = {
  providerId: 'reddit-public-json',
  sourceFamily: 'LOCAL_FORUM',
  async collect(request) {
    const city = cityToken(request.location);
    const windowStart = Date.parse(request.windowStart);
    const windowEnd = Date.parse(request.windowEnd || new Date().toISOString());
    if (!Number.isFinite(windowStart) || !Number.isFinite(windowEnd)) {
      throw new Error('Invalid exposure window for Reddit collector.');
    }

    const search = new URL('https://www.reddit.com/search.json');
    search.searchParams.set('q', city);
    search.searchParams.set('sort', 'new');
    search.searchParams.set('limit', '50');
    search.searchParams.set('t', 'all');
    search.searchParams.set('type', 'link');

    const listing = await redditJson(search.toString());
    const retrievedAt = new Date().toISOString();
    const observations: Observation[] = [];

    for (const child of listing.data?.children ?? []) {
      const post = child.data;
      if (!post?.id || typeof post.created_utc !== 'number') continue;
      const publishedMs = post.created_utc * 1000;
      if (publishedMs < windowStart || publishedMs > windowEnd) continue;

      const title = post.title ?? '';
      const body = post.selftext ?? '';
      const permalink = post.permalink ? `https://www.reddit.com${post.permalink}` : post.url ?? null;
      const text = `${title} ${body}`;
      const markerIds = markersFor(text);

      observations.push({
        observationId: `reddit:${post.name ?? post.id}`,
        provider: 'Reddit',
        sourceFamily: 'LOCAL_FORUM',
        sourceUrl: permalink,
        sourceId: post.name ?? post.id,
        publishedAt: new Date(publishedMs).toISOString(),
        retrievedAt,
        requestedGeography: request.location,
        matchedGeography: post.subreddit ? `r/${post.subreddit}` : city,
        geographicResolution: 'place',
        evidenceType: 'POST',
        markerIds,
        direction: 'TOWARD',
        severity: null,
        responseFrame: null,
        eventFingerprint: hash(`${post.subreddit ?? ''}|${title}`),
        engagement: {
          comments: typeof post.num_comments === 'number' ? post.num_comments : undefined,
          reactions: typeof post.score === 'number' ? post.score : undefined,
        },
        localAccountEstimate: null,
        accountId: post.author && post.author !== '[deleted]' ? `reddit:${post.author}` : null,
        confidenceTerms: {
          geo: 0.35,
          source: 0.45,
          recency: 1,
        },
      });
    }

    return observations;
  },
};
