// Statistical primitives used by the V2 vector and normalization steps.
//
// Implemented here rather than pulled from a dependency so the exact
// formulas the contract specifies are readable and testable in place —
// and so nothing silently changes underneath the engine on a version
// bump. Every function is pure.

/** Linear-interpolated quantile (the "type 7" definition, R/NumPy default). */
export function quantile(values: number[], p: number): number {
  if (values.length === 0) throw new Error('quantile requires at least one value');
  if (p < 0 || p > 1) throw new Error(`quantile p must be in [0,1] — received ${p}`);
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * p;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  if (lowerIndex === upperIndex) return sorted[lowerIndex];
  const fraction = position - lowerIndex;
  return sorted[lowerIndex] * (1 - fraction) + sorted[upperIndex] * fraction;
}

export function median(values: number[]): number {
  return quantile(values, 0.5);
}

/**
 * Weighted median — the fusion operator across source families. Chosen
 * over a weighted mean because a single wildly miscalibrated family
 * cannot drag the fused value: it can only shift which family sits at
 * the weight midpoint.
 */
export function weightedMedian(entries: { value: number; weight: number }[]): number {
  const usable = entries.filter((e) => Number.isFinite(e.value) && e.weight > 0);
  if (usable.length === 0) throw new Error('weightedMedian requires at least one weighted value');
  if (usable.length === 1) return usable[0].value;

  const sorted = [...usable].sort((a, b) => a.value - b.value);
  const totalWeight = sorted.reduce((acc, e) => acc + e.weight, 0);
  const half = totalWeight / 2;

  let cumulative = 0;
  for (let i = 0; i < sorted.length; i++) {
    cumulative += sorted[i].weight;
    if (cumulative > half) return sorted[i].value;
    // Exactly at the midpoint: average the two straddling values, the
    // standard convention that keeps the operator symmetric.
    if (cumulative === half) {
      const next = sorted[i + 1];
      return next ? (sorted[i].value + next.value) / 2 : sorted[i].value;
    }
  }
  return sorted[sorted.length - 1].value;
}

/**
 * Robust percentile of `value` against a baseline distribution, using the
 * midrank convention so ties do not report as 0 or 100. Returns 0-100.
 */
export function robustPercentile(value: number, baseline: number[]): number {
  if (baseline.length === 0) throw new Error('robustPercentile requires a non-empty baseline');
  let below = 0;
  let equal = 0;
  for (const b of baseline) {
    if (b < value) below++;
    else if (b === value) equal++;
  }
  return ((below + 0.5 * equal) / baseline.length) * 100;
}

/** log1p transform used before percentile ranking heavy-tailed counts. */
export function log1pTransform(values: number[]): number[] {
  return values.map((v) => Math.log1p(Math.max(0, v)));
}

// Recurrence threshold before the asymptotic series is applied. At 10 the
// first omitted term of each series is below 1e-11, comfortably tighter
// than the 1e-9 the tests assert against known closed forms.
const DIGAMMA_LARGE = 10;

/**
 * Digamma ψ(x) via recurrence up to x ≥ 6 then the standard asymptotic
 * series. Accurate to ~1e-10 across the range this engine uses (counts
 * plus small priors), which is far tighter than the evidence warrants.
 */
export function digamma(x: number): number {
  if (x <= 0) throw new Error(`digamma requires x > 0 — received ${x}`);
  let value = x;
  let result = 0;
  while (value < DIGAMMA_LARGE) {
    result -= 1 / value;
    value += 1;
  }
  const inv = 1 / value;
  const inv2 = inv * inv;
  result +=
    Math.log(value) -
    0.5 * inv -
    inv2 * (1 / 12 - inv2 * (1 / 120 - inv2 * (1 / 252 - inv2 * (1 / 240))));
  return result;
}

/** Trigamma ψ'(x), same construction. Gives the variance of ln λ. */
export function trigamma(x: number): number {
  if (x <= 0) throw new Error(`trigamma requires x > 0 — received ${x}`);
  let value = x;
  let result = 0;
  while (value < DIGAMMA_LARGE) {
    result += 1 / (value * value);
    value += 1;
  }
  const inv = 1 / value;
  const inv2 = inv * inv;
  // 1/x + 1/(2x²) + 1/(6x³) - 1/(30x⁵) + 1/(42x⁷) - 1/(30x⁹)
  result += inv * (1 + 0.5 * inv + inv2 * (1 / 6 - inv2 * (1 / 30 - inv2 * (1 / 42 - inv2 / 30))));
  return result;
}

/**
 * Inverse standard normal CDF (Acklam's rational approximation,
 * |error| < 1.15e-9). Used to turn posterior variances into the 50% and
 * 95% intervals the contract requires.
 */
export function normalQuantile(p: number): number {
  if (p <= 0 || p >= 1) throw new Error(`normalQuantile requires p in (0,1) — received ${p}`);

  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > pHigh) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  const q = p - 0.5;
  const r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

/**
 * Normalized Herfindahl-Hirschman index over participation shares:
 *
 *   (Σ sᵢ² - 1/n) / (1 - 1/n)
 *
 * 0 = perfectly even participation, 1 = one account is the whole signal.
 * With n = 1 the denominator vanishes; the limit is complete
 * concentration, so 1 is returned rather than NaN.
 */
export function normalizedHhi(shares: number[]): number {
  const n = shares.length;
  if (n === 0) throw new Error('normalizedHhi requires at least one share');
  if (n === 1) return 1;
  const sumSquares = shares.reduce((acc, s) => acc + s * s, 0);
  return (sumSquares - 1 / n) / (1 - 1 / n);
}
