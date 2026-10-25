// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import type {
  EvidenceVector,
  FrameVector,
  MarkerRegistryEntry,
  ResponseFrame,
  SeverityDistribution,
  SourceFamily,
  SpatialConcentrationEstimate,
  TrendEstimate,
  VectorKey,
} from './types';
import { RESPONSE_FRAMES } from './types';
import type { ExposureRecord, FusedEvent } from './dedupe';
import { digamma, median, normalizedHhi, quantile, robustPercentile, trigamma } from './stats';
import { assertChannelAdmissible } from './dimensions';

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


  population: number | null;
  sampledLocalContentCount: number | null;
  sampledActiveLocalAccounts: number | null;
  connectedLocalPopulation: number | null;

  /** Unique local accounts observed participating. One of two signals BRD may combine. */
  uniqueParticipatingLocalAccounts: number | null;


  spatialOccurrenceDistribution: Record<string, number> | null;
  /** Total sub-units the collection plan sampled, for BRD's denominator. */
  sampledSubUnitCount: number | null;

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


function dedupedAmbientQualitySum(exposure: ExposureRecord[]): number {
  const byAccount = new Map<string, number>();
  let total = 0;

  for (const record of exposure) {
    const quality = record.quality ?? 0;
    if (record.accountId === null) {
      total += quality;
      continue;
    }
    const existing = byAccount.get(record.accountId);
    if (existing === undefined || quality > existing) {
      byAccount.set(record.accountId, quality);
    }
  }

  for (const quality of byAccount.values()) total += quality;
  return total;
}

/**
 * PREV — unique-event rate per 10k residents per 30 days for event
 * markers; weighted share of sampled local content for ambient markers.
 */
export function computePrevalence(inputs: VectorInputs): { value: number | null; note?: string } {
  if (inputs.marker.unit === 'ambient') {
    assertChannelAdmissible('PREV', 'AMBIENT_CONTENT_SAMPLE');
    if (inputs.sampledLocalContentCount === null || inputs.sampledLocalContentCount <= 0) {
      return { value: null, note: 'PREV unavailable: no sampled local-content denominator for an ambient marker.' };
    }
    const weighted = dedupedAmbientQualitySum(inputs.exposure);
    return { value: weighted / inputs.sampledLocalContentCount };
  }

  assertChannelAdmissible('PREV', 'INCIDENT');
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


export function computeSeverity(inputs: VectorInputs): SeverityDistribution | null {
  assertChannelAdmissible('SEV', 'INCIDENT');
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


export function computePhysicalDose(inputs: VectorInputs): { value: number | null; note?: string } {
  assertChannelAdmissible('PHYS', 'INCIDENT');
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


export function computeDigitalDose(inputs: VectorInputs): {
  value: number | null;
  isProxy: boolean;
  note?: string;
} {
  assertChannelAdmissible('DIG', 'CIRCULATION');
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


export function computeAmplification(inputs: VectorInputs): { value: number | null; note?: string } {
  assertChannelAdmissible('AMP', 'CIRCULATION');
  assertChannelAdmissible('AMP', 'TEMPORAL_EXTENT');
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

/**
 * BRD — breadth: how widely the condition is distributed across the
 * environment's relevant units. Combines two independent signals when
 * both are available — spatial (distinct affected sub-geographies /
 * sampled sub-geographies) and actor-based (distinct participating local
 * accounts / sampled active local accounts) — and takes their median so
 * neither one alone can carry the whole answer. Either signal alone is
 * used when the other is unavailable; BRD is null only when neither is.
 */
function computeSpatialBreadth(inputs: VectorInputs): number | null {
  const distribution = inputs.spatialOccurrenceDistribution;
  if (!distribution) return null;
  assertChannelAdmissible('BRD', 'SPATIAL_DISTRIBUTION');
  if (inputs.sampledSubUnitCount === null || inputs.sampledSubUnitCount <= 0) return null;
  const affectedSubUnits = Object.values(distribution).filter((c) => c > 0).length;
  return Math.min(1, affectedSubUnits / inputs.sampledSubUnitCount);
}

function computeActorBreadth(inputs: VectorInputs): number | null {
  if (inputs.uniqueParticipatingLocalAccounts === null) return null;
  assertChannelAdmissible('BRD', 'ACTOR_DISTRIBUTION');
  if (inputs.sampledActiveLocalAccounts === null || inputs.sampledActiveLocalAccounts <= 0) return null;
  return Math.min(1, inputs.uniqueParticipatingLocalAccounts / inputs.sampledActiveLocalAccounts);
}

export function computeBreadth(inputs: VectorInputs): { value: number | null; note?: string } {
  const spatial = computeSpatialBreadth(inputs);
  const actor = computeActorBreadth(inputs);
  const available = [spatial, actor].filter((v): v is number => v !== null);

  if (available.length === 0) {
    return {
      value: null,
      note:
        'BRD unavailable: neither a spatial sub-unit distribution nor an actor-participation ' +
        'count/denominator pair was obtainable.',
    };
  }
  return { value: median(available) };
}


export function computeConcentration(inputs: VectorInputs): SpatialConcentrationEstimate | null {
  const distribution = inputs.spatialOccurrenceDistribution;
  if (!distribution) return null;
  assertChannelAdmissible('CONC', 'SPATIAL_DISTRIBUTION');

  const counts = Object.values(distribution).filter((c) => Number.isFinite(c) && c > 0);
  if (counts.length === 0) return null;

  const total = counts.reduce((acc, c) => acc + c, 0);
  const shares = counts.map((c) => c / total).sort((a, b) => b - a);

  const topShare = (fraction: number): number => {
    // At least one sub-unit, so even a small sample still reports the
    // concentration its largest sub-unit actually holds.
    const take = Math.max(1, Math.ceil(shares.length * fraction));
    return shares.slice(0, take).reduce((acc, s) => acc + s, 0);
  };

  return {
    normalizedHhi: normalizedHhi(shares),
    top1PercentShare: topShare(0.01),
    top10PercentShare: topShare(0.1),
    subUnitCount: shares.length,
  };
}

/** FRAME — quality-weighted probability vector over the response frames. */
export function computeFrameVector(inputs: VectorInputs, frames: (ResponseFrame | null)[]): FrameVector | null {
  const weights = new Map<ResponseFrame, number>();
  let total = 0;

  frames.forEach((frame, index) => {
    if (!frame) return;
    assertChannelAdmissible('FRAME', 'INTERPRETATION');
    assertChannelAdmissible('FRAME', 'CIRCULATION');
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


export function computeTrend(inputs: VectorInputs): TrendEstimate | null {
  if (!inputs.baseline) return null;
  assertChannelAdmissible('TREND', 'INCIDENT');
  assertChannelAdmissible('TREND', 'TEMPORAL_EXTENT');
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

/** Computes the nine components of V[m,l,t] this module produces for one family (PERSIST excluded, see header). */
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
