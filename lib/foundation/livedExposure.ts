import { LivedPlaceSchema, type LivedPlace, type Place } from './intakeSchema';

const YEAR_MONTH = /^(\d{4})-(\d{2})$/;

export type YearMonth = { year: number; month: number };

export type LivedPlaceDraft = {
  id: string;
  query: string;
  city: Place | null;
  startMonth: string;
  endMonth: string;
  stillThere: boolean;
};

export function emptyLivedPlaceDraft(id: string): LivedPlaceDraft {
  return {
    id,
    query: '',
    city: null,
    startMonth: '',
    endMonth: '',
    stillThere: false,
  };
}

export function parseYearMonth(value: string): YearMonth | null {
  const match = YEAR_MONTH.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

/** Whole months between two calendar months, divided by 12. Six months is 0.5. */
export function exposureYears(start: YearMonth, end: YearMonth): number {
  return ((end.year - start.year) * 12 + (end.month - start.month)) / 12;
}

export function buildLivedPlace(input: {
  place: Place;
  startMonth: string;
  endMonth: string | null;
  now?: Date;
}): LivedPlace {
  const start = parseYearMonth(input.startMonth);
  if (!start) {
    throw new Error(`Enter the month ${input.place.name} started.`);
  }

  const now = input.now ?? new Date();
  const end = input.endMonth
    ? parseYearMonth(input.endMonth)
    : { year: now.getFullYear(), month: now.getMonth() + 1 };

  if (!end) {
    throw new Error(`Enter the month you left ${input.place.name}, or mark that you still live there.`);
  }

  const yearsLived = exposureYears(start, end);
  if (yearsLived < 0.5) {
    throw new Error(`${input.place.name} counts only after six months.`);
  }

  return LivedPlaceSchema.parse({
    place: input.place,
    startYear: start.year,
    endYear: input.endMonth ? end.year : null,
    yearsLived,
  });
}

export function collectLivedPlaces(rows: LivedPlaceDraft[], now = new Date()): LivedPlace[] {
  const active = rows.filter(
    (row) => row.query.trim() || row.city || row.startMonth || row.endMonth || row.stillThere,
  );

  return active.map((row) => {
    if (!row.city) {
      throw new Error('Select each lived city from the list so it has coordinates.');
    }
    if (!row.stillThere && !row.endMonth) {
      throw new Error(`Enter the month you left ${row.city.name}, or mark that you still live there.`);
    }
    return buildLivedPlace({
      place: row.city,
      startMonth: row.startMonth,
      endMonth: row.stillThere ? null : row.endMonth,
      now,
    });
  });
}

export function livedStackFromPlaces(places: LivedPlace[]): string {
  return places
    .map((entry) => {
      const end = entry.endYear == null ? 'now' : String(entry.endYear);
      return `${entry.place.name} ${entry.startYear}–${end}`;
    })
    .join('. ');
}
