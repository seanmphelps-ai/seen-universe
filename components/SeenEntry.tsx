'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

type Lived = { id: string; value: string; startYear: string; endYear: string };
type NodeId = 'place' | 'mark' | 'code' | 'resonance' | 'begin';

const NODES: { id: NodeId; title: string; sub: string; x: number; y: number }[] = [
  { id: 'place', title: 'PLACE', sub: '01', x: 0.22, y: 0.58 },
  { id: 'mark', title: 'THE MARK', sub: '02', x: 0.5, y: 0.28 },
  { id: 'code', title: 'THE CODE', sub: '03', x: 0.78, y: 0.52 },
  { id: 'resonance', title: 'RESONANCE', sub: '04', x: 0.58, y: 0.78 },
  { id: 'begin', title: 'BEGIN', sub: 'JOIN', x: 0.5, y: 0.52 },
];

const LINKS: [NodeId, NodeId][] = [
  ['place', 'mark'],
  ['mark', 'code'],
  ['code', 'resonance'],
  ['place', 'begin'],
  ['mark', 'begin'],
  ['code', 'begin'],
  ['resonance', 'begin'],
];

const newLived = (): Lived => ({ id: crypto.randomUUID(), value: '', startYear: '', endYear: '' });

export default function SeenEntry() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => Object.fromEntries(NODES.map((n) => [n.id, { x: n.x, y: n.y }])));
  const [focus, setFocus] = useState<NodeId>('place');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [maternityCity, setMaternityCity] = useState('');
  const [lived, setLived] = useState<Lived[]>([newLived()]);
  const drag = useRef<{ id: NodeId; dx: number; dy: number } | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    const wrap = wrapRef.current;
    if (!c || !wrap) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      t += 1;
      for (const [a, b] of LINKS) {
        const A = pos[a];
        const B = pos[b];
        ctx.strokeStyle = 'rgba(216,197,106,0.28)';
        ctx.beginPath();
        ctx.moveTo(A.x * w, A.y * h);
        ctx.lineTo(B.x * w, B.y * h);
        ctx.stroke();
        const u = (t * 0.008 + a.length) % 1;
        ctx.fillStyle = '#fbea83';
        ctx.beginPath();
        ctx.arc(A.x * w + (B.x - A.x) * w * u, A.y * h + (B.y - A.y) * h * u, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  function pointId(clientX: number, clientY: number): NodeId | null {
    const wrap = wrapRef.current;
    if (!wrap) return null;
    const r = wrap.getBoundingClientRect();
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    let best: NodeId | null = null;
    let dist = 0.09;
    for (const id of Object.keys(pos) as NodeId[]) {
      const d = Math.hypot(pos[id].x - x, pos[id].y - y);
      if (d < dist) {
        dist = d;
        best = id;
      }
    }
    return best;
  }

  function onDown(event: React.PointerEvent) {
    const id = pointId(event.clientX, event.clientY);
    if (!id) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    drag.current = {
      id,
      dx: pos[id].x - (event.clientX - r.left) / r.width,
      dy: pos[id].y - (event.clientY - r.top) / r.height,
    };
    setFocus(id);
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onMove(event: React.PointerEvent) {
    if (!drag.current) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const x = Math.min(0.92, Math.max(0.08, (event.clientX - r.left) / r.width + drag.current.dx));
    const y = Math.min(0.9, Math.max(0.12, (event.clientY - r.top) / r.height + drag.current.dy));
    const id = drag.current.id;
    setPos((prev) => ({ ...prev, [id]: { x, y } }));
  }

  function onUp() {
    drag.current = null;
  }

  function go() {
    if (!name.trim() || !birthDate || !birthCity.trim()) {
      setFocus('mark');
      return;
    }
    const places = lived.filter((row) => row.value.trim());
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
        livedPeriods: places.map((row) => ({ location: row.value.trim(), startYear: row.startYear, endYear: row.endYear })),
      }),
    );
    router.push('/foundation/birth');
  }

  return (
    <main className="seenMap">
      <img className="seenMapWorld" src="/foundation/location-forge-background.png" alt="" />
      <div className="seenMapVeil" />
      <header className="seenMapHead"><span>SEEN</span></header>
      <div className="seenMapStage" ref={wrapRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
        <canvas ref={canvasRef} className="seenMapCanvas" />
        {NODES.map((node) => {
          const p = pos[node.id];
          return (
            <button
              key={node.id}
              type="button"
              className={`seenOrb${focus === node.id ? ' on' : ''}`}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              onClick={() => (node.id === 'begin' ? go() : setFocus(node.id))}
            >
              <b>{node.sub}</b>
              {node.title}
            </button>
          );
        })}
      </div>
      <section className="seenMapDock">
        {focus === 'place' && (
          <>
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
            <button type="button" className="seenPlacardPlus" onClick={() => setLived((rows) => [...rows, newLived()])}>+</button>
          </>
        )}
        {focus === 'mark' && (
          <>
            <input className="seenPlacardInput" type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
            <input className="seenPlacardInput" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </>
        )}
        {focus === 'begin' && <button type="button" className="seenPlacardPlus" onClick={go}>Begin</button>}
      </section>
    </main>
  );
}
