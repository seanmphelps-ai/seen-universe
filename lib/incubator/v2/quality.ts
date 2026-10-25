// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import type { ObservationConfidenceTerms } from './types';

/**
 * Relative weights. Geographic match and classifier calibration carry the
 * most weight because they determine whether the observation is about
 * this place and this marker at all; recency carries least because a
 * correctly dated older observation is still true, just less current.
 */
export const QUALITY_TERM_WEIGHTS: Record<keyof ObservationConfidenceTerms, number> = {
  geo: 1.0,
  classifier: 1.0,
  source: 0.8,
  authenticity: 0.8,
  recency: 0.5,
};

export class QualityTermRangeError extends Error {}


export function observationQuality(terms: ObservationConfidenceTerms): number | null {
  const present = (Object.keys(QUALITY_TERM_WEIGHTS) as (keyof ObservationConfidenceTerms)[])
    .map((termName) => ({ termName, value: terms[termName] }))
    .filter((t): t is { termName: keyof ObservationConfidenceTerms; value: number } =>
      typeof t.value === 'number' && Number.isFinite(t.value),
    );

  if (present.length === 0) return null;

  for (const { termName, value } of present) {
    if (value < 0 || value > 1) {
      throw new QualityTermRangeError(
        `Quality term "${termName}" must be in [0,1] — received ${value}. ` +
          `Out-of-range terms indicate an adapter bug and require an explicit error.`,
      );
    }
  }

  // A measured zero annihilates the geometric mean by definition. Handled
  // explicitly because ln(0) = -Infinity would otherwise propagate as NaN
  // through the weighted sum.
  if (present.some((t) => t.value === 0)) return 0;

  let weightedLogSum = 0;
  let weightSum = 0;
  for (const { termName, value } of present) {
    const weight = QUALITY_TERM_WEIGHTS[termName];
    weightedLogSum += weight * Math.log(value);
    weightSum += weight;
  }

  return Math.exp(weightedLogSum / weightSum);
}


export function qualityTermCoverage(terms: ObservationConfidenceTerms): number {
  const total = Object.keys(QUALITY_TERM_WEIGHTS).length;
  const measured = (Object.keys(QUALITY_TERM_WEIGHTS) as (keyof ObservationConfidenceTerms)[])
    .filter((termName) => typeof terms[termName] === 'number' && Number.isFinite(terms[termName]))
    .length;
  return measured / total;
}
