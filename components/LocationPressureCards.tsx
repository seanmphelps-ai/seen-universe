'use client';

import { useEffect, useState } from 'react';
import type { LocationPressureRecord, SketchId } from '../lib/location/pressure';

export function LocationPressureCards({
  label,
  onLocked,
}: {
  label: string;
  onLocked?: (sketchId: SketchId) => void;
}) {
  const [record, setRecord] = useState<LocationPressureRecord | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = label.trim();
    if (query.length < 2) {
      setRecord(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/location/pressure?q=${encodeURIComponent(query)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Pressure lookup failed.');
        const body = (await response.json()) as { pressure: LocationPressureRecord };
        if (!cancelled) setRecord(body.pressure);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed.');
      });
    return () => {
      cancelled = true;
    };
  }, [label]);

  async function pick(sketchId: SketchId) {
    const query = label.trim();
    const response = await fetch(
      `/api/location/pressure?q=${encodeURIComponent(query)}&sketch=${sketchId}`,
    );
    if (!response.ok) return;
    const body = (await response.json()) as { pressure: LocationPressureRecord };
    setRecord(body.pressure);
    onLocked?.(sketchId);
  }

  if (!label.trim()) return null;
  if (error) return <p className="seenFormError">{error}</p>;
  if (!record) return <p className="seenFieldSupport">Reading the soil…</p>;

  return (
    <div className="seenPanel">
      <span className="seenLabel">Which soil is yours</span>
      <div className="seenResultList">
        {record.sketches.map((sketch) => {
          const active = record.selectedSketchId === sketch.id;
          return (
            <button
              key={sketch.id}
              type="button"
              className={active ? 'seenResultRow seenCitySuggestionActive' : 'seenResultRow'}
              onClick={() => pick(sketch.id)}
            >
              <strong className="seenResultName">{sketch.title}</strong>
              <p className="seenFieldSupport">{sketch.body}</p>
              <p className="seenFieldSupport">Gift: {sketch.gift}</p>
              <p className="seenFieldSupport">Cost: {sketch.cost}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
