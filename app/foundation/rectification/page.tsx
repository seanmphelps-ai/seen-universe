'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { NatalChartResult } from '../../../lib/natalChart';
import { useRouter } from 'next/navigation';
import {
  fetchDarkWindowSeeds,
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
  knownCivilTime?: string;
  knownTimeLabel?: string;
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

const RESONANCE_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const ROUND_DELTAS_HOURS = [3, 2, 1] as const;

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

export default function RectificationPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [cards, setCards] = useState<EngineSeedCard[]>([]);
  const [calibrations, setCalibrations] = useState<CardCalibration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<'round1' | 'narrowing-stub'>('round1');
  const [pickedRunId, setPickedRunId] = useState<string | null>(null);
  const [narrowingMessage, setNarrowingMessage] = useState('');
  const [regenerateToken, setRegenerateToken] = useState(0);
  const [knownCivilTime, setKnownCivilTime] = useState('');
  const [knownTimeLoading, setKnownTimeLoading] = useState(false);

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
            setKnownCivilTime(next.knownCivilTime ?? '');
          }
          return;
        }

        if (!cancelled) {
          setBirth({ ...parsed, city });
          setKnownCivilTime(parsed.knownCivilTime ?? '');
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

    let cancelled = false;

    async function loadRound1() {
      setIsLoading(true);
      setError('');
      setCards([]);
      setCalibrations([]);
      setPhase('round1');
      setPickedRunId(null);
      setNarrowingMessage('');

      const { name, birthDate, city, livedStack, birthLocation } = birth!;
      const placeLabel =
        birthLocation?.trim() || `${city!.name}, ${city!.country}`;

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
          setError(err instanceof Error ? err.message : 'Could not build recognition cards.');
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

  function continueFromRound1() {
    if (!allCalibrated || cards.length < 3) return;

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
      return;
    }

    if (winners.length !== 1) {
      setError(
        'Two or more cards share the highest resonance. Change one rating so a single recognition leads, or regenerate.',
      );
      return;
    }

    const winner = winners[0];
    setError('');
    setPickedRunId(winner.card.runId);

    const clocksMeta = cards.map((card, index) => ({
      runId: card.runId,
      clock: card.clock,
      resonancePercent: calibrations[index]?.resonancePercent ?? null,
      fromAge: calibrations[index]?.fromAge.trim() ?? '',
    }));

    const knownTime = knownCivilTime.trim();
    sessionStorage.setItem('seen.foundation.chartResult', JSON.stringify(winner.card.chart));
    sessionStorage.setItem(
      'seen.foundation.rectification',
      JSON.stringify({
        round: 1,
        method: 'engine-dark-windows-pressure-prose',
        pickedRunId: winner.card.runId,
        // Clocks in metadata only — never on card faces.
        clocksMeta,
        pickedClock: winner.card.clock,
        pickedResonancePercent: winner.resonance,
        pickedFromAge: winner.fromAge,
        ...(knownTime
          ? {
              knownCivilTime: knownTime,
              knownTimeLabel: 'known time — not rectified',
            }
          : {}),
      }),
    );

    // Stub narrowing ±3 / ±2 / ±1 — no dead-end after cards render.
    const anchorClock = winner.card.clock ?? '12:00';
    const anchorMinutes = clockToMinutes(anchorClock);
    const stubPlan = ROUND_DELTAS_HOURS.map((hours) => {
      const delta = hours * 60;
      return {
        hours,
        neighbors: [
          minutesToClock(anchorMinutes - delta),
          minutesToClock(anchorMinutes),
          minutesToClock(anchorMinutes + delta),
        ],
      };
    });

    setNarrowingMessage(
      `Recognition locked for Round 1. Next narrowing (±3h / ±2h / ±1h) is stubbed for this ship slice — three anonymous cards per step, clocks stay in metadata. Planned neighbor sets are ready when Round 2 wires in.`,
    );
    sessionStorage.setItem(
      'seen.foundation.rectification.narrowingStub',
      JSON.stringify({ anchorClock, stubPlan }),
    );
    setPhase('narrowing-stub');
  }

  async function lockKnownTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!birth?.city || !/^\d{2}:\d{2}$/.test(knownCivilTime) || knownTimeLoading) return;
    setKnownTimeLoading(true);
    setError('');
    try {
      const response = await fetch('/api/seen/chart-engine/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birth.name,
          birthDate: birth.birthDate,
          latitude: birth.city.latitude,
          longitude: birth.city.longitude,
          birthPlaceLabel: `${birth.city.name}, ${birth.city.country}`,
          livedStack: birth.livedStack,
          clock: knownCivilTime,
          mode: 'single',
        }),
      });
      const payload = (await response.json().catch(() => null)) as { chart?: NatalChartResult; error?: string } | null;
      if (!response.ok || !payload?.chart) throw new Error(payload?.error || 'Known time could not be calculated.');
      sessionStorage.setItem('seen.foundation.chartResult', JSON.stringify(payload.chart));
      sessionStorage.setItem('seen.foundation.rectification', JSON.stringify({
        method: 'known-time-not-rectified',
        knownCivilTime,
        knownTimeLabel: 'known time — not rectified',
      }));
      setPickedRunId(null);
      setNarrowingMessage('Known time held. This foundation was calculated directly and was not rectified through the cards.');
      setPhase('narrowing-stub');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Known time could not be calculated.');
    } finally {
      setKnownTimeLoading(false);
    }
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
            Three anonymous pressure summaries. Say how much of each you can see
            yourself in, and from what age it started to feel true. No clock on
            the card.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>

        {phase === 'round1' && (
          <form className="seenPanel" style={{ marginBottom: '1.25rem' }} onSubmit={lockKnownTime}>
            <label>
              <span className="seenLabel">known time — not rectified</span>
              <input
                className="seenForgeInput"
                type="time"
                value={knownCivilTime}
                onChange={(event) => setKnownCivilTime(event.target.value)}
                style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
              />
            </label>
            <p className="seenFieldSupport" style={{ marginTop: '0.5rem' }}>
              Optional. Calculates one civil clock directly — known time — not rectified.
            </p>
            <button className="seenButtonSecondary" type="submit" disabled={!knownCivilTime || knownTimeLoading} style={{ marginTop: '0.75rem' }}>
              {knownTimeLoading ? 'Calculating…' : 'Use known time'}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}

        {isLoading && (
          <section className="seenPanel">
            <p className="seenFieldSupport">Building pressure cards from the sky…</p>
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
                Regenerate cards
              </button>
            )}
          </section>
        )}

        {!isLoading && phase === 'round1' && cards.length > 0 && (
          <div className="seenFlowForm">
            {cards.map((card, index) => {
              const cal = calibrations[index] ?? {
                resonancePercent: null,
                fromAge: '',
              };
              return (
                <section className="seenPanel" key={card.runId}>
                  <span className="seenLabel">Recognition {index + 1}</span>
                  <p className="seenFlowIntroduction">{card.paragraph}</p>

                  <div className="seenDivider" aria-hidden="true" />

                  <span className="seenLabel">
                    How much of this summary can you see yourself in?
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
              onClick={continueFromRound1}
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {!isLoading && phase === 'narrowing-stub' && (
          <section className="seenPanel">
            <span className="seenLabel">Foundation held</span>
            <p className="seenFlowIntroduction">{narrowingMessage}</p>
            {pickedRunId && (
              <p className="seenFieldSupport">Pick stored. Narrowing ±3 / ±2 / ±1 comes next.</p>
            )}
            <div className="seenDivider" aria-hidden="true" />
            <button
              type="button"
              className="seenButtonPrimary"
              onClick={() => setRegenerateToken((v) => v + 1)}
            >
              Back to Round 1
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
