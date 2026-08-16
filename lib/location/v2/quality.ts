// Observation quality q — the weighted geometric mean of whichever
// confidence terms are available.
//
// Contract: "Observation quality q is the weighted geometric mean of
// available geo, classifier, source reliability, authenticity, and
// recency terms (all 0-1). Missing optional terms are omitted, not set
// to zero."
//
// Omission vs. zero is the whole point. A geometric mean is annihilated
// by a single zero, so treating "we didn't measure authenticity" as
// authenticity = 0 would silently discard a perfectly good observation.
// Omitted terms drop out of both the numerator and the denominator.

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

/**
 * Weighted geometric mean over present terms:
 *   q = exp( Σ wᵢ·ln(xᵢ) / Σ wᵢ )
 *
 * Returns null when no term at all is available — that is an
 * uncharacterized observation, and the caller must charge it to
 * confidence rather than assume a value for it.
 *
 * A genuine measured 0 on any term does yield q = 0. That is correct and
 * deliberate: a measured zero on, say, authenticity means the item is
 * judged inauthentic, and it should carry no evidential weight.
 */
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
          `Out-of-range terms indicate an adapter bug; they are not clamped silently.`,
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

/**
 * How many of the five terms were actually measured. Feeds the
 * provenance-completeness component of confidence — an observation
 * scored on one term is not as trustworthy as the same q scored on five.
 */
export function qualityTermCoverage(terms: ObservationConfidenceTerms): number {
  const total = Object.keys(QUALITY_TERM_WEIGHTS).length;
  const measured = (Object.keys(QUALITY_TERM_WEIGHTS) as (keyof ObservationConfidenceTerms)[])
    .filter((termName) => typeof terms[termName] === 'number' && Number.isFinite(terms[termName]))
    .length;
  return measured / total;
}
