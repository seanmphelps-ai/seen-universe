// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NatalChartResult } from '../../../lib/natalChart';
import { extractWoundMarkers, type WoundMarkerHit } from '../../../lib/seen/woundMarkers';
import { rankWounds, type RankedWound } from '../../../lib/seen/woundRanking';

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
}

type SeenRunResponse = {
  western?: NatalChartResult;
  westernPortalPenetration?: unknown;
  westernLifeSectionRouting?: unknown;
  locations?: unknown;
  locationV2?: unknown;
  error?: string;
}

const RANK_LABEL: Record<number, string> = {
  1: 'Loudest — fires first under pressure.',
  2: 'Strong — shows up clearly in relationships and self-image.',
  3: 'Present — noticeable but quieter.',
  4: 'Quiet — background pressure, rarely the main event.',
  5: 'Faint — only surfaces under extreme stress.',
}

const PLACEMENT_VERB: Record<string, string> = {
  chiron: 'aching',
  trueLilith: 'coiling',
  neptune: 'fogging',
  mars: 'cutting',
  venus: 'testing the door',
  saturn: 'pressing',
  pluto: 'gripping',
  uranus: 'cracking',
}

/** One clause naming what each marker is, so the mechanic teaches something instead of just labeling a placement. */
const MARKER_TEACHING: Record<string, string> = {
  chiron: 'the wound that never heals',
  trueLilith: 'the exiled instinct',
  neptune: 'the dissolver',
  mars: 'the drive to act and sever',
  venus: 'the relational mirror',
  saturn: 'the fear structure',
  pluto: 'the power compulsion',
  uranus: 'the shock point',
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function placementLead(markerId: string, label: string, hit?: WoundMarkerHit): string {
  const verb = PLACEMENT_VERB[markerId] ?? 'active';
  const teaching = MARKER_TEACHING[markerId];
  const name = teaching ? `${label} — ${teaching} —` : label;
  if (!hit) return `${name} is ${verb}.`;
  if (hit.house !== null) return `${name} is ${verb} in the ${ordinal(hit.house)} house.`;
  return `${name} is ${verb} in ${hit.sign}.`;
}

export default function FoundationResultPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<StoredBirth | null>(null);
  const [chart, setChart] = useState<NatalChartResult | null>(null);
  const [rankedWounds, setRankedWounds] = useState<RankedWound[] | null>(null);
  const [woundHits, setWoundHits] = useState<WoundMarkerHit[]>([]);
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
          const hits = extractWoundMarkers(payload.western);
          const ranked = rankWounds(hits, payload.western.aspects);
          setWoundHits(hits);
          setRankedWounds(ranked);
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

            {rankedWounds && rankedWounds.length > 0 && (
              <>
                <div className="seenDivider" aria-hidden="true" />
                <section aria-labelledby="wounds-title">
                  <h2 id="wounds-title" className="seenLabel">Wound markers — ranked</h2>
                  <p className="seenFieldSupport">
                    These are the patterns the chart carries. Rank follows authored criteria — it weighs how tight the aspect is, how heavy the planet is, which house it sits in, and whether several markers fire together.
                  </p>
                  <ul className="seenFlowIntroduction" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
                    {rankedWounds.map((wound) => {
                      const hit = woundHits.find((h) => h.id === wound.markerId);
                      return (
                        <li key={wound.markerId} style={{ borderLeft: '3px solid var(--seen-accent, #c9a227)', paddingLeft: '1rem' }}>
                          <p style={{ margin: 0, fontWeight: 600 }}>
                            {wound.label} — rank {wound.rank}
                          </p>
                          <p className="seenFieldSupport" style={{ margin: '0.25rem 0' }}>{placementLead(wound.markerId, wound.label, hit)}</p>
                          <p className="seenFieldSupport" style={{ margin: '0.25rem 0' }}>{RANK_LABEL[wound.rank]}</p>
                          <p style={{ margin: '0.25rem 0' }}>{wound.signature}</p>
                          <p className="seenFieldSupport" style={{ margin: '0.25rem 0' }}><strong>Cost:</strong> {wound.cost}</p>
                          <p className="seenFieldSupport" style={{ margin: '0.25rem 0' }}><strong>Repeats:</strong> {wound.repeatPattern}</p>
                        </li>
                      );
                    })}
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
