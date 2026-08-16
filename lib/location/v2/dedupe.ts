// Dedupe incident, preserve exposure.
//
// Contract: "Cluster reports/posts into one underlying event e. Within
// each source family retain only its strongest confirmation; fuse
// independent families: p(e) = 1 - Π_f [1 - max(q_o in e,f)]. All
// mentions remain in a separate exposure table. Result: one shooting is
// one event, while 800 posts remain 800 exposure/amplification
// observations."
//
// The two tables come out of one pass and are returned together so a
// caller cannot accidentally use the collapsed set where it needed the
// full set. Nothing is dropped: every input observation appears in
// exposure exactly once.

import type { Observation, SourceFamily } from './types';
import { observationQuality } from './quality';

export type FamilyConfirmation = {
  sourceFamily: SourceFamily;
  /** The single strongest observation retained for this family. */
  strongestObservationId: string;
  /** max(q_o) within this family — the family's contribution to p(e). */
  maxQuality: number;
  /** How many observations this family contributed to the event. */
  observationCount: number;
};

export type FusedEvent = {
  eventFingerprint: string;
  markerIds: string[];
  /** p(e) — probability the underlying event is real, fused across families. */
  probability: number;
  confirmations: FamilyConfirmation[];
  /** Independent families that confirmed the event. Drives confidence caps. */
  familyCount: number;
  earliestPublishedAt: string | null;
  /** Severity of the strongest-quality confirmation, if the marker carries one. */
  severity: number | null;
};

export type ExposureRecord = {
  observationId: string;
  eventFingerprint: string | null;
  sourceFamily: SourceFamily;
  markerIds: string[];
  quality: number | null;
  engagement: Observation['engagement'];
  localAccountEstimate: number | null;
  publishedAt: string | null;
  accountId: string | null;
};

export type DedupeResult = {
  /** One entry per underlying event. Use for PREV, PHYS, TREND. */
  events: FusedEvent[];
  /** One entry per input observation, always. Use for AMP, BRD, CONC, DIG. */
  exposure: ExposureRecord[];
  /**
   * Observations with no fingerprint. They cannot be attributed to an
   * event, so they count as exposure only — never as incidents. Reported
   * explicitly rather than silently bucketed.
   */
  unfingerprintedCount: number;
};

/**
 * Fuses independent family confirmations into p(e).
 *
 *   p(e) = 1 - Π_f [1 - max(q_o in e,f)]
 *
 * The product runs over families, not observations, which is what makes
 * 800 posts about one shooting worth exactly one social-family
 * confirmation rather than 800 multiplicative ones.
 */
export function fuseEventProbability(familyMaxQualities: number[]): number {
  if (familyMaxQualities.length === 0) return 0;
  let complement = 1;
  for (const q of familyMaxQualities) {
    complement *= 1 - q;
  }
  return 1 - complement;
}

export function dedupeObservations(observations: Observation[]): DedupeResult {
  const exposure: ExposureRecord[] = [];
  const byFingerprint = new Map<string, Observation[]>();
  let unfingerprintedCount = 0;

  for (const observation of observations) {
    const quality = observationQuality(observation.confidenceTerms);

    // Every observation lands in the exposure table, without exception —
    // including unfingerprinted ones and ones whose quality is null.
    exposure.push({
      observationId: observation.observationId,
      eventFingerprint: observation.eventFingerprint,
      sourceFamily: observation.sourceFamily,
      markerIds: observation.markerIds,
      quality,
      engagement: observation.engagement,
      localAccountEstimate: observation.localAccountEstimate,
      publishedAt: observation.publishedAt,
      accountId: observation.accountId,
    });

    if (!observation.eventFingerprint) {
      unfingerprintedCount++;
      continue;
    }

    const bucket = byFingerprint.get(observation.eventFingerprint);
    if (bucket) {
      bucket.push(observation);
    } else {
      byFingerprint.set(observation.eventFingerprint, [observation]);
    }
  }

  const events: FusedEvent[] = [];

  for (const [eventFingerprint, clustered] of byFingerprint) {
    // Within each source family, retain only the strongest confirmation.
    const strongestPerFamily = new Map<SourceFamily, { observation: Observation; quality: number; count: number }>();

    for (const observation of clustered) {
      const quality = observationQuality(observation.confidenceTerms);
      // An observation with no measured quality term cannot confirm an
      // event — there is nothing to fuse. It still counts as exposure
      // (already recorded above) and is charged to confidence downstream.
      if (quality === null) continue;

      const existing = strongestPerFamily.get(observation.sourceFamily);
      if (!existing) {
        strongestPerFamily.set(observation.sourceFamily, { observation, quality, count: 1 });
      } else {
        existing.count++;
        if (quality > existing.quality) {
          existing.observation = observation;
          existing.quality = quality;
        }
      }
    }

    if (strongestPerFamily.size === 0) continue;

    const confirmations: FamilyConfirmation[] = [...strongestPerFamily.entries()].map(
      ([sourceFamily, entry]) => ({
        sourceFamily,
        strongestObservationId: entry.observation.observationId,
        maxQuality: entry.quality,
        observationCount: entry.count,
      }),
    );

    const probability = fuseEventProbability(confirmations.map((c) => c.maxQuality));

    const publishedDates = clustered
      .map((o) => o.publishedAt)
      .filter((d): d is string => typeof d === 'string')
      .sort();

    const strongestOverall = [...strongestPerFamily.values()].reduce((best, current) =>
      current.quality > best.quality ? current : best,
    );

    const markerIds = [...new Set(clustered.flatMap((o) => o.markerIds))].sort();

    events.push({
      eventFingerprint,
      markerIds,
      probability,
      confirmations,
      familyCount: confirmations.length,
      earliestPublishedAt: publishedDates[0] ?? null,
      severity: strongestOverall.observation.severity,
    });
  }

  // Stable ordering so downstream output and tests are deterministic.
  events.sort((a, b) => a.eventFingerprint.localeCompare(b.eventFingerprint));

  return { events, exposure, unfingerprintedCount };
}

/**
 * Effective independent evidence — Kish's effective sample size applied to
 * observation qualities:
 *
 *   n_eff = (Σ q)² / Σ q²
 *
 * A hundred near-identical low-quality mentions of one event yield an
 * n_eff near 1, which is exactly the honest answer. Feeds confidence.
 */
export function effectiveIndependentEvidence(qualities: number[]): number {
  const usable = qualities.filter((q) => Number.isFinite(q) && q > 0);
  if (usable.length === 0) return 0;
  const sum = usable.reduce((acc, q) => acc + q, 0);
  const sumSquares = usable.reduce((acc, q) => acc + q * q, 0);
  return (sum * sum) / sumSquares;
}
