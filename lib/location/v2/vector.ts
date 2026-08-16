// Marker evidence vector V[M,L,T] — step 3 of the contract.
//
// Nine components, computed inside a single source family (step 4.1:
// "Compute the full vector inside each source family first"). Cross-family
// fusion happens later, in fuse.ts, never here.
//
// Every component returns null when its inputs were not obtainable. Null
// is not zero: null means "not measured" and is charged to confidence,
// while zero means "measured, and it was zero". Collapsing the two is the
// single most misleading thing this engine could do, so the type keeps
// them apart and every consumer must handle null explicitly.

import type {
  ConcentrationEstimate,
  EvidenceVector,
  FrameVector,
  MarkerRegistryEntry,
  ResponseFrame,
  SeverityDistribution,
  SourceFamily,
  TrendEstimate,
  VectorKey,
} from './types';
import { RESPONSE_FRAMES } from './types';
import type { ExposureRecord, FusedEvent } from './dedupe';
import { digamma, median, normalizedHhi, quantile, robustPercentile, trigamma } from './stats';

/** Per-event inputs the physical-dose term needs. Absent → event omitted from PHYS. */
export type PhysicalDoseInput = {
  eventFingerprint: string;
  /** Share of the local population plausibly within the event's reach, 0-1. */
  affectedPopulationShare: number;
  /** How long the condition persisted, in days. */
  durationDays: number;
  /** Marker-rubric severity, 0-1. */
  severity: number;
};

/** Baselines are provider-, marker-, and time-specific by contract. */
export type AmplificationBaselines = {
  reposts?: number[];
  comments?: number[];
  persistenceDays?: number[];
  crossPlatformCount?: number[];
  networkSpread?: number[];
  mobilization?: number[];
};

export type VectorInputs = {
  key: VectorKey;
  sourceFamily: SourceFamily;
  marker: MarkerRegistryEntry;

  events: FusedEvent[];
  exposure: ExposureRecord[];

  windowDays: number;

  /** Denominators. Each is null when the marker does not use it or it could not be obtained. */
  population: number | null;
  sampledLocalContentCount: number | null;
  sampledActiveLocalAccounts: number | null;
  connectedLocalPopulation: number | null;

  /** Unique local accounts observed participating. Feeds BRD. */
  uniqueParticipatingLocalAccounts: number | null;

  /** Per-account participation counts, for CONC. Keyed by opaque account id. */
  accountParticipation: Record<string, number> | null;

  /**
   * Measured deduplicated local reach. When absent, DIG falls back to a
   * summed-reach proxy and the vector is labeled digIsProxy — the
   * contract permits a proxy only when it is labeled as one.
   */
  measuredDedupedLocalReach: number | null;

  physicalDoseInputs: PhysicalDoseInput[];
  amplificationBaselines: AmplificationBaselines;

  /** Prior-period counts for TREND. */
  baseline: { events: number; windowDays: number } | null;

  /** Optional per-observation extras some providers expose. */
  networkSpreadByObservation?: Record<string, number>;
  mobilizationByObservation?: Record<string, number>;
};

/** Jeffreys prior for the Gamma-Poisson rate model used by TREND. */
const TREND_PRIOR_SHAPE = 0.5;
const Z_95 = 1.959963984540054;

/**
 * PREV — unique-event rate per 10k residents per 30 days for event
 * markers; weighted share of sampled local content for ambient markers.
 */
export function computePrevalence(inputs: VectorInputs): { value: number | null; note?: string } {
  if (inputs.marker.unit === 'ambient') {
    if (inputs.sampledLocalContentCount === null || inputs.sampledLocalContentCount <= 0) {
      return { value: null, note: 'PREV unavailable: no sampled local-content denominator for an ambient marker.' };
    }
    // Weighted share: each mention counts by its observation quality, so
    // a body of weak matches cannot read as a strong ambient presence.
    const weighted = inputs.exposure.reduce((acc, e) => acc + (e.quality ?? 0), 0);
    return { value: weighted / inputs.sampledLocalContentCount };
  }

  if (inputs.population === null || inputs.population <= 0) {
    return { value: null, note: 'PREV unavailable: no population denominator for an event marker.' };
  }
  if (inputs.windowDays <= 0) {
    return { value: null, note: 'PREV unavailable: window length is zero.' };
  }

  const uniqueEvents = inputs.events.length;
  const per10k = (uniqueEvents / inputs.population) * 10_000;
  return { value: per10k * (30 / inputs.windowDays) };
}

/**
 * SEV — the observed intensity distribution. Median and upper tail are
 * reported separately and the marker's polarity travels with them, so a
 * rare-but-extreme marker cannot be flattened into a low average.
 */
export function computeSeverity(inputs: VectorInputs): SeverityDistribution | null {
  const severities = inputs.events
    .map((e) => e.severity)
    .filter((s): s is number => typeof s === 'number' && Number.isFinite(s));

  if (severities.length === 0) return null;

  return {
    median: median(severities),
    upperTail: quantile(severities, 0.9),
    polarity: inputs.marker.polarity,
    n: severities.length,
  };
}

/**
 * PHYS — potential resident dose:
 *   1 - exp(-Σ p(e) × affected-pop-share × duration × severity)
 *
 * "Potential" is load-bearing: this is the dose implied by the observed
 * evidence, not a measured per-person exposure.
 */
export function computePhysicalDose(inputs: VectorInputs): { value: number | null; note?: string } {
  if (inputs.physicalDoseInputs.length === 0) {
    return { value: null, note: 'PHYS unavailable: no per-event dose parameters were obtainable.' };
  }

  const probabilityByFingerprint = new Map(inputs.events.map((e) => [e.eventFingerprint, e.probability]));

  let accumulated = 0;
  let contributing = 0;
  for (const dose of inputs.physicalDoseInputs) {
    const probability = probabilityByFingerprint.get(dose.eventFingerprint);
    if (probability === undefined) continue;
    accumulated += probability * dose.affectedPopulationShare * dose.durationDays * dose.severity;
    contributing++;
  }

  if (contributing === 0) {
    return { value: null, note: 'PHYS unavailable: dose parameters matched no deduplicated event.' };
  }
  return { value: 1 - Math.exp(-accumulated) };
}

/**
 * DIG — potential digital dose:
 *   1 - exp(-deduped local reach / connected local population)
 *
 * When no measured deduplicated reach is available, a summed-reach proxy
 * is used and flagged. The proxy overcounts people reached by more than
 * one item, so it is an upper bound, never a measurement.
 */
export function computeDigitalDose(inputs: VectorInputs): {
  value: number | null;
  isProxy: boolean;
  note?: string;
} {
  if (inputs.connectedLocalPopulation === null || inputs.connectedLocalPopulation <= 0) {
    return {
      value: null,
      isProxy: false,
      note: 'DIG unavailable: no connected-local-population denominator.',
    };
  }

  let reach = inputs.measuredDedupedLocalReach;
  let isProxy = false;

  if (reach === null) {
    const summed = inputs.exposure.reduce((acc, record) => {
      const uniqueReach = record.engagement?.uniqueReach;
      if (typeof uniqueReach !== 'number' || !Number.isFinite(uniqueReach)) return acc;
      const localShare = record.localAccountEstimate ?? 1;
      return acc + uniqueReach * localShare;
    }, 0);

    if (summed === 0) {
      return { value: null, isProxy: false, note: 'DIG unavailable: no reach figures on any observation.' };
    }
    reach = summed;
    isProxy = true;
  }

  return {
    value: 1 - Math.exp(-reach / inputs.connectedLocalPopulation),
    isProxy,
    note: isProxy
      ? 'DIG used a summed-reach proxy (upper bound: people reached by multiple items are counted more than once).'
      : undefined,
  };
}

/**
 * AMP — robust percentile of log-scaled amplification signals against
 * provider/marker/time baselines.
 *
 * Each signal is ranked against its own baseline and the median of the
 * available ranks is taken. Ranking first, then taking a median, means a
 * missing signal simply drops out instead of dragging a summed composite
 * toward zero.
 */
export function computeAmplification(inputs: VectorInputs): { value: number | null; note?: string } {
  const totals = {
    reposts: 0,
    comments: 0,
    persistenceDays: 0,
    crossPlatformCount: 0,
    networkSpread: 0,
    mobilization: 0,
  };
  const observed = {
    reposts: false,
    comments: false,
    persistenceDays: false,
    crossPlatformCount: false,
    networkSpread: false,
    mobilization: false,
  };

  for (const record of inputs.exposure) {
    const engagement = record.engagement;
    if (engagement) {
      if (typeof engagement.reposts === 'number') {
        totals.reposts += engagement.reposts;
        observed.reposts = true;
      }
      if (typeof engagement.comments === 'number') {
        totals.comments += engagement.comments;
        observed.comments = true;
      }
      if (typeof engagement.persistenceDays === 'number') {
        totals.persistenceDays = Math.max(totals.persistenceDays, engagement.persistenceDays);
        observed.persistenceDays = true;
      }
      if (typeof engagement.crossPlatformCount === 'number') {
        totals.crossPlatformCount = Math.max(totals.crossPlatformCount, engagement.crossPlatformCount);
        observed.crossPlatformCount = true;
      }
    }
    const networkSpread = inputs.networkSpreadByObservation?.[record.observationId];
    if (typeof networkSpread === 'number') {
      totals.networkSpread += networkSpread;
      observed.networkSpread = true;
    }
    const mobilization = inputs.mobilizationByObservation?.[record.observationId];
    if (typeof mobilization === 'number') {
      totals.mobilization += mobilization;
      observed.mobilization = true;
    }
  }

  const percentiles: number[] = [];
  const signals: (keyof AmplificationBaselines)[] = [
    'reposts',
    'comments',
    'persistenceDays',
    'crossPlatformCount',
    'networkSpread',
    'mobilization',
  ];

  for (const signal of signals) {
    const baseline = inputs.amplificationBaselines[signal];
    if (!observed[signal] || !baseline || baseline.length === 0) continue;
    const scaledBaseline = baseline.map((b) => Math.log1p(Math.max(0, b)));
    percentiles.push(robustPercentile(Math.log1p(Math.max(0, totals[signal])), scaledBaseline));
  }

  if (percentiles.length === 0) {
    return {
      value: null,
      note: 'AMP unavailable: no amplification signal had both observations and a provider baseline.',
    };
  }
  return { value: median(percentiles) };
}

/** BRD — unique participating local accounts / sampled active local accounts. */
export function computeBreadth(inputs: VectorInputs): { value: number | null; note?: string } {
  if (inputs.uniqueParticipatingLocalAccounts === null) {
    return { value: null, note: 'BRD unavailable: participating-account count not obtainable.' };
  }
  if (inputs.sampledActiveLocalAccounts === null || inputs.sampledActiveLocalAccounts <= 0) {
    return { value: null, note: 'BRD unavailable: no sampled active-local-account denominator.' };
  }
  return {
    value: Math.min(1, inputs.uniqueParticipatingLocalAccounts / inputs.sampledActiveLocalAccounts),
  };
}

/** CONC — normalized account HHI plus top-1% and top-10% contribution. */
export function computeConcentration(inputs: VectorInputs): ConcentrationEstimate | null {
  const participation = inputs.accountParticipation;
  if (!participation) return null;

  const counts = Object.values(participation).filter((c) => Number.isFinite(c) && c > 0);
  if (counts.length === 0) return null;

  const total = counts.reduce((acc, c) => acc + c, 0);
  const shares = counts.map((c) => c / total).sort((a, b) => b - a);

  const topShare = (fraction: number): number => {
    // At least one account, so a small population still reports the
    // concentration its largest contributor actually holds.
    const take = Math.max(1, Math.ceil(shares.length * fraction));
    return shares.slice(0, take).reduce((acc, s) => acc + s, 0);
  };

  return {
    normalizedHhi: normalizedHhi(shares),
    top1PercentShare: topShare(0.01),
    top10PercentShare: topShare(0.1),
    accounts: shares.length,
  };
}

/** FRAME — quality-weighted probability vector over the response frames. */
export function computeFrameVector(inputs: VectorInputs, frames: (ResponseFrame | null)[]): FrameVector | null {
  const weights = new Map<ResponseFrame, number>();
  let total = 0;

  frames.forEach((frame, index) => {
    if (!frame) return;
    const weight = inputs.exposure[index]?.quality ?? 1;
    weights.set(frame, (weights.get(frame) ?? 0) + weight);
    total += weight;
  });

  if (total === 0) return null;

  const vector = {} as FrameVector;
  for (const frame of RESPONSE_FRAMES) {
    vector[frame] = (weights.get(frame) ?? 0) / total;
  }
  return vector;
}

/**
 * TREND — posterior log rate ratio, current window vs prior baseline.
 *
 * Gamma-Poisson conjugate model with a Jeffreys prior (α = 1/2). Using
 * the posterior of ln λ rather than a raw ratio is what keeps a jump
 * from 0 to 2 events from reading as an infinite increase:
 *
 *   E[ln λ] = ψ(α + c) - ln(t)
 *   Var[ln λ] = ψ'(α + c)
 */
export function computeTrend(inputs: VectorInputs): TrendEstimate | null {
  if (!inputs.baseline) return null;
  if (inputs.windowDays <= 0 || inputs.baseline.windowDays <= 0) return null;

  const currentEvents = inputs.events.length;
  const baselineEvents = inputs.baseline.events;

  const currentShape = TREND_PRIOR_SHAPE + currentEvents;
  const baselineShape = TREND_PRIOR_SHAPE + baselineEvents;

  const logCurrentRate = digamma(currentShape) - Math.log(inputs.windowDays);
  const logBaselineRate = digamma(baselineShape) - Math.log(inputs.baseline.windowDays);

  const logRateRatio = logCurrentRate - logBaselineRate;
  const variance = trigamma(currentShape) + trigamma(baselineShape);
  const halfWidth = Z_95 * Math.sqrt(variance);

  return {
    logRateRatio,
    lower95: logRateRatio - halfWidth,
    upper95: logRateRatio + halfWidth,
    currentEvents,
    baselineEvents,
    currentWindowDays: inputs.windowDays,
    baselineWindowDays: inputs.baseline.windowDays,
  };
}

/** Computes the full nine-component vector for one family. */
export function computeEvidenceVector(
  inputs: VectorInputs,
  frames: (ResponseFrame | null)[] = [],
): EvidenceVector {
  const notes: string[] = [];

  const prevalence = computePrevalence(inputs);
  if (prevalence.note) notes.push(prevalence.note);

  const physical = computePhysicalDose(inputs);
  if (physical.note) notes.push(physical.note);

  const digital = computeDigitalDose(inputs);
  if (digital.note) notes.push(digital.note);

  const amplification = computeAmplification(inputs);
  if (amplification.note) notes.push(amplification.note);

  const breadth = computeBreadth(inputs);
  if (breadth.note) notes.push(breadth.note);

  return {
    key: inputs.key,
    sourceFamily: inputs.sourceFamily,
    prev: prevalence.value,
    sev: computeSeverity(inputs),
    phys: physical.value,
    dig: digital.value,
    amp: amplification.value,
    brd: breadth.value,
    conc: computeConcentration(inputs),
    frame: computeFrameVector(inputs, frames),
    trend: computeTrend(inputs),
    raw: {
      uniqueEvents: inputs.events.length,
      exposureObservations: inputs.exposure.length,
      population: inputs.population,
    },
    digIsProxy: digital.isProxy,
    notes,
  };
}
