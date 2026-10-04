'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';
import {
  birthCityCardError,
  birthDateCardError,
  buildIntakeRecord,
  nameCardError,
  placeFromSuggestion,
  type IntakeCard,
} from '../../../lib/foundation/intakeDeck';
import type { Place } from '../../../lib/foundation/intakeSchema';
import {
  collectLivedPlaces,
  emptyLivedPlaceDraft,
  type LivedPlaceDraft,
} from '../../../lib/foundation/livedExposure';
import { LivedPlacesField } from './LivedPlacesField';

const CARD_COPY: Record<IntakeCard, { title: string; support: string; step: string; total: string; next: string; back: string | null; href: string; backTo: string | null; storageKey: string | null; storageValue: ((v: string) => string) | null; validate: (s: { name: string; birthDate: string; birthCity: Place | null; livedRows: LivedPlaceDraft[] }) => string | null; onAdvance: (s: { name: string; birthDate: string; birthCity: Place | null; livedRows: LivedPlaceDraft[] }, router: ReturnType<typeof useRouter>) => void; render: (s: { name: string; birthDate: string; setName: (v: string) => void; setBirthDate: (v: string) => void; cityQuery: string; setCityQuery: (v: string) => void; setBirthCity: (v: Place | null) => void; livedRows: LivedPlaceDraft[]; setLivedRows: (v: LivedPlaceDraft[]) => void }) => React.ReactNode; } = {
  name: {
    title: 'name'
,
    support: 'Name of the system being read.'
,
    step: '1'
,
    total: '4'
,
    next: 'Continue'
,
    back: null
,
    href: '/foundation/birth'
,
    backTo: null
,
    storageKey: null
,
    storageValue: null
,
    validate: ({ name }) => nameCardError(name)
,
    onAdvance: () => { }
,
    render: ({ name, setName }) => (
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
    )
,
  }
,
  birthDate: {
    title: 'birth date'
,
    support: 'The day this system entered.'
,
    step: '2'
,
    total: '4'
,
    next: 'Continue'
,
    back: 'Back'
,
    href: '/foundation/birth'
,
    backTo: '/foundation/birth'
,
    storageKey: null
,
    storageValue: null
,
    validate: ({ birthDate }) => birthDateCardError(birthDate)
,
    onAdvance: () => { }
,
    render: ({ birthDate, setBirthDate }) => (
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
    )
,
  }
,
  birthCity: {
    title: 'birth city'
,
    support: 'Search for the city. The pick carries latitude and longitude.'
,
    step: '3'
,
    total: '4'
,
    next: 'Continue'
,
    back: 'Back'
,
    href: '/foundation/birth'
,
    backTo: '/foundation/birth'
,
    storageKey: null
,
    storageValue: null
,
    validate: ({ birthCity }) => birthCityCardError(birthCity)
,
    onAdvance: () => { }
,
    render: ({ cityQuery, setCityQuery, setBirthCity }) => (
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
            } }
          />
        </div>
      </div>
    )
,
  }
,
  livedPlaces: {
    title: 'lived places'
,
    support: 'Six months or more. A shorter stay does not count.'
,
    step: '4'
,
    total: '4'
,
    next: 'Continue'
,
    back: 'Back'
,
    href: '/foundation/birth'
,
    backTo: '/foundation/birth'
,
    storageKey: 'seen.foundation.birth'
,
    storageValue: null
,
    validate: ({ livedRows }) => {
      try {
        collectLivedPlaces(livedRows);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : 'Check the lived places.';
      }
    }
,
    onAdvance: ({ name, birthDate, birthCity, livedRows }, router) => {
      const record = buildIntakeRecord({ name, birthDate, birthCity: birthCity!, livedPlaces: collectLivedPlaces(livedRows) });
      sessionStorage.setItem('seen.foundation.birth', JSON.stringify(record));
      router.push('/foundation/rectification/);
    }
,
    render: ({ livedRows, setLivedRows }) => <LivedPlacesField rows={livedRows} onChange={setLivedRows} />
,
  }
,
}
,

export default function BirthFoundationPage() {
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
    const message = copy.validate({ name, birthDate, birthCity, livedRows });
    if (message) {
      setError(message);
      return;
    }
    setError('');
    copy.onAdvance({ name, birthDate, birthCity, livedRows }, router);
    if (step < INTAKE_CARDS.length - 1) {
      setStep(step + 1);
    }
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <form className="seenPanel seenFlowForm" noValidate onSubmit={advance} aria-labelledby="intake-card-title">
        <div className="seenProgress">
          <span>The Forge</span>
          <span className="seenProgressValue">
            {copy.step} / {copy.total}
          </span>
        </div>
        <h1 id="intake-card-title">{copy.title}</h1>
        <p className="seenFieldSupport">{copy.support}</p>
        {copy.render({ name, setName, birthDate, setBirthDate, cityQuery, setCityQuery, setBirthCity, livedRows, setLivedRows })}
        {error && (
          <p className="seenFormError" role="alert">
            {error}
          </p>
        )}
        <button className="seenButtonPrimary" type="submit">
          {copy.next}
          <span aria-hidden="true">→</span>
        </button>
        {copy.back && copy.backTo && (
          <button
            className="seenButtonSecondary"
            type="button"
            onClick={() => {
              setError('');
              if (step > 0) {
                setStep(step - 1);
              } else {
                router.push(copy.backTo!);
              }
            } }
          >
            {copy.back}
          </button>
        )}
      </form>
    </main>
  )
,
}

const INTAKE_CARDS = ['name', 'birthDate', 'birthCity', 'livedPlaces'] as const;
