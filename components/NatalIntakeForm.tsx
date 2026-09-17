'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CITIES, type City } from '../lib/cities';
import type { NatalChartInput, NatalChartResult } from '../lib/natalChart';

type NatalIntakeFormProps = {
  title: string;
  onResolved: (chart: NatalChartResult, input: NatalChartInput & { birthLocation: string }) => void;
};

export default function NatalIntakeForm({ title, onResolved }: NatalIntakeFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const citySuggestions = useMemo(() => {
    const query = cityQuery.trim().toLowerCase();
    if (!query || selectedCity) return [];
    return CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query),
    ).slice(0, 8);
  }, [cityQuery, selectedCity]);

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
        throw new Error(body?.error || 'Calculation failed.');
      }
      const chart: NatalChartResult = await response.json();
      onResolved(chart, {
        ...chartInput,
        birthLocation: `${selectedCity.name}, ${selectedCity.country}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed.');
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <form className="seenPanel seenFlowForm" onSubmit={handleSubmit}>
      <span className="seenLabel">{title}</span>
      <div className="seenField">
        <label className="seenLabel" htmlFor={`${title}-name`}>Name</label>
        <div className="seenInputFrame">
          <input
            id={`${title}-name`}
            className="seenInput"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="seenField">
        <label className="seenLabel" htmlFor={`${title}-date`}>Date of birth</label>
        <div className="seenInputFrame">
          <input
            id={`${title}-date`}
            className="seenInput"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </div>
      </div>
      <div className="seenField">
        <label className="seenLabel" htmlFor={`${title}-time`}>Time of birth</label>
        <p className="seenFieldSupport">Optional. Houses and angles stay out unless a real time is given.</p>
        <div className="seenInputFrame">
          <input
            id={`${title}-time`}
            className="seenInput"
            type="time"
            value={birthTime}
            onChange={(event) => setBirthTime(event.target.value)}
          />
        </div>
      </div>
      <div className="seenField">
        <label className="seenLabel" htmlFor={`${title}-city`}>Birth location</label>
        <div className="seenInputFrame">
          <input
            id={`${title}-city`}
            className="seenInput"
            value={cityQuery}
            onChange={(event) => {
              setCityQuery(event.target.value);
              setSelectedCity(null);
            }}
            autoComplete="off"
            placeholder="City"
          />
        </div>
        {citySuggestions.length > 0 && (
          <ul className="seenResultList">
            {citySuggestions.map((city) => (
              <li className="seenResultRow" key={`${city.name}-${city.country}`}>
                <button
                  type="button"
                  className="seenResultName"
                  onClick={() => {
                    setSelectedCity(city);
                    setCityQuery(`${city.name}, ${city.country}`);
                  }}
                >
                  {city.name}, {city.country}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="seenFormError" role="alert">{error}</p>}
      <button className="seenButtonPrimary" type="submit" disabled={isCalculating}>
        {isCalculating ? 'Calculating…' : `Calculate ${title}`}
      </button>
    </form>
  );
}
