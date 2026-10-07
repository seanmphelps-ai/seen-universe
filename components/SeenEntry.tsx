'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveExperienceMode } from '../lib/seen/experienceMode';

const WORDS = ['YOU', 'ARE', 'NOT', 'YOUR', 'SUN', 'SIGN.'];

export default function SeenEntry() {
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'words' | 'ready' | 'mode'>('words');

  useEffect(() => {
    if (phase !== 'words') return;
    if (wordIndex >= WORDS.length) {
      const timer = window.setTimeout(() => setPhase('ready'), 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setWordIndex((index) => index + 1), 700);
    return () => window.clearTimeout(timer);
  }, [phase, wordIndex]);

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
      <div className="seenIntroAmbient" aria-hidden="true" />
      <div className="seenIntroContent">
        {phase === 'words' && (
          <div className="seenIntroWord" data-active="true">
            {WORDS[Math.min(wordIndex, WORDS.length - 1)]}
          </div>
        )}

        {phase === 'ready' && (
          <div className="seenIntroReveal">
            <p>SEEN</p>
            <h1>You are so much more than that.</h1>
            <div className="seenDivider" aria-hidden="true" />
            <button
              type="button"
              className="seenButtonPrimary"
              onClick={() => setPhase('mode')}
            >
              Are you ready to be seen?
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
