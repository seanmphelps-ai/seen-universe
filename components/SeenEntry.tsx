'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

type Lived = { id: string; value: string; startYear: string; endYear: string };
type NodeId = 'place' | 'mark' | 'code' | 'resonance' | 'key' | 'begin';

const NODES: { id: NodeId; title: string; sub: string; x: number; y: number }[] = [
  { id: 'place', title: 'PLACE', sub: '01', x: 0.2, y: 0.58 },
  { id: 'mark', title: 'THE MARK', sub: '02', x: 0.48, y: 0.26 },
  { id: 'code', title: 'THE CODE', sub: '03', x: 0.8, y: 0.48 },
  { id: 'resonance', title: 'RESONANCE', sub: '04', x: 0.62, y: 0.8 },
  { id: 'key', title: 'KEY', sub: '101', x: 0.28, y: 0.3 },
  { id: 'begin', title: 'BEGIN', sub: 'JOIN', x: 0.5, y: 0.54 },
];

const LINKS: [NodeId, NodeId][] = [
  ['place', 'mark'],
  ['mark', 'code'],
  ['code', 'resonance'],
  ['key', 'place'],
  ['key', 'mark'],
  ['key', 'code'],
  ['key', 'begin'],
  ['place', 'begin'],
  ['mark', 'begin'],
];

const PLANET_101: [string, string][] = [
  ['Sun', 'Vital heat. What the life keeps trying to be.'],
  ['Moon', 'The body of habit. What soothes and what swallows.'],
  ['Mercury', 'The tongue and the split. How they think out loud.'],
  ['Venus', 'What they bind to. Taste, bond, the price of beauty.'],
  ['Mars', 'The cut. How they take, fight, and spend heat.'],
  ['Jupiter', 'Where they enlarge. Faith, excess, the big room.'],
  ['Saturn', 'The wall. Time, duty, the cold teacher.'],
  ['Uranus', 'The break in the pattern. Sudden weather.'],
  ['Neptune', 'The dissolve. Fog, holy longing, leak.'],
  ['Pluto', 'What will not stay buried. Power, rot, rebirth.'],
  ['Chiron', 'The unhealable spot that teaches.'],
  ['Lilith', 'The part that will not come to the table.'],
];

const HOUSE_101: [string, string][] = [
  ['1', 'The body in the doorway. How they arrive.'],
  ['2', 'Worth, food, what they keep.'],
  ['3', 'Street, sibling, the near word.'],
  ['4', 'The house under the house. Root, night, family soil.'],
  ['5', 'Heat that plays. Risk, child, making.'],
  ['6', 'Work of the day. Service, craft, the body under strain.'],
  ['7', 'The other chair. Contract, mirror, opponent.'],
  ['8', 'Shared blood and shared debt. What dies between two people.'],
  ['9', 'The far road. Law, faith, the long meaning.'],
  ['10', 'The visible work. Rank, weather of reputation.'],
  ['11', 'The circle. Allies, future, the room of peers.'],
  ['12', 'The back room. Hidden cost, exile, the undoing.'],
];

const newLived = (): Lived => ({ id: crypto.randomUUID(), value: '', startYear: '', endYear: '' });

export default function SeenEntry() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => Object.fromEntries(NODES.map((n) => [n.id, { x: n.x, y: n.y }])));
  const [focus, setFocus] = useState<NodeId>('place');
  const [stack, setStack] = useState<NodeId[]>(['place']);
  const [keyOpen, setKeyOpen] = useState<'planet' | 'house' | 'portal' | 'lens' | null>(null);
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

  function openNode(id: NodeId) {
    setStack((prev) => (prev[prev.length - 1] === id ? prev : [...prev, id]));
    setFocus(id);
    if (id !== 'key') setKeyOpen(null);
  }

  function back() {
    setStack((prev) => {
      if (prev.length < 2) return prev;
      const next = prev.slice(0, -1);
      setFocus(next[next.length - 1]);
      return next;
    });
    setKeyOpen(null);
  }

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
    openNode(id);
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
      openNode('mark');
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
      <header className="seenMapHead">
        <span>SEEN</span>
        {stack.length > 1 ? <button type="button" className="seenBack" onClick={back}>Back</button> : null}
      </header>
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
              onClick={() => (node.id === 'begin' ? go() : openNode(node.id))}
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
        {focus === 'key' && (
          <div className="seenKey">
            <button type="button" onClick={() => setKeyOpen('planet')}>Planet</button>
            <button type="button" onClick={() => setKeyOpen('house')}>House</button>
            <button type="button" onClick={() => setKeyOpen('portal')}>Portal</button>
            <button type="button" onClick={() => setKeyOpen('lens')}>Lens</button>
            {keyOpen === 'planet' && PLANET_101.map(([k, v]) => <p key={k}><b>{k}.</b> {v}</p>)}
            {keyOpen === 'house' && HOUSE_101.map(([k, v]) => <p key={k}><b>{k}.</b> {v}</p>)}
            {keyOpen === 'portal' && <p>The 64 names and extraction live in docs/64_PORTALS.md. This plate opens that book. It does not invent a 65th.</p>}
            {keyOpen === 'lens' && <p>Dr. Maisel 25-lens list is named in canon and not locked as a file. This plate will not invent the 25.</p>}
          </div>
        )}
        {focus === 'begin' && <button type="button" className="seenPlacardPlus" onClick={go}>Begin</button>}
      </section>
    </main>
  );
}
