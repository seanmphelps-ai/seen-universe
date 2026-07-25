'use client'

import { useEffect, useRef, useState } from 'react'

const WORDS = ['You', 'are', 'not', 'your', 'sun', 'sign.']

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const timers = useRef<number[]>([])
  const [word, setWord] = useState(-1)
  const [secondary, setSecondary] = useState(false)
  const [line, setLine] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    const schedule = (run: () => void, delay: number) => {
      timers.current.push(window.setTimeout(run, delay))
    }

    // Reveal each word of the primary line in sequence.
    WORDS.forEach((_, index) => schedule(() => setWord(index), 700 + index * 300))
    // Clear the primary line and bring in the affirmation.
    schedule(() => {
      setWord(-1)
      setSecondary(true)
    }, 700 + WORDS.length * 300 + 500)
    schedule(() => setLine(true), 700 + WORDS.length * 300 + 1400)
    schedule(() => setCtaVisible(true), 700 + WORDS.length * 300 + 2000)

    const captured = timers.current
    return () => captured.forEach(window.clearTimeout)
  }, [])

  return (
    <main className="splashPage">
      <div className="splashAmbient" aria-hidden="true">
        <span className="introHalo introHaloOne" />
        <span className="introHalo introHaloTwo" />
        <span className="introHalo introHaloThree" />
      </div>

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
