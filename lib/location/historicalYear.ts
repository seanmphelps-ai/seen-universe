// SEEN Location V1 — historical year selection for ACS 5-year vintages.
//
// ACS 5-year estimates are published annually; each vintage year Y covers
// the window [Y-4, Y]. This picks the vintage whose window best overlaps
// the requested residence period, and always reports whether it actually
// overlaps or is a nearest-available substitution — per the spec's
// "never silently substitute" rule.

// Known-published ACS5 vintages. This is a maintained list, not a live
// lookup (the Census "available datasets" endpoint would need its own
// network call this sandbox can't make); extend it as new vintages ship.
export const KNOWN_ACS5_VINTAGES = Array.from({ length: 2022 - 2010 + 1 }, (_, i) =>
  String(2010 + i),
);

export type AcsYearSelection = {
  dataYear: string;
  windowStart: number;
  windowEnd: number;
  overlapsResidence: boolean;
  substitution: string | null;
};

export function selectAcsVintageYear(
  exposureStart: string,
  exposureEnd: string | null,
  today: Date = new Date(),
): AcsYearSelection {
  const startYear = Number(exposureStart.slice(0, 4));
  const endYear = exposureEnd ? Number(exposureEnd.slice(0, 4)) : today.getUTCFullYear();

  const targetYear = Math.round((startYear + endYear) / 2);

  const vintages = KNOWN_ACS5_VINTAGES.map(Number);
  const nearest = vintages.reduce((best, y) =>
    Math.abs(y - targetYear) < Math.abs(best - targetYear) ? y : best,
  );

  const windowStart = nearest - 4;
  const windowEnd = nearest;
  const overlapsResidence = windowStart <= endYear && windowEnd >= startYear;

  const substitution = overlapsResidence
    ? null
    : `No ACS5 vintage window overlaps residence period ${exposureStart}–${exposureEnd ?? 'present'}; nearest available vintage ${nearest} (covers ${windowStart}-${windowEnd}) used instead.`;

  return {
    dataYear: String(nearest),
    windowStart,
    windowEnd,
    overlapsResidence,
    substitution,
  };
}
