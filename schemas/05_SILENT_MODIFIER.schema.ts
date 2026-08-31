// SEEN
// 05_SILENT_MODIFIER.schema.ts

export type SilentModifierRole =
  | 'AMPLIFIER'
  | 'SUPPRESSOR'
  | 'DISTORTION'
  | 'ROUTING_SIGNAL'
  | 'PRESSURE_MARKER'
  | 'READINESS_MARKER'
  | 'SAFETY_MARKER'

export type SilentModifierSource =
  | 'INTAKE'
  | 'TRANSCRIPT'
  | 'WOUND_MARKER'
  | 'ENVIRONMENT'
  | 'TEMPORAL'
  | 'RELATIONAL'
  | 'BODY_SIGNAL'

export type SilentModifierInput = {
  schemaVersion: '1.0.0'
  source: SilentModifierSource
  sourceEventIds: string[]
  rawSignalLabel: string
  rawSignalDescription?: string
  observedIntensity?: 1 | 2 | 3 | 4 | 5
}

export type SilentModifier = {
  schemaVersion: '1.0.0'
  id: string
  source: SilentModifierSource
  role: SilentModifierRole
  label: string
  effect: string
  intensity: 1 | 2 | 3 | 4 | 5
  exposeToUser: false
  sourceEventIds: string[]
}

export type SilentModifierOutput = {
  schemaVersion: '1.0.0'
  modifier: SilentModifier
  safeForOracleUse: true
  exposeToUser: false
}

export type SilentModifierContract = {
  schemaVersion: '1.0.0'
  input: SilentModifierInput
  output: SilentModifierOutput
}
