// SEEN Location V1 — comparator + classification.
//
// Classification must be reproducible from the measurement and an explicit
// stored comparator, never guessed from prose. V1 uses a simple, disclosed
// ratio-to-baseline rule rather than a true cross-county percentile rank
// (which would require pulling ACS data for every U.S. county — out of
// scope for the first vertical slice). The rule and its threshold are
// stored in code, not invented per-request, and the comparator value used
// is always recorded on the finding.

import type { Classification, ComparatorValue, IndicatorDirection } from './types';

// A value more than 15% above/below the chosen baseline is classified
// ABUNDANT/SCARCE (direction-adjusted); otherwise PRESENT. This threshold
// is a disclosed V1 default, not a claim about what magnitude of
// difference is meaningful for any given person.
const ABUNDANT_SCARCE_THRESHOLD_RATIO = 0.15;

export function classifyAgainstComparator(
  rawValue: number | null,
  comparator: ComparatorValue | null,
  direction: IndicatorDirection,
): Classification {
  if (rawValue === null) return 'UNKNOWN';
  if (!comparator || comparator.value === 0) return 'UNKNOWN';

  const ratioDiff = (rawValue - comparator.value) / comparator.value;

  const isHigh = ratioDiff >= ABUNDANT_SCARCE_THRESHOLD_RATIO;
  const isLow = ratioDiff <= -ABUNDANT_SCARCE_THRESHOLD_RATIO;

  if (!isHigh && !isLow) return 'PRESENT';

  if (direction === 'HIGHER_IS_MORE') {
    return isHigh ? 'ABUNDANT' : 'SCARCE';
  }
  // LOWER_IS_MORE: a low raw value relative to baseline means "more"
  // (e.g. lower poverty rate than baseline = more economic opportunity).
  return isLow ? 'ABUNDANT' : 'SCARCE';
}

/** Picks which stored comparator drives classification: state, falling back to national. */
export function selectComparator(
  comparators: ComparatorValue[],
  preferredLabel: string,
): ComparatorValue | null {
  return (
    comparators.find((c) => c.label === preferredLabel) ??
    comparators[0] ??
    null
  );
}
