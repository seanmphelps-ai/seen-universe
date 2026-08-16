// Confidence is separate — step 5 of the contract.
//
// "Publish component values + band (very low/low/medium/high), not false
// decimal precision. Apply hard caps: 1 family <=40; 2 <=65; 3 <=80; 4+
// <=95. Nonprobability social data describes the digitally observable
// environment, not every resident."
//
// Confidence never multiplies into the score. A high-scoring cell with
// one family stays high-scoring and low-confidence, and the display must
// carry both. Folding them together would let a confident-looking number
// launder thin evidence, which is the specific failure this section of
// the contract exists to prevent.

import type {
  ConfidenceBand,
  ConfidenceComponents,
  ConfidenceReport,
  Observation,
  SourceFamily,
} from './types';
import { effectiveIndependentEvidence } from './dedupe';
import { observationQuality, qualityTermCoverage } from './quality';

/** Hard caps by count of independent source families. */
export const FAMILY_COUNT_CAPS: { minFamilies: number; cap: number }[] = [
  { minFamilies: 4, cap: 95 },
  { minFamilies: 3, cap: 80 },
  { minFamilies: 2, cap: 65 },
  { minFamilies: 1, cap: 40 },
  { minFamilies: 0, cap: 0 },
];

export function capForFamilyCount(familyCount: number): number {
  for (const { minFamilies, cap } of FAMILY_COUNT_CAPS) {
    if (familyCount >= minFamilies) return cap;
  }
  return 0;
}

/** Component weights. All seven are reported individually regardless. */
const COMPONENT_WEIGHTS: Record<keyof ConfidenceComponents, number> = {
  effectiveEvidence: 1.0,
  sourceFamilyCoverage: 1.0,
  geographicPrecision: 1.0,
  timeCoverage: 0.8,
  classifierCalibration: 0.8,
  authenticity: 0.8,
  provenanceCompleteness: 0.6,
};

/**
 * Effective independent evidence saturates rather than growing without
 * bound: going from 1 to 5 independent observations is a large gain in
 * trustworthiness, 50 to 54 is not. Half-saturation at 8.
 */
const EVIDENCE_HALF_SATURATION = 8;

export function evidenceComponentScore(effectiveEvidence: number): number {
  return effectiveEvidence / (effectiveEvidence + EVIDENCE_HALF_SATURATION);
}

/** Geographic resolution mapped to a precision score. */
const RESOLUTION_PRECISION: Record<string, number> = {
  point: 1.0,
  block_group: 0.9,
  tract: 0.85,
  place: 0.7,
  county: 0.6,
  state: 0.3,
  country: 0.1,
  unknown: 0.0,
};

export type ConfidenceInputs = {
  observations: Observation[];
  familiesPresent: SourceFamily[];
  familiesMissing: SourceFamily[];
  /** Share of the requested interval actually covered by observations, 0-1. */
  timeCoverage: number | null;
  /** Whether any contributing family is nonprobability social data. */
  includesNonprobabilitySocial: boolean;
};

export function computeConfidence(inputs: ConfidenceInputs): ConfidenceReport {
  const notes: string[] = [];
  const { observations, familiesPresent, familiesMissing } = inputs;

  const qualities = observations
    .map((o) => observationQuality(o.confidenceTerms))
    .filter((q): q is number => q !== null);

  const effectiveEvidence = effectiveIndependentEvidence(qualities);

  const expectedFamilyCount = familiesPresent.length + familiesMissing.length;
  const sourceFamilyCoverage =
    expectedFamilyCount === 0 ? 0 : familiesPresent.length / expectedFamilyCount;

  const geographicPrecision =
    observations.length === 0
      ? 0
      : observations.reduce((acc, o) => acc + (RESOLUTION_PRECISION[o.geographicResolution] ?? 0), 0) /
        observations.length;

  const classifierTerms = observations
    .map((o) => o.confidenceTerms.classifier)
    .filter((c): c is number => typeof c === 'number');
  const classifierCalibration =
    classifierTerms.length === 0
      ? 0
      : classifierTerms.reduce((acc, c) => acc + c, 0) / classifierTerms.length;

  const authenticityTerms = observations
    .map((o) => o.confidenceTerms.authenticity)
    .filter((a): a is number => typeof a === 'number');
  const authenticity =
    authenticityTerms.length === 0
      ? 0
      : authenticityTerms.reduce((acc, a) => acc + a, 0) / authenticityTerms.length;

  const provenanceCompleteness =
    observations.length === 0
      ? 0
      : observations.reduce((acc, o) => {
          const hasUrl = o.sourceUrl !== null || o.sourceId !== null;
          const hasPublished = o.publishedAt !== null;
          const hasMatchedGeography = o.matchedGeography !== null;
          const structural = (Number(hasUrl) + Number(hasPublished) + Number(hasMatchedGeography)) / 3;
          // Half structural provenance, half how many quality terms were
          // actually measured — an observation nobody characterized is
          // not fully provenanced even if its URL is present.
          return acc + 0.5 * structural + 0.5 * qualityTermCoverage(o.confidenceTerms);
        }, 0) / observations.length;

  if (classifierTerms.length === 0) {
    notes.push('No classifier calibration was reported by any observation; that component scores 0.');
  }
  if (authenticityTerms.length === 0) {
    notes.push('No authenticity screening was reported by any observation; that component scores 0.');
  }
  if (inputs.timeCoverage === null) {
    notes.push('Time coverage could not be determined; that component scores 0.');
  }

  const components: ConfidenceComponents = {
    effectiveEvidence: evidenceComponentScore(effectiveEvidence),
    sourceFamilyCoverage,
    geographicPrecision,
    timeCoverage: inputs.timeCoverage ?? 0,
    classifierCalibration,
    authenticity,
    provenanceCompleteness,
  };

  let weightedSum = 0;
  let weightTotal = 0;
  for (const [name, weight] of Object.entries(COMPONENT_WEIGHTS) as [
    keyof ConfidenceComponents,
    number,
  ][]) {
    weightedSum += components[name] * weight;
    weightTotal += weight;
  }
  const rawScore = (weightedSum / weightTotal) * 100;

  const capApplied = capForFamilyCount(familiesPresent.length);
  const score = Math.min(rawScore, capApplied);

  if (score === capApplied && rawScore > capApplied) {
    notes.push(
      `Confidence capped at ${capApplied} by the ${familiesPresent.length}-family rule ` +
        `(uncapped components would have given ${rawScore.toFixed(0)}).`,
    );
  }

  if (familiesMissing.length > 0) {
    notes.push(
      `Families queried but absent: ${familiesMissing.join(', ')}. ` +
        `Absence lowered confidence and contributed no value to the score.`,
    );
  }

  if (inputs.includesNonprobabilitySocial) {
    notes.push(
      'Includes nonprobability social data, which describes the digitally observable ' +
        'environment — not every resident.',
    );
  }

  return {
    components,
    familiesPresent,
    familiesMissing,
    // Rounded to a whole number: the contract forbids false decimal
    // precision on a quantity this soft.
    score: Math.round(score),
    capApplied,
    band: confidenceBand(score),
    notes,
  };
}

export function confidenceBand(score: number): ConfidenceBand {
  if (score < 25) return 'VERY_LOW';
  if (score < 50) return 'LOW';
  if (score < 75) return 'MEDIUM';
  return 'HIGH';
}
