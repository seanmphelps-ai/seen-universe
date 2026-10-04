'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';
import { LocationPressureCards } from '../../../components/LocationPressureCards';
import {
  BIRTH_RECORD_KEY,
  INTAKE_DECK_HREF,
  RECTIFICATION_RECORD_KEY,
  exposureCardError,
  exposureFromStored,
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
    const raw = sessionStorage.getItem(BIRTH_RECORD_KEY);
    if (!raw) return;
    try {
      const exposure = exposureFromStored(JSON.parse(raw) as unknown);
      if (!exposure) return;
      setPlace(exposure.city);
      setLabel(exposure.birthLocation);
    } catch {
      // A fresh search stays empty when the stored record cannot be read.
    }
  }, []);

  function continueToMark() {
    const message = exposureCardError(place);
    if (message || !place) {
      setError(message ?? 'Select a place from the list.');
      return;
    }
    let previous: Record<string, unknown> = {};
    const raw = sessionStorage.getItem(BIRTH_RECORD_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === 'object') previous = parsed as Record<string, unknown>;
      } catch {
        previous = {};
      }
    }
    sessionStorage.setItem(BIRTH_RECORD_KEY, JSON.stringify({
      ...previous,
      city: place,
      birthLocation: label.trim() || `${place.name}, ${place.country}`,
    }));
    sessionStorage.removeItem(RECTIFICATION_RECORD_KEY);
    setError('');
    router.push(INTAKE_DECK_HREF.mark);
  }

  return (
    <main className="seenAlivePage">
      <section className="seenPanel seenFlowForm" aria-labelledby="location-card-title">
        <h1 id="location-card-title">environmental exposure</h1>
        <p className="seenFieldSupport">Incubators of the field</p>
        <p className="seenFieldSupport">Reveal the places that shaped the pressure.</p>
        <div className="seenField">
          <label className="seenLabel" htmlFor="location-q">
            City
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
              onPlaceSelect={(suggestion) => {
                if (!suggestion) {
                  setPlace(null);
                  return;
                }
                setLabel(suggestion.label);
                setPlace(placeFromSuggestion(suggestion));
                setError('');
              }}
              placeholder="City"
              ariaLabel="City"
            />
          </div>
        </div>
        <LocationPressureCards label={label} onLocked={setLocked} />
        {locked ? <p className="seenFieldSupport">Locked: {locked}</p> : null}
        {error ? (
          <p className="seenFormError" role="alert">
            {error}
          </p>
        ) : null}
        <button className="seenButtonPrimary" type="button" onClick={continueToMark}>
          Continue
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}
