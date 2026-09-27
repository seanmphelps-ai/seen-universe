'use client';

import { useState } from 'react';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

const BANDS = [
  { name: 'Western', radius: 48, speed: '34s', back: false },
  { name: 'Vedic', radius: 44, speed: '46s', back: true },
  { name: 'Hellenistic', radius: 40, speed: '58s', back: false },
  { name: 'Numerology', radius: 36, speed: '40s', back: true },
  { name: 'Dreamspell', radius: 32, speed: '70s', back: false },
  { name: 'Bazi', radius: 28, speed: '52s', back: true },
  { name: 'Portals', radius: 24, speed: '28s', back: false },
  { name: 'Time', radius: 21, speed: '64s', back: true },
] as const;

type When = 'past' | 'ahead';

export default function SeenEntry() {
  const [personX, setPersonX] = useState('');
  const [personY, setPersonY] = useState('');
  const [when, setWhen] = useState<When>('past');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [draftCity, setDraftCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  function addCity(label?: string) {
    const next = (label ?? draftCity).trim();
    if (next.length < 2) return;
    setCities((rows) => (rows.some((row) => row.toLowerCase() === next.toLowerCase()) ? rows : [...rows, next]));
    setDraftCity('');
  }

  const people = [personX.trim(), personY.trim()].filter(Boolean);
  const held = people.length > 0 || cities.length > 0 || start;
  const whenLine = when === 'past' ? 'A time that already happened' : 'A time still coming';

  return (
    <main className="seenWheelPage">
      <img className="seenWheelWorld" src="/foundation/seen-poster.jpg" alt="" />
      <div className="seenWheelVeil" />

      <header className="seenWheelHead">
        <span>SEEN</span>
        <small>Same seed. Different soil. Different tree.</small>
      </header>

      <section className="seenOrbit" aria-label="Modality wheel">
        {BANDS.map((band) => (
          <div
            key={band.name}
            className={band.back ? 'seenBand back' : 'seenBand'}
            style={{
              width: `${band.radius * 2}%`,
              height: `${band.radius * 2}%`,
              animationDuration: band.speed,
            }}
          >
            <b style={{ animationDuration: band.speed }}>{band.name}</b>
          </div>
        ))}
        <div className="seenHub">
          <b>Forge</b>
          <p>{held ? whenLine : 'The convergence'}</p>
        </div>
      </section>

      {cities.length > 0 && (
        <ul className="seenCityMarks">
          {cities.map((city) => (
            <li key={city}>
              {city}
              <button type="button" onClick={() => setCities((rows) => rows.filter((row) => row !== city))} aria-label={`Remove ${city}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="seenReplay"
        onSubmit={(event) => {
          event.preventDefault();
          addCity();
        }}
      >
        <p className="seenReplayLead">Not a birth. A weekend, a trip, a stretch of days.</p>
        <div className="seenWhen">
          <button type="button" className={when === 'past' ? 'on' : ''} onClick={() => setWhen('past')}>
            Already happened
          </button>
          <button type="button" className={when === 'ahead' ? 'on' : ''} onClick={() => setWhen('ahead')}>
            Still coming
          </button>
        </div>
        <label>
          Person X
          <input value={personX} placeholder="Person X" onChange={(event) => setPersonX(event.target.value)} />
        </label>
        <label>
          Person Y
          <input value={personY} placeholder="Person Y" onChange={(event) => setPersonY(event.target.value)} />
        </label>
        <label>
          From
          <input type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </label>
        <label>
          Until
          <input type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
        </label>
        <label className="seenCityField">
          City
          <LocationAutocompleteInput
            className="seenPlacardInput"
            ariaLabel="City"
            placeholder="Search a city"
            value={draftCity}
            onChange={setDraftCity}
            onLocationEntered={(label) => addCity(label)}
          />
        </label>
        <button type="submit">Add city</button>
      </form>

      <p className="seenHeld">
        {held
          ? `${whenLine}. ${people.join(' and ') || 'Two people'}. ${cities.join(', ') || 'No city yet'}.${start ? ` ${start}` : ''}${end ? ` to ${end}` : ''}. Each band stays its own field. This wheel does not guess which place is easier.`
          : 'Put in the two people, the cities, and the days. Past or ahead.'}
      </p>
    </main>
  );
}
