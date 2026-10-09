'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NatalChartResult } from '../../../lib/natalChart';

type StoredBirth = {
  name: string;
  birthDate: string;
  birthLocation?: string;
  city?: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  livedStack?: string;
  birthTime?: string | null;
  timeSource?: string;
  timeConfidence?: string;
  timeNotes?: string;
  rectificationRounds?: unknown;
  lockedClock?: string;
  pickedRunId?: string;
  pickedClock?: string;
  rounds?: unknown;
  locked?: boolean;
  method?: string;
  [key: string]: unknown;
};

type SeenRunResponse = {
  western?: NatalChartResult;
  westernPortalPenetration?: unknown;
  westernLifeSectionRouting?: unknown;
  locations?: unknown;
  locationV2?: unknown;
  error?: string;
};

function formatDegree(degree: number): string {
  const whole = Math.floor(degree);
  const minutes = Math.round((degree - whole) * 60);
  return `${whole}°${minutes.toString().padStart(2, '0')}'`;
}

function placementLine(label: string, sign: string, degree: number, house: number | null, retrograde: boolean): string {
  const parts = [label, `${formatDegree(degree)} ${sign}`];
  if (house !== null) parts.push(`House ${house}`);
  if (retrograde) parts.push('Rx');
  return parts.join(' — ');
}

export default function FoundationResultPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [chart, setChart] = useState<NatalChartResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('seen.foundation.chartResult') ?? sessionStorage.getItem('seen.foundation.birthResult') ?? sessionStorage.getItem('seen.foundation.birth');
    if (!raw) {
      router.replace('/chart' as any);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const parsed = JSON.parse(raw!) as StoredBirth;
        if (!parsed.city || typeof parsed.city.latitude !== 'number' || typeof parsed.city.longitude !== 'number') {
          if (!cancelled) {
            setError('Birth place is missing coordinates. Return to the intake and pick a suggested city.');
            setIsLoading(false);
          }
          return;
        }

        if (!cancelled) setBirth(parsed);

        const response = await fetch('/api/seen/run', {
          method: 'POST' as const,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chart: { name: parsed.name, birthDate: parsed.birthDate, birthTime: parsed.birthTime ?? null, latitude: parsed.city.latitude, longitude: parsed.city.longitude }, locations: [{ role: 'birth', label: parsed.birthLocation?.trim() || `${parsed.city.name}, ${parsed.city.country}`, latitude: parsed.city.latitude, longitude: parsed.city.longitude, exposureStart: parsed.birthDate }] }),
        });

        const payload = (await response.json().catch(() => null)) as SeenRunResponse | null;
        if (!response.ok) {
          throw new Error(payload?.error || 'Runtime failed.');
        }
        if (!payload?.western) {
          throw new Error('Runtime returned no Western chart.');
        }
        if (!cancelled) {
          setChart(payload.western);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load the chart.');
          setIsLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <section className="seenPanel seenFlowForm" aria-labelledby="result-title">
        <h1 id="result-title">the chart</h1>

        {isLoading && <p className="seenFieldSupport">Reading the full chart…</p>}

        {error && !isLoading && (
          <>
            <p className="seenFormError" role="alert">{error}</p>
            <button type="button" className="seenButtonPrimary" style={{ marginTop: '1rem' }} onClick={() => router.push('/chart' as any)}>
              Back to intake
            </button>
          </>
        )}

        {chart && !isLoading && (
          <>
            <p className="seenFieldSupport">
              {chart.name}
              {chart.hasBirthTime ? ` — birth time known, ${chart.timezone}` : ' — no birth time, houses and angles omitted'}
            </p>

            <div className="seenDivider" aria-hidden="true" />

            <section aria-labelledby="planets-title">
              <h2 id="planets-title" className="seenLabel">Planets</h2>
              <ul className="seenFlowIntroduction" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                {chart.planets.map((planet) => (
                  <li key={planet.key}>{placementLine(planet.label, planet.sign, planet.degreeInSign, planet.house, planet.retrograde)}</li>
                ))}
              </ul>
            </section>

            {(chart.ascendant || chart.midheaven) && (
              <>
                <div className="seenDivider" aria-hidden="true" />
                <section aria-labelledby="angles-title">
                  <h2 id="angles-title" className="seenLabel">Angles</h2>
                  <ul className="seenFlowIntroduction" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                    {chart.ascendant && <li>{placementLine(chart.ascendant.label, chart.ascendant.sign, chart.ascendant.degreeInSign, null, false)}</li>}
                    {chart.midheaven && <li>{placementLine(chart.midheaven.label, chart.midheaven.sign, chart.midheaven.degreeInSign, null, false)}</li>}
                  </ul>
                </section>
              </>
            )}

            {chart.houses && (
              <>
                <div className="seenDivider" aria-hidden="true" />
                <section aria-labelledby="houses-title">
                  <h2 id="houses-title" className="seenLabel">Houses</h2>
                  <ul className="seenFlowIntroduction" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                    {chart.houses.map((house) => (
                      <li key={house.house}>House {house.house} — {formatDegree(house.degreeInSign)} {house.sign}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {chart.aspects.length > 0 && (
              <>
                <div className="seenDivider" aria-hidden="true" />
                <section aria-labelledby="aspects-title">
                  <h2 id="aspects-title" className="seenLabel">Aspects</h2>
                  <ul className="seenFlowIntroduction" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                    {chart.aspects.map((aspect, index) => (
                      <li key={index}>{aspect.point1} {aspect.aspect} {aspect.point2} — orb {aspect.orb}°</li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            <div className="seenDivider" aria-hidden="true" />
            <button type="button" className="seenButtonPrimary" onClick={() => router.push('/chart' as any)}>
              Start over
            </button>
          </>
        )}
      </section>
    </main>
  );
}
