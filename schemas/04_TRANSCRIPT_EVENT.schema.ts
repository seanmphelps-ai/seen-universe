// SEEN
// 04_TRANSCRIPT_EVENT.schema.ts

export type TranscriptSpeaker =
  | 'USER'
  | 'OTHER_PERSON'
  | 'ORACLE'
  | 'SYSTEM'

export type TranscriptEventType =
  | 'MESSAGE'
  | 'VOICE_INPUT'
  | 'USER_INTERRUPTION'
  | 'USER_PAUSE'
  | 'USER_REQUEST_MORE'
  | 'USER_REQUEST_STOP'
  | 'ORACLE_RESPONSE'
  | 'SYSTEM_ROUTING'

export type TranscriptEvent = {
  schemaVersion: '1.0.0'
  id: string
  sessionId: string
  timestamp: string
  speaker: TranscriptSpeaker
  eventType: TranscriptEventType
  text: string

  userFacing: boolean
  eligibleForExtraction: boolean
  containsIntakeAnswer: boolean
  containsSensitiveMechanic: boolean
}
