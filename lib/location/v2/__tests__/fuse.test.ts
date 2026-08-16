import { describe, it, expect } from 'vitest';
import {
  CONTRADICTION_SPREAD,
  MAX_FAMILY_INFLUENCE,
  capFamilyInfluence,
  fuseComponent,
  fuseVectors,
} from '../fuse';
import type { EvidenceVector, SourceFamily } from '../types';

const EXPECTED: SourceFamily[] = ['OFFICIAL_DATA', 'LOCAL_NEWS', 'SOCIAL_PUBLIC', 'GDELT'];

function vector(sourceFamily: SourceFamily, overrides: Partial<EvidenceVector> = {}): EvidenceVector {
  return {
    key: { markerId: 'm', locationId: 'l', windowStart: '2024-01-01', windowEnd: '2024-03-31' },
    sourceFamily,
    prev: 50,
    sev: null,
    phys: null,
    dig: null,
    amp: null,
    brd: null,
    conc: null,
    frame: null,
    trend: null,
    raw: { uniqueEvents: 0, exposureObservations: 0, population: null },
    digIsProxy: false,
    notes: [],
    ...overrides,
  };
}

describe('capFamilyInfluence', () => {
  it('leaves weights alone when the cap cannot bind', () => {
    const weights = [
      { sourceFamily: 'OFFICIAL_DATA' as SourceFamily, weight: 1 },
      { sourceFamily: 'SOCIAL_PUBLIC' as SourceFamily, weight: 0.4 },
    ];
    expect(capFamilyInfluence(weights)).toEqual(weights);
  });

  it('caps a dominant family at MAX_FAMILY_INFLUENCE of total weight', () => {
    const weights: { sourceFamily: SourceFamily; weight: number }[] = [
      { sourceFamily: 'OFFICIAL_DATA', weight: 100 },
      { sourceFamily: 'LOCAL_NEWS', weight: 1 },
      { sourceFamily: 'SOCIAL_PUBLIC', weight: 1 },
      { sourceFamily: 'GDELT', weight: 1 },
    ];
    const capped = capFamilyInfluence(weights);
    const total = capped.reduce((acc, w) => acc + w.weight, 0);
    const dominant = capped.find((w) => w.sourceFamily === 'OFFICIAL_DATA')!;
    expect(dominant.weight / total).toBeLessThanOrEqual(MAX_FAMILY_INFLUENCE + 1e-9);
  });
});

describe('fuseComponent', () => {
  it('omits a missing family from the score and reports it as missing', () => {
    const fused = fuseComponent(
      'prev',
      'PREV',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 60 },
        { sourceFamily: 'LOCAL_NEWS', value: null },
      ],
      EXPECTED,
    );

    expect(fused.value).toBe(60);
    expect(fused.familiesPresent).toEqual(['OFFICIAL_DATA']);
    expect(fused.familiesMissing).toEqual(['LOCAL_NEWS', 'SOCIAL_PUBLIC', 'GDELT']);
  });

  it('never substitutes a zero for an absent family', () => {
    // Two families both reporting 80; a third absent. If absence were
    // treated as 0 the fused value would collapse toward it.
    const fused = fuseComponent(
      'prev',
      'PREV',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 80 },
        { sourceFamily: 'LOCAL_NEWS', value: 80 },
        { sourceFamily: 'SOCIAL_PUBLIC', value: null },
      ],
      EXPECTED,
    );
    expect(fused.value).toBe(80);
  });

  it('returns a null value — not 0 — when no family supplied the component', () => {
    const fused = fuseComponent('phys', 'PHYS', [{ sourceFamily: 'OFFICIAL_DATA', value: null }], EXPECTED);
    expect(fused.value).toBeNull();
    expect(fused.familiesPresent).toEqual([]);
  });

  it('flags contradiction and preserves the parallel signals', () => {
    const fused = fuseComponent(
      'prev',
      'PREV',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 10 },
        { sourceFamily: 'ACLED', value: 90 },
      ],
      EXPECTED,
    );

    expect(fused.contradiction).toBe(true);
    expect(fused.contradictionNote).toMatch(/disagree/i);
    expect(fused.signals.map((s) => s.value).sort((a, b) => a - b)).toEqual([10, 90]);
  });

  it('does not flag contradiction for ordinary spread', () => {
    const fused = fuseComponent(
      'prev',
      'PREV',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 50 },
        { sourceFamily: 'ACLED', value: 50 + CONTRADICTION_SPREAD - 1 },
      ],
      EXPECTED,
    );
    expect(fused.contradiction).toBe(false);
  });

  it('never flags contradiction on a single family', () => {
    const fused = fuseComponent('prev', 'PREV', [{ sourceFamily: 'OFFICIAL_DATA', value: 5 }], EXPECTED);
    expect(fused.contradiction).toBe(false);
  });

  it('weights by PER-DIMENSION competence, not a single family score: official data ' +
    'dominates PREV while social public dominates DIG — the opposite ranking', () => {
    const prev = fuseComponent(
      'prev',
      'PREV',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 20 },
        { sourceFamily: 'SOCIAL_PUBLIC', value: 80 },
      ],
      EXPECTED,
    );
    const dig = fuseComponent(
      'dig',
      'DIG',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 20 },
        { sourceFamily: 'SOCIAL_PUBLIC', value: 80 },
      ],
      EXPECTED,
    );

    // Same two families, same two raw values — opposite fused answer,
    // because OFFICIAL_DATA is authoritative for PREV and has zero
    // declared competence for DIG, while SOCIAL_PUBLIC is the reverse.
    expect(prev.value).toBe(20);
    expect(dig.value).toBe(80);
  });

  it('excludes a family with zero competence for this dimension from the fused value, ' +
    'but still reports it as present and names it incompetent', () => {
    const fused = fuseComponent(
      'prev',
      'PREV',
      [
        { sourceFamily: 'OFFICIAL_DATA', value: 40 },
        { sourceFamily: 'ADS', value: 95 }, // ADS has no declared PREV competence at all
      ],
      EXPECTED,
    );

    expect(fused.value).toBe(40);
    expect(fused.familiesPresent).toEqual(['OFFICIAL_DATA', 'ADS']);
    expect(fused.incompetentFamilies).toEqual(['ADS']);
    const adsSignal = fused.signals.find((s) => s.sourceFamily === 'ADS')!;
    expect(adsSignal.effectiveWeight).toBe(0);
    expect(adsSignal.value).toBe(95); // preserved for transparency, just unweighted
  });

  it('returns null when every contributing family is incompetent for the dimension', () => {
    const fused = fuseComponent('prev', 'PREV', [{ sourceFamily: 'ADS', value: 50 }], EXPECTED);
    expect(fused.value).toBeNull();
    expect(fused.incompetentFamilies).toEqual(['ADS']);
    expect(fused.familiesPresent).toEqual(['ADS']);
  });
});

describe('fuseVectors', () => {
  it('fuses every numeric component across the supplied vectors', () => {
    const fused = fuseVectors(
      [
        vector('OFFICIAL_DATA', { prev: 40, phys: 0.2 }),
        vector('SOCIAL_PUBLIC', { prev: 60, phys: null }),
      ],
      EXPECTED,
    );

    expect(fused.prev.value).toBe(40);
    expect(fused.phys.value).toBe(0.2);
    expect(fused.phys.familiesPresent).toEqual(['OFFICIAL_DATA']);
    expect(fused.dig.value).toBeNull();
  });

  it('pulls nested severity, concentration, and trend values through', () => {
    const fused = fuseVectors(
      [
        vector('OFFICIAL_DATA', {
          sev: { median: 0.5, upperTail: 0.9, polarity: 'PRESSURE', n: 4 },
          conc: { normalizedHhi: 0.3, top1PercentShare: 0.2, top10PercentShare: 0.5, subUnitCount: 100 },
          trend: {
            logRateRatio: 0.4,
            lower95: 0.1,
            upper95: 0.7,
            currentEvents: 10,
            baselineEvents: 20,
            currentWindowDays: 90,
            baselineWindowDays: 365,
          },
        }),
      ],
      EXPECTED,
    );

    expect(fused.sevMedian.value).toBe(0.5);
    expect(fused.sevUpperTail.value).toBe(0.9);
    expect(fused.conc.value).toBe(0.3);
    expect(fused.trendLogRateRatio.value).toBe(0.4);
  });
});
