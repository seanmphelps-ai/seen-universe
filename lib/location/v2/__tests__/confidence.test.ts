import { describe, it, expect } from 'vitest';
import { capForFamilyCount, computeConfidence, confidenceBand } from '../confidence';
import type { Observation, SourceFamily } from '../types';

function observation(id: string, sourceFamily: SourceFamily, overrides: Partial<Observation> = {}): Observation {
  return {
    observationId: id,
    provider: 'test-provider',
    sourceFamily,
    sourceUrl: `https://example.test/${id}`,
    sourceId: id,
    publishedAt: '2024-02-01T00:00:00.000Z',
    retrievedAt: '2024-02-02T00:00:00.000Z',
    requestedGeography: 'Los Angeles County, CA',
    matchedGeography: 'Los Angeles County, CA',
    geographicResolution: 'tract',
    evidenceType: 'ARTICLE',
    markerIds: ['violent_incident'],
    direction: 'TOWARD',
    severity: 0.5,
    responseFrame: 'NEUTRAL',
    eventFingerprint: 'e1',
    engagement: null,
    localAccountEstimate: 0.9,
    accountId: id,
    confidenceTerms: { geo: 0.9, classifier: 0.85, source: 0.9, authenticity: 0.95, recency: 0.8 },
    ...overrides,
  };
}

describe('capForFamilyCount', () => {
  it('applies the contract caps exactly', () => {
    expect(capForFamilyCount(0)).toBe(0);
    expect(capForFamilyCount(1)).toBe(40);
    expect(capForFamilyCount(2)).toBe(65);
    expect(capForFamilyCount(3)).toBe(80);
    expect(capForFamilyCount(4)).toBe(95);
    expect(capForFamilyCount(9)).toBe(95);
  });
});

describe('confidenceBand', () => {
  it('maps scores to the four published bands', () => {
    expect(confidenceBand(0)).toBe('VERY_LOW');
    expect(confidenceBand(24)).toBe('VERY_LOW');
    expect(confidenceBand(25)).toBe('LOW');
    expect(confidenceBand(49)).toBe('LOW');
    expect(confidenceBand(50)).toBe('MEDIUM');
    expect(confidenceBand(74)).toBe('MEDIUM');
    expect(confidenceBand(75)).toBe('HIGH');
    expect(confidenceBand(100)).toBe('HIGH');
  });
});

describe('computeConfidence', () => {
  it('caps a single-family result at 40 no matter how good the evidence is', () => {
    const observations = Array.from({ length: 50 }, (_, i) =>
      observation(`o-${i}`, 'OFFICIAL_DATA', { geographicResolution: 'point' }),
    );

    const report = computeConfidence({
      observations,
      familiesPresent: ['OFFICIAL_DATA'],
      familiesMissing: [],
      timeCoverage: 1,
      includesNonprobabilitySocial: false,
      accountParticipation: null,
    });

    expect(report.capApplied).toBe(40);
    expect(report.score).toBeLessThanOrEqual(40);
    expect(report.notes.some((n) => /capped at 40/.test(n))).toBe(true);
  });

  it('raises the ceiling as independent families accumulate', () => {
    const build = (families: SourceFamily[]) =>
      computeConfidence({
        observations: families.flatMap((family, index) =>
          Array.from({ length: 10 }, (_, i) =>
            observation(`${family}-${i}-${index}`, family, { geographicResolution: 'point' }),
          ),
        ),
        familiesPresent: families,
        familiesMissing: [],
        timeCoverage: 1,
        includesNonprobabilitySocial: false,
        accountParticipation: null,
      });

    const one = build(['OFFICIAL_DATA']);
    const four = build(['OFFICIAL_DATA', 'LOCAL_NEWS', 'ACLED', 'OSM']);

    expect(four.score).toBeGreaterThan(one.score);
    expect(four.capApplied).toBe(95);
  });

  it('charges missing families to confidence and names them', () => {
    const report = computeConfidence({
      observations: [observation('a', 'OFFICIAL_DATA')],
      familiesPresent: ['OFFICIAL_DATA'],
      familiesMissing: ['SOCIAL_PUBLIC', 'ACLED'],
      timeCoverage: 1,
      includesNonprobabilitySocial: false,
      accountParticipation: null,
    });

    expect(report.components.sourceFamilyCoverage).toBeCloseTo(1 / 3, 12);
    expect(report.notes.some((n) => n.includes('SOCIAL_PUBLIC') && n.includes('ACLED'))).toBe(true);
  });

  it('scores coarse geography below precise geography', () => {
    const build = (resolution: Observation['geographicResolution']) =>
      computeConfidence({
        observations: [observation('a', 'OFFICIAL_DATA', { geographicResolution: resolution })],
        familiesPresent: ['OFFICIAL_DATA'],
        familiesMissing: [],
        timeCoverage: 1,
        includesNonprobabilitySocial: false,
        accountParticipation: null,
      });

    expect(build('state').components.geographicPrecision).toBeLessThan(
      build('point').components.geographicPrecision,
    );
  });

  it('reports a whole-number score rather than false decimal precision', () => {
    const report = computeConfidence({
      observations: [observation('a', 'OFFICIAL_DATA')],
      familiesPresent: ['OFFICIAL_DATA'],
      familiesMissing: [],
      timeCoverage: 0.5,
      includesNonprobabilitySocial: false,
      accountParticipation: null,
    });
    expect(Number.isInteger(report.score)).toBe(true);
  });

  it('notes the nonprobability caveat when social data contributed', () => {
    const report = computeConfidence({
      observations: [observation('a', 'SOCIAL_PUBLIC')],
      familiesPresent: ['SOCIAL_PUBLIC'],
      familiesMissing: [],
      timeCoverage: 1,
      includesNonprobabilitySocial: true,
      accountParticipation: null,
    });
    expect(report.notes.some((n) => /digitally observable/.test(n))).toBe(true);
  });

  it('flags unmeasured classifier calibration and authenticity instead of assuming them', () => {
    const report = computeConfidence({
      observations: [observation('a', 'OFFICIAL_DATA', { confidenceTerms: { geo: 0.9 } })],
      familiesPresent: ['OFFICIAL_DATA'],
      familiesMissing: [],
      timeCoverage: null,
      includesNonprobabilitySocial: false,
      accountParticipation: null,
    });

    expect(report.components.classifierCalibration).toBe(0);
    expect(report.components.authenticity).toBe(0);
    expect(report.components.timeCoverage).toBe(0);
    expect(report.notes.filter((n) => /scores 0/.test(n))).toHaveLength(3);
  });

  it('returns a zero-confidence report when there is no evidence at all', () => {
    const report = computeConfidence({
      observations: [],
      familiesPresent: [],
      familiesMissing: ['OFFICIAL_DATA'],
      timeCoverage: null,
      includesNonprobabilitySocial: false,
      accountParticipation: null,
    });

    expect(report.score).toBe(0);
    expect(report.band).toBe('VERY_LOW');
  });

  it('reports evidence independence as a diagnostic separate from the score, and flags low independence', () => {
    const dominated = computeConfidence({
      observations: [observation('a', 'OFFICIAL_DATA')],
      familiesPresent: ['OFFICIAL_DATA'],
      familiesMissing: [],
      timeCoverage: 1,
      includesNonprobabilitySocial: false,
      accountParticipation: { whale: 900, ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`a-${i}`, 1])) },
    });

    expect(dominated.evidenceIndependence).not.toBeNull();
    expect(dominated.evidenceIndependence!.accountHhi).toBeGreaterThan(0.5);
    expect(dominated.notes.some((n) => /Evidence independence is low/.test(n))).toBe(true);
    // The diagnostic must never leak into the score's own components.
    expect(dominated.components).not.toHaveProperty('evidenceIndependence');
  });

  it('returns a null evidence-independence diagnostic when no account data was supplied', () => {
    const report = computeConfidence({
      observations: [observation('a', 'OFFICIAL_DATA')],
      familiesPresent: ['OFFICIAL_DATA'],
      familiesMissing: [],
      timeCoverage: 1,
      includesNonprobabilitySocial: false,
      accountParticipation: null,
    });
    expect(report.evidenceIndependence).toBeNull();
  });
});
