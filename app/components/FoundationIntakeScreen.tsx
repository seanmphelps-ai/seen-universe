'use client'

import { FormEvent, useState } from 'react'
import { FoundationIntakeSchema, type FoundationIntake } from '../../src/schema/phase-1/intake/foundationIntake.schema'
import { SeenIcon } from './SeenIcon'

export function FoundationIntakeScreen({ initial, onComplete }: { initial: FoundationIntake; onComplete: (value: FoundationIntake) => void }) {
  const [value, setValue] = useState(initial)
  const [locations, setLocations] = useState(initial.locationsLivedOneYearOrMore.length ? initial.locationsLivedOneYearOrMore : [''])
  const [error, setError] = useState('')

  function update<Key extends keyof FoundationIntake>(key: Key, next: FoundationIntake[Key]) {
    setValue((current) => ({ ...current, [key]: next }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = FoundationIntakeSchema.safeParse({ ...value, locationsLivedOneYearOrMore: locations.map((place) => place.trim()).filter(Boolean), birthTime: value.birthTime?.trim() || undefined })
    if (!parsed.success) {
      setError('Complete the birth location, current location, and birth date before continuing.')
      return
    }
    setError('')
    onComplete(parsed.data)
  }

  return (
    <main className="seenPage">
      <section className="seenFrame intakeFrame" aria-labelledby="foundation-title">
        <header className="seenHeader"><div className="brandMark">SEEN</div><div className="progressTrack"><span className="progressFill" /></div><p className="progressLabel">Foundation · 01 / 03</p></header>
        <div className="editorialIntro"><p className="eyebrow">Begin here</p><h1 id="foundation-title">Let’s begin with your foundation.</h1><p>We’ll build from your environment first.</p><div className="seenDivider" /></div>
        <form className="seenPanel foundationForm" onSubmit={submit}>
          <div className="formSection"><span className="sectionNumber">01</span><div><h2>Your place field</h2><p>Origin, lived terrain, and current environment remain separate.</p></div></div>
          <Field label="Birth location" icon="location"><input className="seenInput" value={value.birthLocation} onChange={(event) => update('birthLocation', event.target.value)} placeholder="City, region, country" autoComplete="off" required /></Field>
          <fieldset className="fieldGroup"><legend className="fieldLabel">Locations lived for one year or more</legend>{locations.map((place, index) => <span className="inputShell locationRow" key={index}><SeenIcon name="location" /><input className="seenInput" value={place} onChange={(event) => setLocations((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="Add a place" />{index ? <button className="roundControl" type="button" onClick={() => setLocations((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove location"><SeenIcon name="close" /></button> : <button className="roundControl" type="button" onClick={() => setLocations((current) => [...current, ''])} aria-label="Add location"><SeenIcon name="plus" /></button>}</span>)}</fieldset>
          <Field label="Current location" icon="location"><input className="seenInput" value={value.currentLocation} onChange={(event) => update('currentLocation', event.target.value)} placeholder="Where you live now" autoComplete="off" required /></Field>
          <div className="formSection dateSection"><span className="sectionNumber">02</span><div><h2>Your time anchor</h2><p>Date enters after the environmental field is present.</p></div></div>
          <Field label="Birth date" icon="calendar"><input className="seenInput" value={value.birthDate} onChange={(event) => update('birthDate', event.target.value)} type="date" required /></Field>
          <Field label="Birth time" optional icon="clock"><input className="seenInput" value={value.birthTime ?? ''} onChange={(event) => update('birthTime', event.target.value || undefined)} type="time" /><small>A submitted time remains unresolved until SEEN confirms it through convergence and recognition.</small></Field>
          {error && <p className="formError" role="alert">{error}</p>}
          <button className="seenButtonPrimary readyButton" type="submit"><SeenIcon name="sparkle" /><span>Are you ready to be SEEN?</span><SeenIcon name="sparkle" /></button>
          <div className="seenDivider formDivider" />
        </form>
      </section>
    </main>
  )
}

function Field({ label, icon, optional, children }: { label: string; icon: 'location' | 'calendar' | 'clock'; optional?: boolean; children: React.ReactNode }) {
  return <label className="fieldGroup"><span className="fieldLabel">{label}{optional && <span className="optionalLabel">Optional</span>}</span><span className="inputShell"><SeenIcon name={icon} />{children}</span></label>
}
