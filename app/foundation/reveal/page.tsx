'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CardFeed from '../../../components/CardFeed';
import type { NatalChartResult } from '../../../lib/natalChart';
import { extractWoundMarkers } from '../../../lib/seen/woundMarkers';
import { rankWounds } from '../../../lib/seen/woundRanking';

type PlaceCity = { name: string; country: string; latitude: number; longitude: number };

type StoredBirth = {
  name: string;
  birthDate: string;
  birthTime?: string | null;
  birthLocation?: string;
  city?: PlaceCity;
  livedStack?: string;
};

type StoredRectification = { pickedClock?: string };

type SeenRunResponse = { western?: NatalChartResult; error?: string };

export default function RevealPage() {
  const router = useRouter();
  const [cards, setCards] = useState<{ title: string; deepText: string }[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const rawBirth = sessionStorage.getItem('seen.foundation.birth');
    if (!rawBirth) {
      router.replace('/chart');
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const birth = JSON.parse(rawBirth!) as StoredBirth;
        if (!birth.city || typeof birth.city.latitude !== 'number' || typeof birth.city.longitude !== 'number') {
          throw new Error('Birth place is missing coordinates. Return to intake and pick a suggested city.');
        }

        const rawRectification = sessionStorage.getItem('seen.foundation.rectification');
        const rectification = rawRectification ? (JSON.parse(rawRectification) as StoredRectification) : null;
        const birthTime = rectification?.pickedClock ?? birth.birthTime ?? null;

        const response = await fetch('/api/seen/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chart: { name: birth.name, birthDate: birth.birthDate, birthTime, latitude: birth.city.latitude, longitude: birth.city.longitude },
            locations: [{
              role: 'birth',
              label: birth.birthLocation?.trim() || `${birth.city.name}, ${birth.city.country}`,
              latitude: birth.city.latitude,
              longitude: birth.city.longitude,
              exposureStart: birth.birthDate,
            }],
          }),
        });

        const payload = (await response.json().catch(() => null)) as SeenRunResponse | null;
        if (!response.ok || !payload?.western) {
          throw new Error(payload?.error || 'Runtime failed.');
        }

        const ranked = rankWounds(extractWoundMarkers(payload.western), payload.western.aspects);
        if (cancelled) return;
        setCards(ranked.map((wound) => ({
          title: wound.label,
          deepText: `${wound.signature} ${wound.cost} ${wound.repeatPattern}`,
        })));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not build the reading.');
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <main className="seenAlivePage">
        <p className="seenFormError" role="alert">{error}</p>
        <button type="button" className="seenButtonPrimary" onClick={() => router.push('/chart')}>
          Back to intake
        </button>
      </main>
    );
  }

  if (!cards) {
    return (
      <main className="seenAlivePage">
        <p className="seenFieldSupport">Reading the full chart…</p>
      </main>
    );
  }

  return (
    <main className="seenAlivePage">
      <CardFeed cards={cards} />
    </main>
  );
}
