'use client'

import { useState } from 'react'
import { FoundationIntakeSchema, type FoundationIntake } from '../../src/schema/phase-1/intake/foundationIntake.schema'

type Props = {
  initial: FoundationIntake
  onComplete: (value: FoundationIntake) => void
  onReplay?: () => void
}

function Sparkle() {
  return (
    <svg className="giSparkle" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FoundationIntakeScreen({ initial, onComplete, onReplay }: Props) {
  const [step, setStep] = useState<'place' | 'time'>('place')
  const [birthLocation, setBirthLocation] = useState(initial.birthLocation)
  const [currentLocation, setCurrentLocation] = useState(initial.currentLocation)
  const [locations, setLocations] = useState<string[]>(
    initial.locationsLivedOneYearOrMore.length ? initial.locationsLivedOneYearOrMore : [''],
  )
  const [birthDate, setBirthDate] = useState(initial.birthDate)
  const [birthTime, setBirthTime] = useState(initial.birthTime ?? '')
  const [error, setError] = useState('')

  function continueFromPlace() {
    if (!birthLocation.trim() || !currentLocation.trim()) {
      setError('Enter your birth location and current location to continue.')
      return
    }
    setError('')
    setStep('time')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function finish() {
    const parsed = FoundationIntakeSchema.safeParse({
      birthLocation: birthLocation.trim(),
      currentLocation: currentLocation.trim(),
      locationsLivedOneYearOrMore: locations.map((place) => place.trim()).filter(Boolean),
      birthDate,
      birthTime: birthTime.trim() || undefined,
    })
    if (!parsed.success) {
      setError('Enter your birth date to continue.')
      return
    }
    setError('')
    onComplete(parsed.data)
  }

  return (
    <main className="giPage">
      <div className="giFrame">
        <button
          type="button"
          className="giBack"
          onClick={() => (step === 'time' ? setStep('place') : onReplay?.())}
        >
          <span aria-hidden="true">&#8249;</span>
          {step === 'time' ? 'Back' : 'Replay splash'}
        </button>

        <div className="giMetaRow">
          <span className="giEyebrow">Foundation</span>
          <span className="giEyebrow giStepCount">{step === 'place' ? '01' : '02'} / 02</span>
        </div>

        {step === 'place' ? (
          <h1 className="giTitle">Geographical Imprints</h1>
        ) : (
          <h1 className="giTitle">Your Time Anchor</h1>
        )}
        <p className="giSubtitle">
          {step === 'place'
            ? 'Tell us where in the world your life has taken place.'
            : 'The moment you arrived. Date first — time is optional.'}
        </p>

        <div className="giDivider" />

        {step === 'place' ? (
          <section className="giPanel">
            <div className="giGroup">
              <span className="giLabel">Where were you born?</span>
              <label className="giInputFrame">
                <span className="giSparkleWrap">
                  <Sparkle />
                </span>
                <input
                  className="giInput"
                  value={birthLocation}
                  onChange={(event) => setBirthLocation(event.target.value)}
                  placeholder="City, state or country"
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="giGroup">
              <span className="giLabel">Where else have you lived?</span>
              <p className="giHelp">Add each location where you lived for one year or longer.</p>
              <div className="giLocationList">
                {locations.map((place, index) => (
                  <div className="giLocationRow" key={index}>
                    <label className="giInputFrame">
                      <span className="giSparkleWrap">
                        <Sparkle />
                      </span>
                      <input
                        className="giInput"
                        value={place}
                        onChange={(event) =>
                          setLocations((current) =>
                            current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                          )
                        }
                        placeholder="City, state or country"
                        autoComplete="off"
                      />
                    </label>
                    {locations.length > 1 && (
                      <button
                        type="button"
                        className="giRemove"
                        onClick={() =>
                          setLocations((current) => current.filter((_, itemIndex) => itemIndex !== index))
                        }
                        aria-label="Remove location"
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="giAdd"
                onClick={() => setLocations((current) => [...current, ''])}
              >
                <span className="giAddIcon" aria-hidden="true">+</span>
                Add another location
              </button>
            </div>

            <div className="giGroup">
              <span className="giLabel">Where do you live now?</span>
              <label className="giInputFrame">
                <span className="giSparkleWrap">
                  <Sparkle />
                </span>
                <input
                  className="giInput"
                  value={currentLocation}
                  onChange={(event) => setCurrentLocation(event.target.value)}
                  placeholder="Where you live now"
                  autoComplete="off"
                />
              </label>
            </div>

            {error && <p className="giError" role="alert">{error}</p>}

            <button type="button" className="giContinue" onClick={continueFromPlace}>
              Continue <span aria-hidden="true">&rarr;</span>
            </button>
          </section>
        ) : (
          <section className="giPanel">
            <div className="giGroup">
              <span className="giLabel">What is your birth date?</span>
              <label className="giInputFrame">
                <span className="giSparkleWrap">
                  <Sparkle />
                </span>
                <input
                  className="giInput"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </label>
            </div>

            <div className="giGroup">
              <span className="giLabel">
                What time were you born? <span className="giOptional">Optional</span>
              </span>
              <label className="giInputFrame">
                <span className="giSparkleWrap">
                  <Sparkle />
                </span>
                <input
                  className="giInput"
                  type="time"
                  value={birthTime}
                  onChange={(event) => setBirthTime(event.target.value)}
                />
              </label>
              <p className="giHelp">A submitted time stays unresolved until SEEN confirms it through recognition.</p>
            </div>

            {error && <p className="giError" role="alert">{error}</p>}

            <button type="button" className="giContinue" onClick={finish}>
              Continue <span aria-hidden="true">&rarr;</span>
            </button>
          </section>
        )}
      </div>
    </main>
  )
}
