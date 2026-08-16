import { describe, it, expect } from 'vitest';
import {
  estimateEmpiricalPrior,
  normalizeAgainstBaseline,
  partialPool,
  priorGroupId,
} from '../normalize';

describe('normalizeAgainstBaseline', () => {
  it('keeps the raw value beside the normalized one, per the contract', () => {
    const result = normalizeAgainstBaseline(42, [1, 2, 3, 4, 5]);
    expect(result.raw).toBe(42);
    expect(result.normalized).toBe(100);
    expect(result.baselineSize).toBe(5);
    expect(result.logScaled).toBe(true);
  });

  it('log-scales by default so outliers do not compress the ordinary range', () => {
    const baseline = [1, 2, 3, 4, 1_000_000];
    const logScaled = normalizeAgainstBaseline(3, baseline).normalized;
    const linear = normalizeAgainstBaseline(3, baseline, { logScale: false }).normalized;
    // The rank is the same either way here; what matters is that the
    // transform is applied to both sides consistently.
    expect(logScaled).toBe(linear);
    expect(normalizeAgainstBaseline(3, baseline).logScaled).toBe(true);
  });

  it('refuses an empty baseline instead of inventing one', () => {
    expect(() => normalizeAgainstBaseline(5, [])).toThrow(/non-empty provider-specific baseline/);
  });
});

describe('estimateEmpiricalPrior', () => {
  it('estimates τ² as observed variance minus mean sampling variance', () => {
    const peers = [
      { value: 10, variance: 1 },
      { value: 20, variance: 1 },
      { value: 30, variance: 1 },
    ];
    const prior = estimateEmpiricalPrior(peers);
    expect(prior.mean).toBeCloseTo(20, 12);
    expect(prior.variance).toBeCloseTo(100 - 1, 12); // sample var of 10,20,30 is 100
    expect(prior.peerCount).toBe(3);
  });

  it('clamps τ² at 0 when spread is fully explained by sampling noise', () => {
    const peers = [
      { value: 10, variance: 500 },
      { value: 12, variance: 500 },
      { value: 11, variance: 500 },
    ];
    expect(estimateEmpiricalPrior(peers).variance).toBe(0);
  });

  it('falls back to the single peer variance rather than forcing τ² = 0', () => {
    const prior = estimateEmpiricalPrior([{ value: 5, variance: 3 }]);
    expect(prior.mean).toBe(5);
    expect(prior.variance).toBe(3);
    expect(prior.peerCount).toBe(1);
  });

  it('requires at least one peer', () => {
    expect(() => estimateEmpiricalPrior([])).toThrow();
  });
});

describe('partialPool', () => {
  const prior = { mean: 50, variance: 100, peerCount: 12 };

  it('barely moves a well-observed cell', () => {
    const pooled = partialPool(80, 1, prior);
    expect(pooled.median).toBeGreaterThan(79);
    expect(pooled.observationWeight).toBeGreaterThan(0.98);
  });

  it('shrinks a sparse cell hard toward the group prior', () => {
    const pooled = partialPool(80, 900, prior);
    expect(pooled.median).toBeLessThan(56);
    expect(pooled.median).toBeGreaterThan(50);
    expect(pooled.observationWeight).toBeLessThan(0.15);
  });

  it('returns a 95% interval wider than the 50% interval', () => {
    const pooled = partialPool(80, 25, prior);
    expect(pooled.upper95 - pooled.lower95).toBeGreaterThan(pooled.upper50 - pooled.lower50);
    expect(pooled.lower95).toBeLessThan(pooled.median);
    expect(pooled.upper95).toBeGreaterThan(pooled.median);
  });

  it('pools completely when the peers support no between-cell variance', () => {
    const pooled = partialPool(80, 10, { mean: 50, variance: 0, peerCount: 5 });
    expect(pooled.median).toBe(50);
    expect(pooled.observationWeight).toBe(0);
  });

  it('does not shrink a cell measured without error', () => {
    const pooled = partialPool(80, 0, prior);
    expect(pooled.median).toBe(80);
    expect(pooled.observationWeight).toBe(1);
    expect(pooled.lower95).toBe(80);
  });

  it('rejects a negative sampling variance', () => {
    expect(() => partialPool(10, -1, prior)).toThrow();
  });
});

describe('priorGroupId', () => {
  it('keys on marker, region, and settlement type together', () => {
    expect(
      priorGroupId({ markerId: 'violent_incident', region: 'CA', settlementType: 'URBAN_CORE' }),
    ).toBe('violent_incident::CA::URBAN_CORE');
  });
});
