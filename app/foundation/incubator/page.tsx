// PROVENANCE: bot=claude-code session=2026-10-14 task=forge-page-environmental-exposure-compact-bottom
'use client';

import { useRef, useState } from 'react';
import { IncubatorAutocompleteInput } from '../../../components/IncubatorAutocompleteInput';
import { IncubatorPressureCards } from '../../../components/IncubatorPressureCards';
import { placeFromSuggestion } from '../../../lib/foundation/intakeDeck';
import { emptyLivedPlaceDraft, type LivedPlaceDraft } from '../../../lib/foundation/livedExposure';
import type { SketchId } from '../../../lib/incubator/pressure';

/** Incubator card. Its label is environmental exposure. */
export default function IncubatorPage() {
  const [birth, setBirth] = useState('');
  const [current, setCurrent] = useState('');
  const [lived, setLived] = useState<LivedPlaceDraft[]>([]);
  const [locked, setLocked] = useState<SketchId | null>(null);
  const nextId = useRef(0);

  function patchLived(id: string, patch: Partial<LivedPlaceDraft>) {
    setLived((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addLived() {
    nextId.current += 1;
    setLived((rows) => [...rows, emptyLivedPlaceDraft(String(nextId.current))]);
  }

  return (
    <main className="seenForgePage">
      <img className="seenForgeBackdrop seenForgeBackdropImage" src="/foundation/incubator-forge-background.png" alt="" />
      <div className="seenForgeBackdropVeil" />
      <div className="seenForgeShell">
        <header className="seenForgeMasthead">
          <span className="seenForgeNumber">01</span>
          <h1 className="seenForgeTitle" id="exposure-title">environmental exposure</h1>
        </header>
        <div className="seenForgeGlobeSpace" />
        <section className="seenForgeMini" aria-label="environmental exposures">
          <div className="seenForgeMiniField">
            <IncubatorAutocompleteInput
              id="birth-incubator"
              className="seenForgeMiniInput"
              value={birth}
              onChange={(value) => {
                setBirth(value);
                setLocked(null);
              }}
              placeholder="Birth incubator"
              ariaLabel="Birth incubator"
            />
          </div>
          {lived.map((row, index) => (
            <div className="seenForgeMiniField seenForgeMiniLived" key={row.id}>
              <IncubatorAutocompleteInput
                id={`lived-${row.id}`}
                className="seenForgeMiniInput"
                value={row.query}
                placeholder={`Lived 6+ months (${index + 1})`}
                ariaLabel={`Lived incubator ${index + 1}`}
                onChange={(value) => patchLived(row.id, { query: value })}
                onPlaceSelect={(suggestion) => {
                  if (!suggestion) {
                    patchLived(row.id, { city: null });
                    return;
                  }
                  patchLived(row.id, { query: suggestion.label, city: placeFromSuggestion(suggestion) });
                }}
              />
              <input
                className="seenForgeMiniInput seenForgeMiniMonth"
                type="month"
                aria-label={`Lived incubator ${index + 1} from`}
                value={row.startMonth}
                onChange={(event) => patchLived(row.id, { startMonth: event.target.value })}
              />
              <input
                className="seenForgeMiniInput seenForgeMiniMonth"
                type="month"
                aria-label={`Lived incubator ${index + 1} until`}
                value={row.stillThere ? '' : row.endMonth}
                disabled={row.stillThere}
                onChange={(event) => patchLived(row.id, { endMonth: event.target.value, stillThere: false })}
              />
              <button
                className="seenForgeMiniRemove"
                type="button"
                aria-label={`Remove lived incubator ${index + 1}`}
                onClick={() => setLived((rows) => rows.filter((r) => r.id !== row.id))}
              >
                ×
              </button>
            </div>
          ))}
          <button className="seenForgeMiniAdd" type="button" onClick={addLived}>
            + incubators lived 6+ months
          </button>
          <div className="seenForgeMiniField">
            <IncubatorAutocompleteInput
              id="current-incubator"
              className="seenForgeMiniInput"
              value={current}
              onChange={setCurrent}
              placeholder="Current incubator"
              ariaLabel="Current incubator"
            />
          </div>
          <IncubatorPressureCards label={birth} onLocked={setLocked} />
          {locked ? <p className="seenForgeMiniNote">Locked: {locked}</p> : null}
        </section>
      </div>
    </main>
  );
}
