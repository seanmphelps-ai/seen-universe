/**
 * Time-narrowing ladder for the Grok Bot first slice.
 * Round 1 clocks must stay equal to chartEngine.DARK_WINDOWS.
 * This module stays free of the Swiss engine so the card UI can import it.
 */

export const ROUND_1_CLOCKS = ['04:00', '12:00', '20:00'] as const;

export type NarrowingRound = 1 | 2 | 3 | 4;

const ROUND_DELTAS: Record<Exclude<NarrowingRound, 1>, number> = {
  2: 3,
  3: 2,
  4: 1,
};

const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isHiddenClock(value: string): boolean {
  return CLOCK.test(value);
}

function clockToMinutes(clock: string): number {
  const match = CLOCK.exec(clock);
  if (!match) {
    throw new Error('A picked summary is missing its hidden clock.');
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

function minutesToClock(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Neighbor set [anchor−Δ, anchor, anchor+Δ], wrapped inside 24h. */
export function neighborClocks(anchorClock: string, deltaHours: number): string[] {
  const anchorMinutes = clockToMinutes(anchorClock);
  const delta = deltaHours * 60;
  return [
    minutesToClock(anchorMinutes - delta),
    minutesToClock(anchorMinutes),
    minutesToClock(anchorMinutes + delta),
  ];
}

export function clocksForRound(round: NarrowingRound, pickedClock?: string): string[] {
  if (round === 1) return [...ROUND_1_CLOCKS];
  if (!pickedClock || !isHiddenClock(pickedClock)) {
    throw new Error('A picked summary is missing its hidden clock.');
  }
  return neighborClocks(pickedClock, ROUND_DELTAS[round]);
}

/**
 * Omitted clocks mean Round 1.
 * A present list must already be valid HH:MM values — never swapped for noon.
 */
export function resolveDarkClocks(
  clocks: unknown,
  fallback: readonly string[] = ROUND_1_CLOCKS,
): { ok: true; clocks: string[] } | { ok: false; error: string } {
  if (clocks == null) return { ok: true, clocks: [...fallback] };
  if (!Array.isArray(clocks) || clocks.length === 0 || clocks.some((clock) => typeof clock !== 'string' || !isHiddenClock(clock))) {
    return { ok: false, error: 'Clocks must be a non-empty list of HH:MM values.' };
  }
  return { ok: true, clocks };
}
