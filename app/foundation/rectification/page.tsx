'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NatalChartInput, NatalChartResult } from '../../../lib/natalChart';

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

const INITIAL_MINUTES = [4 * 60, 12 * 60, 20 * 60];
const ROUND_DELTAS = [180, 90, 30];

const HOUSE_DOMAINS: Record<number, string> = {
  1: 'identity and immediate response',
  2: 'security, resources, and self-worth',
  3: 'communication and everyday movement',
  4: 'home, roots, and private life',
  5: 'creativity, pleasure, and self-expression',
  6: 'work, routines, and daily demands',
  7: 'partnership and one-to-one relationships',
  8: 'intimacy, trust, loss, and shared resources',
  9: 'belief, meaning, travel, and perspective',
  10: 'public role, responsibility, and direction',
  11: 'community, friendship, and future aims',
  12: 'private processing, retreat, and what stays hidden',
};

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

function summarize(chart: NatalChartResult): string[] {
  const counts = new Map<number, number>();
  for (const planet of chart.planets) {
    if (planet.house === null) continue;
    counts.set(planet.house, (counts.get(planet.house) ?? 0) + 1);
  }

  const strongestHouses = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 2)
    .map(([house]) => HOUSE_DOMAINS[house]);

  const moon = chart.planets.find((planet) => planet.key === 'moon');
  const mars = chart.planets.find((planet) => planet.key === 'mars');
  const saturn = chart.planets.find((planet) => planet.key === 'saturn');
  const pluto = chart.planets.find((planet) => planet.key === 'pluto');
  const tightAspect = [...chart.aspects].sort((a, b) => a.orb - b.orb)[0];

  const lines: string[] = [];

  if (strongestHouses.length) {
    lines.push(`The strongest concentration falls around ${strongestHouses.join(' and ')}.`);
  }

  if (moon?.house) {
    lines.push(`Emotional processing is centered in ${HOUSE_DOMAINS[moon.house]}.`);
  }

  const pressurePieces = [
    mars?.house ? `drive and conflict around ${HOUSE_DOMAINS[mars.house]}` : null,
    saturn?.house ? `pressure and restraint around ${HOUSE_DOMAINS[saturn.house]}` : null,
    pluto?.house ? `intensity and transformation around ${HOUSE_DOMAINS[pluto.house]}` : null,
  ].filter(Boolean) as string[];

  if (pressurePieces.length) {
    lines.push(`This version places ${pressurePieces.join('; ')}.`);
  }

  if (tightAspect) {
    lines.push(`One of its tightest internal relationships is ${tightAspect.point1} ${tightAspect.aspect.toLowerCase()} ${tightAspect.point2}.`);
  }

  if (chart.ascendant) {
    lines.push(`Its outward orientation begins through ${chart.ascendant.sign}.`);
  }

  return lines.slice(0, 4);
}

export default function RectificationPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [round, setRound] = useState(0);
  const [anchor, setAnchor] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

    let cancelled = false;

    async function loadCandidates() {
      setIsLoading(true);
      setError('');

      try {
        const results = await Promise.all(
          minutes.map(async (candidateMinute) => {
            const chartInput: NatalChartInput = {
              name: birth.name,
              birthDate: birth.birthDate,
              birthTime: toBirthTime(candidateMinute),
              latitude: birth.city.latitude,
              longitude: birth.city.longitude,
            };

            const response = await fetch('/api/chart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(chartInput),
            });

            if (!response.ok) {
              const body = await response.json().catch(() => null);
              throw new Error(body?.error || 'Could not build the summaries.');
            }

            return {
              minutes: candidateMinute,
              chart: (await response.json()) as NatalChartResult,
            };
          }),
        );

        if (!cancelled) setCandidates(results);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not build the summaries.');
          setCandidates([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCandidates();

    return () => {
      cancelled = true;
    };
  }, [birth, minutes]);

  function choose(candidate: Candidate) {
    const finalRound = round >= 3;

    if (finalRound) {
      sessionStorage.setItem(
        'seen.foundation.rectification',
        JSON.stringify({
          resolvedBirthTime: toBirthTime(candidate.minutes),
          roundsCompleted: round + 1,
          method: 'behavioral-summary-narrowing',
        }),
      );
      sessionStorage.setItem('seen.foundation.chartResult', JSON.stringify(candidate.chart));
      router.push('/chart?source=rectification');
      return;
    }

    setAnchor(candidate.minutes);
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
            Great. We’re going to give you a few summaries. Let us know which one resonates with you the most.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>

        {isLoading && (
          <section className="seenPanel">
            <p className="seenFieldSupport">Building the next three summaries…</p>
          </section>
        )}

        {error && (
          <section className="seenPanel">
            <p className="seenFormError" role="alert">{error}</p>
          </section>
        )}

        {!isLoading && !error && (
          <div className="seenFlowForm">
            {candidates.map((candidate, index) => (
              <button
                key={`${round}-${candidate.minutes}`}
                type="button"
                className="seenPanel"
                onClick={() => choose(candidate)}
                style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
                aria-label={`Choose summary ${index + 1}`}
              >
                <span className="seenLabel">Summary {String.fromCharCode(65 + index)}</span>
                <div className="seenDivider" aria-hidden="true" />
                {summarize(candidate.chart).map((line) => (
                  <p className="seenFieldSupport" key={line}>{line}</p>
                ))}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
