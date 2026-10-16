// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveExperienceMode } from '../lib/seen/experienceMode';

const WORDS = ['YOUR', 'STORY', 'HOLDS', 'A', 'WHOLE', 'UNIVERSE.'];

export default function SeenEntry() {
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'words' | 'ready' | 'mode' | 'interaction'>('words');

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
    setPhase('interaction');
  }

  function chooseInteraction(interaction: 'manuscript' | 'chat' | 'voice') {
    try {
      sessionStorage.setItem('seen:interaction-mode', interaction);
    } catch {
      /* storage unavailable */
    }
    const raw = sessionStorage.getItem('seen:experience-mode');
    const resolved = raw ? JSON.parse(raw) : null;
    const next = resolved?.next === 'closure_people' ? '/closure' : interaction === 'chat' ? '/foundation/chat' : '/chart';
    router.push(next);
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
            <h1>Every part of you has a story.</h1>
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

        {phase === 'interaction' && (
          <div className="seenIntroReveal">
            <p>Closure & Composure</p>
            <h1>How do you want to tell it?</h1>
            <p className="seenFlowIntroduction" style={{ marginTop: 16 }}>
              Voice is coming. For now, talk it through in chat, or write it out yourself.
            </p>
            <div className="seenDivider" aria-hidden="true" />
            <div className="seenIntroComposer">
              <button
                type="button"
                className="seenButtonPrimary"
                style={{ width: '100%' }}
                onClick={() => chooseInteraction('chat')}
              >
                Chat
              </button>
              <button
                type="button"
                className="seenIntroContinue"
                style={{ marginTop: 12 }}
                onClick={() => chooseInteraction('manuscript')}
              >
                Manuscript
              </button>
              <button type="button" className="seenIntroContinue" style={{ marginTop: 12 }} disabled>
                Voice — coming soon
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
