'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ComparativeShadowCard } from '../../lib/seen/closureCompare';

type StoredSelection = {
  selected: ComparativeShadowCard;
};

export default function CadencePage() {
  const [card, setCard] = useState<ComparativeShadowCard | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('seen:closure:selection');
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredSelection;
      setCard(parsed.selected);
    } catch {
      setCard(null);
    }
  }, []);

  function handleSave() {
    try {
      const existing = sessionStorage.getItem('seen:cadence:log');
      const log = existing ? JSON.parse(existing) as { at: string; note: string }[] : [];
      log.push({ at: new Date().toISOString(), note: note.trim() });
      sessionStorage.setItem('seen:cadence:log', JSON.stringify(log));
      setSaved(true);
    } catch {
      setSaved(true);
    }
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell">
        <header className="seenFlowHeader">
          <div className="seenProgress">
            <span>Cadence</span>
            <span className="seenProgressValue">First action</span>
          </div>
          <h1 className="seenDisplayLarge">The reading continues as practice.</h1>
          <p className="seenFlowIntroduction">
            Cadence starts from the selected Closure pattern. No second onboarding.
          </p>
          <div className="seenDivider" aria-hidden="true" />
        </header>

        <div className="seenPanel seenFlowForm">
          {card ? (
            <>
              <span className="seenLabel">{card.title}</span>
              <p>{card.firstAction}</p>
              <label className="seenLabel" htmlFor="cadence-note">What happened</label>
              <div className="seenInputFrame">
                <textarea
                  id="cadence-note"
                  className="seenInput"
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
              <button type="button" className="seenButtonPrimary" onClick={handleSave} disabled={!note.trim()}>
                {saved ? 'Recorded' : 'Save today'}
              </button>
            </>
          ) : (
            <p className="seenFieldSupport">
              No Closure selection is stored in this session.
            </p>
          )}
          <Link className="seenButtonSecondary" href="/closure">← Closure</Link>
        </div>
      </section>
    </main>
  );
}
