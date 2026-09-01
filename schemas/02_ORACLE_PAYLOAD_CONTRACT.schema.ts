// SEEN
// 02_ORACLE_PAYLOAD_CONTRACT.schema.ts

export type OraclePayloadRisk =
  | 'BLAME'
  | 'SELF_BLAME'
  | 'FLOODING'
  | 'FIXATION'
  | 'AVOIDANCE'
  | 'OVERLOAD'
  | 'PROJECTION'
  | 'SHAME'

export type OraclePayloadDepth =
  | 'SURFACE'
  | 'MODERATE'
  | 'DEEP'
  | 'SHADOW'
  | 'FULL_MIRROR'

export type OraclePayloadSection = {
  id: string
  label:
    | 'STABILIZE'
    | 'PATTERN'
    | 'FACT_STORY'
    | 'REVEAL'
    | 'ANCHOR'
    | 'CONSEQUENCE'
    | 'REGULATE'
    | 'NEXT_ACTION'
  text: string
  userFacing: boolean
  hiddenMechanic: boolean
}

export type OraclePayloadContract = {
  schemaVersion: '1.0.0'
  payloadId: string
  depth: OraclePayloadDepth

  finalizedByGenerator: true
  safeForOracleRender: true
  mechanicsHidden: true

  risks: OraclePayloadRisk[]

  sections: OraclePayloadSection[]

  validation: {
    hasStabilize: true
    hasPattern: true
    hasRegulationClose: true
    containsRawIntakeAnswers: false
    containsRawScoring: false
    containsUnverifiedClaims: false
  }
}
