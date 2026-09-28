'use client';

import { useRef, useState } from 'react';

const CARDS = [
  { id: 'forged', src: '/foundation/cards/forged.jpg' },
  { id: 'forces', src: '/foundation/cards/forces.jpg' },
  { id: 'place', src: '/foundation/cards/place.jpg' },
  { id: 'mark', src: '/foundation/cards/mark.jpg' },
  { id: 'code', src: '/foundation/cards/code.jpg' },
  { id: 'resonance', src: '/foundation/cards/resonance.jpg' },
  { id: 'ignite', src: '/foundation/cards/ignite.jpg' },
  { id: 'western', src: '/foundation/cards/western.jpg' },
  { id: 'hellenistic', src: '/foundation/cards/hellenistic.jpg' },
  { id: 'tzolkin', src: '/foundation/cards/tzolkin.jpg' },
  { id: 'bazi', src: '/foundation/cards/bazi.jpg' },
  { id: 'vedic', src: '/foundation/cards/vedic.jpg' },
  { id: 'numerology', src: '/foundation/cards/numerology.jpg' },
  { id: 'signature', src: '/foundation/cards/signature.jpg' },
  { id: 'trio', src: '/foundation/cards/trio.jpg' },
  { id: 'galaxy-time', src: '/foundation/cards/galaxy-time.jpg' },
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
    </main>
  );
}
