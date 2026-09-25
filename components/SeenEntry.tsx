'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveExperienceMode } from '../lib/seen/experienceMode';

const CARDS = [
  {
    id: 'closure',
    num: '00',
    title: 'CLOSURE',
    sub: '& COMPOSURE',
    use: 'Someone else\u2019s chart. The first trust.',
    href: 'multi',
  },
  {
    id: 'place',
    num: '01',
    title: 'PLACE',
    sub: 'THE SOIL',
    use: 'Where you are changes everything.',
    href: 'location',
  },
  {
    id: 'mark',
    num: '02',
    title: 'THE MARK',
    sub: 'THE DAY',
    use: 'The day you entered the world.',
    href: 'location',
  },
  {
    id: 'code',
    num: '03',
    title: 'THE CODE',
    sub: 'HIDDEN IN THE DAY',
    use: 'Logic and pattern in the birthday.',
    href: 'location',
  },
  {
    id: 'resonance',
    num: '04',
    title: 'RESONANCE',
    sub: 'YOUR FREQUENCY',
    use: 'Time and rhythm that complete you.',
    href: 'location',
  },
  {
    id: 'forge',
    num: '05',
    title: 'FORGE',
    sub: 'THE JOIN',
    use: 'The act that binds the layers.',
    href: 'location',
  },
  {
    id: 'cadence',
    num: '06',
    title: 'CADENCE',
    sub: '260 DAYS',
    use: 'Earth time. Not clock time.',
    href: 'single',
  },
] as const;

export default function SeenEntry() {
  const router = useRouter();
  const [focus, setFocus] = useState(0);

  function go(card: (typeof CARDS)[number]) {
    const mode = card.href === 'multi' ? 'multi_person' : 'single_person';
    const resolved = resolveExperienceMode({ mode });
    try {
      sessionStorage.setItem('seen:experience-mode', JSON.stringify(resolved));
      sessionStorage.setItem('seen:entry-card', card.id);
    } catch {}
    if (card.href === 'multi' || resolved.next !== 'person_a_foundation') {
      router.push('/closure');
      return;
    }
    router.push('/foundation/location');
  }

  return (
    <main className="seenDepth">
      <img className="seenDepthWorld" src="/foundation/location-forge-background.png" alt="" />
      <div className="seenDepthVeil" />

      <header className="seenDepthHead">
        <span>SEEN</span>
        <h1>SEEN</h1>
        <p>Same seed. Different soil. Different tree.</p>
      </header>

      <section className="seenDepthStage" aria-label="Layers">
        {CARDS.map((card, i) => {
          const delta = i - focus;
          const abs = Math.abs(delta);
          return (
            <button
              key={card.id}
              type="button"
              className={`seenGlass${i === focus ? ' focus' : ''}`}
              style={{
                transform: `translate3d(${delta * 18}%, ${abs * 6}px, ${-abs * 140}px) rotateY(${delta * -9}deg) scale(${1 - abs * 0.12})`,
                opacity: abs > 3 ? 0 : 1 - abs * 0.18,
                zIndex: 20 - abs,
                filter: `blur(${abs * 1.2}px)`,
              }}
              onClick={() => (i === focus ? go(card) : setFocus(i))}
            >
              <em>{card.num}</em>
              <strong>{card.title}</strong>
              <span>{card.sub}</span>
              <p>{card.use}</p>
            </button>
          );
        })}
      </section>

      <p className="seenDepthHint">{CARDS[focus].use}</p>
    </main>
  );
}
