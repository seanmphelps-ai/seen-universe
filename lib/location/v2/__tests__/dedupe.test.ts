import { describe, it, expect } from 'vitest';
import {
  dedupeObservations,
  effectiveIndependentEvidence,
  fuseEventProbability,
} from '../dedupe';
import type { Observation, SourceFamily } from '../types';

function observation(
  id: string,
  sourceFamily: SourceFamily,
  fingerprint: string | null,
  quality: number,
  extra: Partial<Observation> = {},
): Observation {
  return {
    observationId: id,
    provider: `provider-${sourceFamily}`,
    sourceFamily,
    sourceUrl: `https://example.test/${id}`,
    sourceId: id,
    publishedAt: '2024-03-01T00:00:00.000Z',
    retrievedAt: '2024-03-02T00:00:00.000Z',
    requestedGeography: 'Los Angeles County, CA',
    matchedGeography: 'Los Angeles County, CA',
    geographicResolution: 'county',
    evidenceType: 'POST',
    markerIds: ['violent_incident'],
    direction: 'TOWARD',
    severity: 0.75,
    responseFrame: 'GRIEF',
    eventFingerprint: fingerprint,
    engagement: null,
    localAccountEstimate: 0.8,
    accountId: id,
    confidenceTerms: { geo: quality, classifier: quality },
    ...extra,
  };
}

describe('fuseEventProbability', () => {
  it('applies p(e) = 1 - Π(1 - q) across families', () => {
    expect(fuseEventProbability([0.8, 0.5])).toBeCloseTo(1 - 0.2 * 0.5, 12);
  });

  it('returns 0 with no confirmations rather than an undefined product', () => {
    expect(fuseEventProbability([])).toBe(0);
  });

  it('is monotonic — an extra independent family never lowers p(e)', () => {
    const two = fuseEventProbability([0.6, 0.6]);
    const three = fuseEventProbability([0.6, 0.6, 0.6]);
    expect(three).toBeGreaterThan(two);
  });
});

describe('dedupeObservations', () => {
  it('collapses one incident to one event while preserving every mention as exposure', () => {
    // The contract's own example: one shooting, 800 posts.
    const posts = Array.from({ length: 800 }, (_, i) =>
      observation(`post-${i}`, 'SOCIAL_PUBLIC', 'shooting-2024-03-01-downtown', 0.7),
    );
    const newsReport = observation('news-1', 'LOCAL_NEWS', 'shooting-2024-03-01-downtown', 0.9);

    const result = dedupeObservations([...posts, newsReport]);

    expect(result.events).toHaveLength(1);
    expect(result.exposure).toHaveLength(801);
    expect(result.events[0].familyCount).toBe(2);
  });

  it('retains only the strongest confirmation within a family', () => {
    const weak = observation('weak', 'SOCIAL_PUBLIC', 'event-1', 0.3);
    const strong = observation('strong', 'SOCIAL_PUBLIC', 'event-1', 0.9);

    const result = dedupeObservations([weak, strong]);
    const confirmation = result.events[0].confirmations[0];

    expect(confirmation.strongestObservationId).toBe('strong');
    expect(confirmation.maxQuality).toBeCloseTo(0.9, 12);
    expect(confirmation.observationCount).toBe(2);
  });

  it('does not let repeat mentions in one family inflate p(e)', () => {
    const single = dedupeObservations([observation('a', 'SOCIAL_PUBLIC', 'e', 0.7)]);
    const hundred = dedupeObservations(
      Array.from({ length: 100 }, (_, i) => observation(`a-${i}`, 'SOCIAL_PUBLIC', 'e', 0.7)),
    );
    expect(hundred.events[0].probability).toBeCloseTo(single.events[0].probability, 12);
  });

  it('counts unfingerprinted observations as exposure only, and reports how many', () => {
    const result = dedupeObservations([
      observation('floating', 'SOCIAL_PUBLIC', null, 0.8),
      observation('anchored', 'SOCIAL_PUBLIC', 'e', 0.8),
    ]);

    expect(result.events).toHaveLength(1);
    expect(result.exposure).toHaveLength(2);
    expect(result.unfingerprintedCount).toBe(1);
  });

  it('keeps uncharacterized observations in exposure but lets them confirm nothing', () => {
    const uncharacterized = observation('u', 'SOCIAL_PUBLIC', 'e', 0.5, { confidenceTerms: {} });
    const result = dedupeObservations([uncharacterized]);

    expect(result.exposure).toHaveLength(1);
    expect(result.exposure[0].quality).toBeNull();
    expect(result.events).toHaveLength(0);
  });

  it('takes the earliest publication date across the cluster', () => {
    const later = observation('later', 'SOCIAL_PUBLIC', 'e', 0.8, {
      publishedAt: '2024-03-05T00:00:00.000Z',
    });
    const earlier = observation('earlier', 'LOCAL_NEWS', 'e', 0.8, {
      publishedAt: '2024-03-01T00:00:00.000Z',
    });
    const result = dedupeObservations([later, earlier]);
    expect(result.events[0].earliestPublishedAt).toBe('2024-03-01T00:00:00.000Z');
  });
});

describe('effectiveIndependentEvidence', () => {
  it('equals n when all observations are equally weighted', () => {
    expect(effectiveIndependentEvidence([0.5, 0.5, 0.5, 0.5])).toBeCloseTo(4, 12);
  });

  it('falls well below n when one observation dominates', () => {
    const nEff = effectiveIndependentEvidence([0.99, 0.01, 0.01, 0.01]);
    expect(nEff).toBeGreaterThan(1);
    expect(nEff).toBeLessThan(1.2);
  });

  it('returns 0 when nothing usable is present', () => {
    expect(effectiveIndependentEvidence([])).toBe(0);
    expect(effectiveIndependentEvidence([0, 0])).toBe(0);
  });
});
