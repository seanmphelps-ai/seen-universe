'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveExperienceMode } from '../lib/seen/experienceMode';

const MODALITIES = [
  { id: 'location', label: 'LOCATION', score: 92, note: 'places write first' },
  { id: 'wound', label: 'WOUND', score: 81, note: 'markers under the chart' },
  { id: 'western', label: 'WESTERN', score: 74, note: 'sky as last layer' },
  { id: 'vedic', label: 'VEDIC', score: 69, note: 'timing and dasha' },
  { id: 'design', label: 'DESIGN', score: 66, note: 'gates and pressure' },
  { id: 'cadence', label: 'CADENCE', score: 58, note: 'daily operating keys' },
  { id: 'forge', label: 'FORGE', score: 88, note: 'location meets sky' },
  { id: 'jev', label: 'JEV', score: 95, note: 'typed decision layer' },
] as const;

export default function SeenEntry() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<(typeof MODALITIES)[number]['id']>('forge');
  const [linked, setLinked] = useState<string[]>(['location', 'wound', 'forge', 'jev']);
  const [phase, setPhase] = useState<'board' | 'mode'>('board');
  const current = MODALITIES.find((m) => m.id === active) ?? MODALITIES[6];

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const particles = Array.from({ length: 520 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 48 + Math.random() * 92,
      s: 0.003 + Math.random() * 0.012,
      z: Math.random(),
    }));
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = 'rgba(8,7,6,0.28)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      t += 1;
      for (const p of particles) {
        p.a += p.s;
        const x = cx + Math.cos(p.a) * p.r;
        const y = cy + Math.sin(p.a) * p.r * 0.68;
        ctx.fillStyle = `hsla(${38 + p.z * 28}, 72%, ${58 + p.z * 16}%, ${0.12 + p.z * 0.7})`;
        ctx.fillRect(x, y, p.z > 0.82 ? 2.1 : 1.1, p.z > 0.82 ? 2.1 : 1.1);
      }
      ctx.strokeStyle = 'rgba(212,180,106,0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 38, 38, 0, 0, Math.PI * 2);
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggleLink(id: string) {
    setActive(id as typeof active);
    setLinked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function choose(mode: 'single_person' | 'multi_person') {
    const resolved = resolveExperienceMode({ mode });
    try {
      sessionStorage.setItem('seen:experience-mode', JSON.stringify(resolved));
      sessionStorage.setItem('seen:linked-modalities', JSON.stringify(linked));
    } catch {
      /* storage unavailable */
    }
    if (resolved.next === 'person_a_foundation') {
      router.push('/foundation/location');
      return;
    }
    router.push('/closure');
  }

  const bars = useMemo(() => Array.from({ length: 18 }, (_, i) => 6 + ((i * 11 + current.score) % 18)), [current.score]);

  return (
    <main className="seenIntro forgeBoard">
      <div className="seenIntroAmbient" aria-hidden="true" />
      <header className="forgeTop">
        <div>
          <span>SEEN // FORGE</span>
          <b>THE INTERLOCK</b>
        </div>
        <div className="forgeStats">
          <em>{linked.length} live</em>
          <em>{current.score}</em>
        </div>
      </header>

      <section className="forgeStage">
        <canvas ref={canvasRef} className="forgeRing" />
        <div className="forgeHud">
          <div>
            {current.label}
            <div className="forgeSpark">
              {bars.map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </div>
          </div>
          <p>{current.note}</p>
        </div>
      </section>

      <section className="forgeGrid" aria-label="Modalities">
        {MODALITIES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`forgeCard${active === m.id ? ' on' : ''}${linked.includes(m.id) ? ' linked' : ''}`}
            onClick={() => toggleLink(m.id)}
          >
            <span>{m.label}</span>
            <b>{m.score}</b>
            <em>{linked.includes(m.id) ? 'LINKED' : 'IDLE'}</em>
          </button>
        ))}
      </section>

      {phase === 'board' ? (
        <button type="button" className="seenIntroContinue forgeGo" onClick={() => setPhase('mode')}>
          Assemble {linked.length} layers
        </button>
      ) : (
        <div className="seenIntroComposer">
          <p className="forgeWho">Who is in the field?</p>
          <button type="button" className="seenIntroContinue" onClick={() => choose('single_person')}>
            One person
          </button>
          <button type="button" className="seenButtonPrimary" style={{ width: '100%', marginTop: 12 }} onClick={() => choose('multi_person')}>
            Two people
          </button>
        </div>
      )}
    </main>
  );
}
