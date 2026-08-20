// SEEN Location — FORGED interrogation model.
//
// FORGED is not a set of causal forces imposed on a place or a person.
// It is the name of the evidence-gated convergence layer: many independent
// markers meet the conditions of a lived environment and, through repeated
// pressure, exposure, reinforcement, constraint, opportunity, heat, time,
// and contradiction, produce an environmental reading.
//
// Think metal shaped through heat and repeated contact, or land carved over
// time by ice, water, rock, weather, and terrain. No single input predetermines
// the form. The form emerges from accumulated interaction.
//
// Therefore REWARD, STATUS, BELONGING, SAFETY, TRUST, etc. are not declared
// "forces" that SEEN assumes are acting on a resident. They are canonical
// FORGED interrogations — questions SEEN asks of the evidence. Their answers
// must be earned by observed markers, admissible dimensions, provenance,
// geographic/temporal fit, contradiction handling, and confidence.
//
// This file is the authoritative vocabulary for that layer. The retired
// implementation is quarantined in _RETIRED_DO_NOT_USE_force-interrogation.ts
// only as a compatibility/data bridge while the model is renamed. New code
// must import this file (or interrogation.ts), use FORGED terminology, and
// must not introduce new force-based ontology names.

import type { DimensionId } from './dimensions';
import type { SourceFamily } from './types';
import * as Legacy from './_RETIRED_DO_NOT_USE_force-interrogation';

export const FORGED_MODEL_RULE =
  'FORGED is an emergent environmental reading produced by converging evidence. It does not predeclare a causal force, predetermine an outcome, or assert that any resident developed a particular adaptation.';

export type ForgedInterrogation = Legacy.EnvironmentalForce;
export type GeographicLevel = Legacy.GeographicLevel;
export type TemporalRule = Legacy.TemporalRule;
export type NormalizationRule = Legacy.NormalizationRule;

export type ForgedSpec = Omit<Legacy.ForceSpec, 'force'> & {
  /** The canonical question being interrogated, not a presumed causal force. */
  forged: ForgedInterrogation;
};

function toForgedSpec(spec: Legacy.ForceSpec): ForgedSpec {
  const { force: retiredName, ...rest } = spec;
  return { ...rest, forged: retiredName };
}

/**
 * Canonical FORGED interrogation registry.
 *
 * The registry declares what SEEN asks and what evidence is allowed to
 * answer it. Registry membership is never evidence that the condition is
 * present. Unsupported answers remain unsupported/unknown.
 */
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

/**
 * Discounts correlated FORGED readings so one underlying environmental
 * phenomenon cannot be counted several times simply because several
 * interrogations describe different faces of it.
 */
export function decorrelatedWeights(
  forged: ForgedInterrogation[],
): DecorrelatedForgedWeight[] {
  return Legacy.decorrelatedWeights(forged).map(({ force: retiredName, weight, correlationGroup }) => ({
    forged: retiredName,
    weight,
    correlationGroup,
  }));
}

/**
 * Resolves source competence for one FORGED interrogation and one evidence
 * dimension. Competence answers "can this source measure this part of this
 * question?" — never "is this source generally trustworthy?".
 */
export function forgedSourceCompetence(
  forged: ForgedInterrogation,
  family: SourceFamily,
  dimension: DimensionId,
): number {
  return Legacy.forceSourceCompetence(forged, family, dimension);
}

/**
 * Candidate adaptive demand produced after environmental evidence has
 * converged. Still scoped to ENVIRONMENT; never a claim about the person.
 */
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

/**
 * FORGED interrogations with no backing marker in registry.ts. A declared
 * gap stays visible rather than being silently converted into an answer.
 */
export function forgedWithoutMarkerCoverage(): ForgedInterrogation[] {
  return FORGED_REGISTRY
    .filter((spec) => spec.evidencedByMarkers.length === 0)
    .map((spec) => spec.forged);
}

export function markersReferencedByForged(): string[] {
  return [...new Set(FORGED_REGISTRY.flatMap((spec) => spec.evidencedByMarkers))].sort();
}

/**
 * Geographic nesting remains an explicit implementation gap. The wording
 * here uses the current FORGED ontology rather than the retired vocabulary.
 */
export const GEOGRAPHIC_NESTING_TODO =
  'NOT IMPLEMENTED: comparable signals across locality → county/metro → state/region → country, so ' +
  'local-specific effects can be distinguished from the larger surrounding field. FORGED interrogations ' +
  'declare their applicable levels via geographicScope, but readings are currently single-resolution ' +
  '(county, per HistoricalGeography in ../types).';
