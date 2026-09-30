import { dedupeObservations } from './dedupe';
import { getMarker } from './registry';
import type { RuntimeVectorInput } from './runtime';
import type { Observation, SourceFamily } from './types';

function windowDays(start: string, end: string): number {
  const from = Date.parse(start);
  const to = Date.parse(end);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return 1;
  return Math.max(1, Math.round((to - from) / 86_400_000));
}

export function observationsToRuntimeInputs(
  observations: Observation[],
  locationId: string,
  windowStart: string,
  windowEnd: string,
): RuntimeVectorInput[] {
  const byFamilyMarker = new Map<string, Observation[]>();

  for (const observation of observations) {
    for (const markerId of observation.markerIds) {
      const key = `${observation.sourceFamily}::${markerId}`;
      const bucket = byFamilyMarker.get(key);
      if (bucket) bucket.push(observation);
      else byFamilyMarker.set(key, [observation]);
    }
  }

  const inputs: RuntimeVectorInput[] = [];

  for (const [key, grouped] of byFamilyMarker) {
    const [sourceFamily, markerId] = key.split('::') as [SourceFamily, string];
    const { events, exposure } = dedupeObservations(grouped);

    inputs.push({
      vector: {
        key: { markerId, locationId, windowStart, windowEnd },
        sourceFamily,
        marker: getMarker(markerId),
        events,
        exposure,
        windowDays: windowDays(windowStart, windowEnd),
        population: null,
        sampledLocalContentCount: grouped.length,
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
    });
  }

  return inputs;
}
