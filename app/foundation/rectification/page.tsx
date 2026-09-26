'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchDarkWindowSeeds,
  fetchSeedsForClocks,
  type EngineSeedCard,
} from '../../../lib/seen/darkCardSeeds';

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

type CardCalibration = {
  resonancePercent: number | null;
  fromAge: string;
};

type RectificationPhase = 'round1' | 'round2' | 'round3' | 'round4' | 'complete';

const RESONANCE_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const ROUND_DELTAS: Record<2 | 3 | 4, number> = { 2: 3, 3: 2, 4: 1 };

function clockToMinutes(clock: string) {
  const [h, m] = clock.split(':').map(Number);
  return h * 60 + m;
}

function minutesToClock(minutes: number) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Neighbor set [anchor−Δ, anchor, anchor+Δ] wrapped to 24h. */
function neighborClocksForDelta(anchorClock: string, deltaHours: number): string[] {
  const anchorMinutes = clockToMinutes(anchorClock);
  const delta = deltaHours * 60;
  return [
    minutesToClock(anchorMinutes - delta),
    minutesToClock(anchorMinutes),
    minutesToClock(anchorMinutes + delta),
  ];
}

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

function emptyCalibrations(count: number): CardCalibration[] {
  return Array.from({ length: count }, () => ({ resonancePercent: null, fromAge: '' }));
}

function placeLabelFor(birth: StoredBirth): string {
  const city = birth.city!;
  return birth.birthLocation?.trim() || `${city.name}, ${city.country}`;
}

export default function RectificationPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [cards, setCards] = useState<EngineSeedCard[]>([]);
  const [calibrations, setCalibrations] = useState<CardCalibration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<RectificationPhase>('round1');
  const [pickedRunId, setPickedRunId] = useState<string | null>(null);
  const [narrowingMessage, setNarrowingMessage] = useState('');
  const [roundHistory, setRoundHistory] = useState<Array<Record<string, unknown>>>([]);
  const [regenerateToken, setRegenerateToken] = useState(0);
  /** Prevents Round-1 useEffect from wiping Round-2 while neighbor cards load. */
  const phaseRef = useRef<RectificationPhase>(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const raw = sessionStorage.getItem('seen.foundation.birth');
    if (!raw) {
      router.replace('/foundation/birth');
      return;
    }

    let cancelled = false;

    async function hydrateBirth() {
      try {
        const parsed = JSON.parse(raw!) as StoredBirth;
        let city = parsed.city;
        if (
          !city ||
          typeof city.latitude !== 'number' ||
          typeof city.longitude !== 'number'
        ) {
          const label = parsed.birthLocation?.trim() || '';
          if (!label) {
            if (!cancelled) {
              setError(
                'Birth place is missing coordinates. Return to The Mark or The Forge and choose a suggested city.',
              );
              setIsLoading(false);
            }
            return;
          }
          const resolved = await resolveCityFromLabel(label);
          if (!resolved) {
            if (!cancelled) {
              setError(
                `Could not resolve coordinates for “${label}”. Return to location intake and pick a suggested city.`,
              );
              setIsLoading(false);
            }
            return;
          }
          city = resolved;
          const next = { ...parsed, city };
          sessionStorage.setItem('seen.foundation.birth', JSON.stringify(next));
          if (!cancelled) {
            setBirth(next);
            }
          return;
        }

        if (!cancelled) {
          setBirth({ ...parsed, city });
        }
      } catch {
        if (!cancelled) router.replace('/foundation/birth');
      }
    }

    hydrateBirth();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!birth?.city) return;
    // Critical: do not reload Round-1 while Round-2 is active (neighbor fetch / cards).
    // "Back to Round 1" sets phase to round1 before bumping regenerateToken.
    if (phaseRef.current !== 'round1') return;

    let cancelled = false;

    async function loadRound1() {
      setIsLoading(true);
      setError('');
      setCards([]);
      setCalibrations([]);
      setPhase('round1');
      setPickedRunId(null);
      setNarrowingMessage('');
      setRoundHistory([]);

      const { name, birthDate, city, livedStack } = birth!;
      const placeLabel = placeLabelFor(birth!);

      try {
        // PRIMARY Round-1 path: real Swiss dark-windows (not LLM scenarios).
        const seeds = await fetchDarkWindowSeeds({
          name,
          birthDate,
          latitude: city!.latitude,
          longitude: city!.longitude,
          birthPlaceLabel: placeLabel,
          livedStack,
        });

        if (cancelled) return;
        if (seeds.length < 3) {
          throw new Error('Chart engine returned fewer than three dark windows.');
        }

        setCards(seeds.slice(0, 3));
        setCalibrations(emptyCalibrations(Math.min(3, seeds.length)));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not build recognition summaries.');
          setCards([]);
          setCalibrations([]);
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

  const allCalibrated = useMemo(() => {
    if (cards.length < 3 || calibrations.length < 3) return false;
    return calibrations.every(
      (c) => c.resonancePercent !== null && c.fromAge.trim().length > 0,
    );
  }, [cards, calibrations]);

  function setResonance(index: number, value: number) {
    setCalibrations((current) =>
      current.map((entry, i) =>
        i === index ? { ...entry, resonancePercent: value } : entry,
      ),
    );
  }

  function setFromAge(index: number, value: string) {
    setCalibrations((current) =>
      current.map((entry, i) => (i === index ? { ...entry, fromAge: value } : entry)),
    );
  }

  function pickUniqueMaxWinner(): {
    card: EngineSeedCard;
    index: number;
    resonance: number;
    fromAge: string;
  } | null {
    if (!allCalibrated || cards.length < 3) return null;

    const scored = cards.map((card, index) => ({
      card,
      index,
      resonance: calibrations[index]?.resonancePercent ?? 0,
      fromAge: calibrations[index]?.fromAge.trim() ?? '',
    }));

    const max = Math.max(...scored.map((s) => s.resonance));
    const winners = scored.filter((s) => s.resonance === max);

    if (max === 0) {
      setError(
        'None of these summaries registered. Adjust resonance, or regenerate for a fresh set.',
      );
      return null;
    }

    if (winners.length !== 1) {
      setError(
        'Two or more cards share the highest resonance. Change one rating so a single recognition leads, or regenerate.',
      );
      return null;
    }

    return winners[0];
  }

  function roundRecord(round: number, winner: ReturnType<typeof pickUniqueMaxWinner>) {
    if (!winner) return null;
    return {
      round,
      method: 'engine-dark-windows-pressure-prose',
      pickedRunId: winner.card.runId,
      clocksMeta: cards.map((card, index) => ({
        runId: card.runId,
        clock: card.clock,
        resonancePercent: calibrations[index]?.resonancePercent ?? null,
        fromAge: calibrations[index]?.fromAge.trim() ?? '',
      })),
      pickedClock: winner.card.clock,
      pickedResonancePercent: winner.resonance,
      pickedFromAge: winner.fromAge,
    };
  }

  async function continueRound(round: 1 | 2 | 3 | 4) {
    const winner = pickUniqueMaxWinner();
    if (!winner || !birth?.city) return;

    setError('');
    setPickedRunId(winner.card.runId);

    const record = roundRecord(round, winner);
    const nextHistory = record ? [...roundHistory, record] : roundHistory;
    setRoundHistory(nextHistory);

    sessionStorage.setItem('seen.foundation.chartResult', JSON.stringify(winner.card.chart));
    sessionStorage.setItem(
      'seen.foundation.rectification',
      JSON.stringify({
        round,
        method: 'engine-dark-windows-pressure-prose',
        pickedRunId: winner.card.runId,
        pickedClock: winner.card.clock,
        pickedResonancePercent: winner.resonance,
        pickedFromAge: winner.fromAge,
        rounds: nextHistory,
        locked: round === 4,
      }),
    );

    if (round === 4) {
      sessionStorage.removeItem('seen.foundation.rectification.narrowingStub');
      setNarrowingMessage('Recognition locked.');
      setPhase('complete');
      return;
    }

    const nextRound = (round + 1) as 2 | 3 | 4;
    const deltaHours = ROUND_DELTAS[nextRound];
    const anchorClock = winner.card.clock ?? '12:00';
    const neighborClocks = neighborClocksForDelta(anchorClock, deltaHours);

    setPhase(`round${nextRound}` as RectificationPhase);
    setIsLoading(true);
    setCards([]);
    setCalibrations([]);
    setNarrowingMessage('');

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
        neighborClocks,
      );

      if (seeds.length < 3) {
        throw new Error(`Chart engine returned fewer than three Round-${nextRound} neighbor summaries.`);
      }

      setCards(seeds.slice(0, 3));
      setCalibrations(emptyCalibrations(3));
      setPickedRunId(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Could not build Round-${nextRound} recognition summaries.`,
      );
      setCards([]);
      setCalibrations([]);
    } finally {
      setIsLoading(false);
    }
  }

  function backToRound1() {
    setPhase('round1');
    setRegenerateToken((v) => v + 1);
  }

  const showingCards =
    !isLoading && phase !== 'complete' && cards.length > 0;

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="rectification-title">
        <div className="seenProgress" aria-label="Foundation progress">
          <span className="seenProgressLabel">Foundation</span>
          <span className="seenProgressValue">04</span>
        </div>

        <header className="seenFlowHeader">
          <h1 id="rectification-title" className="seenDisplayLarge">
            Resonance
          </h1>

          <p className="seenFlowIntroduction">
            Say how much of each you can see yourself in, and from what age it
            started to feel true. The calculation stays backstage.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>


        {isLoading && (
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
            {phase === 'round1' && (
              <button
                type="button"
                className="seenButtonPrimary"
                style={{ marginTop: '1rem' }}
                onClick={() => setRegenerateToken((v) => v + 1)}
              >
                Regenerate summaries
              </button>
            )}
            {phase !== 'round1' && phase !== 'complete' && (
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
            {cards.map((card, index) => {
              const cal = calibrations[index] ?? {
                resonancePercent: null,
                fromAge: '',
              };
              return (
                <section className="seenPanel" key={card.runId}>
                  <span className="seenLabel">Recognition {index + 1}</span>
                  {/* TODO (HARD LAW): paragraph is temporary screen text, not the recognition contract. Render PORTAL_EXTRACTION_FIELDS. Do not fold modalities. */}
                  <p className="seenFlowIntroduction">{card.paragraph}</p>

                  <div className="seenDivider" aria-hidden="true" />

                  <span className="seenLabel">
                    How much of this can you see yourself in?
                  </span>
                  <div
                    role="group"
                    aria-label={`Resonance for recognition ${index + 1}`}
                    style={{
                      display: 'flex',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                      marginTop: '0.5rem',
                    }}
                  >
                    {RESONANCE_STEPS.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          cal.resonancePercent === value
                            ? 'seenButtonPrimary'
                            : 'seenPanel'
                        }
                        onClick={() => setResonance(index, value)}
                        aria-pressed={cal.resonancePercent === value}
                        style={{
                          cursor: 'pointer',
                          minWidth: '3.25rem',
                          padding: '0.55rem 0.65rem',
                        }}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>

                  <label style={{ display: 'block', marginTop: '1.25rem' }}>
                    <span className="seenLabel">From what age?</span>
                    <input
                      type="text"
                      className="seenForgeInput"
                      placeholder="e.g. 14 or 12–16"
                      value={cal.fromAge}
                      onChange={(event) => setFromAge(index, event.target.value)}
                      style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
                      autoComplete="off"
                    />
                  </label>
                </section>
              );
            })}

            <button
              className="seenButtonPrimary"
              type="button"
              disabled={!allCalibrated}
              onClick={() => continueRound(phase === 'round1' ? 1 : phase === 'round2' ? 2 : phase === 'round3' ? 3 : 4)}
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {!isLoading && phase === 'complete' && (
          <section className="seenPanel">
            <span className="seenLabel">Recognition locked</span>
            <p className="seenFlowIntroduction">{narrowingMessage}</p>
            <div className="seenDivider" aria-hidden="true" />
            <button
              type="button"
              className="seenButtonPrimary"
              onClick={backToRound1}
            >
              Start over
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
