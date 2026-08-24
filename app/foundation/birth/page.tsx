'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StoredLocations = {
  birthLocation?: string;
};

export default function BirthFoundationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('seen.foundation.locations');
    if (!stored) return;

    try {
      const locations = JSON.parse(stored) as StoredLocations;
      setBirthLocation(locations.birthLocation?.trim() ?? '');
    } catch {
      setBirthLocation('');
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    sessionStorage.setItem(
      'seen.foundation.birth',
      JSON.stringify({
        name: name.trim(),
        birthDate,
        birthLocation,
      }),
    );

    router.push('/foundation/rectification');
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

            <label className="seenForgeField">
              <span className="seenForgeFieldBody">
                <span className="seenForgeFieldLabel">Date of Birth</span>
                <input
                  id="foundation-date"
                  className="seenForgeInput"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </span>
            </label>

            {birthLocation && (
              <div className="seenForgeField" aria-label="Birth location">
                <span className="seenForgeFieldBody">
                  <span className="seenForgeFieldLabel">Birth Location</span>
                  <span className="seenForgeInput">{birthLocation}</span>
                </span>
              </div>
            )}

            {error && (
              <p className="seenForgeError" role="alert">
                {error}
              </p>
            )}

            <button className="seenForgeSubmit" type="submit">
              Continue
              <span aria-hidden="true">›</span>
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
