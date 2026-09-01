'use client'

import { Capacitor } from '@capacitor/core'

export type NotificationSetupResult = {
  native: boolean
  scheduled: boolean
  remoteRegistrationRequested: boolean
  message: string
}

const CADENCE_NOTIFICATION_ID = 611
const PUSH_TOKEN_STORAGE_KEY = 'seen:push-token'

async function syncPushToken(token: string) {
  localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token)
  const endpoint = process.env.NEXT_PUBLIC_PUSH_REGISTRATION_URL
  if (!endpoint) return

  await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, platform: Capacitor.getPlatform() }),
  })
}

export async function enableCadenceNotifications(time: string): Promise<NotificationSetupResult> {
  if (!Capacitor.isNativePlatform()) {
    return {
      native: false,
      scheduled: false,
      remoteRegistrationRequested: false,
      message: 'Lock-screen Cadence activates inside the installed iPhone app.',
    }
  }

  const [hourText, minuteText] = time.split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error('Choose a valid notification time.')
  }

  const { LocalNotifications } = await import('@capacitor/local-notifications')
  let localPermission = await LocalNotifications.checkPermissions()
  if (localPermission.display === 'prompt') {
    localPermission = await LocalNotifications.requestPermissions()
  }
  if (localPermission.display !== 'granted') {
    return {
      native: true,
      scheduled: false,
      remoteRegistrationRequested: false,
      message: 'Notification permission was not granted.',
    }
  }

  await LocalNotifications.cancel({ notifications: [{ id: CADENCE_NOTIFICATION_ID }] })
  await LocalNotifications.schedule({
    notifications: [{
      id: CADENCE_NOTIFICATION_ID,
      title: 'SEEN Cadence',
      body: 'Pause. Notice what is asking to be seen today.',
      schedule: {
        on: { hour, minute },
        repeats: true,
        allowWhileIdle: true,
      },
      threadIdentifier: 'seen-cadence',
      interruptionLevel: 'active',
      extra: { destination: 'recognition' },
    }],
  })

  const { PushNotifications } = await import('@capacitor/push-notifications')
  await PushNotifications.removeAllListeners()
  await PushNotifications.addListener('registration', ({ value }) => {
    void syncPushToken(value)
  })
  await PushNotifications.addListener('registrationError', ({ error }) => {
    console.error('SEEN push registration failed:', error)
  })

  let pushPermission = await PushNotifications.checkPermissions()
  if (pushPermission.receive === 'prompt') {
    pushPermission = await PushNotifications.requestPermissions()
  }

  const remoteRegistrationRequested = pushPermission.receive === 'granted'
  if (remoteRegistrationRequested) {
    await PushNotifications.register()
  }

  return {
    native: true,
    scheduled: true,
    remoteRegistrationRequested,
    message: remoteRegistrationRequested
      ? `Daily Cadence is scheduled for ${time}, and APNs registration has started.`
      : `Daily Cadence is scheduled for ${time}. Remote push permission remains off.`,
  }
}
