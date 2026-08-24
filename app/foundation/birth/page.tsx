'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CITIES, type City } from '../../../lib/cities';

type StoredLocations = {
  birthLocation?: string;
};

export default function BirthFoundationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('seen.foundation.locations');
    if (!stored) return;

    try {
      const locations = JSON.parse(stored) as StoredLocations;
      const birthLocation = locations.birthLocation?.trim();
      if (!birthLocation) return;

      setCityQuery(birthLocation);

      const normalized = birthLocation.toLowerCase();
      const match = CITIES.find((city) => {
        const cityName = city.name.toLowerCase();
        const country = city.country.toLowerCase();
        return normalized.includes(cityName) && normalized.includes(country);
      });

      if (match) {
        setSelectedCity(match);
        setCityQuery(`${match.name}, ${match.country}`);
      }
    } catch {
      // Leave the form empty if stored Foundation data cannot be read.
    }
  }, []);

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
      setError('Enter your name.');
      return;
    }

    if (!birthDate) {
      setError('Enter your date of birth.');
      return;
    }

    if (!selectedCity) {
      setError('Search for and select your birth location from the list.');
      return;
    }

    setError('');

    sessionStorage.setItem(
      'seen.foundation.birth',
      JSON.stringify({
        name: name.trim(),
        birthDate,
        city: selectedCity,
      }),
    );

    router.push('/foundation/rectification');
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="birth-foundation-title">
        <div className="seenProgress" aria-label="Foundation progress">
          <span className="seenProgressLabel">Foundation</span>
          <span className="seenProgressValue">02</span>
        </div>

        <header className="seenFlowHeader">
          <h1 id="birth-foundation-title" className="seenDisplayLarge">
            Birth Date
          </h1>

          <p className="seenFlowIntroduction">
            Give us the date and place that anchor this life.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>

        <form className="seenPanel seenFlowForm" onSubmit={handleSubmit}>
          <div className="seenField">
            <label className="seenLabel" htmlFor="foundation-name">
              Name
            </label>
            <div className="seenInputFrame">
              <input
                id="foundation-name"
                className="seenInput"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>

          <div className="seenField">
            <label className="seenLabel" htmlFor="foundation-date">
              Date of birth
            </label>
            <div className="seenInputFrame">
              <input
                id="foundation-date"
                className="seenInput"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </div>
          </div>

          <div className="seenField">
            <label className="seenLabel" htmlFor="foundation-city">
              Birth location
            </label>
            <div className="seenInputFrame">
              <span className="seenFieldIcon" aria-hidden="true">⟡</span>
              <input
                id="foundation-city"
                className="seenInput seenInputWithIcon"
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

            {cityQuery.trim() && !selectedCity && citySuggestions.length === 0 && (
              <p className="seenFieldSupport">
                No match in the bundled city list. Try a nearby larger city.
              </p>
            )}
          </div>

          {error && (
            <p className="seenFormError" role="alert">
              {error}
            </p>
          )}

          <button className="seenButtonPrimary" type="submit">
            Continue
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
