// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import type { DimensionId } from './dimensions';
import type { EvidenceVector, SourceFamily } from './types';
import { familyCompetence } from './competence';
import { weightedMedian } from './stats';


export const MAX_FAMILY_INFLUENCE = 0.4;

export type FamilySignal = {
  sourceFamily: SourceFamily;
  value: number;
  /** Weight after reliability and influence capping. */
  effectiveWeight: number;
};

export type FusedComponent = {
  component: string;

  value: number | null;
  /** Every contributing family's own value, always preserved. */
  signals: FamilySignal[];
  familiesPresent: SourceFamily[];
  familiesMissing: SourceFamily[];

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


export const CONTRADICTION_SPREAD = 40;


export function capFamilyInfluence(
  weights: { sourceFamily: SourceFamily; weight: number }[],
): { sourceFamily: SourceFamily; weight: number }[] {
  if (weights.length === 0) return [];
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
