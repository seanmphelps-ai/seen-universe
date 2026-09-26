'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type DeepenChip = 'STAY_HERE' | 'GO_DEEPER' | 'REGULATE';

const EXAMPLE_CARD = {
  title: 'Night pressure (example delivery)',
  reveal:
    'This person looks for the hidden motive before they trust the visible one. Closeness can feel like a place where they can be watched, judged, or left.',
  pressure: 'Feeling ignored, exposed, or emotionally cornered.',
  behavior:
    'They coil first, then strike sideways: a sharp question, a remembered detail, a test disguised as concern.',
  consequence:
    'The partner is pulled into defending themselves against a case built in private.',
  release: 'Name the fear before collecting evidence. Ask one direct question, then stop investigating.',
} as const;

/**
 * Oracle delivery stub — doctrine only.
 * No modality calc. Darkness-first deepen → Cadence handoff.
 * See docs/oracle/
 */
export default function FoundationOracleDeliveryPage() {
  const [chip, setChip] = useState<DeepenChip>('STAY_HERE');
  const [depthNote, setDepthNote] = useState('Holding surface. Mechanics hidden.');

  const deepenCopy = useMemo(() => {
    if (chip === 'GO_DEEPER') {
      return 'Going one layer under the behavior — wound / injury / darkness underneath. Still no chart math on this surface.';
    }
    if (chip === 'REGULATE') {
      return 'Regulation close. Cadence is the practice layer after the dark reading — not a second onboarding.';
    }
    return 'Holding here. Pressure named as pressure. Pattern named as pattern.';
  }, [chip]);

  function choose(next: DeepenChip) {
    setChip(next);
    setDepthNote(next === 'GO_DEEPER' ? 'Depth +1 (stub).' : next === 'REGULATE' ? 'Regulate → ready for Cadence.' : 'Stay here.');
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell">
        <header className="seenFlowHeader">
          <div className="seenProgress">
            <span>Oracle</span>
            <span className="seenProgressValue">Darkness first</span>
          </div>
          <h1 className="seenDisplayLarge">How they blow.</h1>
          <p className="seenFlowIntroduction">
            Delivery stub. Example prose only — Generator owns calc. Deepen, then Cadence.
          </p>
          <div className="seenDivider" aria-hidden="true" />
        </header>

        <div className="seenPanel seenFlowForm">
          <span className="seenLabel">{EXAMPLE_CARD.title}</span>
          <p>
            <strong>Reveal.</strong> {EXAMPLE_CARD.reveal}
          </p>
          <p>
            <strong>Pressure.</strong> {EXAMPLE_CARD.pressure}
          </p>
          <p>
            <strong>Behavior.</strong> {EXAMPLE_CARD.behavior}
          </p>
          <p>
            <strong>Consequence.</strong> {EXAMPLE_CARD.consequence}
          </p>
          <p>
            <strong>Release.</strong> {EXAMPLE_CARD.release}
          </p>

          <span className="seenLabel">Deepen</span>
          <p className="seenFieldSupport">{deepenCopy}</p>
          <p className="seenFieldSupport">{depthNote}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" className="seenButtonSecondary" onClick={() => choose('STAY_HERE')}>
              Stay here
            </button>
            <button type="button" className="seenButtonSecondary" onClick={() => choose('GO_DEEPER')}>
              Go deeper
            </button>
            <button type="button" className="seenButtonSecondary" onClick={() => choose('REGULATE')}>
              Regulate
            </button>
          </div>

          <Link className="seenButtonPrimary" href="/cadence">
            Continue to Cadence
          </Link>
          <Link className="seenButtonSecondary" href="/closure">
            ← Closure
          </Link>
          <p className="seenFieldSupport">
            Doctrine: <code>docs/oracle/</code>. No modality calc on this route.
          </p>
        </div>
      </section>
    </main>
  );
}
