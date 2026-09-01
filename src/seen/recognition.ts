import type { FoundationIntake } from '../schema/phase-1/intake/foundationIntake.schema'

export type RecognitionPayload = {
  eyebrow: string
  title: string
  lead: string
  recognition: string
  boundary: string
  captured: Array<{ label: string; value: string }>
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase()
}

export function buildFoundationRecognition(input: FoundationIntake): RecognitionPayload {
  const livedCount = input.locationsLivedOneYearOrMore.length
  const samePlace = normalize(input.birthLocation) === normalize(input.currentLocation)
  const locationCount = 2 + livedCount

  return {
    eyebrow: 'First recognition',
    title: livedCount > 0
      ? 'Your foundation is larger than one place.'
      : 'Your beginning and your present both matter.',
    lead: `SEEN is preserving ${locationCount} location fields as separate phases before interpretation begins.`,
    recognition: samePlace
      ? 'Your birthplace and current location share the same name. SEEN still keeps origin and present-day environment separate so time, context, and lived phase are not collapsed into one story.'
      : 'Your birthplace and current location are different. SEEN holds that movement as a real change in environmental context rather than treating your chart as though it developed in one unchanging place.',
    boundary: 'This is a structural recognition, not a personality claim. Environmental pressure, wound activation, and deeper interpretation remain hidden until the Generator has enough converging evidence.',
    captured: [
      { label: 'Birth location', value: input.birthLocation },
      ...(livedCount ? [{ label: 'Lived one year or more', value: input.locationsLivedOneYearOrMore.join(' · ') }] : []),
      { label: 'Current location', value: input.currentLocation },
      { label: 'Birth date', value: input.birthDate },
      ...(input.birthTime ? [{ label: 'Birth time', value: `${input.birthTime} · held as unresolved` }] : []),
    ],
  }
}
