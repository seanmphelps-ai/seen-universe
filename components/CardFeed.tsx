'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import RiveCard from './RiveCard';

type Card = { title: string; deepText: string };

export default function CardFeed({ cards }: { cards: Card[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progresses, setProgresses] = useState<number[]>(() => cards.map(() => 0));

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });

    function update() {
      const center = window.innerHeight / 2;
      setProgresses(
        itemRefs.current.map((el) => {
          if (!el) return 0;
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - center);
          return Math.max(0, 1 - distance / center);
        }),
      );
    }

    lenis.on('scroll', update);
    update();

    return () => {
      lenis.off('scroll', update);
      lenis.destroy();
    };
  }, [cards.length]);

  const activeIndex = progresses.indexOf(Math.max(...progresses));

  return (
    <div className="cardFeed">
      {cards.map((card, index) => (
        <div
          key={card.title + index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="cardFeedItem"
          data-active={index === activeIndex}
        >
          <RiveCard
            title={card.title}
            deepText={card.deepText}
            progress={progresses[index] ?? 0}
            onProgressChange={() => {}}
          />
        </div>
      ))}
    </div>
  );
}
