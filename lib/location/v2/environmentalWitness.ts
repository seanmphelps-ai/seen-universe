// SEEN Location — Environmental Witness first pass.
//
// This is the high-recall Location pass. Its job is to reconstruct the
// observable environmental field for one place and exposure window before
// any natal/person-specific system is consulted.
//
// Providers may represent social/public posts, local forums, reviews, ads,
// marketplace listings, search interest, local news, events, institutions,
// movement/place data, official data, or any future provider that can emit
// the existing Observation contract.

import { getMarker } from './registry';
import type { Observation, SourceFamily } from './types';

export type EnvironmentalWitnessInput = {
  locationId: string;
  location: string;
  windowStart: string;
  windowEnd: string;
};

export type WitnessCollectionRequest = EnvironmentalWitnessInput & {
  researchQuestions: string[];
};

export type WitnessProvider = {
  providerId: string;
  sourceFamily: SourceFamily;
  collect(request: WitnessCollectionRequest): Promise<Observation[]>;
};

export type WitnessProviderFailure = {
  providerId: string;
  sourceFamily: SourceFamily;
  message: string;
};

export type WitnessSourceLane = {
  sourceFamily: SourceFamily;
  examples: string[];
  purpose: string;
};

/**
 * Explicit first-pass research lanes. Concrete provider implementations can
 * change without changing the environmental witness contract.
 */
export const WITNESS_SOURCE_LANES: WitnessSourceLane[] = [
  {
    sourceFamily: 'SOCIAL_PUBLIC',
    examples: ['TikTok', 'Instagram', 'Facebook', 'X', 'YouTube', 'Bluesky'],
    purpose: 'Publicly visible local behavior, attention, norms, celebration, conflict, aspiration, fear, status, belonging, and repeated complaints.',
  },
  {
    sourceFamily: 'LOCAL_FORUM',
    examples: ['Reddit', 'local forums', 'community boards', 'public neighborhood groups'],
    purpose: 'Long-form local discussion, recurring concerns, insider descriptions, practical friction, belonging, exclusion, and local norms.',
  },
  {
    sourceFamily: 'REVIEWS',
    examples: ['Google reviews', 'Yelp', 'Tripadvisor', 'platform reviews'],
    purpose: 'Repeated visitor and resident experience of places, services, access, safety, hospitality, recreation, and day-to-day friction.',
  },
  {
    sourceFamily: 'ADS',
    examples: ['local ads', 'public social ads', 'classified promotions'],
    purpose: 'What is being sold, financed, feared, desired, promised, and repeatedly marketed to people in the area.',
  },
  {
    sourceFamily: 'MARKETPLACE',
    examples: ['Facebook Marketplace', 'Craigslist', 'local classifieds', 'housing listings'],
    purpose: 'Resale behavior, housing movement, informal commerce, distress selling, luxury saturation, tools, vehicles, and what households cycle through.',
  },
  {
    sourceFamily: 'SEARCH_INTEREST',
    examples: ['search trends', 'local query patterns'],
    purpose: 'What people appear to seek repeatedly: jobs, housing, treatment, recreation, schools, travel, services, and help.',
  },
  {
    sourceFamily: 'LOCAL_NEWS',
    examples: ['local newspapers', 'local TV', 'local radio', 'regional reporting'],
    purpose: 'Events, institutions, disputes, hazards, civic changes, business openings/closures, public safety, and historical continuity.',
  },
  {
    sourceFamily: 'EVENTS',
    examples: ['event calendars', 'festivals', 'sports', 'rallies', 'meetings', 'fundraisers'],
    purpose: 'What repeatedly mobilizes people and what the community makes time to gather around.',
  },
  {
    sourceFamily: 'INSTITUTIONS',
    examples: ['schools', 'hospitals', 'churches', 'libraries', 'clubs', 'employers', 'civic organizations'],
    purpose: 'Durable local structure, access, opportunity, authority, care, education, religion, work, and social infrastructure.',
  },
  {
    sourceFamily: 'MOVEMENT_PLACE',
    examples: ['mobility data', 'place visitation', 'travel patterns'],
    purpose: 'Where people actually go, how far ordinary life requires travel, and which places concentrate daily activity.',
  },
  {
    sourceFamily: 'OSM',
    examples: ['OpenStreetMap', 'public geospatial place data'],
    purpose: 'Roads, land use, terrain-facing infrastructure, services, recreation, geographic access, and physical place structure.',
  },
  {
    sourceFamily: 'POPULATION_GRID',
    examples: ['population grids', 'settlement density layers'],
    purpose: 'Human density and spatial distribution used to contextualize physical exposure and remoteness.',
  },
  {
    sourceFamily: 'OFFICIAL_DATA',
    examples: ['Census', 'BLS', 'NOAA', 'CDC', 'FBI', 'EPA', 'local government'],
    purpose: 'Historical baselines, corroboration, structured measurements, uncertainty, and long-run comparison.',
  },
];

export type EnvironmentalDiscovery = {
  markerId: string;
  label: string;
  polarity: 'PRESSURE' | 'SUPPORT' | 'NEUTRAL';
  seenMappings: string[];
  observationCount: number;
  uniqueProviders: string[];
  sourceFamilies: SourceFamily[];
  evidenceTypes: string[];
  sourceUrls: string[];
  firstObservedAt: string | null;
  lastObservedAt: string | null;
};

export type EnvironmentalWitnessRecord = {
  locationId: string;
  location: string;
  windowStart: string;
  windowEnd: string;
  collectedAt: string;
  observations: Observation[];
  discoveries: EnvironmentalDiscovery[];
  familiesPresent: SourceFamily[];
  providerFailures: WitnessProviderFailure[];
};

/**
 * Broad witness prompts. They describe the place without selecting what
 * should matter to a particular person. A later SEEN pass can weight these
 * discoveries against natal and other person-specific systems.
 */
export const WITNESS_RESEARCH_QUESTIONS: string[] = [
  'What is repeatedly encountered in ordinary daily life here?',
  'What makes ordinary days easier here?',
  'What makes ordinary days harder here?',
  'What physical conditions recur across the year?',
  'What social conditions recur across the year?',
  'What receives attention locally?',
  'What earns visible status locally?',
  'What creates belonging or exclusion?',
  'What do people repeatedly complain about?',
  'What do people repeatedly celebrate?',
  'What do people spend money on when they have choice?',
  'What appears scarce, abundant, accessible, or difficult to access?',
  'What do jobs, housing, schools, commerce, recreation, nightlife, religion, sports, dating, family life, traffic, safety, weather, terrain, distance, density, and infrastructure reveal?',
  'What appears stable over time and what appears to be changing?',
  'What would a visitor notice here that would feel materially different in another place?',
];

function timestampValue(value: string | null): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isoAt(ms: number | null): string | null {
  return ms === null ? null : new Date(ms).toISOString();
}

function discoveryFor(markerId: string, observations: Observation[]): EnvironmentalDiscovery {
  const marker = getMarker(markerId);
  const relevant = observations.filter((observation) => observation.markerIds.includes(markerId));

  const times = relevant
    .map((observation) => timestampValue(observation.publishedAt))
    .filter((value): value is number => value !== null);

  return {
    markerId,
    label: marker.label,
    polarity: marker.polarity,
    seenMappings: [...marker.seenMappings],
    observationCount: relevant.length,
    uniqueProviders: [...new Set(relevant.map((observation) => observation.provider))].sort(),
    sourceFamilies: [...new Set(relevant.map((observation) => observation.sourceFamily))].sort(),
    evidenceTypes: [...new Set(relevant.map((observation) => observation.evidenceType))].sort(),
    sourceUrls: [...new Set(relevant.map((observation) => observation.sourceUrl).filter((url): url is string => Boolean(url)))],
    firstObservedAt: isoAt(times.length ? Math.min(...times) : null),
    lastObservedAt: isoAt(times.length ? Math.max(...times) : null),
  };
}

/**
 * Runs the first-pass environmental witness across every supplied provider.
 * Each provider is isolated so a missing or failed source family cannot erase
 * the rest of the place. Every valid observation is retained for downstream
 * V2 dedupe/vector/confidence/scoring work.
 */
export async function runEnvironmentalWitness(
  input: EnvironmentalWitnessInput,
  providers: WitnessProvider[],
): Promise<EnvironmentalWitnessRecord> {
  const request: WitnessCollectionRequest = {
    ...input,
    researchQuestions: [...WITNESS_RESEARCH_QUESTIONS],
  };

  const observations: Observation[] = [];
  const providerFailures: WitnessProviderFailure[] = [];

  await Promise.all(
    providers.map(async (provider) => {
      try {
        const collected = await provider.collect(request);
        for (const observation of collected) {
          for (const markerId of observation.markerIds) getMarker(markerId);
          observations.push(observation);
        }
      } catch (error) {
        providerFailures.push({
          providerId: provider.providerId,
          sourceFamily: provider.sourceFamily,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }),
  );

  observations.sort((a, b) => {
    const aTime = timestampValue(a.publishedAt) ?? timestampValue(a.retrievedAt) ?? 0;
    const bTime = timestampValue(b.publishedAt) ?? timestampValue(b.retrievedAt) ?? 0;
    return aTime - bTime || a.observationId.localeCompare(b.observationId);
  });

  const markerIds = [...new Set(observations.flatMap((observation) => observation.markerIds))].sort();
  const discoveries = markerIds.map((markerId) => discoveryFor(markerId, observations));

  return {
    locationId: input.locationId,
    location: input.location,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    collectedAt: new Date().toISOString(),
    observations,
    discoveries,
    familiesPresent: [...new Set(observations.map((observation) => observation.sourceFamily))].sort(),
    providerFailures: providerFailures.sort((a, b) => a.providerId.localeCompare(b.providerId)),
  };
}
