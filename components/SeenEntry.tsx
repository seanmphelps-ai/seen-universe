// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveExperienceMode } from '../lib/seen/experienceMode';

export default function SeenEntry() {
  const router = useRouter();
  const [phase, setPhase] = useState<'ready' | 'mode'>('ready');

  function choose(mode: 'single_person' | 'multi_person') {
    const resolved = resolveExperienceMode({ mode });
    try {
      sessionStorage.setItem('seen:experience-mode', JSON.stringify(resolved));
    } catch {
      /* storage unavailable */
    }
    if (resolved.next === 'person_a_foundation') {
      router.push('/foundation/location');
      return;
    }
    router.push('/closure');
  }

  return (
    <main className="seenIntro">
      <video
        className="seenIntroVideo"
        src="/foundation/splash.mp4"
        poster="/foundation/splash-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="seenIntroVeil" aria-hidden="true" />
      <div className="seenIntroContent">
        {phase === 'ready' && (
          <div className="seenIntroReveal">
            <h1 className="seenIntroMark">SEEN</h1>
            <button
              type="button"
              className="seenIntroEnter"
              onClick={() => setPhase('mode')}
            >
              Enter
            </button>
          </div>
        )}

        {phase === 'mode' && (
          <div className="seenIntroReveal">
            <p>Closure & Composure</p>
            <h1>Who is in the field?</h1>
            <p className="seenFlowIntroduction" style={{ marginTop: 16 }}>
              One person for a single reading. Two people for recognition, comparison, and the first Cadence action.
            </p>
            <div className="seenDivider" aria-hidden="true" />
            <div className="seenIntroComposer">
              <button type="button" className="seenIntroContinue" onClick={() => choose('single_person')}>
                One person
              </button>
              <button
                type="button"
                className="seenButtonPrimary"
                style={{ width: '100%', marginTop: 12 }}
                onClick={() => choose('multi_person')}
              >
                Two people
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
