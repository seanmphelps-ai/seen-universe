// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import type { Classification, ComparatorValue, IndicatorDirection } from './types';

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
