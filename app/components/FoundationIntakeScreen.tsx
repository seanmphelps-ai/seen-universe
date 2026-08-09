'use client'

import { useMemo, useState } from 'react'
import { FoundationIntakeSchema, type FoundationIntake } from '../../src/schema/phase-1/intake/foundationIntake.schema'
import type { EnvironmentalState } from '../../src/schema/phase-1/intake/environmentalIntake.schema'

type Props = {
  initial: FoundationIntake
  onComplete: (value: FoundationIntake) => void
  onReplay?: () => void
}

type Step = 'place' | 'environment' | 'time'
type EnvironmentDraft = Record<string, Record<EnvironmentalState, string>>

const STATES: Array<{ key: EnvironmentalState; label: string; help: string }> = [
  {
    key: 'present',
    label: 'What was repeatedly present?',
    help: 'People, work, climate, nature, noise, crime, opportunity, culture, routines, obligations — anything that repeatedly entered the field.',
  },
  {
    key: 'absent',
    label: 'What was missing?',
    help: 'Resources, people, places, outlets, services, nature, opportunity, community, privacy, ocean access — anything materially unavailable.',
  },
  {
    key: 'constrained',
    label: 'What existed but was hard to access or choose?',
    help: 'Anything blocked by money, distance, transportation, family, work, rules, time, status, scarcity, or other real constraints.',
  },
  {
    key: 'displaced',
    label: 'What did this environment replace?',
    help: 'Work, relationships, routines, communities, travel, recreation, identity roles, or other parts of life that used to occupy the field.',
  },
]

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

function splitObservations(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function draftFromInitial(initial: FoundationIntake): EnvironmentDraft {
  const draft: EnvironmentDraft = {}

  for (const location of initial.environmentalIntake ?? []) {
    draft[location.location] = {
      present: location.observations.filter((item) => item.state === 'present').map((item) => item.value).join('\n'),
      absent: location.observations.filter((item) => item.state === 'absent').map((item) => item.value).join('\n'),
      constrained: location.observations.filter((item) => item.state === 'constrained').map((item) => item.value).join('\n'),
      displaced: location.observations.filter((item) => item.state === 'displaced').map((item) => item.value).join('\n'),
    }
  }

  return draft
}

export function FoundationIntakeScreen({ initial, onComplete, onReplay }: Props) {
  const [step, setStep] = useState<Step>('place')
  const [birthLocation, setBirthLocation] = useState(initial.birthLocation)
  const [currentLocation, setCurrentLocation] = useState(initial.currentLocation)
  const [locations, setLocations] = useState<string[]>(
    initial.locationsLivedOneYearOrMore.length ? initial.locationsLivedOneYearOrMore : [''],
  )
  const [environment, setEnvironment] = useState<EnvironmentDraft>(() => draftFromInitial(initial))
  const [birthDate, setBirthDate] = useState(initial.birthDate)
  const [birthTime, setBirthTime] = useState(initial.birthTime ?? '')
  const [error, setError] = useState('')

  const enteredLocations = useMemo(() => {
    const values = [birthLocation, ...locations, currentLocation]
      .map((value) => value.trim())
      .filter(Boolean)

    return Array.from(new Set(values))
  }, [birthLocation, currentLocation, locations])

  function ensureEnvironmentDraft(location: string) {
    setEnvironment((current) => {
      if (current[location]) return current
      return {
        ...current,
        [location]: {
          present: '',
          absent: '',
          constrained: '',
          displaced: '',
        },
      }
    })
  }

  function continueFromPlace() {
    if (!birthLocation.trim() || !currentLocation.trim()) {
      setError('Enter your birth location and current location to continue.')
      return
    }

    enteredLocations.forEach(ensureEnvironmentDraft)
    setError('')
    setStep('environment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function continueFromEnvironment() {
    setError('')
    setStep('time')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function finish() {
    const environmentalIntake = enteredLocations.map((location) => {
      const values = environment[location] ?? {
        present: '',
        absent: '',
        constrained: '',
        displaced: '',
      }

      return {
        location,
        observations: STATES.flatMap(({ key }) =>
          splitObservations(values[key]).map((value) => ({ state: key, value })),
        ),
      }
    })

    const parsed = FoundationIntakeSchema.safeParse({
      birthLocation: birthLocation.trim(),
      currentLocation: currentLocation.trim(),
      locationsLivedOneYearOrMore: locations.map((place) => place.trim()).filter(Boolean),
      environmentalIntake,
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

  function goBack() {
    if (step === 'time') setStep('environment')
    else if (step === 'environment') setStep('place')
    else onReplay?.()
  }

  const stepNumber = step === 'place' ? '01' : step === 'environment' ? '02' : '03'

  return (
    <main className="giPage">
      <div className="giFrame">
        <button type="button" className="giBack" onClick={goBack}>
          <span aria-hidden="true">&#8249;</span>
          {step === 'place' ? 'Replay splash' : 'Back'}
        </button>

        <div className="giMetaRow">
          <span className="giEyebrow">Foundation</span>
          <span className="giEyebrow giStepCount">{stepNumber} / 03</span>
        </div>

        <h1 className="giTitle">
          {step === 'place' && 'Geographical Imprints'}
          {step === 'environment' && 'Environmental Field'}
          {step === 'time' && 'Your Time Anchor'}
        </h1>

        <p className="giSubtitle">
          {step === 'place' && 'Tell us where in the world your life has taken place.'}
          {step === 'environment' && 'For each place, record what repeatedly entered the field — and what the environment did not provide.'}
          {step === 'time' && 'The moment you arrived. Date first — time is optional.'}
        </p>

        <div className="giDivider" />

        {step === 'place' && (
          <section className="giPanel">
            <div className="giGroup">
              <span className="giLabel">Where were you born?</span>
              <label className="giInputFrame">
                <span className="giSparkleWrap"><Sparkle /></span>
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
                      <span className="giSparkleWrap"><Sparkle /></span>
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
                        onClick={() => setLocations((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        aria-label="Remove location"
                      >
                        &minus;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="giAdd" onClick={() => setLocations((current) => [...current, ''])}>
                <span className="giAddIcon" aria-hidden="true">+</span>
                Add another location
              </button>
            </div>

            <div className="giGroup">
              <span className="giLabel">Where do you live now?</span>
              <label className="giInputFrame">
                <span className="giSparkleWrap"><Sparkle /></span>
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
        )}

        {step === 'environment' && (
          <section className="giPanel">
            {enteredLocations.map((location) => {
              const values = environment[location] ?? {
                present: '',
                absent: '',
                constrained: '',
                displaced: '',
              }

              return (
                <div className="giGroup" key={location}>
                  <span className="giLabel">{location}</span>
                  <p className="giHelp">Use short phrases. Separate items with commas or new lines.</p>

                  {STATES.map(({ key, label, help }) => (
                    <div className="giGroup" key={key}>
                      <span className="giLabel">{label}</span>
                      <p className="giHelp">{help}</p>
                      <label className="giInputFrame">
                        <textarea
                          className="giInput"
                          rows={4}
                          value={values[key]}
                          onChange={(event) =>
                            setEnvironment((current) => ({
                              ...current,
                              [location]: {
                                ...(current[location] ?? {
                                  present: '',
                                  absent: '',
                                  constrained: '',
                                  displaced: '',
                                }),
                                [key]: event.target.value,
                              },
                            }))
                          }
                          placeholder={
                            key === 'present'
                              ? 'Example: ocean, packed classes, crime, open space, manual work...'
                              : key === 'absent'
                                ? 'Example: ocean access, workers, public transit, nightlife...'
                                : key === 'constrained'
                                  ? 'Example: travel, privacy, career options, healthcare...'
                                  : 'Example: teaching replaced by property work, travel replaced by place-bound obligations...'
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )
            })}

            <button type="button" className="giContinue" onClick={continueFromEnvironment}>
              Continue <span aria-hidden="true">&rarr;</span>
            </button>
          </section>
        )}

        {step === 'time' && (
          <section className="giPanel">
            <div className="giGroup">
              <span className="giLabel">What is your birth date?</span>
              <label className="giInputFrame">
                <span className="giSparkleWrap"><Sparkle /></span>
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
                <span className="giSparkleWrap"><Sparkle /></span>
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
