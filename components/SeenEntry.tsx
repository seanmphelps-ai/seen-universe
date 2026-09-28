'use client';

import { useRef, useState } from 'react';

const CARDS = [
  {
    id: 'forged',
    src: '/foundation/cards/forged.jpg',
    line: 'As above, so below. As within, so without. Pressure makes the pattern. You are what comes out.',
  },
  {
    id: 'forces',
    src: '/foundation/cards/forces.jpg',
    line: 'The planets give the seed. The soil shapes the pressure. Time shows the pattern. You bring it to life.',
  },
  {
    id: 'place',
    src: '/foundation/cards/place.jpg',
    line: 'This universe is the soil. The place the seed sat, and how long it sat there.',
  },
  {
    id: 'mark',
    src: '/foundation/cards/mark.jpg',
    line: 'This universe is the day. The mark of when you came in. Not a personality.',
  },
  {
    id: 'code',
    src: '/foundation/cards/code.jpg',
    line: 'This universe is the count hidden in that day. Its own language.',
  },
  {
    id: 'resonance',
    src: '/foundation/cards/resonance.jpg',
    line: 'This universe is the clock. The rhythm that finishes the day.',
  },
  {
    id: 'ignite',
    src: '/foundation/cards/ignite.jpg',
    line: 'This universe is the convergence. Forge lights the dark chart. The other fields stay their own.',
  },
  {
    id: 'western',
    src: '/foundation/cards/western.jpg',
    line: 'This universe is the tropical wheel. It reads only its own sky.',
  },
  {
    id: 'hellenistic',
    src: '/foundation/cards/hellenistic.jpg',
    line: 'This universe is whole sign and the lots. It does not borrow another sky.',
  },
  {
    id: 'tzolkin',
    src: '/foundation/cards/tzolkin.jpg',
    line: 'This universe is the 260-day count. Its own calendar.',
  },
  {
    id: 'bazi',
    src: '/foundation/cards/bazi.jpg',
    line: 'This universe is four pillars. Year, month, day, hour. Its own clock.',
  },
  {
    id: 'vedic',
    src: '/foundation/cards/vedic.jpg',
    line: 'This universe is the sidereal sky. A different zodiac.',
  },
  {
    id: 'numerology',
    src: '/foundation/cards/numerology.jpg',
    line: 'This universe is the count of the name and the day. It is not a chart.',
  },
  {
    id: 'signature',
    src: '/foundation/cards/signature.jpg',
    line: 'This universe is one galactic seal. The kin.',
  },
  {
    id: 'trio',
    src: '/foundation/cards/trio.jpg',
    line: 'This universe is tone and seal together. The three.',
  },
  {
    id: 'galaxy-time',
    src: '/foundation/cards/galaxy-time.jpg',
    line: 'This universe is the wave. Where that day sits in it.',
  },
] as const;

export default function SeenEntry() {
  const startX = useRef(0);
  const moved = useRef(false);
  const [index, setIndex] = useState(0);
  const count = CARDS.length;

  function turn(dir: number) {
    setIndex((current) => (current + dir + count) % count);
  }

  return (
    <main className="seenAlivePage">
      <div className="seenPosterFrame">
        <img src="/foundation/seen-poster.jpg" alt="" />
      </div>
      <div
        className="seenRail"
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
        {CARDS.map((card, cardIndex) => {
          let delta = cardIndex - index;
          if (delta > count / 2) delta -= count;
          if (delta < -count / 2) delta += count;
          const abs = Math.abs(delta);
          if (abs > 1) return null;
          return (
            <button
              key={card.id}
              type="button"
              className={abs === 0 ? 'seenRailCard front' : 'seenRailCard'}
              style={{
                transform: `translateX(${delta * 28}vw) scale(${abs === 0 ? 1 : 0.78})`,
                zIndex: 10 - abs,
                opacity: abs === 0 ? 1 : 0.92,
              }}
              onClick={() => {
                if (moved.current) return;
                setIndex(cardIndex);
              }}
            >
              <img src={card.src} alt="" />
            </button>
          );
        })}
      </div>
      <p className="seenSynopsis">{CARDS[index].line}</p>
    </main>
  );
}
