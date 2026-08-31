'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { CITIES, type City } from '../../lib/cities';
import type { NatalChartInput, NatalChartResult } from '../../lib/natalChart';
import NatalChartView from '../../components/NatalChartView';

export default function NatalChartPage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<NatalChartResult | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

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

  const [isCalculating, setIsCalculating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    setError('');
    setIsCalculating(true);

    try {
      const chartInput: NatalChartInput = {
        name: name.trim(),
        birthDate,
        birthTime: birthTime || null,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
      };

      const response = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chartInput),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Calculation failed. Try again.');
      }

      const chart: NatalChartResult = await response.json();
      setResult(chart);

      const saveResponse = await fetch('/api/saved-people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...chartInput,
          birthLocation: `${selectedCity.name}, ${selectedCity.country}`,
          westernChart: chart,
        }),
      });
      if (saveResponse.ok) {
        setSaveMessage('Saved to this person’s account.');
      } else if (saveResponse.status === 401) {
        setSaveMessage('Sign in to save this person and chart.');
      } else {
        setSaveMessage('The chart calculated successfully. Saving needs attention.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Calculation failed. Try again.',
      );
    } finally {
      setIsCalculating(false);
    }
  }

  function handleStartOver() {
    setResult(null);
    setSaveMessage('');
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="natal-chart-title">
        <header className="seenFlowHeader">
          <h1 id="natal-chart-title" className="seenDisplayLarge">
            Western Natal Chart
          </h1>

          <p className="seenFlowIntroduction">
            Tropical planetary positions, Chiron, Black Moon Lilith, lunar
            nodes, Placidus houses, and major aspects — calculated with Swiss
            Ephemeris.
          </p>

          <div className="seenDivider" aria-hidden="true" />
          <Link className="seenButtonSecondary" href="/account">Saved people</Link>
        </header>

        {!result && (
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
                  placeholder="Full name"
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
              <label className="seenLabel" htmlFor="chart-time">
                Time of birth
              </label>
              <p className="seenFieldSupport">
                Optional. Without it, the Ascendant, Midheaven, and houses
                can&apos;t be calculated, so they&apos;re left out rather than
                guessed.
              </p>
              <div className="seenInputFrame">
                <input
                  id="chart-time"
                  className="seenInput"
                  type="time"
                  value={birthTime}
                  onChange={(event) => setBirthTime(event.target.value)}
                />
              </div>
            </div>

            <div className="seenField">
              <label className="seenLabel" htmlFor="chart-city">
                Birth location
              </label>
              <div className="seenInputFrame">
                <span className="seenFieldIcon" aria-hidden="true">
                  ⟡
                </span>
                <input
                  id="chart-city"
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

            <button className="seenButtonPrimary" type="submit" disabled={isCalculating}>
              {isCalculating ? 'Calculating…' : 'Calculate chart'}
              {!isCalculating && <span aria-hidden="true">→</span>}
            </button>
          </form>
        )}

        {result && <ChartResults result={result} saveMessage={saveMessage} onStartOver={handleStartOver} />}
      </section>
    </main>
  );
}

function ChartResults({
  result,
  saveMessage,
  onStartOver,
}: {
  result: NatalChartResult;
  saveMessage: string;
  onStartOver: () => void;
}) {
  return (
    <div className="seenPanel seenFlowForm">
      <div className="seenField">
        <span className="seenLabel">{result.name}&apos;s chart</span>
        {saveMessage && <p className="seenFieldSupport">{saveMessage}</p>}
        {saveMessage.startsWith('Sign in') && <Link href="/auth">Sign in or create an account →</Link>}
      </div>

      <NatalChartView result={result} />

      <button className="seenButtonSecondary" type="button" onClick={onStartOver}>
        Calculate another chart
      </button>
    </div>
  );
}
