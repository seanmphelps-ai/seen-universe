'use client'

import { useEffect, useState } from 'react'
import { FoundationIntakeSchema, type FoundationIntake } from '../src/schema/phase-1/intake/foundationIntake.schema'
import { FoundationIntakeScreen } from './components/FoundationIntakeScreen'
import { RecognitionScreen } from './components/RecognitionScreen'
import { SplashScreen } from './components/SplashScreen'

const STORAGE_KEY = 'seen:foundation-intake:v1'
const INTRO_KEY = 'seen:intro-complete'
const EMPTY: FoundationIntake = { birthLocation: '', locationsLivedOneYearOrMore: [], currentLocation: '', birthDate: '', birthTime: undefined }
type Stage = 'splash' | 'intake' | 'recognition'

export default function Home() {
  const [stage, setStage] = useState<Stage>('splash')
  const [foundation, setFoundation] = useState<FoundationIntake>(EMPTY)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let restored = false
    if (stored) {
      const parsed = FoundationIntakeSchema.safeParse(JSON.parse(stored))
      if (parsed.success) { setFoundation(parsed.data); restored = true }
      else localStorage.removeItem(STORAGE_KEY)
    }
    if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/sw.js')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || sessionStorage.getItem(INTRO_KEY) === 'true') setStage(restored ? 'recognition' : 'intake')
  }, [])

  function completeIntro() {
    sessionStorage.setItem(INTRO_KEY, 'true')
    setStage('intake')
  }

  function replayIntro() {
    sessionStorage.removeItem(INTRO_KEY)
    setStage('splash')
    window.scrollTo({ top: 0 })
  }

  function completeFoundation(value: FoundationIntake) {
    setFoundation(value)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    setStage('recognition')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (stage === 'splash') return <SplashScreen onComplete={completeIntro} />
  if (stage === 'intake') return <FoundationIntakeScreen initial={foundation} onComplete={completeFoundation} onReplay={replayIntro} />
  return <RecognitionScreen foundation={foundation} onEdit={() => setStage('intake')} />
}
