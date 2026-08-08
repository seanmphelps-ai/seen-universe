'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const WORDS = ['YOU', 'ARE', 'NOT', 'YOUR', 'SUN', 'SIGN.'];

export default function SplashPage() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [wordActive, setWordActive] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timers.current.push(id);
    };

    const doFlash = (intensity: number) => {
      const flash = flashRef.current;
      if (!flash) return;
      flash.style.transition = 'none';
      flash.style.opacity = String(intensity);
      schedule(() => {
        flash.style.transition = 'opacity 2960ms ease-out';
        flash.style.opacity = '0';
      }, 40);
    };

    const showWord = (index: number) => {
      if (index >= WORDS.length) {
        schedule(() => {
          setShowMessage(true);
          schedule(() => {
            setShowLine(true);
            schedule(() => setShowCta(true), 950);
          }, 750);
        }, 700);
        return;
      }

      setWord(WORDS[index]);
      setWordActive(true);

      schedule(() => {
        setWordActive(false);
        schedule(() => showWord(index + 1), 340);
      }, 520);
    };

    let flashCount = 0;
    const flashInterval = setInterval(() => {
      doFlash(0.38);
      flashCount += 1;
      if (flashCount >= 3) {
        clearInterval(flashInterval);
        schedule(() => showWord(0), 320);
      }
    }, 360);

    const scheduledTimers = timers.current;
    return () => {
      clearInterval(flashInterval);
      scheduledTimers.forEach(clearTimeout);
    };
  }, []);

  function enterSeen() {
    router.push('/foundation/location');
  }

  return (
    <main className="seenSplash">
      <div className="seenSplashAmbient" aria-hidden="true" />

      <div className="seenSplashContent">
        <div className="seenSplashWord" data-active={wordActive}>
          {word}
        </div>

        <div className="seenSplashMessage" data-show={showMessage}>
          You are so much more than that.
        </div>

        <div
          className="seenSplashLine"
          data-show={showLine}
          aria-hidden="true"
        />

        <div className="seenSplashCta" data-show={showCta}>
          <button
            type="button"
            className="seenButtonPrimary"
            onClick={enterSeen}
          >
            ARE YOU READY TO BE SEEN?
          </button>
        </div>
      </div>

      <div className="seenSplashFlash" ref={flashRef} aria-hidden="true" />
    </main>
  );
}
