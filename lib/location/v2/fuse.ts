// Cross-family fusion — step 4.3 of the contract.
//
// "Fuse available families by weighted median; cap each family's total
// influence. Missing family: omitted from score, charged to confidence.
// Contradiction: preserve parallel signals, do not average away."
//
// Three properties this module guarantees:
//   1. A missing family never contributes a number. It is recorded in
//      `familiesMissing` and handed to confidence.ts. There is no default.
//   2. No single family can exceed MAX_FAMILY_INFLUENCE of total weight,
//      so one well-instrumented provider cannot quietly become the answer.
//   3. When families genuinely disagree, the disagreement is reported
//      alongside the fused value rather than smoothed out of existence.

import type { DimensionId } from './dimensions';
import type { EvidenceVector, SourceFamily } from './types';
import { familyCompetence } from './competence';
import { weightedMedian } from './stats';

/** No family may hold more than this share of total fusion weight. */
export const MAX_FAMILY_INFLUENCE = 0.4;

export type FamilySignal = {
  sourceFamily: SourceFamily;
  value: number;
  /** Weight after reliability and influence capping. */
  effectiveWeight: number;
};

export type FusedComponent = {
  component: string;
  /** Fused value, or null when no family could supply this component. */
  value: number | null;
  /** Every contributing family's own value, always preserved. */
  signals: FamilySignal[];
  familiesPresent: SourceFamily[];
  familiesMissing: SourceFamily[];
  /**
   * True when families disagree beyond CONTRADICTION_SPREAD. The fused
   * value is still reported, but a contradiction means the parallel
   * signals — not the fused number — are the honest summary.
   */
  contradiction: boolean;
  contradictionNote: string | null;
  /**
   * Families that produced a value for this component but have zero
   * declared competence for its governing dimension (see competence.ts).
   * Shown in `signals` with effectiveWeight 0; excluded from the fused
   * value entirely. Distinct from `contradiction`, which is about
   * disagreement between competent signals.
   */
  incompetentFamilies: SourceFamily[];
};

/**
 * Families are treated as contradictory when their spread exceeds 40
 * percentile points. On a 0-100 normalized scale that is the difference
 * between "unremarkable" and "notably elevated" — a disagreement no
 * single fused number can honestly represent.
 */
export const CONTRADICTION_SPREAD = 40;

/**
 * Caps each family's share of total weight at MAX_FAMILY_INFLUENCE.
 *
 * Solved directly rather than by repeatedly rescaling. If a set C of
 * families is held at the cap c and the remaining families' weights sum
 * to R, the post-cap total T satisfies T = |C|·c·T + R, so
 *
 *   T = R / (1 - |C|·c)
 *
 * and each capped family takes c·T. The loop grows C until no uncapped
 * family exceeds the cap — normally one or two passes. Naive iterative
 * rescaling converges to the same fixed point but only asymptotically,
 * which left a dominant family well above the cap after a bounded number
 * of passes.
 */
export function capFamilyInfluence(
  weights: { sourceFamily: SourceFamily; weight: number }[],
): { sourceFamily: SourceFamily; weight: number }[] {
  if (weights.length === 0) return [];
  // Shares must sum to 1, so with fewer than ceil(1/c) families some
  // family necessarily exceeds c and the cap cannot bind at all.
  if (weights.length * MAX_FAMILY_INFLUENCE <= 1) return weights;

  const result = weights.map((w) => ({ ...w }));
  const cappedFamilies = new Set<SourceFamily>();

  for (let iteration = 0; iteration <= result.length; iteration++) {
    const uncapped = result.filter((w) => !cappedFamilies.has(w.sourceFamily));
    const uncappedSum = uncapped.reduce((acc, w) => acc + w.weight, 0);
    const denominator = 1 - cappedFamilies.size * MAX_FAMILY_INFLUENCE;
    if (denominator <= 0) break;

    const total = uncappedSum / denominator;
    if (total <= 0) break;
    const capWeight = MAX_FAMILY_INFLUENCE * total;

    const newlyOver = uncapped.filter((w) => w.weight > capWeight);
    if (newlyOver.length === 0) {
      for (const entry of result) {
        if (cappedFamilies.has(entry.sourceFamily)) entry.weight = capWeight;
      }
      break;
    }
    for (const entry of newlyOver) cappedFamilies.add(entry.sourceFamily);
  }

  return result;
}

/**
 * Fuses one component across families, weighted by each family's
 * competence for the GOVERNING DIMENSION — not a single per-family
 * credibility score (see competence.ts). A family with zero declared
 * competence for this dimension still appears in `signals` (transparency:
 * it did produce a value) with effectiveWeight 0, but contributes nothing
 * to the fused number — weightedMedian excludes non-positive weights.
 *
 * `expectedFamilies` is the full set the collection plan intended to
 * query. Anything in it that produced no value is returned in
 * `familiesMissing` so confidence.ts can charge for it — this is the
 * mechanism that turns provider absence into lower confidence rather
 * than a zero.
 */
export function fuseComponent(
  component: string,
  dimensionId: DimensionId,
  contributions: { sourceFamily: SourceFamily; value: number | null }[],
  expectedFamilies: SourceFamily[],
): FusedComponent {
  const present = contributions.filter(
    (c): c is { sourceFamily: SourceFamily; value: number } =>
      typeof c.value === 'number' && Number.isFinite(c.value),
  );

  const familiesPresent = present.map((c) => c.sourceFamily);
  const familiesMissing = expectedFamilies.filter((f) => !familiesPresent.includes(f));

  if (present.length === 0) {
    return {
      component,
      value: null,
      signals: [],
      familiesPresent: [],
      familiesMissing,
      contradiction: false,
      contradictionNote: null,
      incompetentFamilies: [],
    };
  }

  const capped = capFamilyInfluence(
    present.map((c) => ({
      sourceFamily: c.sourceFamily,
      weight: familyCompetence(c.sourceFamily, dimensionId),
    })),
  );
  const weightByFamily = new Map(capped.map((c) => [c.sourceFamily, c.weight]));

  const signals: FamilySignal[] = present.map((c) => ({
    sourceFamily: c.sourceFamily,
    value: c.value,
    effectiveWeight: weightByFamily.get(c.sourceFamily) ?? 0,
  }));

  const competentSignals = signals.filter((s) => s.effectiveWeight > 0);
  const fused =
    competentSignals.length > 0
      ? weightedMedian(competentSignals.map((s) => ({ value: s.value, weight: s.effectiveWeight })))
      : null;

  const values = present.map((c) => c.value);
  const spread = Math.max(...values) - Math.min(...values);
  const contradiction = present.length > 1 && spread > CONTRADICTION_SPREAD;

  const incompetentFamilies = signals.filter((s) => s.effectiveWeight === 0).map((s) => s.sourceFamily);

  return {
    component,
    value: fused,
    signals,
    familiesPresent,
    familiesMissing,
    contradiction,
    contradictionNote: contradiction
      ? `Source families disagree by ${spread.toFixed(1)} points on ${component} ` +
        `(${signals.map((s) => `${s.sourceFamily}=${s.value.toFixed(1)}`).join(', ')}). ` +
        `The fused value is reported, but the parallel signals are the honest summary — ` +
        `they are preserved above and must be displayed alongside it.`
      : null,
    incompetentFamilies,
  };
}

/** Which dimension governs each fused output key — the lookup fuseVectors uses into competence.ts. */
const COMPONENT_DIMENSIONS: Record<string, DimensionId> = {
  prev: 'PREV',
  phys: 'PHYS',
  dig: 'DIG',
  amp: 'AMP',
  brd: 'BRD',
  conc: 'CONC',
  sevMedian: 'SEV',
  sevUpperTail: 'SEV',
  trendLogRateRatio: 'TREND',
};

/** Fuses every numeric component of a set of per-family vectors. */
export function fuseVectors(
  vectors: EvidenceVector[],
  expectedFamilies: SourceFamily[],
): Record<string, FusedComponent> {
  const numericComponents: (keyof Pick<EvidenceVector, 'prev' | 'phys' | 'dig' | 'amp' | 'brd'>)[] = [
    'prev',
    'phys',
    'dig',
    'amp',
    'brd',
  ];

  const fused: Record<string, FusedComponent> = {};

  for (const component of numericComponents) {
    fused[component] = fuseComponent(
      component,
      COMPONENT_DIMENSIONS[component],
      vectors.map((v) => ({ sourceFamily: v.sourceFamily, value: v[component] })),
      expectedFamilies,
    );
  }

  fused.conc = fuseComponent(
    'conc',
    COMPONENT_DIMENSIONS.conc,
    vectors.map((v) => ({ sourceFamily: v.sourceFamily, value: v.conc?.normalizedHhi ?? null })),
    expectedFamilies,
  );

  fused.sevMedian = fuseComponent(
    'sevMedian',
    COMPONENT_DIMENSIONS.sevMedian,
    vectors.map((v) => ({ sourceFamily: v.sourceFamily, value: v.sev?.median ?? null })),
    expectedFamilies,
  );

  fused.sevUpperTail = fuseComponent(
    'sevUpperTail',
    COMPONENT_DIMENSIONS.sevUpperTail,
    vectors.map((v) => ({ sourceFamily: v.sourceFamily, value: v.sev?.upperTail ?? null })),
    expectedFamilies,
  );

  fused.trendLogRateRatio = fuseComponent(
    'trendLogRateRatio',
    COMPONENT_DIMENSIONS.trendLogRateRatio,
    vectors.map((v) => ({ sourceFamily: v.sourceFamily, value: v.trend?.logRateRatio ?? null })),
    expectedFamilies,
  );

  return fused;
}
