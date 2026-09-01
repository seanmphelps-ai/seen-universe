// SEEN
// 03_GENERATOR_EXTRACTION_CONTRACT.ts

export type GeneratorSignalType =
  | 'FACT'
  | 'PATTERN'
  | 'CONTRADICTION'
  | 'REPETITION'
  | 'EMOTIONAL_INTENSITY'
  | 'RELATIONAL_IMPACT'
  | 'BODY_SIGNAL'
  | 'AVOIDANCE'
  | 'BLAME'
  | 'SELF_BLAME'
  | 'FLOODING'
  | 'FIXATION'

export type GeneratorSignal = {
  id: string
  type: GeneratorSignalType
  sourceTurnIds: string[]
  confidence: number
  userFacingSummary: string
  hiddenMechanic?: string
}

export type GeneratorExtractionContract = {
  schemaVersion: '1.0.0'
  fileResponsibility: 'generator_extracts_signals_for_oracle_render'

  laws: {
    generatorCalculates: true
    generatorExtracts: true
    generatorWeights: true
    generatorRoutes: true
    oracleDoesNotCalculate: true
    oracleReceivesOnlyFinalizedPayload: true
  }

  input: {
    transcriptTurnIds: string[]
    activeContextIds: string[]
  }

  output: {
    signals: GeneratorSignal[]
    exhausted: boolean
    readyForOraclePayload: boolean
  }
}
