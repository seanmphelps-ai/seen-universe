'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FoundationIntake } from '../../src/schema/phase-1/intake/foundationIntake.schema'
import { buildFoundationRecognition } from '../../src/seen/recognition'
import { enableCadenceNotifications, type NotificationSetupResult } from '../../src/native/notifications'
import { purchaseSeenAccess, readSubscriptionAccess, restoreSeenAccess, type SubscriptionAccess } from '../../src/native/subscriptions'
import { SeenIcon } from './SeenIcon'

export function RecognitionScreen({ foundation, onEdit }: { foundation: FoundationIntake; onEdit: () => void }) {
  const recognition = useMemo(() => buildFoundationRecognition(foundation), [foundation])
  const [access, setAccess] = useState<SubscriptionAccess | null>(null)
  const [purchasePending, setPurchasePending] = useState(false)
  const [message, setMessage] = useState('')
  const [time, setTime] = useState('09:00')
  const [notification, setNotification] = useState<NotificationSetupResult | null>(null)
  const [notificationPending, setNotificationPending] = useState(false)

  useEffect(() => { void readSubscriptionAccess().then(setAccess).catch(() => setMessage('SEEN could not read the App Store entitlement state.')) }, [])

  async function purchase(restore = false) {
    setPurchasePending(true)
    setMessage('')
    try {
      const result = restore ? await restoreSeenAccess() : await purchaseSeenAccess()
      setAccess(result)
      setMessage(result.message)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The App Store request could not be completed.')
    } finally { setPurchasePending(false) }
  }

  async function enableCadence() {
    setNotificationPending(true)
    try { setNotification(await enableCadenceNotifications(time)) }
    catch (error) { setNotification({ native: true, scheduled: false, remoteRegistrationRequested: false, message: error instanceof Error ? error.message : 'Cadence notifications could not be enabled.' }) }
    finally { setNotificationPending(false) }
  }

  return (
    <main className="seenPage recognitionPage"><section className="seenFrame recognitionFrame" aria-labelledby="recognition-title">
      <header className="seenHeader recognitionHeader"><button className="backAction" type="button" onClick={onEdit}>Edit foundation</button><div className="brandMark">SEEN</div><p className="progressLabel">Recognition · 02 / 03</p></header>
      <article className="recognitionHero"><p className="eyebrow">{recognition.eyebrow}</p><h1 id="recognition-title">{recognition.title}</h1><p className="recognitionLead">{recognition.lead}</p><div className="seenDivider" /></article>
      <article className="seenPanel recognitionPanel"><div className="featureIcon"><SeenIcon name="sparkle" /></div><p className="recognitionStatement">{recognition.recognition}</p><p className="recognitionBoundary">{recognition.boundary}</p></article>
      <section className="capturedSection"><p className="eyebrow">Foundation captured</p><div className="capturedList">{recognition.captured.map((item) => <div className="capturedRow" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></section>
      <section className={access?.active ? 'seenPanel accessPanel accessPanelActive' : 'seenPanel accessPanel'}><div className="accessHeader"><div><p className="eyebrow">Full access</p><h2>{access?.active ? 'SEEN is unlocked.' : 'Continue into the full SEEN path.'}</h2></div><span className="accessState">{access?.active ? 'Active' : 'Locked'}</span></div><div className="accessFeatures"><p><SeenIcon name="sparkle" /> Environmental pressure profile</p><p><SeenIcon name="sparkle" /> Recognition summaries and deeper paths</p><p><SeenIcon name="sparkle" /> Cadence on your lock screen</p></div>{!access?.active && <div className="purchaseActions"><button className="seenButtonPrimary" type="button" onClick={() => purchase()} disabled={purchasePending}><span>{purchasePending ? 'Connecting…' : `Unlock SEEN${access?.priceLabel ? ` · ${access.priceLabel}` : ''}`}</span><SeenIcon name="arrow" /></button><button className="seenButtonSecondary" type="button" onClick={() => purchase(true)} disabled={purchasePending}>Restore purchase</button></div>}<p className="purchaseMessage" aria-live="polite">{message || access?.message}</p></section>
      <section className="seenPanel cadencePanel"><div className="cadenceCopy"><p className="eyebrow">Cadence</p><h2>Bring recognition to your lock screen.</h2><p>Choose when SEEN should create a quiet daily return point. Notification access remains optional.</p></div><label className="fieldGroup cadenceTimeField"><span className="fieldLabel">Daily reminder time</span><span className="inputShell"><SeenIcon name="clock" /><input className="seenInput" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></span></label><button className="seenButtonSecondary cadenceButton" type="button" onClick={enableCadence} disabled={notificationPending}>{notificationPending ? 'Connecting…' : 'Enable lock-screen Cadence'}</button>{notification && <p className="purchaseMessage" aria-live="polite">{notification.message}</p>}</section>
    </section></main>
  )
}
