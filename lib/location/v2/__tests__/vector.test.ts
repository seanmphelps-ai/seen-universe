import { describe, it, expect } from 'vitest';
import {
  computeAmplification,
  computeBreadth,
  computeConcentration,
  computeDigitalDose,
  computeEvidenceVector,
  computePhysicalDose,
  computePrevalence,
  computeSeverity,
  computeTrend,
  type VectorInputs,
} from '../vector';
import type { FusedEvent, ExposureRecord } from '../dedupe';
import { getMarker } from '../registry';

function event(fingerprint: string, probability: number, severity: number | null = 0.5): FusedEvent {
  return {
    eventFingerprint: fingerprint,
    markerIds: ['violent_incident'],
    probability,
    confirmations: [],
    familyCount: 1,
    earliestPublishedAt: '2024-01-15T00:00:00.000Z',
    severity,
  };
}

function exposureRecord(id: string, overrides: Partial<ExposureRecord> = {}): ExposureRecord {
  return {
    observationId: id,
    eventFingerprint: 'e1',
    sourceFamily: 'SOCIAL_PUBLIC',
    markerIds: ['violent_incident'],
    quality: 0.8,
    engagement: null,
    localAccountEstimate: 1,
    publishedAt: '2024-01-15T00:00:00.000Z',
    accountId: id, // distinct account per record unless a test overrides it
    ...overrides,
  };
}

function baseInputs(overrides: Partial<VectorInputs> = {}): VectorInputs {
  return {
    key: {
      markerId: 'violent_incident',
      locationId: 'loc-1',
      windowStart: '2024-01-01',
      windowEnd: '2024-03-31',
    },
    sourceFamily: 'SOCIAL_PUBLIC',
    marker: getMarker('violent_incident'),
    events: [],
    exposure: [],
    windowDays: 90,
    population: 100_000,
    sampledLocalContentCount: null,
    sampledActiveLocalAccounts: null,
    connectedLocalPopulation: null,
    uniqueParticipatingLocalAccounts: null,
    spatialOccurrenceDistribution: null,
    sampledSubUnitCount: null,
    measuredDedupedLocalReach: null,
    physicalDoseInputs: [],
    amplificationBaselines: {},
    baseline: null,
    ...overrides,
  };
}

describe('computePrevalence', () => {
  it('computes unique events per 10k residents per 30 days', () => {
    const inputs = baseInputs({
      events: [event('a', 1), event('b', 1), event('c', 1)],
      population: 100_000,
      windowDays: 90,
    });
    // 3 / 100000 * 10000 = 0.3 per 10k over 90 days → 0.1 per 30 days.
    expect(computePrevalence(inputs).value).toBeCloseTo(0.1, 12);
  });

  it('returns null — not 0 — when the population denominator is missing', () => {
    const result = computePrevalence(baseInputs({ events: [event('a', 1)], population: null }));
    expect(result.value).toBeNull();
    expect(result.note).toMatch(/no population denominator/i);
  });

  it('uses quality-weighted share of sampled content for ambient markers', () => {
    const inputs = baseInputs({
      marker: getMarker('status_competition_signal'),
      sampledLocalContentCount: 1000,
      exposure: [exposureRecord('a', { quality: 0.5 }), exposureRecord('b', { quality: 0.25 })],
    });
    expect(computePrevalence(inputs).value).toBeCloseTo(0.75 / 1000, 12);
  });

  it('distinguishes a real zero from a missing denominator', () => {
    const measuredZero = computePrevalence(baseInputs({ events: [], population: 100_000 }));
    expect(measuredZero.value).toBe(0);
    const missing = computePrevalence(baseInputs({ events: [], population: null }));
    expect(missing.value).toBeNull();
  });
});

describe('computeSeverity', () => {
  it('reports median, upper tail, and the marker polarity', () => {
    const inputs = baseInputs({
      events: [event('a', 1, 0.25), event('b', 1, 0.5), event('c', 1, 1.0)],
    });
    const severity = computeSeverity(inputs)!;
    expect(severity.median).toBeCloseTo(0.5, 12);
    expect(severity.upperTail).toBeGreaterThan(severity.median);
    expect(severity.polarity).toBe('PRESSURE');
    expect(severity.n).toBe(3);
  });

  it('does not hide a rare extreme inside the median', () => {
    // Median sits on the low mass either way; the upper tail is what
    // exposes the fatal events, which is the point of reporting both.
    const oneInTen = computeSeverity(
      baseInputs({
        events: [
          ...Array.from({ length: 9 }, (_, i) => event(`low-${i}`, 1, 0.25)),
          event('fatal', 1, 1.0),
        ],
      }),
    )!;
    expect(oneInTen.median).toBeCloseTo(0.25, 12);
    expect(oneInTen.upperTail).toBeGreaterThan(oneInTen.median);

    const threeInTen = computeSeverity(
      baseInputs({
        events: [
          ...Array.from({ length: 7 }, (_, i) => event(`low-${i}`, 1, 0.25)),
          ...Array.from({ length: 3 }, (_, i) => event(`fatal-${i}`, 1, 1.0)),
        ],
      }),
    )!;
    // The median is unmoved by tripling the fatalities; the tail is not.
    expect(threeInTen.median).toBeCloseTo(0.25, 12);
    expect(threeInTen.upperTail).toBe(1.0);
  });

  it('returns null when no event carries a severity', () => {
    expect(computeSeverity(baseInputs({ events: [event('a', 1, null)] }))).toBeNull();
  });
});

describe('computePhysicalDose', () => {
  it('applies 1 - exp(-Σ p·share·duration·severity)', () => {
    const inputs = baseInputs({
      events: [event('a', 0.8)],
      physicalDoseInputs: [
        { eventFingerprint: 'a', affectedPopulationShare: 0.5, durationDays: 2, severity: 0.5 },
      ],
    });
    const accumulated = 0.8 * 0.5 * 2 * 0.5;
    expect(computePhysicalDose(inputs).value).toBeCloseTo(1 - Math.exp(-accumulated), 12);
  });

  it('saturates rather than growing without bound as dose accumulates', () => {
    const dose = (durationDays: number) =>
      computePhysicalDose(
        baseInputs({
          events: [event('a', 1)],
          physicalDoseInputs: [
            { eventFingerprint: 'a', affectedPopulationShare: 1, durationDays, severity: 1 },
          ],
        }),
      ).value!;

    // Strictly below 1 across any realistic dose...
    expect(dose(1)).toBeLessThan(1);
    expect(dose(20)).toBeLessThan(1);
    expect(dose(20)).toBeGreaterThan(dose(1));
    // ...and never exceeds 1. At extreme dose exp(-x) underflows to 0 in
    // float64, so the mathematical open bound closes to exactly 1.
    expect(dose(10_000)).toBe(1);
  });

  it('returns null when no dose parameters were obtainable', () => {
    expect(computePhysicalDose(baseInputs({ events: [event('a', 1)] })).value).toBeNull();
  });

  it('ignores dose parameters that match no deduplicated event', () => {
    const inputs = baseInputs({
      events: [event('a', 1)],
      physicalDoseInputs: [
        { eventFingerprint: 'orphan', affectedPopulationShare: 1, durationDays: 1, severity: 1 },
      ],
    });
    expect(computePhysicalDose(inputs).value).toBeNull();
  });
});

describe('computeDigitalDose', () => {
  it('uses measured deduplicated reach when available and does not flag a proxy', () => {
    const inputs = baseInputs({
      connectedLocalPopulation: 10_000,
      measuredDedupedLocalReach: 5_000,
    });
    const result = computeDigitalDose(inputs);
    expect(result.value).toBeCloseTo(1 - Math.exp(-0.5), 12);
    expect(result.isProxy).toBe(false);
  });

  it('labels the summed-reach fallback as a proxy, per the contract', () => {
    const inputs = baseInputs({
      connectedLocalPopulation: 10_000,
      exposure: [
        exposureRecord('a', { engagement: { uniqueReach: 3_000 }, localAccountEstimate: 0.5 }),
        exposureRecord('b', { engagement: { uniqueReach: 1_000 }, localAccountEstimate: 1 }),
      ],
    });
    const result = computeDigitalDose(inputs);
    expect(result.isProxy).toBe(true);
    expect(result.note).toMatch(/proxy/i);
    expect(result.value).toBeCloseTo(1 - Math.exp(-2_500 / 10_000), 12);
  });

  it('returns null without a connected-population denominator', () => {
    expect(computeDigitalDose(baseInputs({ connectedLocalPopulation: null })).value).toBeNull();
  });
});

describe('computeAmplification', () => {
  it('medians the per-signal percentiles across available signals', () => {
    const inputs = baseInputs({
      exposure: [exposureRecord('a', { engagement: { reposts: 500, comments: 10 } })],
      amplificationBaselines: {
        reposts: [1, 2, 3, 4, 5],
        comments: [100, 200, 300, 400, 500],
      },
    });
    // reposts far above baseline → ~100; comments far below → ~0; median of the two → ~50.
    expect(computeAmplification(inputs).value).toBeCloseTo(50, 6);
  });

  it('drops a signal that has observations but no baseline, rather than scoring it 0', () => {
    const inputs = baseInputs({
      exposure: [exposureRecord('a', { engagement: { reposts: 500, comments: 10 } })],
      amplificationBaselines: { reposts: [1, 2, 3, 4, 5] },
    });
    expect(computeAmplification(inputs).value).toBe(100);
  });

  it('returns null when no signal has both observations and a baseline', () => {
    const result = computeAmplification(baseInputs({ exposure: [exposureRecord('a')] }));
    expect(result.value).toBeNull();
    expect(result.note).toMatch(/no amplification signal/i);
  });
});

describe('computeBreadth', () => {
  it('computes spatial breadth as distinct affected sub-units / sampled sub-units', () => {
    const inputs = baseInputs({
      spatialOccurrenceDistribution: { a: 3, b: 0, c: 1, d: 0 },
      sampledSubUnitCount: 8,
    });
    // 2 of 8 sampled sub-units affected (a, c) — accounts (uniqueParticipatingLocalAccounts)
    // are absent, so BRD is the spatial signal alone.
    expect(computeBreadth(inputs).value).toBeCloseTo(2 / 8, 12);
  });

  it('computes actor breadth as participating accounts / sampled active accounts', () => {
    const inputs = baseInputs({
      uniqueParticipatingLocalAccounts: 250,
      sampledActiveLocalAccounts: 1_000,
    });
    expect(computeBreadth(inputs).value).toBeCloseTo(0.25, 12);
  });

  it('combines both signals by median when both are available', () => {
    const inputs = baseInputs({
      spatialOccurrenceDistribution: { a: 1, b: 1 }, // 2/4 = 0.5
      sampledSubUnitCount: 4,
      uniqueParticipatingLocalAccounts: 100, // 100/1000 = 0.1
      sampledActiveLocalAccounts: 1_000,
    });
    expect(computeBreadth(inputs).value).toBeCloseTo((0.5 + 0.1) / 2, 12);
  });

  it('caps each signal at 1 when the numerator exceeds its sample', () => {
    const inputs = baseInputs({
      uniqueParticipatingLocalAccounts: 2_000,
      sampledActiveLocalAccounts: 1_000,
    });
    expect(computeBreadth(inputs).value).toBe(1);
  });

  it('returns null only when neither spatial nor actor signal is available', () => {
    expect(
      computeBreadth(baseInputs({ uniqueParticipatingLocalAccounts: 10 })).value,
    ).toBeNull();
    expect(computeBreadth(baseInputs()).value).toBeNull();
  });
});

describe('computeConcentration', () => {
  it('reports normalized HHI plus top-1% and top-10% contribution over sub-units', () => {
    const distribution: Record<string, number> = {};
    for (let i = 0; i < 100; i++) distribution[`subunit-${i}`] = 1;
    const result = computeConcentration(baseInputs({ spatialOccurrenceDistribution: distribution }))!;

    expect(result.subUnitCount).toBe(100);
    expect(result.normalizedHhi).toBeCloseTo(0, 10);
    expect(result.top1PercentShare).toBeCloseTo(0.01, 10);
    expect(result.top10PercentShare).toBeCloseTo(0.1, 10);
  });

  it('surfaces occurrences clustered in a small share of the geography', () => {
    // The contract's own example: most violence concentrated in a few sub-units.
    const distribution: Record<string, number> = { hotspot: 900 };
    for (let i = 0; i < 99; i++) distribution[`subunit-${i}`] = 1;
    const result = computeConcentration(baseInputs({ spatialOccurrenceDistribution: distribution }))!;

    expect(result.normalizedHhi).toBeGreaterThan(0.5);
    expect(result.top1PercentShare).toBeGreaterThan(0.85);
  });

  it('never reads account participation — that is a confidence diagnostic, not CONC', () => {
    // No spatialOccurrenceDistribution supplied; accountParticipation is not
    // even a field on VectorInputs any more (moved to ConfidenceInputs).
    expect(computeConcentration(baseInputs())).toBeNull();
  });

  it('returns null when no spatial distribution was obtained', () => {
    expect(computeConcentration(baseInputs())).toBeNull();
  });
});

describe('computeTrend', () => {
  it('reports a positive log rate ratio when the current rate exceeds baseline', () => {
    const inputs = baseInputs({
      events: Array.from({ length: 30 }, (_, i) => event(`e-${i}`, 1)),
      windowDays: 90,
      baseline: { events: 40, windowDays: 365 },
    });
    const trend = computeTrend(inputs)!;
    expect(trend.logRateRatio).toBeGreaterThan(0);
    expect(trend.lower95).toBeLessThan(trend.logRateRatio);
    expect(trend.upper95).toBeGreaterThan(trend.logRateRatio);
  });

  it('gives a wide interval on sparse counts instead of a confident spike', () => {
    const sparse = computeTrend(
      baseInputs({
        events: [event('a', 1), event('b', 1)],
        windowDays: 90,
        baseline: { events: 1, windowDays: 365 },
      }),
    )!;
    const dense = computeTrend(
      baseInputs({
        events: Array.from({ length: 200 }, (_, i) => event(`e-${i}`, 1)),
        windowDays: 90,
        baseline: { events: 100, windowDays: 365 },
      }),
    )!;
    expect(sparse.upper95 - sparse.lower95).toBeGreaterThan(dense.upper95 - dense.lower95);
  });

  it('stays finite when the current window has zero events', () => {
    const trend = computeTrend(
      baseInputs({ events: [], windowDays: 90, baseline: { events: 50, windowDays: 365 } }),
    )!;
    expect(Number.isFinite(trend.logRateRatio)).toBe(true);
    expect(trend.logRateRatio).toBeLessThan(0);
  });

  it('returns null without a baseline period', () => {
    expect(computeTrend(baseInputs({ baseline: null }))).toBeNull();
  });
});

describe('computeEvidenceVector', () => {
  it('assembles all components and keeps raw counts beside them', () => {
    const inputs = baseInputs({
      events: [event('a', 0.9, 0.5), event('b', 0.8, 1.0)],
      exposure: [exposureRecord('o1'), exposureRecord('o2'), exposureRecord('o3')],
      population: 50_000,
    });
    const vector = computeEvidenceVector(inputs, ['GRIEF', 'ANGER', 'GRIEF']);

    expect(vector.raw.uniqueEvents).toBe(2);
    expect(vector.raw.exposureObservations).toBe(3);
    expect(vector.raw.population).toBe(50_000);
    expect(vector.prev).toBeGreaterThan(0);
    expect(vector.sev).not.toBeNull();
    expect(vector.frame!.GRIEF).toBeCloseTo(2 / 3, 12);
    expect(vector.frame!.ANGER).toBeCloseTo(1 / 3, 12);
  });

  it('reports null components with an explanatory note rather than zeros', () => {
    const vector = computeEvidenceVector(baseInputs({ population: null }));

    expect(vector.prev).toBeNull();
    expect(vector.phys).toBeNull();
    expect(vector.dig).toBeNull();
    expect(vector.amp).toBeNull();
    expect(vector.brd).toBeNull();
    expect(vector.notes.length).toBeGreaterThanOrEqual(5);
  });

  it('normalizes the frame vector to sum to 1', () => {
    const vector = computeEvidenceVector(
      baseInputs({ exposure: [exposureRecord('a'), exposureRecord('b')] }),
      ['FEAR', 'AID'],
    );
    const total = Object.values(vector.frame!).reduce((acc, p) => acc + p, 0);
    expect(total).toBeCloseTo(1, 12);
  });
});
