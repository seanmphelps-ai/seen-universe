'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StoredLocations = {
  birthLocation?: string;
  livedLocations?: string[];
  livedPeriods?: Array<{ location: string; startYear: string; endYear: string }>;
  currentLocation?: string;
  currentPeriod?: { startYear: string; endYear: string };
};

type CitySuggestion = {
  label: string;
  city: string;
  region: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population: number;
};

function buildLivedStack(locations: StoredLocations | null, birthLocation: string): string {
  if (!locations) return birthLocation ? `Birth: ${birthLocation}` : '';
  const parts: string[] = [];
  if (birthLocation) parts.push(`Birth: ${birthLocation}`);
  const periods = locations.livedPeriods ?? [];
  for (const period of periods) {
    if (!period.location?.trim()) continue;
    parts.push(`Lived: ${period.location} (${period.startYear}–${period.endYear})`);
  }
  if (locations.currentLocation?.trim()) {
    const start = locations.currentPeriod?.startYear ?? '?';
    parts.push(`Current: ${locations.currentLocation} (from ${start})`);
  }
  return parts.join('; ');
}

async function resolveCityFromLabel(query: string): Promise<{
  name: string;
  country: string;
  latitude: number;
  longitude: number;
} | null> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  const candidates = [trimmed];
  const beforeComma = trimmed.split(',')[0]?.trim();
  if (
    beforeComma &&
    beforeComma.length >= 2 &&
    beforeComma.toLowerCase() !== trimmed.toLowerCase()
  ) {
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
    const cityMatch = suggestions.find(
      (s) => s.city.toLowerCase() === (beforeComma ?? trimmed).toLowerCase(),
    );
    best = exactLabel ?? cityMatch ?? suggestions[0];
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

export default function BirthFoundationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [knownCivilTime, setKnownCivilTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedLocations, setStoredLocations] = useState<StoredLocations | null>(null);

  useEffect(() => {
    setBirthDate(sessionStorage.getItem('seen.foundation.birthDate') ?? '');
    const stored = sessionStorage.getItem('seen.foundation.locations');
    if (!stored) return;

    try {
      const locations = JSON.parse(stored) as StoredLocations;
      setStoredLocations(locations);
      setBirthLocation(locations.birthLocation?.trim() ?? '');
    } catch {
      setBirthLocation('');
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }

    if (!birthDate) {
      setError('Enter your date of birth.');
      return;
    }

    if (!birthLocation) {
      setError('Complete your location first.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const city = await resolveCityFromLabel(birthLocation);
      if (!city) {
        setError(
          `Could not resolve coordinates for “${birthLocation}”. Go back and pick a suggested city, or try a clearer place name.`,
        );
        setIsSubmitting(false);
        return;
      }

      const livedStack = buildLivedStack(storedLocations, birthLocation);
      const knownTime = knownCivilTime.trim();

      sessionStorage.setItem(
        'seen.foundation.birth',
        JSON.stringify({
          name: name.trim(),
          birthDate,
          birthLocation,
          city,
          livedStack,
          ...(knownTime
            ? {
                knownCivilTime: knownTime,
                knownTimeLabel: 'known time — not rectified',
              }
            : {}),
        }),
      );

      router.push('/foundation/rectification');
    } catch {
      setError('Could not resolve birth place coordinates. Try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <main className="seenForgePage">
      <Image
        className="seenForgeBackdrop"
        src="/foundation/location-forge-background.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="(max-width: 760px) 100vw, 760px"
      />
      <div className="seenForgeBackdropVeil" aria-hidden="true" />

      <section className="seenForgeShell" aria-labelledby="birth-foundation-title">
        <header className="seenForgeMasthead">
          <span className="seenForgeNumber">02</span>
          <h1 id="birth-foundation-title" className="seenForgeTitle">
            The Mark
          </h1>
        </header>

        <div className="seenForgeGlobeSpace" aria-hidden="true" />

        <section className="seenForgeExposure">
          <header className="seenForgeExposureHeader">
            <h2>When did this life enter the world?</h2>
          </header>

          <form className="seenForgeForm" onSubmit={handleSubmit}>
            <label className="seenForgeField">
              <span className="seenForgeFieldBody">
                <span className="seenForgeFieldLabel">Name</span>
                <input
                  id="foundation-name"
                  className="seenForgeInput"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </span>
            </label>

            <div className="seenForgeField" aria-label="Date of birth">
              <span className="seenForgeFieldBody">
                <span className="seenForgeFieldLabel">Date of Birth</span>
                <span className="seenForgeInput">{birthDate}</span>
              </span>
            </div>

            {birthLocation && (
              <div className="seenForgeField" aria-label="Birth location">
                <span className="seenForgeFieldBody">
                  <span className="seenForgeFieldLabel">Birth Location</span>
                  <span className="seenForgeInput">{birthLocation}</span>
                </span>
              </div>
            )}

            <label className="seenForgeField">
              <span className="seenForgeFieldBody">
                <span className="seenForgeFieldLabel">known time — not rectified</span>
                <input
                  id="foundation-known-civil-time"
                  className="seenForgeInput"
                  type="text"
                  inputMode="numeric"
                  placeholder="Optional · HH:MM civil clock"
                  value={knownCivilTime}
                  onChange={(event) => setKnownCivilTime(event.target.value)}
                  aria-describedby="known-time-hint"
                />
                <span id="known-time-hint" className="seenForgeFieldLabel" style={{ opacity: 0.7 }}>
                  Optional override path. Still runs the recognition calc; does not skip Round 1
                  unless used on the next screen.
                </span>
              </span>
            </label>

            {error && (
              <p className="seenForgeError" role="alert">
                {error}
              </p>
            )}

            <button className="seenForgeSubmit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Resolving place…' : 'Continue'}
              <span aria-hidden="true">›</span>
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
