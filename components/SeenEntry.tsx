'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

type Person = { id: string; name: string };
type Plate = 'place' | 'mark' | 'western' | 'wound' | 'bazi' | 'galactic' | 'key';

const PLATES: { id: Plate; label: string }[] = [
  { id: 'place', label: 'PLACE' },
  { id: 'mark', label: 'THE MARK' },
  { id: 'western', label: 'WESTERN' },
  { id: 'wound', label: 'WOUND' },
  { id: 'bazi', label: 'BAZI' },
  { id: 'galactic', label: 'GALACTIC' },
  { id: 'key', label: 'KEY' },
];

export default function SeenEntry() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([
    { id: 'you', name: 'You' },
    { id: 'other', name: 'The other' },
  ]);
  const [frontPerson, setFrontPerson] = useState('you');
  const [ring, setRing] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');

  const plate = PLATES[ring];

  function spin(dir: number) {
    setRing((i) => (i + dir + PLATES.length) % PLATES.length);
  }

  function go() {
    sessionStorage.setItem('seen.introduction.v2.complete', 'true');
    sessionStorage.setItem('seen.foundation.name', name.trim() || people.find((p) => p.id === frontPerson)?.name || 'You');
    sessionStorage.setItem('seen.foundation.birthDate', birthDate);
    sessionStorage.setItem('seen.foundation.locations', JSON.stringify({ birthLocation: birthCity.trim() }));
    router.push('/foundation/birth');
  }

  return (
    <main className="seenTree">
      <img className="seenTreeWorld" src="/foundation/location-forge-background.png" alt="" />
      <div className="seenTreeVeil" />

      <header className="seenTreeHead">SEEN</header>

      <div className="seenRing">
        <button type="button" className="seenRingGhost left" onClick={() => spin(-1)}>
          {PLATES[(ring - 1 + PLATES.length) % PLATES.length].label}
        </button>
        <article className="seenRingFront">
          <b>{String(ring + 1).padStart(2, '0')}</b>
          <h1>{plate.label}</h1>
          {plate.id === 'place' && (
            <LocationAutocompleteInput className="seenPlacardInput" ariaLabel="Birth city" placeholder="Birth city" value={birthCity} onChange={setBirthCity} />
          )}
          {plate.id === 'mark' && (
            <>
              <input className="seenPlacardInput" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="seenPlacardInput" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </>
          )}
        </article>
        <button type="button" className="seenRingGhost right" onClick={() => spin(1)}>
          {PLATES[(ring + 1) % PLATES.length].label}
        </button>
      </div>

      <nav className="seenPeople" aria-label="People">
        {people.map((person) => (
          <button
            key={person.id}
            type="button"
            className={frontPerson === person.id ? 'on' : ''}
            onClick={() => setFrontPerson(person.id)}
          >
            {person.name}
          </button>
        ))}
        <button
          type="button"
          className="add"
          onClick={() =>
            setPeople((rows) => [...rows, { id: crypto.randomUUID(), name: `Person ${rows.length + 1}` }])
          }
        >
          +
        </button>
      </nav>
      <p className="seenTreeHint">Front person is the body. Flick the ring. Drop the plate on them later.</p>
      <button type="button" className="seenPlacardPlus" onClick={go}>Begin</button>
    </main>
  );
}
