'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveExperienceMode } from '../lib/seen/experienceMode';

const CARDS = [
  { id: 'forge', kicker: '01', title: 'THE FORGE', line: 'Place. Exposure. Time.', hue: 38 },
  { id: 'wound', kicker: '02', title: 'WOUND', line: 'Markers under the story.', hue: 8 },
  { id: 'western', kicker: '03', title: 'WESTERN', line: 'Sky as last layer.', hue: 210 },
  { id: 'vedic', kicker: '04', title: 'VEDIC', line: 'Dasha and timing.', hue: 28 },
  { id: 'design', kicker: '05', title: 'DESIGN', line: 'Gates. Pressure. Type.', hue: 280 },
  { id: 'cadence', kicker: '06', title: 'CADENCE', line: 'Daily operating keys.', hue: 160 },
  { id: 'jev', kicker: '07', title: 'JEV', line: 'Typed answers. Host owns the move.', hue: 190 },
] as const;

function Pulse({ hue, live }: { hue: number; live: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const pts = Array.from({ length: 220 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 18 + Math.random() * 54,
      s: 0.004 + Math.random() * 0.02,
      z: Math.random(),
    }));
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w || !h) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = 'rgba(6,5,4,0.32)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2 + 4;
      t += live ? 1 : 0.25;
      for (const p of pts) {
        p.a += live ? p.s : p.s * 0.2;
        const x = cx + Math.cos(p.a + t * 0.002) * p.r;
        const y = cy + Math.sin(p.a) * p.r * 0.62;
        ctx.fillStyle = `hsla(${hue}, 78%, ${56 + p.z * 18}%, ${live ? 0.18 + p.z * 0.75 : 0.08 + p.z * 0.25})`;
        ctx.fillRect(x, y, p.z > 0.8 ? 2 : 1, p.z > 0.8 ? 2 : 1);
      }
      ctx.strokeStyle = `hsla(${hue}, 70%, 62%, ${live ? 0.45 : 0.16})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 22, 22, 0, 0, Math.PI * 2);
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hue, live]);
  return <canvas ref={ref} className="forgePulse" />;
}

export default function SeenEntry() {
  const router = useRouter();
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState<string[]>(['forge', 'jev']);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const onScroll = () => {
      const cards = [...el.querySelectorAll<HTMLElement>('[data-card]')];
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      cards.forEach((card, i) => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  function toggle(id: string) {
    setArmed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function enter(mode: 'single_person' | 'multi_person') {
    const resolved = resolveExperienceMode({ mode });
    try {
      sessionStorage.setItem('seen:experience-mode', JSON.stringify(resolved));
      sessionStorage.setItem('seen:linked-modalities', JSON.stringify(armed));
    } catch {}
    router.push(resolved.next === 'person_a_foundation' ? '/foundation/location' : '/closure');
  }

  return (
    <main className="seenRailPage">
      <img className="seenRailWorld" src="/foundation/location-forge-background.png" alt="" />
      <div className="seenRailVeil" />
      <header className="seenRailHead">
        <span>SEEN</span>
        <b>{armed.length} layers live</b>
      </header>
      <div className="seenRail" ref={rail}>
        {CARDS.map((card, i) => {
          const on = armed.includes(card.id);
          return (
            <article
              key={card.id}
              data-card
              className={`seenPlacard${i === active ? ' center' : ''}${on ? ' live' : ''}`}
              onClick={() => toggle(card.id)}
            >
              <Pulse hue={card.hue} live={on || i === active} />
              <div className="seenPlacardCopy">
                <span>{card.kicker}</span>
                <h2>{card.title}</h2>
                <p>{card.line}</p>
                <em>{on ? 'LIVE' : 'TAP TO ARM'}</em>
              </div>
            </article>
          );
        })}
      </div>
      <footer className="seenRailFoot">
        <button type="button" onClick={() => enter('single_person')}>One person</button>
        <button type="button" className="alt" onClick={() => enter('multi_person')}>Two people</button>
      </footer>
    </main>
  );
}
