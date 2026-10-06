'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BIRTH_RECORD_KEY,
  CALCULATED_MODALITY_NAMES,
  INTAKE_DECK_HREF,
  birthDateCardError,
  buildDeckRecord,
  exposureFromStored,
} from '../../lib/foundation/intakeDeck';

export default function MarkPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(BIRTH_RECORD_KEY);
    let stored: unknown = null;
    try {
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }
    const exposure = exposureFromStored(stored);
    if (!exposure) {
      router.replace(INTAKE_DECK_HREF.exposure);
      return;
    }
    setBirthLocation(exposure.birthLocation);
    const existingDate = stored && typeof stored === 'object'
      ? (stored as { birthDate?: unknown }).birthDate
      : null;
    if (typeof existingDate === 'string' && !birthDateCardError(existingDate)) {
      setBirthDate(existingDate);
    }
    setReady(true);
  }, [router]);

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = sessionStorage.getItem(BIRTH_RECORD_KEY);
    let stored: unknown = null;
    try {
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }
    const exposure = exposureFromStored(stored);
    const message = birthDateCardError(birthDate);
    if (message || !exposure) {
      setError(message ?? 'Select a place from the list.');
      if (!exposure) router.replace(INTAKE_DECK_HREF.exposure);
      return;
    }

    const record = buildDeckRecord({
      birthDate,
      birthCity: exposure.city,
      birthLocation: exposure.birthLocation,
    });
    sessionStorage.setItem(BIRTH_RECORD_KEY, JSON.stringify(record));
    setError('');
    router.push(INTAKE_DECK_HREF.time);
  }

  if (!ready) {
    return <main className="seenAlivePage seenIntakeDeck" />;
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <form className="seenPanel seenFlowForm" noValidate onSubmit={advance} aria-labelledby="intake-card-title">
        <h1 id="intake-card-title">The Mark</h1>
        <p className="seenFieldSupport">Born on what date?</p>
        <div className="seenField">
          <label className="seenLabel" htmlFor="chart-date">
            Date of birth
          </label>
          <div className="seenInputFrame">
            <input
              id="chart-date"
              className="seenInput"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
            />
          </div>
        </div>
        <div className="seenField">
          <span className="seenLabel" id="mark-systems">Systems being read</span>
          <ul className="seenResultList" aria-labelledby="mark-systems">
            {CALCULATED_MODALITY_NAMES.map((name) => (
              <li key={name} className="seenFieldSupport">
                {name}
              </li>
            ))}
          </ul>
        </div>
        {birthLocation ? <p className="seenFieldSupport">{birthLocation}</p> : null}
        {error && (
          <p className="seenFormError" role="alert">
            {error}
          </p>
        )}
        <button className="seenButtonPrimary" type="submit">
          Continue
          <span aria-hidden="true">→</span>
        </button>
        <button
          className="seenButtonSecondary"
          type="button"
          onClick={() => router.push(INTAKE_DECK_HREF.exposure)}
        >
          Back
        </button>
      </form>
    </main>
  );
}
