'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NatalChartInput, NatalChartResult } from '../../../lib/natalChart';
import type { RectificationScenarioResponse } from '../../../lib/rectification/schema';

type StoredBirth = {
  name: string;
  birthDate: string;
  city: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
};

type Candidate = {
  minutes: number;
  chart: NatalChartResult;
};

type Ratings = Record<string, number>;

const INITIAL_MINUTES = [4 * 60, 12 * 60, 20 * 60];
const ROUND_DELTAS = [180, 90, 30];
const RATING_OPTIONS = [0, 25, 50, 75, 100];

function normalizeMinutes(value: number) {
  return ((value % 1440) + 1440) % 1440;
}

function toBirthTime(minutes: number) {
  const normalized = normalizeMinutes(minutes);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function candidateMinutes(round: number, anchor: number | null) {
  if (round === 0 || anchor === null) return INITIAL_MINUTES;
  const delta = ROUND_DELTAS[Math.min(round - 1, ROUND_DELTAS.length - 1)];
  return [anchor - delta, anchor, anchor + delta].map(normalizeMinutes);
}

function ratingKey(scenarioIndex: number, candidateIndex: number) {
  return `${scenarioIndex}:${candidateIndex}`;
}

export default function RectificationPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [round, setRound] = useState(0);
  const [anchor, setAnchor] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [scenarios, setScenarios] = useState<RectificationScenarioResponse['scenarios']>([]);
  const [ratings, setRatings] = useState<Ratings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [regenerateToken, setRegenerateToken] = useState(0);
  const [history, setHistory] = useState<Array<{ round: number; scores: number[] }>>([]);

  const minutes = useMemo(() => candidateMinutes(round, anchor), [round, anchor]);

  useEffect(() => {
    const raw = sessionStorage.getItem('seen.foundation.birth');
    if (!raw) {
      router.replace('/foundation/birth');
      return;
    }

    try {
      setBirth(JSON.parse(raw) as StoredBirth);
    } catch {
      router.replace('/foundation/birth');
    }
  }, [router]);

  useEffect(() => {
    if (!birth) return;
    const { name, birthDate, city } = birth;

    let cancelled = false;

    async function loadRound() {
      setIsLoading(true);
      setError('');
      setRatings({});
      setScenarios([]);

      try {
        const chartCandidates = await Promise.all(
          minutes.map(async (candidateMinute) => {
            const chartInput: NatalChartInput = {
              name,
              birthDate,
              birthTime: toBirthTime(candidateMinute),
              latitude: city.latitude,
              longitude: city.longitude,
            };

            const response = await fetch('/api/chart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(chartInput),
            });

            if (!response.ok) {
              const body = await response.json().catch(() => null);
              throw new Error(body?.error || 'Could not calculate the candidate charts.');
            }

            return {
              minutes: candidateMinute,
              chart: (await response.json()) as NatalChartResult,
            };
          }),
        );

        const scenarioResponse = await fetch('/api/rectification/scenarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            round,
            candidates: chartCandidates.map((candidate, index) => ({
              index,
              chart: candidate.chart,
            })),
          }),
        });

        if (!scenarioResponse.ok) {
          const body = await scenarioResponse.json().catch(() => null);
          throw new Error(body?.error || 'Could not generate the behavioral scenarios.');
        }

        const generated = (await scenarioResponse.json()) as RectificationScenarioResponse;

        if (!cancelled) {
          setCandidates(chartCandidates);
          setScenarios(generated.scenarios);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not build this round.');
          setCandidates([]);
          setScenarios([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadRound();

    return () => {
      cancelled = true;
    };
  }, [birth, minutes, round, regenerateToken]);

  const requiredRatings = scenarios.length * 3;
  const allRated = requiredRatings > 0 && Object.keys(ratings).length === requiredRatings;

  function setRating(scenarioIndex: number, candidateIndex: number, value: number) {
    setRatings((current) => ({
      ...current,
      [ratingKey(scenarioIndex, candidateIndex)]: value,
    }));
  }

  function continueRound() {
    if (!allRated || candidates.length !== 3) return;

    const scores = candidates.map((_, candidateIndex) => {
      const values = scenarios.map((_, scenarioIndex) => ratings[ratingKey(scenarioIndex, candidateIndex)] ?? 0);
      return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
    });

    const bestScore = Math.max(...scores);
    const winners = scores
      .map((score, index) => ({ score, index }))
      .filter((entry) => entry.score === bestScore);

    if (bestScore === 0 || winners.length !== 1) {
      setError(
        bestScore === 0
          ? 'None of these reactions fit. We’ll try a different set of scenarios.'
          : 'Two candidates are tied. We’ll ask a different set of scenarios to separate them.',
      );
      setRegenerateToken((value) => value + 1);
      return;
    }

    const winnerIndex = winners[0].index;
    const winner = candidates[winnerIndex];
    const nextHistory = [...history, { round: round + 1, scores }];
    setHistory(nextHistory);

    if (round >= 3) {
      sessionStorage.setItem(
        'seen.foundation.rectification',
        JSON.stringify({
          resolvedBirthTime: toBirthTime(winner.minutes),
          roundsCompleted: round + 1,
          method: 'llm-behavioral-scenario-ratings',
          ratings: nextHistory,
        }),
      );
      sessionStorage.setItem('seen.foundation.chartResult', JSON.stringify(winner.chart));
      router.push('/chart?source=rectification');
      return;
    }

    setAnchor(winner.minutes);
    setRound((value) => value + 1);
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="rectification-title">
        <div className="seenProgress" aria-label="Foundation progress">
          <span className="seenProgressLabel">Foundation</span>
          <span className="seenProgressValue">03</span>
        </div>

        <header className="seenFlowHeader">
          <h1 id="rectification-title" className="seenDisplayLarge">
            Recognition
          </h1>

          <p className="seenFlowIntroduction">
            Great. We’re going to give you a few different situations. Tell us how true each reaction is of this person.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>

        {isLoading && (
          <section className="seenPanel">
            <p className="seenFieldSupport">Building the next situations…</p>
          </section>
        )}

        {error && !isLoading && (
          <section className="seenPanel">
            <p className="seenFormError" role="alert">{error}</p>
          </section>
        )}

        {!isLoading && scenarios.length > 0 && (
          <div className="seenFlowForm">
            {scenarios.map((scenario, scenarioIndex) => (
              <section className="seenPanel" key={`${round}-${scenarioIndex}`}>
                <span className="seenLabel">Situation {scenarioIndex + 1}</span>
                <p className="seenFlowIntroduction">{scenario.scenario}</p>
                <div className="seenDivider" aria-hidden="true" />

                {scenario.reactions
                  .slice()
                  .sort((a, b) => a.candidateIndex - b.candidateIndex)
                  .map((reaction, reactionIndex) => {
                    const key = ratingKey(scenarioIndex, reaction.candidateIndex);
                    const selected = ratings[key];

                    return (
                      <div key={key} style={{ marginTop: reactionIndex === 0 ? 0 : '1.5rem' }}>
                        <p className="seenFieldSupport" style={{ marginBottom: '0.75rem' }}>
                          {reaction.reaction}
                        </p>
                        <span className="seenLabel">How true is this of the person?</span>
                        <div
                          role="group"
                          aria-label={`Rate reaction ${reactionIndex + 1} for situation ${scenarioIndex + 1}`}
                          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}
                        >
                          {RATING_OPTIONS.map((value) => (
                            <button
                              key={value}
                              type="button"
                              className={selected === value ? 'seenButtonPrimary' : 'seenPanel'}
                              onClick={() => setRating(scenarioIndex, reaction.candidateIndex, value)}
                              aria-pressed={selected === value}
                              style={{
                                cursor: 'pointer',
                                minWidth: '3.5rem',
                                padding: '0.6rem 0.75rem',
                              }}
                            >
                              {value}%
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </section>
            ))}

            <button
              className="seenButtonPrimary"
              type="button"
              disabled={!allRated}
              onClick={continueRound}
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
