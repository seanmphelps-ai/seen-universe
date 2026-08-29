'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { CITIES, type City } from '../../lib/cities';
import type { NatalChartInput, NatalChartResult } from '../../lib/natalChart';

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
        {!result.hasBirthTime && (
          <p className="seenFieldSupport">
            No birth time was given, so this uses noon as a placeholder for
            sign positions only. Ascendant, Midheaven, and houses require a
            real birth time and are not shown.
          </p>
        )}
      </div>

      <NatalChartWheel result={result} />

      <div className="seenField">
        <span className="seenLabel">Planets</span>
        <ul className="seenResultList">
          {result.planets.map((planet) => (
            <li className="seenResultRow" key={planet.key}>
              <span className="seenResultName">{planet.label}</span>
              <span className="seenResultValue">
                {planet.sign} {planet.degreeInSign.toFixed(1)}°
                {planet.retrograde ? ' ℞' : ''}
                {planet.house ? ` · House ${planet.house}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {(result.ascendant || result.midheaven) && (
        <div className="seenField">
          <span className="seenLabel">Angles</span>
          <ul className="seenResultList">
            {result.ascendant && (
              <li className="seenResultRow">
                <span className="seenResultName">Ascendant</span>
                <span className="seenResultValue">
                  {result.ascendant.sign} {result.ascendant.degreeInSign.toFixed(1)}°
                </span>
              </li>
            )}
            {result.midheaven && (
              <li className="seenResultRow">
                <span className="seenResultName">Midheaven</span>
                <span className="seenResultValue">
                  {result.midheaven.sign} {result.midheaven.degreeInSign.toFixed(1)}°
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {result.houses && (
        <div className="seenField">
          <span className="seenLabel">Houses</span>
          <ul className="seenResultList">
            {result.houses.map((house) => (
              <li className="seenResultRow" key={house.house}>
                <span className="seenResultName">House {house.house}</span>
                <span className="seenResultValue">
                  {house.sign} {house.degreeInSign.toFixed(1)}°
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.aspects.length > 0 && (
        <div className="seenField">
          <span className="seenLabel">Major aspects</span>
          <ul className="seenResultList">
            {result.aspects.map((aspect, index) => (
              <li className="seenResultRow" key={index}>
                <span className="seenResultName">
                  {aspect.point1} {aspect.aspect} {aspect.point2}
                </span>
                <span className="seenResultValue">orb {aspect.orb}°</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="seenButtonSecondary" type="button" onClick={onStartOver}>
        Calculate another chart
      </button>
    </div>
  );
}

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', lilith: '⚸', 'north-node': '☊', 'south-node': '☋',
};

function chartPoint(longitude: number, radius: number, ascendant: number) {
  const angle = (180 - (longitude - ascendant)) * Math.PI / 180;
  return { x: 180 + Math.cos(angle) * radius, y: 180 + Math.sin(angle) * radius };
}

function NatalChartWheel({ result }: { result: NatalChartResult }) {
  const ascendant = result.ascendant?.longitude ?? 0;
  const planetByLabel = new Map(result.planets.map((planet) => [planet.label, planet]));

  return (
    <div className="seenChartWheel" aria-label={`Traditional Western natal chart for ${result.name}`}>
      <svg viewBox="0 0 360 360" role="img">
        <title>{result.name}&apos;s Western natal chart</title>
        <circle cx="180" cy="180" r="174" className="seenChartRing" />
        <circle cx="180" cy="180" r="137" className="seenChartRing" />
        <circle cx="180" cy="180" r="91" className="seenChartRing" />

        {ZODIAC_SYMBOLS.map((symbol, index) => {
          const boundary = chartPoint(index * 30, 174, ascendant);
          const label = chartPoint(index * 30 + 15, 155, ascendant);
          return <g key={symbol}>
            <line x1="180" y1="180" x2={boundary.x} y2={boundary.y} className="seenChartDivision" />
            <text x={label.x} y={label.y} className="seenChartZodiac">{symbol}</text>
          </g>;
        })}

        {result.houses?.map((house) => {
          const outer = chartPoint(house.longitude, 137, ascendant);
          const label = chartPoint(house.longitude + 4, 111, ascendant);
          return <g key={house.house}>
            <line x1="180" y1="180" x2={outer.x} y2={outer.y} className="seenChartHouse" />
            <text x={label.x} y={label.y} className="seenChartHouseNumber">{house.house}</text>
          </g>;
        })}

        {result.aspects.map((aspect, index) => {
          const first = planetByLabel.get(aspect.point1);
          const second = planetByLabel.get(aspect.point2);
          if (!first || !second) return null;
          const from = chartPoint(first.longitude, 84, ascendant);
          const to = chartPoint(second.longitude, 84, ascendant);
          return <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`seenChartAspect seenChartAspect${aspect.aspect}`} />;
        })}

        {result.planets.map((planet, index) => {
          const point = chartPoint(planet.longitude, 112 - (index % 2) * 13, ascendant);
          return <text key={planet.key} x={point.x} y={point.y} className="seenChartPlanet">
            {PLANET_SYMBOLS[planet.key]}{planet.retrograde ? '℞' : ''}
          </text>;
        })}
      </svg>
    </div>
  );
}
