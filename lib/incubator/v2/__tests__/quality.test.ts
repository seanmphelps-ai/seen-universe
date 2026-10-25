import { describe, it, expect } from 'vitest';
import {
  observationQuality,
  qualityTermCoverage,
  QUALITY_TERM_WEIGHTS,
  QualityTermRangeError,
} from '../quality';

describe('observationQuality', () => {
  it('returns the value itself when only one term is present', () => {
    expect(observationQuality({ geo: 0.6 })).toBeCloseTo(0.6, 12);
  });

  it('computes the weighted geometric mean over present terms', () => {
    const terms = { geo: 0.9, classifier: 0.5 };
    // Equal weights (1.0 each) → plain geometric mean.
    expect(observationQuality(terms)).toBeCloseTo(Math.sqrt(0.9 * 0.5), 12);
  });

  it('respects the declared term weights', () => {
    const terms = { geo: 0.9, recency: 0.4 };
    const expected = Math.exp(
      (QUALITY_TERM_WEIGHTS.geo * Math.log(0.9) + QUALITY_TERM_WEIGHTS.recency * Math.log(0.4)) /
        (QUALITY_TERM_WEIGHTS.geo + QUALITY_TERM_WEIGHTS.recency),
    );
    expect(observationQuality(terms)).toBeCloseTo(expected, 12);
  });

  it('OMITS missing terms rather than treating them as zero — the core contract rule', () => {
    const onlyTwo = observationQuality({ geo: 0.8, classifier: 0.8 });
    // If the three absent terms were coerced to 0, a geometric mean would
    // be annihilated to 0. Omission must leave the value at 0.8.
    expect(onlyTwo).toBeCloseTo(0.8, 12);
    expect(onlyTwo).not.toBe(0);
  });

  it('returns null when no term at all was measured', () => {
    expect(observationQuality({})).toBeNull();
  });

  it('does return 0 for a MEASURED zero — that is a judgement, not a gap', () => {
    expect(observationQuality({ geo: 0.9, authenticity: 0 })).toBe(0);
  });

  it('rejects out-of-range terms instead of clamping them silently', () => {
    expect(() => observationQuality({ geo: 1.4 })).toThrow(QualityTermRangeError);
    expect(() => observationQuality({ classifier: -0.2 })).toThrow(QualityTermRangeError);
  });

  it('ignores non-finite values rather than producing NaN', () => {
    expect(observationQuality({ geo: 0.5, classifier: Number.NaN })).toBeCloseTo(0.5, 12);
  });
});

describe('qualityTermCoverage', () => {
  it('reports the share of the five terms actually measured', () => {
    expect(qualityTermCoverage({})).toBe(0);
    expect(qualityTermCoverage({ geo: 0.5 })).toBeCloseTo(0.2, 12);
    expect(
      qualityTermCoverage({ geo: 1, classifier: 1, source: 1, authenticity: 1, recency: 1 }),
    ).toBe(1);
  });
});
