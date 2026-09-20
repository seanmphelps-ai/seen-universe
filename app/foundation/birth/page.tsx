'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StoredLocations = { birthLocation?: string };

export default function BirthFoundationPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('seen.foundation.locations');
    if (!stored) {
      router.replace('/foundation/location');
      return;
    }
    try {
      setBirthLocation((JSON.parse(stored) as StoredLocations).birthLocation ?? '');
      setBirthDate(sessionStorage.getItem('seen.foundation.birthDate') ?? '');
      setReady(true);
    } catch {
      router.replace('/foundation/location');
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!birthDate) {
      setError('Choose your date of birth.');
      return;
    }
    sessionStorage.setItem('seen.foundation.birthDate', birthDate);
    setError('');
    router.push('/foundation/code');
  }

  if (!ready) return null;

  return (
    <main className="seenForgePage">
      <Image className="seenForgeBackdrop" src="/foundation/location-forge-background.png" alt="" aria-hidden="true" fill priority sizes="(max-width: 760px) 100vw, 760px" />
      <div className="seenForgeBackdropVeil" aria-hidden="true" />
      <section className="seenForgeShell seenForgeStepShell" aria-labelledby="birth-foundation-title">
        <header className="seenForgeMasthead">
          <span className="seenForgeNumber">02</span>
          <h1 id="birth-foundation-title" className="seenForgeTitle">The Mark</h1>
          <p className="seenForgeStepTagline">The day you entered it</p>
        </header>
        <div className="seenForgeGlobeSpace" aria-hidden="true" />
        <section className="seenForgeExposure">
          <header className="seenForgeExposureHeader">
            <p className="seenForgeIncubator">Date intake</p>
            <h2>When did this life enter the world?</h2>
            <p>{birthLocation || 'Your first coordinates are held.'}</p>
          </header>
          <form className="seenForgeForm" onSubmit={handleSubmit}>
            <label className="seenForgeField">
              <span className="seenForgeFieldBody">
                <span className="seenForgeFieldLabel">Date of birth</span>
                <input id="foundation-date" className="seenForgeInput" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
              </span>
            </label>
            {error && <p className="seenForgeError" role="alert">{error}</p>}
            <button className="seenForgeSubmit" type="submit">Continue<span aria-hidden="true">›</span></button>
          </form>
        </section>
      </section>
    </main>
  );
}
