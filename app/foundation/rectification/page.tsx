'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BIRTH_RECORD_KEY,
  INTAKE_DECK_HREF,
  RECTIFICATION_RECORD_KEY,
} from '../../../lib/foundation/intakeDeck';
import {
  fetchSeedsForClocks,
  type EngineSeedCard,
} from '../../../lib/seen/darkCardSeeds';
import {
  clocksForRound,
  type NarrowingRound,
} from '../../../lib/rectification/timeNarrowing';

type PlaceCity = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type StoredBirth = {
  name: string;
  birthDate: string;
  birthLocation?: string;
  city?: PlaceCity;
  livedStack?: string;
};

type CitySuggestion = {
  label: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type RectificationPhase = 'round1' | 'round2' | 'round3' | 'round4' | 'complete';

async function resolveCityFromLabel(query: string): Promise<PlaceCity | null> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  const candidates = [trimmed];
  const beforeComma = trimmed.split(',')[0]?.trim();
  if (beforeComma && beforeComma.length >= 2 && beforeComma.toLowerCase() !== trimmed.toLowerCase()) {
    candidates.push(beforeComma);
  }

  let best: CitySuggestion | null = null;

  for (const q of candidates) {
    const response = await fetch(`/api/location/suggest/?q=${encodeURIComponent(q)}`);
    if (!response.ok) continue;
    const data = (await response.json()) as { suggestions?: CitySuggestion[] };
    const suggestions = data.suggestions ?? [];
    if (suggestions.length === 0) continue;

    const exactLabel = suggestions.find(
      (s) => s.label.toLowerCase() === trimmed.toLowerCase(),
    );
    const startsLabel = suggestions.find(
      (s) =>
        trimmed.toLowerCase().startsWith(s.label.toLowerCase()) ||
        s.label.toLowerCase().startsWith(trimmed.toLowerCase()) ||
        s.city.toLowerCase() === (beforeComma ?? '').toLowerCase(),
    );
    best = exactLabel ?? startsLabel ?? suggestions[0];
    break;
  }

  if (!best) return null;
  return {
    name: best.city,
    country: best.country,
    latitude: best.latitude,
    longitude: best.longitude,
  };
}

function placeLabelFor(birth: StoredBirth): string {
  const city = birth.city!;
  return birth.birthLocation?.trim() || `${city.name}, ${city.country}`;
}

function phaseRound(phase: RectificationPhase): NarrowingRound {
  if (phase === 'round2') return 2;
  if (phase === 'round3') return 3;
  if (phase === 'round4') return 4;
  return 1;
}

export default function RectificationPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [cards, setCards] = useState<EngineSeedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<RectificationPhase>('round1');
  const [pickedRunId, setPickedRunId] = useState<string | null>(null);
  const [lockedMessage, setLockedMessage] = useState('');
  const [roundHistory, setRoundHistory] = useState<Array<Record<string, unknown>>>([]);
  const [regenerateToken, setRegenerateToken] = useState(0);
  const phaseRef = useRef<RectificationPhase>(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const raw = sessionStorage.getItem(BIRTH_RECORD_KEY);
    if (!raw) {
      router.replace(INTAKE_DECK_HREF.mark);
      return;
    }

    let cancelled = false;

    async function hydrateBirth() {
      try {
        const parsed = JSON.parse(raw!) as StoredBirth;
        if (!parsed.birthDate) {
          if (!cancelled) router.replace(INTAKE_DECK_HREF.mark);
          return;
        }
        let city = parsed.city;
        if (
          !city ||
          typeof city.latitude !== 'number' ||
          typeof city.longitude !== 'number'
        ) {
          const label = parsed.birthLocation?.trim() || '';
          if (!label) {
            if (!cancelled) {
              setError('Birth place is missing coordinates. Return and choose a suggested city.');
              setIsLoading(false);
            }
            return;
          }
          const resolved = await resolveCityFromLabel(label);
          if (!resolved) {
            if (!cancelled) {
              setError(`Could not resolve coordinates for “${label}”. Return and pick a suggested city.`);
              setIsLoading(false);
            }
            return;
          }
          city = resolved;
          const next = { ...parsed, city };
          sessionStorage.setItem(BIRTH_RECORD_KEY, JSON.stringify(next));
          if (!cancelled) setBirth(next);
          return;
        }

        if (!cancelled) setBirth({ ...parsed, city });
      } catch {
        if (!cancelled) router.replace(INTAKE_DECK_HREF.mark);
      }
    }

    hydrateBirth();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!birth?.city) return;
    if (phaseRef.current !== 'round1') return;

    let cancelled = false;

    async function loadRound1() {
      setIsLoading(true);
      setError('');
      setCards([]);
      setPhase('round1');
      setPickedRunId(null);
      setLockedMessage('');
      setRoundHistory([]);

      const { name, birthDate, city, livedStack } = birth!;

      try {
        const seeds = await fetchSeedsForClocks(
          {
            name,
            birthDate,
            latitude: city!.latitude,
            longitude: city!.longitude,
            birthPlaceLabel: placeLabelFor(birth!),
            livedStack,
          },
          clocksForRound(1),
        );

        if (cancelled) return;
        if (seeds.length < 3) {
          throw new Error('Chart engine returned fewer than three dark windows.');
        }

        setCards(seeds.slice(0, 3));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not build recognition summaries.');
          setCards([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadRound1();
    return () => {
      cancelled = true;
    };
  }, [birth, regenerateToken]);

  async function continueRound(round: NarrowingRound) {
    const winner = cards.find((card) => card.runId === pickedRunId);
    if (!winner || !birth?.city) {
      setError('Pick one summary.');
      return;
    }
    if (!winner.clock) {
      setError('A picked summary is missing its hidden clock.');
      return;
    }

    setError('');

    const record = {
      round,
      method: 'engine-dark-windows-pressure-prose',
      pickedRunId: winner.runId,
      pickedClock: winner.clock,
    };
    const nextHistory = [...roundHistory, record];
    setRoundHistory(nextHistory);

    sessionStorage.setItem('seen.foundation.chartResult', JSON.stringify(winner.chart));
    sessionStorage.setItem(
      RECTIFICATION_RECORD_KEY,
      JSON.stringify({
        round,
        method: 'engine-dark-windows-pressure-prose',
        pickedRunId: winner.runId,
        pickedClock: winner.clock,
        rounds: nextHistory,
        locked: round === 4,
      }),
    );

    if (round === 4) {
      sessionStorage.removeItem('seen.foundation.rectification.narrowingStub');
      setLockedMessage('Recognition locked.');
      setPhase('complete');
      setCards([]);
      return;
    }

    const nextRound = (round + 1) as Exclude<NarrowingRound, 1>;
    let neighborSet: string[];
    try {
      neighborSet = clocksForRound(nextRound, winner.clock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not narrow this pick.');
      return;
    }

    setPhase(`round${nextRound}` as RectificationPhase);
    setIsLoading(true);
    setCards([]);
    setPickedRunId(null);

    try {
      const seeds = await fetchSeedsForClocks(
        {
          name: birth.name,
          birthDate: birth.birthDate,
          latitude: birth.city.latitude,
          longitude: birth.city.longitude,
          birthPlaceLabel: placeLabelFor(birth),
          livedStack: birth.livedStack,
        },
        neighborSet,
      );

      if (seeds.length < 3) {
        throw new Error('Chart engine returned fewer than three neighboring summaries.');
      }

      setCards(seeds.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build the next summaries.');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }

  function backToRound1() {
    setPhase('round1');
    setRegenerateToken((value) => value + 1);
  }

  const showingCards = !isLoading && phase !== 'complete' && cards.length > 0;
  const round = phaseRound(phase);

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <section className="seenPanel seenFlowForm" aria-labelledby="rectification-title">
        <h1 id="rectification-title">pressure</h1>
        {phase !== 'complete' && (
          <p className="seenFieldSupport">
            {phase === 'round1'
              ? 'Three anonymous summaries. Pick the one you recognize.'
              : 'Three neighboring summaries. Pick the one you recognize.'}
          </p>
        )}

        {isLoading && birth && (
          <section className="seenPanel">
            <p className="seenFieldSupport">
              {phase === 'round1'
                ? 'Building pressure summaries…'
                : 'Narrowing — building three neighboring pressure summaries…'}
            </p>
          </section>
        )}

        {error && !isLoading && (
          <section className="seenPanel">
            <p className="seenFormError" role="alert">
              {error}
            </p>
            {phase === 'round1' ? (
              <button
                type="button"
                className="seenButtonPrimary"
                style={{ marginTop: '1rem' }}
                onClick={() => setRegenerateToken((value) => value + 1)}
              >
                Regenerate summaries
              </button>
            ) : (
              <button
                type="button"
                className="seenButtonPrimary"
                style={{ marginTop: '1rem' }}
                onClick={backToRound1}
              >
                Back to Round 1
              </button>
            )}
          </section>
        )}

        {showingCards && (
          <div className="seenFlowForm">
            <div role="radiogroup" aria-label="Pressure summaries" style={{ display: 'grid', gap: '1.5rem' }}>
              {cards.map((card, index) => {
                const selected = pickedRunId === card.runId;
                return (
                  <button
                    key={card.runId}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={selected ? 'seenPanel seenPickCard isSelected' : 'seenPanel seenPickCard'}
                    onClick={() => {
                      setPickedRunId(card.runId);
                      setError('');
                    }}
                  >
                    <span className="seenLabel">Summary {index + 1}</span>
                    <p className="seenFlowIntroduction">{card.paragraph}</p>
                  </button>
                );
              })}
            </div>
            <button
              className="seenButtonPrimary"
              type="button"
              disabled={!pickedRunId}
              onClick={() => continueRound(round)}
            >
              This one
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {!isLoading && phase === 'complete' && (
          <section className="seenPanel">
            <span className="seenLabel">Recognition locked</span>
            <p className="seenFlowIntroduction">{lockedMessage}</p>
            <div className="seenDivider" aria-hidden="true" />
            <Link className="seenButtonPrimary" href={INTAKE_DECK_HREF.reveal}>
              Reveal
            </Link>
            <button type="button" className="seenButtonSecondary" onClick={backToRound1}>
              Start over
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
