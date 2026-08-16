import { describe, it, expect } from 'vitest';
import {
  digamma,
  log1pTransform,
  median,
  normalQuantile,
  normalizedHhi,
  quantile,
  robustPercentile,
  trigamma,
  weightedMedian,
} from '../stats';

describe('quantile', () => {
  it('matches the type-7 definition on a known vector', () => {
    const values = [1, 2, 3, 4];
    expect(quantile(values, 0)).toBe(1);
    expect(quantile(values, 1)).toBe(4);
    expect(quantile(values, 0.5)).toBeCloseTo(2.5, 12);
    // position = 3 * 0.9 = 2.7 → 3 + 0.7*(4-3) = 3.7
    expect(quantile(values, 0.9)).toBeCloseTo(3.7, 12);
  });

  it('handles a single value', () => {
    expect(quantile([7], 0.9)).toBe(7);
  });

  it('rejects an out-of-range p rather than clamping', () => {
    expect(() => quantile([1, 2], 1.5)).toThrow();
  });

  it('does not mutate the caller array', () => {
    const values = [3, 1, 2];
    median(values);
    expect(values).toEqual([3, 1, 2]);
  });
});

describe('weightedMedian', () => {
  it('reduces to the plain median with equal weights', () => {
    const entries = [1, 2, 3].map((value) => ({ value, weight: 1 }));
    expect(weightedMedian(entries)).toBe(2);
  });

  it('is pulled toward the heavily weighted value', () => {
    expect(
      weightedMedian([
        { value: 10, weight: 1 },
        { value: 90, weight: 9 },
      ]),
    ).toBe(90);
  });

  it('resists a single extreme outlier, unlike a mean', () => {
    const entries = [
      { value: 50, weight: 1 },
      { value: 52, weight: 1 },
      { value: 10_000, weight: 1 },
    ];
    expect(weightedMedian(entries)).toBe(52);
  });

  it('averages the straddling values at an exact weight midpoint', () => {
    expect(
      weightedMedian([
        { value: 20, weight: 1 },
        { value: 40, weight: 1 },
      ]),
    ).toBe(30);
  });
});

describe('robustPercentile', () => {
  it('uses the midrank convention so an exact tie is not 0 or 100', () => {
    expect(robustPercentile(5, [5])).toBe(50);
  });

  it('ranks a value above the whole baseline near 100', () => {
    expect(robustPercentile(100, [1, 2, 3, 4])).toBe(100);
  });

  it('ranks a value below the whole baseline at 0', () => {
    expect(robustPercentile(0, [1, 2, 3, 4])).toBe(0);
  });
});

describe('log1pTransform', () => {
  it('compresses a heavy tail and floors negatives at zero', () => {
    expect(log1pTransform([0, -5, Math.E - 1])).toEqual([0, 0, 1]);
  });
});

describe('digamma / trigamma', () => {
  // Reference values from the standard mathematical definitions.
  it('matches ψ(1) = -γ', () => {
    expect(digamma(1)).toBeCloseTo(-0.5772156649015329, 9);
  });

  it('matches ψ(0.5) = -γ - 2ln2', () => {
    expect(digamma(0.5)).toBeCloseTo(-1.9635100260214235, 9);
  });

  it('satisfies the recurrence ψ(x+1) = ψ(x) + 1/x', () => {
    for (const x of [0.3, 1.7, 4.2, 11.9]) {
      expect(digamma(x + 1)).toBeCloseTo(digamma(x) + 1 / x, 9);
    }
  });

  it("matches ψ'(1) = π²/6", () => {
    expect(trigamma(1)).toBeCloseTo(Math.PI ** 2 / 6, 9);
  });

  it("satisfies the recurrence ψ'(x+1) = ψ'(x) - 1/x²", () => {
    for (const x of [0.4, 2.5, 7.1]) {
      expect(trigamma(x + 1)).toBeCloseTo(trigamma(x) - 1 / (x * x), 9);
    }
  });

  it('rejects non-positive arguments', () => {
    expect(() => digamma(0)).toThrow();
    expect(() => trigamma(-1)).toThrow();
  });
});

describe('normalQuantile', () => {
  it('is 0 at the median', () => {
    expect(normalQuantile(0.5)).toBeCloseTo(0, 9);
  });

  it('matches the standard 95% and 50% critical values', () => {
    expect(normalQuantile(0.975)).toBeCloseTo(1.959963984540054, 8);
    expect(normalQuantile(0.75)).toBeCloseTo(0.6744897501960817, 8);
  });

  it('is antisymmetric', () => {
    expect(normalQuantile(0.1)).toBeCloseTo(-normalQuantile(0.9), 8);
  });
});

describe('normalizedHhi', () => {
  it('is 0 for perfectly even participation', () => {
    expect(normalizedHhi([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(0, 12);
  });

  it('is 1 when one account is the entire signal', () => {
    expect(normalizedHhi([1, 0, 0, 0])).toBeCloseTo(1, 12);
  });

  it('returns 1 for a single account instead of dividing by zero', () => {
    expect(normalizedHhi([1])).toBe(1);
  });

  it('sits between the extremes for a skewed distribution', () => {
    const value = normalizedHhi([0.7, 0.1, 0.1, 0.1]);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(1);
  });
});
