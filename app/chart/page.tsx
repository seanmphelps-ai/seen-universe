'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import LivedPlacesField from '../../components/LivedPlacesField';
import { CITIES, type City } from '../../lib/cities';
import {
  collectLivedPlaces,
  emptyLivedPlaceDraft,
  livedStackFromPlaces,
} from '../../lib/foundation/livedExposure';

export default function NatalChartPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [livedRows, setLivedRows] = useState(() => [emptyLivedPlaceDraft('1')]);
  const [error, setError] = useState('');

  const citySuggestions = useMemo(() => {
    const query = cityQuery.trim().toLowerCase();
    if (!query || selectedCity) return [];
    return CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query),
    ).slice(0, 8);
  }, [cityQuery, selectedCity]);

  function handleCityInputChange(value: string) {
    setCityQuery(value);
    setSelectedCity(null);
  }

  function handleCitySelect(city: City) {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.country}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError('Enter a name.');
      return;
    }

    if (!birthDate) {
      setError('Enter a date of birth.');
      return;
    }

    if (!selectedCity) {
      setError('Search for and select a birth location from the list.');
      return;
    }

    let livedPlaces;
    try {
      livedPlaces = collectLivedPlaces(livedRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check the lived places.');
      return;
    }

    sessionStorage.setItem(
      'seen.foundation.birth',
      JSON.stringify({
        name: name.trim(),
        birthDate,
        city: {
          name: selectedCity.name,
          country: selectedCity.country,
          latitude: selectedCity.latitude,
          longitude: selectedCity.longitude,
        },
        livedPlaces,
        livedStack: livedStackFromPlaces(livedPlaces),
      }),
    );

    router.push('/foundation/rectification');
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="natal-chart-title">
        <header className="seenFlowHeader">
          <h1 id="natal-chart-title" className="seenDisplayLarge">
            SEEN recognition
          </h1>

          <p className="seenFlowIntroduction">
            Name, birth date, and birth city come first. Then the places lived,
            with years. Six months counts. Those years write the card. They do
            not move the planets. Time is found by the pressure cards. Do not
            type a clock.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>

        <form className="seenPanel seenFlowForm" onSubmit={handleSubmit}>
          <div className="seenField">
            <label className="seenLabel" htmlFor="chart-name">
              Name
            </label>
            <div className="seenInputFrame">
              <input
                id="chart-name"
                className="seenInput"
                type="text"
                autoComplete="off"
                placeholder="Self, parent, child, or ex"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>

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
            <label className="seenLabel" htmlFor="chart-city">
              Birth location
            </label>
            <div className="seenInputFrame">
              <input
                id="chart-city"
                className="seenInput"
                type="text"
                autoComplete="off"
                placeholder="Search for a city"
                value={cityQuery}
                onChange={(event) => handleCityInputChange(event.target.value)}
              />
            </div>

            {citySuggestions.length > 0 && (
              <ul className="seenCitySuggestions">
                {citySuggestions.map((city) => (
                  <li key={`${city.name}-${city.country}`}>
                    <button
                      type="button"
                      className="seenCitySuggestion"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city.name}, {city.country}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <LivedPlacesField rows={livedRows} onChange={setLivedRows} />

          {error && (
            <p className="seenFormError" role="alert">
              {error}
            </p>
          )}

          <button className="seenButtonPrimary" type="submit">
            Start pressure cards
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
