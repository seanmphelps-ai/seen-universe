'use client'

import { useEffect, useRef, useState } from 'react'

const WORDS = ['You', 'are', 'not', 'your', 'sun', 'sign.']

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const timers = useRef<number[]>([])
  const [started, setStarted] = useState(false)
  const [word, setWord] = useState(-1)
  const [secondary, setSecondary] = useState(false)
  const [line, setLine] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  function schedule(run: () => void, delay: number) {
    timers.current.push(window.setTimeout(run, delay))
  }

  function start() {
    if (started) return

    setStarted(true)
    schedule(
      () => WORDS.forEach((_, index) => schedule(() => setWord(index), index * 220)),
      2400,
    )
    schedule(() => {
      setWord(-1)
      setSecondary(true)
    }, 3800)
    schedule(() => setLine(true), 5000)
    schedule(() => setCtaVisible(true), 5900)
  }

  useEffect(() => {
    const fallback = window.setTimeout(start, 4500)
    timers.current.push(fallback)
    // The opening sequence starts once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="splashPage">
      <video
        className={started ? 'introVideo introVideoHidden' : 'introVideo'}
        src="/align_intro.mp4"
        autoPlay
        playsInline
        muted
        onEnded={start}
        onError={start}
        aria-label="SEEN opening film"
      />

      <div className="introFallback" aria-hidden="true">
        <span className="introHalo introHaloOne" />
        <span className="introHalo introHaloTwo" />
        <span className="introMonogram">S</span>
      </div>

      <div
        className={started ? 'whiteFlash whiteFlashActive' : 'whiteFlash'}
        aria-hidden="true"
      />

      <section className="splashContent" aria-live="polite">
        <div className="primaryLine" aria-label="You are not your sun sign.">
          {WORDS.map((value, index) => (
            <span
              key={value}
              className={word === index ? 'primaryWord primaryWordVisible' : 'primaryWord'}
              aria-hidden="true"
            >
              {value}
            </span>
          ))}
        </div>

        <p className={secondary ? 'secondaryLine secondaryLineVisible' : 'secondaryLine'}>
          You are so much more than that.
        </p>

        <div className={line ? 'goldLine goldLineExpanded' : 'goldLine'} aria-hidden="true" />

        <button
          className={ctaVisible ? 'splashCta splashCtaVisible' : 'splashCta'}
          type="button"
          onClick={onComplete}
          disabled={!ctaVisible}
        >
          Are you ready to be <span>SEEN?</span>
        </button>
      </section>
    </main>
  )
}
