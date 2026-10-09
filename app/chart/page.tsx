// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import LivedPlacesField from '../../components/LivedPlacesField';
import { LocationAutocompleteInput } from '../../components/LocationAutocompleteInput';
import {
  INTAKE_CARDS,
  birthCityCardError,
  birthDateCardError,
  buildIntakeRecord,
  nameCardError,
  placeFromSuggestion,
  type IntakeCard,
} from '../../lib/foundation/intakeDeck';
import type { Place } from '../../lib/foundation/intakeSchema';
import {
  collectLivedPlaces,
  emptyLivedPlaceDraft,
  type LivedPlaceDraft,
} from '../../lib/foundation/livedExposure';

const CARD_COPY: Record<IntakeCard, { title: string; support: string }> = {
  name: {
    title: 'name',
    support: 'Name of the system being read.',
  },
  birthDate: {
    title: 'birth date',
    support: 'The day this system entered.',
  },
  birthCity: {
    title: 'birth city',
    support: 'Search for the city. The pick carries latitude and longitude.',
  },
  livedPlaces: {
    title: 'lived places',
    support: 'Include stays of six months or more.',
  },
};

export default function NatalChartPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [birthCity, setBirthCity] = useState<Place | null>(null);
  const [livedRows, setLivedRows] = useState<LivedPlaceDraft[]>(() => [emptyLivedPlaceDraft('1')]);
  const [error, setError] = useState('');

  const card = INTAKE_CARDS[step] ?? 'name';
  const copy = CARD_COPY[card];

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = errorFor(card);
    if (message) {
      setError(message);
      return;
    }
    setError('');
    if (step < INTAKE_CARDS.length - 1) {
      setStep(step + 1);
      return;
    }

    try {
      const record = buildIntakeRecord({
        name,
        birthDate,
        birthCity: birthCity!,
        livedPlaces: collectLivedPlaces(livedRows),
      });
      sessionStorage.setItem('seen.foundation.birth', JSON.stringify(record));
      router.push('/foundation/rectification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check the lived places.');
    }
  }

  function errorFor(current: IntakeCard): string | null {
    if (current === 'name') return nameCardError(name);
    if (current === 'birthDate') return birthDateCardError(birthDate);
    if (current === 'birthCity') return birthCityCardError(birthCity);
    try {
      collectLivedPlaces(livedRows);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Check the lived places.';
    }
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <form className="seenPanel seenFlowForm" noValidate onSubmit={advance} aria-labelledby="intake-card-title">
        <h1 id="intake-card-title">{copy.title}</h1>
        <p className="seenFieldSupport">{copy.support}</p>

        {card === 'name' && (
          <div className="seenField">
            <label className="seenLabel" htmlFor="chart-name">
              Name
            </label>
            <div className="seenInputFrame">
              <input
                id="chart-name"
                className="seenInput"
                type="text"
                autoComplete="name"
                placeholder="Self, parent, child, or ex"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>
        )}

        {card === 'birthDate' && (
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
        )}

        {card === 'birthCity' && (
          <div className="seenField">
            <label className="seenLabel" htmlFor="chart-city">
              Birth city
            </label>
            <div className="seenInputFrame">
              <LocationAutocompleteInput
                id="chart-city"
                className="seenInput"
                value={cityQuery}
                placeholder="Search for a city"
                ariaLabel="Birth city"
                onChange={setCityQuery}
                onPlaceSelect={(suggestion) => {
                  if (!suggestion) {
                    setBirthCity(null);
                    return;
                  }
                  setCityQuery(suggestion.label);
                  setBirthCity(placeFromSuggestion(suggestion));
                }}
              />
            </div>
          </div>
        )}

        {card === 'livedPlaces' && (
          <LivedPlacesField rows={livedRows} onChange={setLivedRows} />
        )}

        {error && (
          <p className="seenFormError" role="alert">
            {error}
          </p>
        )}

        <button className="seenButtonPrimary" type="submit">
          Continue
          <span aria-hidden="true">→</span>
        </button>
        {step > 0 && (
          <button
            className="seenButtonSecondary"
            type="button"
            onClick={() => {
              setError('');
              setStep(step - 1);
            }}
          >
            Back
          </button>
        )}
      </form>
    </main>
  );
}
