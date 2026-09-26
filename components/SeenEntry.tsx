'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

type Lived = { id: string; value: string; startYear: string; endYear: string };

const newLived = (): Lived => ({
  id: crypto.randomUUID(),
  value: '',
  startYear: '',
  endYear: '',
});

export default function SeenEntry() {
  const router = useRouter();
  const [focus, setFocus] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [maternityCity, setMaternityCity] = useState('');
  const [lived, setLived] = useState<Lived[]>([newLived()]);
  const [error, setError] = useState('');

  function saveAndGo() {
    if (!name.trim() || !birthDate || !birthCity.trim()) {
      setError('Name, date, and birth city.');
      setFocus(0);
      return;
    }
    const places = lived.filter((row) => row.value.trim());
    try {
      sessionStorage.setItem('seen.introduction.v2.complete', 'true');
      sessionStorage.setItem('seen.foundation.name', name.trim());
      sessionStorage.setItem('seen.foundation.birthDate', birthDate);
      sessionStorage.setItem(
        'seen.foundation.locations',
        JSON.stringify({
          name: name.trim(),
          birthLocation: birthCity.trim(),
          maternityLocation: maternityCity.trim() || undefined,
          livedLocations: places.map((row) => row.value.trim()),
          livedPeriods: places.map((row) => ({
            location: row.value.trim(),
            startYear: row.startYear,
            endYear: row.endYear,
          })),
        }),
      );
    } catch {}
    router.push('/foundation/birth');
  }

  return (
    <main className="seenBoard">
      <img className="seenBoardWorld" src="/foundation/location-forge-background.png" alt="" />
      <div className="seenBoardVeil" />

      <header className="seenBoardHead">
        <span>SEEN</span>
        <p>Same seed. Different soil. Different tree.</p>
      </header>

      <div className="seenBoardRail">
        <article className={`seenPlacard${focus === 0 ? ' on' : ''}`} onClick={() => setFocus(0)}>
          <em>01</em>
          <h2>PLACE</h2>
          <p>The soil</p>
          <LocationAutocompleteInput className="seenPlacardInput" ariaLabel="Birth city" placeholder="Birth city" value={birthCity} onChange={setBirthCity} />
          <LocationAutocompleteInput className="seenPlacardInput" ariaLabel="Maternity city if different" placeholder="Maternity city if different" value={maternityCity} onChange={setMaternityCity} />
          {lived.map((row, index) => (
            <div key={row.id} className="seenPlacardLived">
              <LocationAutocompleteInput className="seenPlacardInput" ariaLabel={`Lived city ${index + 1}`} placeholder="Lived 6+ months" value={row.value} onChange={(value) => setLived((rows) => rows.map((item) => (item.id === row.id ? { ...item, value } : item)))} />
              <div className="seenPlacardYears">
                <input inputMode="numeric" maxLength={4} placeholder="From" value={row.startYear} onChange={(event) => setLived((rows) => rows.map((item) => (item.id === row.id ? { ...item, startYear: event.target.value.replace(/\D/g, '') } : item)))} />
                <input inputMode="numeric" maxLength={4} placeholder="To" value={row.endYear} onChange={(event) => setLived((rows) => rows.map((item) => (item.id === row.id ? { ...item, endYear: event.target.value.replace(/\D/g, '') } : item)))} />
              </div>
            </div>
          ))}
          <button type="button" className="seenPlacardPlus" onClick={(event) => { event.stopPropagation(); setLived((rows) => [...rows, newLived()]); }}>+</button>
        </article>

        <article className={`seenPlacard${focus === 1 ? ' on' : ''}`} onClick={() => setFocus(1)}>
          <em>02</em>
          <h2>THE MARK</h2>
          <p>The day you entered the world</p>
          <input className="seenPlacardInput" type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="seenPlacardInput" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </article>

        <article className={`seenPlacard${focus === 2 ? ' on' : ''}`} onClick={() => setFocus(2)}>
          <em>03</em>
          <h2>THE CODE</h2>
          <p>Hidden in the day</p>
        </article>

        <article className={`seenPlacard${focus === 3 ? ' on' : ''}`} onClick={() => setFocus(3)}>
          <em>04</em>
          <h2>RESONANCE</h2>
          <p>Your frequency</p>
        </article>

        <button type="button" className={`seenPlacard begin${focus === 4 ? ' on' : ''}`} onClick={saveAndGo}>
          <em>05</em>
          <h2>BEGIN</h2>
          <p>The join</p>
        </button>
      </div>
      {error ? <p className="seenBoardError">{error}</p> : null}
    </main>
  );
}
