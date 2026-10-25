// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import type { DimensionId } from './dimensions';
import type { SourceFamily } from './types';
import * as Legacy from './_RETIRED_DO_NOT_USE_force-interrogation';

export const FORGED_MODEL_RULE =
  'FORGED is an emergent environmental reading produced by converging evidence. Outcomes and individual adaptations require evidence specific to the resident.';

export type ForgedInterrogation = Legacy.EnvironmentalForce;
export type GeographicLevel = Legacy.GeographicLevel;
export type TemporalRule = Legacy.TemporalRule;
export type NormalizationRule = Legacy.NormalizationRule;

export type ForgedSpec = Omit<Legacy.ForceSpec, 'force'> & {

  forged: ForgedInterrogation;
};

function toForgedSpec(spec: Legacy.ForceSpec): ForgedSpec {
  const { force: retiredName, ...rest } = spec;
  return { ...rest, forged: retiredName };
}


export const FORGED_REGISTRY: ForgedSpec[] = Legacy.FORCE_REGISTRY.map(toForgedSpec);

export type CorrelationGroup = Omit<Legacy.CorrelationGroup, 'members'> & {
  members: ForgedInterrogation[];
};

export const CORRELATION_GROUPS: CorrelationGroup[] =
  Legacy.CORRELATION_GROUPS as CorrelationGroup[];

export function getCorrelationGroup(id: string): CorrelationGroup {
  return Legacy.getCorrelationGroup(id) as CorrelationGroup;
}

export type DecorrelatedForgedWeight = {
  forged: ForgedInterrogation;
  weight: number;
  correlationGroup: string | null;
};


export function decorrelatedWeights(
  forged: ForgedInterrogation[],
): DecorrelatedForgedWeight[] {
  return Legacy.decorrelatedWeights(forged).map(({ force: retiredName, weight, correlationGroup }) => ({
    forged: retiredName,
    weight,
    correlationGroup,
  }));
}


export function forgedSourceCompetence(
  forged: ForgedInterrogation,
  family: SourceFamily,
  dimension: DimensionId,
): number {
  return Legacy.forceSourceCompetence(forged, family, dimension);
}


export type AdaptiveDemand = Omit<Legacy.AdaptiveDemand, 'derivedFromForces'> & {
  derivedFromForged: ForgedInterrogation[];
};

export const ADAPTIVE_DEMAND_BOUNDARY = Legacy.ADAPTIVE_DEMAND_BOUNDARY;

export function makeAdaptiveDemand(
  input: Omit<AdaptiveDemand, 'scope' | 'notAClaimAbout'>,
): AdaptiveDemand {
  const legacy = Legacy.makeAdaptiveDemand({
    demandId: input.demandId,
    demand: input.demand,
    derivedFromForces: input.derivedFromForged,
    candidateCapacity: input.candidateCapacity,
    candidateCost: input.candidateCost,
  });

  return {
    demandId: legacy.demandId,
    demand: legacy.demand,
    derivedFromForged: legacy.derivedFromForces,
    candidateCapacity: legacy.candidateCapacity,
    candidateCost: legacy.candidateCost,
    scope: legacy.scope,
    notAClaimAbout: legacy.notAClaimAbout,
  };
}

export const ALL_FORGED_INTERROGATIONS: ForgedInterrogation[] =
  FORGED_REGISTRY.map((spec) => spec.forged);

export function getForged(forged: ForgedInterrogation): ForgedSpec {
  const spec = FORGED_REGISTRY.find((candidate) => candidate.forged === forged);
  if (!spec) {
    throw new Error(
      `Unknown FORGED interrogation "${forged}". Every question SEEN interrogates must be declared here with its full canonical schema before use.`,
    );
  }
  return spec;
}


export function forgedWithoutMarkerCoverage(): ForgedInterrogation[] {
  return FORGED_REGISTRY
    .filter((spec) => spec.evidencedByMarkers.length === 0)
    .map((spec) => spec.forged);
}

export function markersReferencedByForged(): string[] {
  return [...new Set(FORGED_REGISTRY.flatMap((spec) => spec.evidencedByMarkers))].sort();
}


export const GEOGRAPHIC_NESTING_TODO =
  'PENDING IMPLEMENTATION: comparable signals across locality → county/metro → state/region → country, so ' +
  'local-specific effects can be distinguished from the larger surrounding field. FORGED interrogations ' +
  'declare their applicable levels via geographicScope, but readings are currently single-resolution ' +
  '(county, per HistoricalGeography in ../types).';
