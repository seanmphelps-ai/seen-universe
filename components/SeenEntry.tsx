'use client';

import { useRef, useState } from 'react';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

const PLACARDS = [
  { id: 'intake', title: 'Intake', line: 'The mark' },
  { id: 'western', title: 'Western', line: 'Field' },
  { id: 'hellenistic', title: 'Hellenistic', line: 'Field' },
  { id: 'tzolkin', title: 'Tzolkin', line: 'Field' },
  { id: 'bazi', title: 'Bazi', line: '4 pillars' },
  { id: 'vedic', title: 'Vedic', line: 'Field' },
  { id: 'numerology', title: 'Numerology', line: 'Field' },
  { id: 'galaxy', title: 'Signature', line: 'Galaxy' },
  { id: 'trio', title: 'Trio', line: 'Galaxy' },
  { id: 'galaxy-time', title: 'Time', line: 'Galaxy' },
  { id: 'location', title: 'Location', line: 'Incubator' },
] as const;

type PlacardId = (typeof PLACARDS)[number]['id'];

type Stay = {
  city: string;
  sixMonths: boolean;
  from: string;
  until: string;
  clock: string;
};

function Emblem({ id }: { id: PlacardId }) {
  const common = {
    viewBox: '0 0 80 80',
    className: 'seenEmblem',
    'aria-hidden': true as const,
  };
  if (id === 'location' || id === 'intake') {
    return (
      <svg {...common}>
        <circle cx="40" cy="40" r="22" />
        <ellipse cx="40" cy="40" rx="10" ry="22" />
        <path d="M18 40 H62 M40 18 V62" />
      </svg>
    );
  }
  if (id === 'western' || id === 'vedic') {
    return (
      <svg {...common}>
        <circle cx="40" cy="40" r="22" />
        <circle cx="40" cy="40" r="8" />
        <path d="M40 18 V62 M18 40 H62 M24 24 L56 56 M56 24 L24 56" />
      </svg>
    );
  }
  if (id === 'hellenistic') {
    return (
      <svg {...common}>
        <path d="M40 16 L64 60 H16 Z" />
        <circle cx="40" cy="44" r="6" />
      </svg>
    );
  }
  if (id === 'tzolkin') {
    return (
      <svg {...common}>
        <rect x="18" y="18" width="44" height="44" />
        <path d="M28 40 H52 M40 28 V52 M24 24 H56 V56 H24 Z" />
      </svg>
    );
  }
  if (id === 'bazi') {
    return (
      <svg {...common}>
        <path d="M22 22 V58 M34 30 V58 M46 18 V58 M58 26 V58" />
      </svg>
    );
  }
  if (id === 'numerology') {
    return (
      <svg {...common}>
        <circle cx="28" cy="40" r="8" />
        <circle cx="40" cy="28" r="8" />
        <circle cx="52" cy="40" r="8" />
        <circle cx="40" cy="52" r="8" />
      </svg>
    );
  }
  if (id === 'trio') {
    return (
      <svg {...common}>
        <path d="M24 46 L28 34 L32 46 M38 50 L40 30 L42 50 M50 44 L56 28 L62 44" />
      </svg>
    );
  }
  if (id === 'galaxy-time') {
    return (
      <svg {...common}>
        <path d="M12 40 C 22 28, 30 52, 40 40 S 58 28, 68 40" />
        <circle cx="40" cy="40" r="3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M40 16 L44 34 L62 34 L48 46 L54 64 L40 52 L26 64 L32 46 L18 34 L36 34 Z" />
    </svg>
  );
}

export default function SeenEntry() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef(0);
  const moved = useRef(false);
  const [index, setIndex] = useState(0);
  const [onPoster, setOnPoster] = useState<PlacardId[]>([]);
  const [open, setOpen] = useState<PlacardId | null>(null);
  const [personX, setPersonX] = useState('');
  const [personY, setPersonY] = useState('');
  const [place, setPlace] = useState('');
  const [mark, setMark] = useState('');
  const [resonance, setResonance] = useState('');
  const [draftCity, setDraftCity] = useState('');
  const [stays, setStays] = useState<Stay[]>([]);

  const count = PLACARDS.length;

  function turn(dir: number) {
    setIndex((current) => (current + dir + count) % count);
  }

  function placeOnPoster(id: PlacardId) {
    setOnPoster((rows) => (rows.includes(id) ? rows : [...rows, id]));
    setOpen(id);
  }

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

  const front = PLACARDS[index];

  return (
    <main className="seenAlivePage">
      <header className="seenAliveHead">
        <span>SEEN</span>
        <small>Swipe the rail. Tap the front placard and it goes onto the poster.</small>
      </header>

      <div
        className="seenPosterFrame"
        ref={posterRef}
        onPointerUp={(event) => {
          const box = posterRef.current?.getBoundingClientRect();
          if (!box) return;
          const inside =
            event.clientX >= box.left &&
            event.clientX <= box.right &&
            event.clientY >= box.top &&
            event.clientY <= box.bottom;
          if (inside && event.currentTarget === event.target) return;
        }}
      >
        <img src="/foundation/seen-poster.jpg" alt="SEEN. Same seed. Different soil. Different tree." />
        {onPoster.length > 0 && (
          <div className="seenNested">
            {onPoster.map((id) => {
              const card = PLACARDS.find((item) => item.id === id);
              if (!card) return null;
              return (
                <button key={id} type="button" className={open === id ? 'on' : ''} onClick={() => setOpen(id)}>
                  {card.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="seenRail"
        ref={railRef}
        onPointerDown={(event) => {
          startX.current = event.clientX;
          moved.current = false;
        }}
        onPointerUp={(event) => {
          const delta = event.clientX - startX.current;
          if (delta > 36) {
            moved.current = true;
            turn(-1);
          } else if (delta < -36) {
            moved.current = true;
            turn(1);
          }
        }}
      >
        <button type="button" className="seenRailNudge left" onClick={() => turn(-1)} aria-label="Previous placard">
          ‹
        </button>
        {PLACARDS.map((card, cardIndex) => {
          let delta = cardIndex - index;
          if (delta > count / 2) delta -= count;
          if (delta < -count / 2) delta += count;
          const abs = Math.abs(delta);
          if (abs > 2) return null;
          return (
            <article
              key={card.id}
              className={delta === 0 ? 'seenRailCard front' : 'seenRailCard'}
              style={{
                transform: `translateX(${delta * 86}px) scale(${delta === 0 ? 1 : 0.86})`,
                zIndex: 10 - abs,
                opacity: 1 - abs * 0.18,
              }}
              onClick={() => {
                if (moved.current) return;
                if (delta === 0) placeOnPoster(card.id);
                else setIndex(cardIndex);
              }}
            >
              <b>{String(cardIndex + 1).padStart(2, '0')}</b>
              <h2>{card.title}</h2>
              <Emblem id={card.id} />
              <p>{card.line}</p>
            </article>
          );
        })}
        <button type="button" className="seenRailNudge right" onClick={() => turn(1)} aria-label="Next placard">
          ›
        </button>
      </div>

      {open && (
        <section className="seenSheet" aria-label={front.title}>
          <header>
            <b>{PLACARDS.find((card) => card.id === open)?.line}</b>
            <h2>{PLACARDS.find((card) => card.id === open)?.title}</h2>
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
              <p>Six months or more, and the calendar span in that place.</p>
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
                </fieldset>
              ))}
            </form>
          )}
          {open !== 'intake' && open !== 'location' && (
            <p>On the poster. This one stays its own field.</p>
          )}
        </section>
      )}
    </main>
  );
}
