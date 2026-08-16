// Person-location exposure — step 7 of the contract.
//
//   Dose_j = [1 - exp(-months_j / 12)] × V(location_j, lived interval)
//
// Two rules this module enforces structurally rather than by convention:
//
//   1. Birth location, each residence of ≥6 months, and the current
//      location are DISTINCT historical slices. They are never merged.
//   2. "Do not overwrite unavailable historical evidence with current
//      data." If the vector for a residence's own lived interval could
//      not be obtained, the slice reports UNAVAILABLE. It does not
//      silently borrow today's numbers for a place someone lived in
//      1994 — that would fabricate history, which the contract forbids
//      everywhere and which matters most precisely here.

import type { EvidenceVector } from './types';

export type ResidenceRole = 'BIRTH' | 'LIVED' | 'CURRENT';

/** Minimum tenure for a residence to qualify as its own exposure slice. */
export const MINIMUM_RESIDENCE_MONTHS = 6;

export type ResidenceSlice = {
  locationId: string;
  label: string;
  role: ResidenceRole;
  /** ISO date the residence began. */
  start: string;
  /** ISO date it ended, or null for the current location. */
  end: string | null;
  months: number;
};

export type SliceDose = {
  slice: ResidenceSlice;
  /** [1 - exp(-months/12)]. Tenure saturation, independent of the vector. */
  tenureWeight: number;
  /**
   * Dose per vector component, or null where the component was not
   * measurable for this slice's own lived interval.
   */
  dose: Record<string, number | null>;
  status: 'COMPUTED' | 'UNAVAILABLE';
  /** Set when status is UNAVAILABLE. Never filled with substitute data. */
  unavailableReason: string | null;
};

/** [1 - exp(-months/12)] — one year of exposure reaches ~63% of the asymptote. */
export function tenureWeight(months: number): number {
  if (months < 0) throw new Error(`tenureWeight requires non-negative months — received ${months}`);
  return 1 - Math.exp(-months / 12);
}

export function monthsBetween(start: string, end: string | null, now: Date = new Date()): number {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : now;
  if (Number.isNaN(startDate.getTime())) throw new Error(`Invalid residence start date: ${start}`);
  if (Number.isNaN(endDate.getTime())) throw new Error(`Invalid residence end date: ${end}`);
  const days = (endDate.getTime() - startDate.getTime()) / 86_400_000;
  return Math.max(0, days / 30.436875); // mean Gregorian month length
}

/**
 * Whether a residence qualifies as its own slice. Birth and current
 * locations always qualify regardless of tenure — a birth location is a
 * distinct slice by definition, and the current location is where the
 * person is now.
 */
export function qualifiesAsSlice(slice: ResidenceSlice): boolean {
  if (slice.role === 'BIRTH' || slice.role === 'CURRENT') return true;
  return slice.months >= MINIMUM_RESIDENCE_MONTHS;
}

/**
 * Computes the dose for one slice.
 *
 * `vector` must have been built from the slice's OWN lived interval. Pass
 * null when that historical evidence could not be obtained; the slice
 * will report UNAVAILABLE rather than fall back to present-day data.
 */
export function computeSliceDose(
  slice: ResidenceSlice,
  vector: EvidenceVector | null,
  unavailableReason: string | null = null,
): SliceDose {
  const weight = tenureWeight(slice.months);

  if (!vector) {
    return {
      slice,
      tenureWeight: weight,
      dose: {},
      status: 'UNAVAILABLE',
      unavailableReason:
        unavailableReason ??
        `No evidence vector was obtainable for ${slice.label} over its own lived interval ` +
          `(${slice.start} to ${slice.end ?? 'present'}). Current-period data was NOT substituted.`,
    };
  }

  if (!vectorCoversInterval(vector, slice)) {
    return {
      slice,
      tenureWeight: weight,
      dose: {},
      status: 'UNAVAILABLE',
      unavailableReason:
        `The supplied vector covers ${vector.key.windowStart}–${vector.key.windowEnd}, which does not ` +
        `overlap this slice's lived interval (${slice.start} to ${slice.end ?? 'present'}). ` +
        `Refusing to apply out-of-period evidence to a historical residence.`,
    };
  }

  const components: Record<string, number | null> = {
    prev: vector.prev,
    phys: vector.phys,
    dig: vector.dig,
    amp: vector.amp,
    brd: vector.brd,
    sevMedian: vector.sev?.median ?? null,
    sevUpperTail: vector.sev?.upperTail ?? null,
  };

  const dose: Record<string, number | null> = {};
  for (const [name, value] of Object.entries(components)) {
    dose[name] = value === null ? null : weight * value;
  }

  return { slice, tenureWeight: weight, dose, status: 'COMPUTED', unavailableReason: null };
}

/** True when the vector's window overlaps the slice's lived interval at all. */
export function vectorCoversInterval(vector: EvidenceVector, slice: ResidenceSlice): boolean {
  const vectorStart = new Date(vector.key.windowStart).getTime();
  const vectorEnd = new Date(vector.key.windowEnd).getTime();
  const sliceStart = new Date(slice.start).getTime();
  const sliceEnd = slice.end ? new Date(slice.end).getTime() : Date.now();
  return vectorStart <= sliceEnd && vectorEnd >= sliceStart;
}

export type ExposureProfile = {
  slices: SliceDose[];
  /** Slices excluded for falling under the tenure minimum, reported not hidden. */
  excludedShortResidences: ResidenceSlice[];
  unavailableSlices: string[];
};

export function buildExposureProfile(
  residences: { slice: ResidenceSlice; vector: EvidenceVector | null }[],
): ExposureProfile {
  const slices: SliceDose[] = [];
  const excludedShortResidences: ResidenceSlice[] = [];

  for (const { slice, vector } of residences) {
    if (!qualifiesAsSlice(slice)) {
      excludedShortResidences.push(slice);
      continue;
    }
    slices.push(computeSliceDose(slice, vector));
  }

  return {
    slices,
    excludedShortResidences,
    unavailableSlices: slices.filter((s) => s.status === 'UNAVAILABLE').map((s) => s.slice.locationId),
  };
}

/**
 * The conditioning input handed to the Western / Vedic / Hellenistic /
 * BaZi / I Ching / Human Design modules.
 *
 * The contract is explicit about what this is and is not: those modules
 * receive the same location vector as a conditioning input, and the
 * evidence engine "stays independent and makes no claim that astrology
 * itself is validated". This type carries that disclaimer in the payload
 * so it cannot be dropped by a downstream consumer that only reads data.
 */
export type LocationConditioningInput = {
  profile: ExposureProfile;
  disclosure: string;
};

export const CONDITIONING_DISCLOSURE =
  'This location vector is supplied to symbolic modules (Western, Vedic, Hellenistic, BaZi, ' +
  'I Ching, Human Design) as a conditioning input only. The evidence engine is independent of ' +
  'them and makes no claim that any symbolic system is validated by this data, nor that this ' +
  'data is validated by them.';

export function toConditioningInput(profile: ExposureProfile): LocationConditioningInput {
  return { profile, disclosure: CONDITIONING_DISCLOSURE };
}
