// PERSIST — condition persistence/duration for one [M,L,T] cell.
//
// This module deliberately measures the temporal extent of the CONDITION,
// not the persistence of discussion about it. Attention persistence belongs
// to AMP. PERSIST reads TEMPORAL_EXTENT and reports the fraction of the
// requested exposure window during which the condition was active.
//
// Regime classification is not guessed from arbitrary thresholds here.
// Callers may supply a regime only when the marker/provider contract has
// enough evidence to establish it; otherwise the regime remains UNKNOWN.

import {
  assertChannelAdmissible,
  type PersistenceEstimate,
  type PersistenceRegime,
} from './dimensions';

const DAY_MS = 86_400_000;

export type TemporalExtentInput = {
  /** ISO-8601 timestamp/date when the condition became active. */
  start: string;
  /** ISO-8601 timestamp/date when the condition ceased being active. */
  end: string;
};

export type PersistenceInputs = {
  /** Requested exposure window, ISO-8601. */
  windowStart: string;
  windowEnd: string;
  /** Condition-active intervals. Discussion/circulation intervals do not belong here. */
  extents: TemporalExtentInput[];
  /** Evidence-backed regime classification, when independently established. */
  regime?: PersistenceRegime | null;
};

type Interval = { startMs: number; endMs: number };

function parseMs(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Computes condition persistence inside the requested exposure window.
 *
 * Null means the temporal extent was not measurable. It is never converted
 * to zero: zero would mean the condition was measured and known to be absent,
 * which is a different claim.
 */
export function computePersistence(inputs: PersistenceInputs): PersistenceEstimate | null {
  const windowStartMs = parseMs(inputs.windowStart);
  const windowEndMs = parseMs(inputs.windowEnd);

  if (
    windowStartMs === null ||
    windowEndMs === null ||
    windowEndMs <= windowStartMs ||
    inputs.extents.length === 0
  ) {
    return null;
  }

  assertChannelAdmissible('PERSIST', 'TEMPORAL_EXTENT');

  const clipped: Interval[] = [];

  for (const extent of inputs.extents) {
    const rawStart = parseMs(extent.start);
    const rawEnd = parseMs(extent.end);
    if (rawStart === null || rawEnd === null || rawEnd <= rawStart) continue;

    const startMs = Math.max(windowStartMs, rawStart);
    const endMs = Math.min(windowEndMs, rawEnd);
    if (endMs <= startMs) continue;

    clipped.push({ startMs, endMs });
  }

  if (clipped.length === 0) return null;

  clipped.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);

  const merged: Interval[] = [];
  for (const interval of clipped) {
    const previous = merged[merged.length - 1];
    if (!previous || interval.startMs > previous.endMs) {
      merged.push({ ...interval });
      continue;
    }
    previous.endMs = Math.max(previous.endMs, interval.endMs);
  }

  const windowDurationMs = windowEndMs - windowStartMs;
  const activeDurationMs = merged.reduce((sum, interval) => sum + (interval.endMs - interval.startMs), 0);
  const longestDurationMs = Math.max(...merged.map((interval) => interval.endMs - interval.startMs));

  const activeFraction = Math.min(1, Math.max(0, activeDurationMs / windowDurationMs));
  const spansEntireWindow =
    merged.length === 1 &&
    merged[0].startMs <= windowStartMs &&
    merged[0].endMs >= windowEndMs;

  return {
    activeFraction,
    regime: inputs.regime ?? 'UNKNOWN',
    longestUnbrokenDays: longestDurationMs / DAY_MS,
    spellCount: merged.length,
    spansEntireWindow,
  };
}
