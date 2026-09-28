'use client';

import { useEffect, useRef, useState } from 'react';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

const PLACARDS = [
  { id: 'intake', kicker: 'Intake', title: 'The mark' },
  { id: 'western', kicker: 'Field', title: 'Western' },
  { id: 'hellenistic', kicker: 'Field', title: 'Hellenistic' },
  { id: 'tzolkin', kicker: 'Field', title: 'Tzolkin' },
  { id: 'bazi', kicker: '4 pillars', title: 'Bazi' },
  { id: 'vedic', kicker: 'Field', title: 'Vedic' },
  { id: 'numerology', kicker: 'Field', title: 'Numerology' },
  { id: 'galaxy', kicker: 'Galaxy', title: 'Signature' },
  { id: 'trio', kicker: 'Galaxy', title: 'Trio' },
  { id: 'galaxy-time', kicker: 'Galaxy', title: 'Time' },
  { id: 'location', kicker: 'Incubator', title: 'Location' },
] as const;

type PlacardId = (typeof PLACARDS)[number]['id'];

type Stay = {
  city: string;
  sixMonths: boolean;
  from: string;
  until: string;
  clock: string;
};

type Drag = {
  id: PlacardId;
  x: number;
  y: number;
  dx: number;
  dy: number;
};

export default function SeenEntry() {
  const stageRef = useRef<HTMLElement | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Partial<Record<PlacardId, HTMLElement | null>>>({});
  const dragRef = useRef<Drag | null>(null);
  const droppedRef = useRef<PlacardId[]>([]);

  const [dropped, setDropped] = useState<PlacardId[]>([]);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [open, setOpen] = useState<PlacardId | null>(null);
  const [personX, setPersonX] = useState('');
  const [personY, setPersonY] = useState('');
  const [mark, setMark] = useState('');
  const [resonance, setResonance] = useState('');
  const [place, setPlace] = useState('');
  const [draftCity, setDraftCity] = useState('');
  const [stays, setStays] = useState<Stay[]>([]);

  useEffect(() => {
    droppedRef.current = dropped;
  }, [dropped]);

  useEffect(() => {
    let frame = 0;
    const tick = (t: number) => {
      const stage = stageRef.current;
      const riding = PLACARDS.filter(
        (card) => !droppedRef.current.includes(card.id) && dragRef.current?.id !== card.id,
      );
      if (stage && riding.length) {
        const breathe = Math.sin(t / 1700);
        const rx = stage.clientWidth * (0.34 + breathe * 0.03);
        const ry = stage.clientHeight * (0.36 + breathe * 0.055);
        riding.forEach((card, index) => {
          const el = cardRefs.current[card.id];
          if (!el) return;
          const angle = t / 11000 + (index / riding.length) * Math.PI * 2;
          const depth = (Math.sin(angle) + 1) / 2;
          el.style.transform = `translate(${Math.cos(angle) * rx}px, ${Math.sin(angle) * ry}px) scale(${0.78 + depth * 0.22})`;
          el.style.opacity = String(0.38 + depth * 0.62);
          el.style.zIndex = String(8 + Math.round(depth * 24));
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function addStay(label?: string) {
    const city = (label ?? draftCity).trim();
    if (city.length < 2) return;
    setStays((rows) =>
      rows.some((row) => row.city.toLowerCase() === city.toLowerCase())
        ? rows
        : [...rows, { city, sixMonths: false, from: '', until: '', clock: '' }],
    );
    setDraftCity('');
  }

  function updateStay(city: string, patch: Partial<Stay>) {
    setStays((rows) => rows.map((row) => (row.city === city ? { ...row, ...patch } : row)));
  }

  function pointerDown(event: React.PointerEvent<HTMLElement>, id: PlacardId) {
    if (droppedRef.current.includes(id)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = {
      id,
      x: rect.left,
      y: rect.top,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
    };
    dragRef.current = next;
    setDrag(next);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: React.PointerEvent<HTMLElement>) {
    const current = dragRef.current;
    if (!current) return;
    const next = {
      ...current,
      x: event.clientX - current.dx,
      y: event.clientY - current.dy,
    };
    dragRef.current = next;
    setDrag(next);
  }

  function pointerUp(event: React.PointerEvent<HTMLElement>) {
    const current = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!current) return;
    const poster = posterRef.current?.getBoundingClientRect();
    const hit =
      poster &&
      event.clientX >= poster.left &&
      event.clientX <= poster.right &&
      event.clientY >= poster.top &&
      event.clientY <= poster.bottom;
    if (hit) {
      setDropped((rows) => (rows.includes(current.id) ? rows : [...rows, current.id]));
      setOpen(current.id);
    }
  }

  const openCard = PLACARDS.find((card) => card.id === open);

  return (
    <main className="seenAlivePage">
      <header className="seenAliveHead">
        <span>SEEN</span>
        <small>Drag a placard onto the poster. Roots deepen, then the loop closes.</small>
      </header>

      <section className="seenStage" ref={stageRef} aria-label="Living poster">
        <div className="seenPosterLive" ref={posterRef}>
          <img src="/foundation/seen-poster.jpg" alt="" />
          <svg className="seenRoots" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="root a" d="M50 62 C 47 74, 42 82, 34 96" />
            <path className="root b" d="M50 62 C 53 76, 61 84, 70 97" />
            <path className="root c" d="M50 63 C 49 78, 48 86, 46 98" />
            <path className="root d" d="M50 64 C 56 78, 54 88, 58 98" />
            <path className="root e" d="M49 66 C 40 80, 36 88, 28 98" />
          </svg>
          <div className="seenPulse" />
          {dropped.length > 0 && (
            <div className="seenCombined">
              {dropped.map((id) => {
                const card = PLACARDS.find((item) => item.id === id);
                if (!card) return null;
                return (
                  <button key={id} type="button" className={open === id ? 'on' : ''} onClick={() => setOpen(id)}>
                    {card.title}
                    <i
                      role="presentation"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDropped((rows) => rows.filter((row) => row !== id));
                        setOpen((current) => (current === id ? null : current));
                      }}
                    >
                      ×
                    </i>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {PLACARDS.filter((card) => !dropped.includes(card.id)).map((card, index, ridingCards) => {
          const riding = drag?.id === card.id;
          const angle = (index / ridingCards.length) * Math.PI * 2 - Math.PI / 2;
          const parked = {
            transform: `translate(${Math.cos(angle) * 132}px, ${Math.sin(angle) * 168}px)`,
            opacity: 1,
            zIndex: 6,
          };
          return (
            <article
              key={card.id}
              ref={(node) => {
                cardRefs.current[card.id] = node;
              }}
              className={riding ? 'seenPlacard dragging' : 'seenPlacard'}
              style={riding ? { left: drag.x, top: drag.y, transform: 'none', opacity: 1, zIndex: 40 } : parked}
              onPointerDown={(event) => pointerDown(event, card.id)}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
            >
              <b>{card.kicker}</b>
              <h2>{card.title}</h2>
            </article>
          );
        })}
      </section>

      {openCard && (
        <section className="seenSheet" aria-label={openCard.title}>
          <header>
            <b>{openCard.kicker}</b>
            <h2>{openCard.title}</h2>
            <button type="button" onClick={() => setOpen(null)}>
              Close
            </button>
          </header>

          {open === 'intake' && (
            <div className="seenSheetGrid">
              <label>
                Person X
                <input value={personX} placeholder="Person X" onChange={(event) => setPersonX(event.target.value)} />
              </label>
              <label>
                Person Y
                <input value={personY} placeholder="Person Y" onChange={(event) => setPersonY(event.target.value)} />
              </label>
              <label>
                Place
                <input value={place} placeholder="Where" onChange={(event) => setPlace(event.target.value)} />
              </label>
              <label>
                The mark
                <input type="date" value={mark} onChange={(event) => setMark(event.target.value)} />
              </label>
              <label>
                Resonance
                <input type="time" value={resonance} onChange={(event) => setResonance(event.target.value)} />
              </label>
            </div>
          )}

          {open === 'location' && (
            <form
              className="seenSheetGrid"
              onSubmit={(event) => {
                event.preventDefault();
                addStay();
              }}
            >
              <p>The soil. Six months or more, and the calendar span they were in that place.</p>
              <label className="wide">
                City
                <LocationAutocompleteInput
                  className="seenPlacardInput"
                  ariaLabel="City"
                  placeholder="Search a city"
                  value={draftCity}
                  onChange={setDraftCity}
                  onLocationEntered={(label) => addStay(label)}
                />
              </label>
              <button type="submit">Add city</button>
              {stays.map((stay) => (
                <fieldset key={stay.city}>
                  <legend>{stay.city}</legend>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={stay.sixMonths}
                      onChange={(event) => updateStay(stay.city, { sixMonths: event.target.checked })}
                    />
                    Six months or more
                  </label>
                  <label>
                    From
                    <input type="date" value={stay.from} onChange={(event) => updateStay(stay.city, { from: event.target.value })} />
                  </label>
                  <label>
                    Until
                    <input type="date" value={stay.until} onChange={(event) => updateStay(stay.city, { until: event.target.value })} />
                  </label>
                  <label>
                    Clock
                    <input type="time" value={stay.clock} onChange={(event) => updateStay(stay.city, { clock: event.target.value })} />
                  </label>
                  <button type="button" onClick={() => setStays((rows) => rows.filter((row) => row.city !== stay.city))}>
                    Remove
                  </button>
                </fieldset>
              ))}
            </form>
          )}

          {open !== 'intake' && open !== 'location' && (
            <p>On the poster. This field stays its own. It is not blended into the others.</p>
          )}
        </section>
      )}
    </main>
  );
}
