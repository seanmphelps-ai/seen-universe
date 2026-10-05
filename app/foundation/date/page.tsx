'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BIRTH_SESSION_KEY,
  birthDateCardError,
  buildDeckBirthRecord,
} from '../../../lib/foundation/intakeDeck';
import type { Place } from '../../../lib/foundation/intakeSchema';

type StoredPlace = {
  birthLocation?: string;
  city?: Place;
  birthDate?: string;
};

export default function DatePage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [draft, setDraft] = useState<StoredPlace | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem(BIRTH_SESSION_KEY);
    if (!raw) {
      router.replace('/foundation/location');
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredPlace;
      if (
        !parsed.city ||
        typeof parsed.city.latitude !== 'number' ||
        typeof parsed.city.longitude !== 'number'
      ) {
        router.replace('/foundation/location');
        return;
      }
      setDraft(parsed);
    } catch {
      router.replace('/foundation/location');
    }
  }, [router]);

  function continueToTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = birthDateCardError(birthDate);
    if (message || !draft?.city || !draft.birthLocation) {
      setError(message ?? 'Select a place from the list.');
      return;
    }
    try {
      const record = buildDeckBirthRecord({
        birthDate,
        birthCity: draft.city,
        birthLocation: draft.birthLocation,
      });
      sessionStorage.setItem(BIRTH_SESSION_KEY, JSON.stringify(record));
      router.push('/foundation/rectification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Choose a birth date.');
    }
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <form className="seenPanel seenFlowForm" noValidate onSubmit={continueToTime} aria-labelledby="date-card-title">
        <h1 id="date-card-title">birth date</h1>
        <p className="seenFieldSupport">The day this system entered.</p>
        <div className="seenField">
          <label className="seenLabel" htmlFor="deck-date">
            Date of birth
          </label>
          <div className="seenInputFrame">
            <input
              id="deck-date"
              className="seenInput"
              type="date"
              value={birthDate}
              onChange={(event) => {
                setBirthDate(event.target.value);
                setError('');
              }}
            />
          </div>
        </div>
        {error ? (
          <p className="seenFormError" role="alert">
            {error}
          </p>
        ) : null}
        <button className="seenButtonPrimary seenStickyAction" type="submit">
          Continue
          <span aria-hidden="true">→</span>
        </button>
        <button
          className="seenButtonSecondary"
          type="button"
          onClick={() => router.push('/foundation/location')}
        >
          Back
        </button>
      </form>
    </main>
  );
}
