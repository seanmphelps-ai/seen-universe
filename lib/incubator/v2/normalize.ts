// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import { log1pTransform, normalQuantile, robustPercentile } from './stats';

export type SettlementType = 'URBAN_CORE' | 'SUBURBAN' | 'SMALL_TOWN' | 'RURAL' | 'UNKNOWN';

/** Identifies the peer group a sparse cell is pooled toward. */
export type PriorGroupKey = {
  markerId: string;
  region: string;
  settlementType: SettlementType;
};

export type NormalizedValue = {
  /** The untransformed count or rate, always retained. */
  raw: number;
  /** Robust percentile against the provider-specific baseline, 0-100. */
  normalized: number;
  /** Size of the baseline the percentile was taken against. */
  baselineSize: number;
  /** Whether a log1p transform was applied before ranking. */
  logScaled: boolean;
};


export function normalizeAgainstBaseline(
  raw: number,
  baseline: number[],
  options: { logScale?: boolean } = {},
): NormalizedValue {
  const logScale = options.logScale ?? true;
  if (baseline.length === 0) {
    throw new Error(
      'normalizeAgainstBaseline requires a non-empty provider-specific baseline — ' +
        'the caller must record the missing baseline in confidence.',
    );
  }
  const scaledBaseline = logScale ? log1pTransform(baseline) : baseline;
  const scaledValue = logScale ? Math.log1p(Math.max(0, raw)) : raw;

  return {
    raw,
    normalized: robustPercentile(scaledValue, scaledBaseline),
    baselineSize: baseline.length,
    logScaled: logScale,
  };
}

export type EmpiricalPrior = {
  mean: number;
  variance: number; // τ² — between-cell variance
  peerCount: number;
};

/**
 * Method-of-moments empirical Bayes prior estimated from peer cells in
 * the same marker × region × settlement-type group.
 *
 *   τ² = max(0, Var(y) - mean(σ²))
 *
 * Clamping at 0 is the standard treatment: a negative moment estimate
 * means the observed spread is entirely explained by sampling noise, so
 * the honest reading is that the cells are exchangeable and should pool
 * completely.
 */
export function estimateEmpiricalPrior(
  peers: { value: number; variance: number }[],
): EmpiricalPrior {
  const usable = peers.filter((p) => Number.isFinite(p.value) && Number.isFinite(p.variance));
  if (usable.length === 0) {
    throw new Error('estimateEmpiricalPrior requires at least one peer cell');
  }
  const n = usable.length;
  const mean = usable.reduce((acc, p) => acc + p.value, 0) / n;

  if (n === 1) {
    return { mean, variance: usable[0].variance, peerCount: 1 };
  }

  const observedVariance = usable.reduce((acc, p) => acc + (p.value - mean) ** 2, 0) / (n - 1);
  const meanSamplingVariance = usable.reduce((acc, p) => acc + p.variance, 0) / n;
  return {
    mean,
    variance: Math.max(0, observedVariance - meanSamplingVariance),
    peerCount: n,
  };
}

export type PooledEstimate = {
  /** Posterior median. For the normal-normal model this equals the mean. */
  median: number;
  lower50: number;
  upper50: number;
  lower95: number;
  upper95: number;
  /**
   * Shrinkage weight on the observation, τ²/(τ²+σ²). 1 = the cell speaks
   * for itself; 0 = the cell is entirely represented by its peer group.
   */
  observationWeight: number;
  priorMean: number;
  peerCount: number;
};

/**
 * Normal-normal partial pooling. Sparse cells (large σ²) shrink toward
 * the group prior; well-observed cells barely move.
 *
 *   posterior mean = (y/σ² + μ/τ²) / (1/σ² + 1/τ²)
 *   posterior var  = 1 / (1/σ² + 1/τ²)
 */
export function partialPool(
  observedValue: number,
  samplingVariance: number,
  prior: EmpiricalPrior,
): PooledEstimate {
  if (samplingVariance < 0) {
    throw new Error(`partialPool requires a non-negative sampling variance — received ${samplingVariance}`);
  }

  let posteriorMean: number;
  let posteriorVariance: number;

  if (prior.variance === 0) {
    posteriorMean = prior.mean;
    posteriorVariance = 0;
  } else if (samplingVariance === 0) {
    posteriorMean = observedValue;
    posteriorVariance = 0;
  } else {
    const observationPrecision = 1 / samplingVariance;
    const priorPrecision = 1 / prior.variance;
    posteriorVariance = 1 / (observationPrecision + priorPrecision);
    posteriorMean =
      (observedValue * observationPrecision + prior.mean * priorPrecision) * posteriorVariance;
  }

  const sd = Math.sqrt(posteriorVariance);
  const z50 = normalQuantile(0.75);
  const z95 = normalQuantile(0.975);

  const observationWeight =
    prior.variance === 0
      ? 0
      : samplingVariance === 0
        ? 1
        : prior.variance / (prior.variance + samplingVariance);

  return {
    median: posteriorMean,
    lower50: posteriorMean - z50 * sd,
    upper50: posteriorMean + z50 * sd,
    lower95: posteriorMean - z95 * sd,
    upper95: posteriorMean + z95 * sd,
    observationWeight,
    priorMean: prior.mean,
    peerCount: prior.peerCount,
  };
}

export function priorGroupId(key: PriorGroupKey): string {
  return `${key.markerId}::${key.region}::${key.settlementType}`;
}
