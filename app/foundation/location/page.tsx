'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';
import { LocationPressureCards } from '../../../components/LocationPressureCards';
import {
  BIRTH_SESSION_KEY,
  birthCityCardError,
  placeFromSuggestion,
} from '../../../lib/foundation/intakeDeck';
import type { Place } from '../../../lib/foundation/intakeSchema';
import type { SketchId } from '../../../lib/location/pressure';

/** Location card. Its label is environmental exposure. */
export default function LocationPage() {
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [locked, setLocked] = useState<SketchId | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem(BIRTH_SESSION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { birthLocation?: string; city?: Place };
      if (
        parsed.city &&
        typeof parsed.city.latitude === 'number' &&
        typeof parsed.city.longitude === 'number' &&
        parsed.birthLocation
      ) {
        setLabel(parsed.birthLocation);
        setPlace(parsed.city);
      }
    } catch {
      setLabel('');
      setPlace(null);
    }
  }, []);

  function continueToDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = birthCityCardError(place);
    if (message || !place) {
      setError(message ?? 'Select a place from the list.');
      return;
    }

    let previous: Record<string, unknown> = {};
    const raw = sessionStorage.getItem(BIRTH_SESSION_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (parsed && typeof parsed === 'object') previous = parsed;
      } catch {
        previous = {};
      }
    }
    delete previous.birthTime;
    delete previous.clock;
    sessionStorage.setItem(
      BIRTH_SESSION_KEY,
      JSON.stringify({
        ...previous,
        birthLocation: label.trim(),
        city: place,
      }),
    );
    router.push('/foundation/date');
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <form className="seenPanel seenFlowForm" noValidate onSubmit={continueToDate} aria-labelledby="location-card-title">
        <h1 id="location-card-title">environmental exposure</h1>
        <p className="seenFieldSupport">What were you exposed to?</p>
        <p className="seenFieldSupport">Incubators of the field</p>
        <p className="seenFieldSupport">Reveal the places that shaped the pressure.</p>
        <div className="seenField">
          <label className="seenLabel" htmlFor="location-q">
            Place
          </label>
          <div className="seenInputFrame">
            <LocationAutocompleteInput
              id="location-q"
              className="seenInput"
              value={label}
              onChange={(value) => {
                setLabel(value);
                setPlace(null);
                setLocked(null);
                setError('');
              }}
              placeholder="Search for a city"
              ariaLabel="Place"
              onPlaceSelect={(suggestion) => {
                if (!suggestion) {
                  setPlace(null);
                  return;
                }
                setLabel(suggestion.label);
                setPlace(placeFromSuggestion(suggestion));
                setError('');
              }}
            />
          </div>
        </div>
        {place ? <LocationPressureCards label={label} onLocked={setLocked} /> : null}
        {locked ? <p className="seenFieldSupport">Locked: {locked}</p> : null}
        {error ? (
          <p className="seenFormError" role="alert">
            {error}
          </p>
        ) : null}
        <button className="seenButtonPrimary seenStickyAction" type="submit">
          Continue
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </main>
  );
}
