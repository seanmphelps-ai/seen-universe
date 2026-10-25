// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

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
