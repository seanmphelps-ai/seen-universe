import type { LocationField } from '../types';
import { getMarker } from './registry';
import type { RuntimeVectorInput } from './runtime';
import type { SourceFamily } from './types';

export const PRODUCT_SOURCE_FAMILIES: SourceFamily[] = [
  'SOCIAL_PUBLIC',
  'LOCAL_FORUM',
  'REVIEWS',
  'ADS',
  'MARKETPLACE',
  'SEARCH_INTEREST',
  'LOCAL_NEWS',
  'EVENTS',
  'INSTITUTIONS',
  'OFFICIAL_DATA',
  'MOVEMENT_PLACE',
  'POPULATION_GRID',
  'OSM',
  'ACLED',
  'GDELT',
];

const OFFICIAL_MARKERS = [
  'economic_deprivation',
  'labor_instability',
  'affluence_saturation',
] as const;

function windowDays(start: string, end: string | null): number {
  const from = Date.parse(start);
  const to = Date.parse(end ?? new Date().toISOString());
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return 1;
  return Math.max(1, Math.round((to - from) / 86_400_000));
}

export function officialFieldToV2Inputs(field: LocationField): RuntimeVectorInput[] {
  const locationId = `${field.input.role}:${field.input.latitude},${field.input.longitude}`;
  const windowStart = field.input.exposureStart;
  const windowEnd = field.input.exposureEnd ?? new Date().toISOString().slice(0, 10);

  return OFFICIAL_MARKERS.map((markerId) => ({
    vector: {
      key: {
        markerId,
        locationId,
        windowStart,
        windowEnd,
      },
      sourceFamily: 'OFFICIAL_DATA',
      marker: getMarker(markerId),
      events: [],
      exposure: [],
      windowDays: windowDays(windowStart, windowEnd),
      population: null,
      sampledLocalContentCount: null,
      sampledActiveLocalAccounts: null,
      connectedLocalPopulation: null,
      uniqueParticipatingLocalAccounts: null,
      spatialOccurrenceDistribution: null,
      sampledSubUnitCount: null,
      measuredDedupedLocalReach: null,
      physicalDoseInputs: [],
      amplificationBaselines: {},
      baseline: null,
    },
  }));
}

export function missingProductFamilies(present: SourceFamily[]): SourceFamily[] {
  return PRODUCT_SOURCE_FAMILIES.filter((family) => !present.includes(family));
}
