'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

type Cocoon =
  | 'Western'
  | 'Vedic'
  | 'Hellenistic'
  | 'Numerology'
  | 'Dreamspell'
  | 'Bazi'
  | 'Portals'
  | 'Time';

const COCOONS: Cocoon[] = [
  'Western',
  'Vedic',
  'Hellenistic',
  'Numerology',
  'Dreamspell',
  'Bazi',
  'Portals',
  'Time',
];

const INTAKE = ['Person X', 'Person Y', 'Location', 'Calendar', 'Clock'] as const;

export default function SeenEntry() {
  const router = useRouter();
  const centerRef = useRef<HTMLElement | null>(null);
  const drag = useRef<Cocoon | null>(null);
  const [personX, setPersonX] = useState('');
  const [personY, setPersonY] = useState('');
  const [location, setLocation] = useState('');
  const [calendar, setCalendar] = useState('');
  const [clock, setClock] = useState('');
  const [spin, setSpin] = useState(0);
  const [center, setCenter] = useState<Cocoon | null>(null);
  const [over, setOver] = useState(false);

  const cards = [...INTAKE, ...COCOONS];

  function valueOf(label: string) {
    if (label === 'Person X') return personX;
    if (label === 'Person Y') return personY;
    if (label === 'Location') return location;
    if (label === 'Calendar') return calendar;
    if (label === 'Clock') return clock;
    return '';
  }

  function place(index: number) {
    const count = cards.length;
    let delta = index - spin;
    delta = ((delta % count) + count) % count;
    if (delta > count / 2) delta -= count;
    const fade = Math.min(1, Math.abs(delta) / 3);
    return {
      transform: `translateX(${delta * 86}px) scale(${1 - Math.abs(delta) * 0.08})`,
      opacity: 1 - fade * 0.78,
      zIndex: 20 - Math.abs(delta),
    };
  }

  function hitCenter(x: number, y: number) {
    const zone = centerRef.current?.getBoundingClientRect();
    if (!zone) return false;
    return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
  }

  function begin() {
    sessionStorage.setItem('seen.introduction.v2.complete', 'true');
    sessionStorage.setItem('seen.foundation.name', personX.trim() || 'Person X');
    sessionStorage.setItem('seen.foundation.otherName', personY.trim() || 'Person Y');
    sessionStorage.setItem('seen.foundation.birthDate', calendar);
    sessionStorage.setItem('seen.foundation.birthTime', clock);
    sessionStorage.setItem(
      'seen.foundation.locations',
      JSON.stringify({ birthLocation: location.trim() }),
    );
    if (center) sessionStorage.setItem('seen.foundation.cocoon', center);
    router.push('/foundation/birth');
  }

  return (
    <main className="seenTree">
      <img className="seenTreeWorld" src="/foundation/location-forge-background.png" alt="" />
      <div className="seenTreeVeil" />

      <header className="seenTreeHead">
        <span>SEEN</span>
        <small>Same seed. Different soil. Different tree.</small>
      </header>

      <section className="seenBoard">
        <aside className="seenPlate">
          <b>How you are forged</b>
          <p>As above. So below. As within. So without.</p>
        </aside>

        <article
          id="seen-center"
          ref={centerRef}
          className={over ? 'seenCenter hot' : 'seenCenter'}
        >
          {center ? (
            <>
              <b>Independent</b>
              <h1>{center}</h1>
              <p>This cocoon only. The others stay on the wheel.</p>
            </>
          ) : (
            <p>Drag a cocoon here. It reads alone.</p>
          )}
        </article>

        <aside className="seenPlate">
          <b>The forces</b>
          <p>The seed is the chart. The soil is the place and the time. You bring the two people.</p>
        </aside>
      </section>

      <section className="seenJev" aria-label="Jev map">
        <header>
          <b>Jev map</b>
          <span>All present. Nothing hidden.</span>
        </header>
        <label>
          Person X
          <input value={personX} placeholder="Person X" onChange={(e) => setPersonX(e.target.value)} />
        </label>
        <label>
          Person Y
          <input value={personY} placeholder="Person Y" onChange={(e) => setPersonY(e.target.value)} />
        </label>
        <label>
          Location
          <LocationAutocompleteInput
            className="seenPlacardInput"
            ariaLabel="Location"
            placeholder="Location"
            value={location}
            onChange={setLocation}
          />
        </label>
        <label>
          Calendar
          <input type="date" value={calendar} onChange={(e) => setCalendar(e.target.value)} />
        </label>
        <label>
          Clock
          <input type="time" value={clock} onChange={(e) => setClock(e.target.value)} />
        </label>
        <p className="seenJevCocoons">
          {COCOONS.map((name) => (
            <i key={name} className={center === name ? 'on' : ''}>
              {name}
            </i>
          ))}
        </p>
      </section>

      <div className="seenWheel">
        <button type="button" className="seenSpin" onClick={() => setSpin((n) => n - 1)} aria-label="Turn the wheel back">
          ‹
        </button>
        <div className="seenWheelRail">
          {cards.map((label, index) => {
            const cocoon = COCOONS.find((name) => name === label);
            return (
              <article
                key={label}
                className={cocoon ? 'seenCard cocoon' : 'seenCard'}
                style={place(index)}
                onClick={() => setSpin(index)}
                onPointerDown={(e) => {
                  if (!cocoon) return;
                  drag.current = cocoon;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!drag.current) return;
                  setOver(hitCenter(e.clientX, e.clientY));
                }}
                onPointerUp={(e) => {
                  if (drag.current && hitCenter(e.clientX, e.clientY)) setCenter(drag.current);
                  drag.current = null;
                  setOver(false);
                }}
              >
                <b>{String(index + 1).padStart(2, '0')}</b>
                <h2>{label}</h2>
                {!cocoon && <em>{valueOf(label) || '—'}</em>}
              </article>
            );
          })}
        </div>
        <button type="button" className="seenSpin" onClick={() => setSpin((n) => n + 1)} aria-label="Turn the wheel forward">
          ›
        </button>
      </div>

      <button type="button" className="seenPlacardPlus" onClick={begin}>
        Begin
      </button>
    </main>
  );
}
