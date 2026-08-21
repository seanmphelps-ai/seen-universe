import { describe, expect, it } from 'vitest';
import {
  runEnvironmentalWitness,
  type WitnessProvider,
} from '../environmentalWitness';
import type { Observation, SourceFamily } from '../types';

function observation(
  observationId: string,
  sourceFamily: SourceFamily,
  provider: string,
  markerIds: string[],
  publishedAt: string,
): Observation {
  return {
    observationId,
    provider,
    sourceFamily,
    sourceUrl: `https://example.test/${observationId}`,
    sourceId: observationId,
    publishedAt,
    retrievedAt: '2026-08-21T17:00:00.000Z',
    requestedGeography: 'Cut Bank, Montana, USA',
    matchedGeography: 'Cut Bank, Montana, USA',
    geographicResolution: 'place',
    evidenceType:
      sourceFamily === 'MARKETPLACE'
        ? 'LISTING'
        : sourceFamily === 'REVIEWS'
          ? 'REVIEW'
          : sourceFamily === 'LOCAL_NEWS'
            ? 'ARTICLE'
            : sourceFamily === 'OFFICIAL_DATA'
              ? 'STATISTICAL_ESTIMATE'
              : 'POST',
    markerIds,
    direction: 'TOWARD',
    severity: null,
    responseFrame: null,
    eventFingerprint: null,
    engagement: null,
    localAccountEstimate: 0.9,
    accountId: `${provider}-${observationId}`,
    confidenceTerms: {
      geo: 0.95,
      source: 0.8,
      classifier: 0.85,
      authenticity: 0.9,
      recency: 0.9,
    },
  };
}

function provider(
  providerId: string,
  sourceFamily: SourceFamily,
  observations: Observation[],
): WitnessProvider {
  return {
    providerId,
    sourceFamily,
    collect: async (request) => {
      expect(request.location).toBe('Cut Bank, Montana, USA');
      expect(request.researchQuestions.length).toBeGreaterThan(10);
      return observations;
    },
  };
}

describe('runEnvironmentalWitness', () => {
  it('retains many distinct high-signal environmental findings before personalization', async () => {
    const providers: WitnessProvider[] = [
      provider('local-social', 'SOCIAL_PUBLIC', [
        observation('social-1', 'SOCIAL_PUBLIC', 'local-social', ['outmigration_intent'], '2026-01-10T12:00:00Z'),
        observation('social-2', 'SOCIAL_PUBLIC', 'local-social', ['collective_aid_signal'], '2026-02-10T12:00:00Z'),
        observation('social-3', 'SOCIAL_PUBLIC', 'local-social', ['status_competition_signal'], '2026-03-10T12:00:00Z'),
      ]),
      provider('local-reviews', 'REVIEWS', [
        observation('review-1', 'REVIEWS', 'local-reviews', ['green_and_recreation_access'], '2026-04-10T12:00:00Z'),
      ]),
      provider('local-market', 'MARKETPLACE', [
        observation('market-1', 'MARKETPLACE', 'local-market', ['affluence_saturation'], '2026-05-10T12:00:00Z'),
      ]),
      provider('local-news', 'LOCAL_NEWS', [
        observation('news-1', 'LOCAL_NEWS', 'local-news', ['violent_incident'], '2026-06-10T12:00:00Z'),
      ]),
      provider('official-baseline', 'OFFICIAL_DATA', [
        observation('official-1', 'OFFICIAL_DATA', 'official-baseline', ['labor_instability'], '2026-07-10T12:00:00Z'),
        observation('official-2', 'OFFICIAL_DATA', 'official-baseline', ['institutional_density'], '2026-07-11T12:00:00Z'),
      ]),
    ];

    const record = await runEnvironmentalWitness(
      {
        locationId: 'cut-bank-mt',
        location: 'Cut Bank, Montana, USA',
        windowStart: '2026-01-01T00:00:00Z',
        windowEnd: '2026-12-31T23:59:59Z',
      },
      providers,
    );

    expect(record.observations).toHaveLength(8);
    expect(record.discoveries).toHaveLength(8);
    expect(record.discoveries.map((finding) => finding.markerId)).toEqual(
      expect.arrayContaining([
        'outmigration_intent',
        'collective_aid_signal',
        'status_competition_signal',
        'green_and_recreation_access',
        'affluence_saturation',
        'violent_incident',
        'labor_instability',
        'institutional_density',
      ]),
    );

    // First pass captures the field. It does not collapse eight distinct
    // environmental findings into one person-specific interpretation.
    expect(record.discoveries.every((finding) => finding.observationCount >= 1)).toBe(true);
    expect(record.familiesPresent).toEqual(
      expect.arrayContaining(['SOCIAL_PUBLIC', 'REVIEWS', 'MARKETPLACE', 'LOCAL_NEWS', 'OFFICIAL_DATA']),
    );
  });

  it('continues when one provider fails and reports the failure', async () => {
    const good = provider('working-social', 'SOCIAL_PUBLIC', [
      observation('social-good', 'SOCIAL_PUBLIC', 'working-social', ['collective_aid_signal'], '2026-02-10T12:00:00Z'),
    ]);

    const failed: WitnessProvider = {
      providerId: 'failed-marketplace',
      sourceFamily: 'MARKETPLACE',
      collect: async () => {
        throw new Error('provider unavailable');
      },
    };

    const record = await runEnvironmentalWitness(
      {
        locationId: 'cut-bank-mt',
        location: 'Cut Bank, Montana, USA',
        windowStart: '2026-01-01T00:00:00Z',
        windowEnd: '2026-12-31T23:59:59Z',
      },
      [good, failed],
    );

    expect(record.observations).toHaveLength(1);
    expect(record.discoveries).toHaveLength(1);
    expect(record.providerFailures).toEqual([
      {
        providerId: 'failed-marketplace',
        sourceFamily: 'MARKETPLACE',
        message: 'provider unavailable',
      },
    ]);
  });

  it('keeps source provenance on every discovery', async () => {
    const record = await runEnvironmentalWitness(
      {
        locationId: 'cut-bank-mt',
        location: 'Cut Bank, Montana, USA',
        windowStart: '2026-01-01T00:00:00Z',
        windowEnd: '2026-12-31T23:59:59Z',
      },
      [
        provider('social-a', 'SOCIAL_PUBLIC', [
          observation('a1', 'SOCIAL_PUBLIC', 'social-a', ['outmigration_intent'], '2026-01-01T12:00:00Z'),
        ]),
        provider('forum-a', 'LOCAL_FORUM', [
          observation('a2', 'LOCAL_FORUM', 'forum-a', ['outmigration_intent'], '2026-03-01T12:00:00Z'),
        ]),
      ],
    );

    const finding = record.discoveries[0];
    expect(finding.markerId).toBe('outmigration_intent');
    expect(finding.observationCount).toBe(2);
    expect(finding.uniqueProviders).toEqual(['forum-a', 'social-a']);
    expect(finding.sourceFamilies).toEqual(['LOCAL_FORUM', 'SOCIAL_PUBLIC']);
    expect(finding.sourceUrls).toHaveLength(2);
    expect(finding.firstObservedAt).toBe('2026-01-01T12:00:00.000Z');
    expect(finding.lastObservedAt).toBe('2026-03-01T12:00:00.000Z');
  });
});
