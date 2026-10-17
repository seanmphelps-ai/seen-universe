// SEEN
// 10_ORACLE_RESPONSE_CONTRACT.ts

export type OracleResponseSection =
  | 'STABILIZE'
  | 'NAME_PATTERN'
  | 'SEPARATE_FACT_FROM_STORY'
  | 'RESTORE_AGENCY'
  | 'CLEAN_NEXT_ACTION'
  | 'REGULATE'

export type OracleResponseChip =
  | 'STAY_HERE'
  | 'GO_DEEPER'
  | 'REGULATE'

export type OracleResponseInput = {
  schemaVersion: '1.0.0'
  payloadId: string
  sessionId: string
  transcriptEventIds: string[]
  factSignals: string[]
  feelingSignals: string[]
  interpretationSignals: string[]
  patternSignals: string[]
  modifierIds: string[]
  requestedDepth: OracleResponseChip
  priorResponseIds: string[]
  mechanicsHidden: true
  finalizedByGenerator: true
}

export type OracleRenderedSection = {
  section: OracleResponseSection
  text: string
  userFacing: true
  exposesMechanics: false
}

export type OracleResponseOutput = {
  schemaVersion: '1.0.0'
  responseId: string
  sessionId: string
  sections: OracleRenderedSection[]
  chips: OracleResponseChip[]
  savedSession: true
  safeForUser: true
  mechanicsHidden: true
  readyForTraversalMemory: true
}

export type OracleResponseContract = {
  schemaVersion: '1.0.0'
  fileResponsibility: 'render_generator_payload_into_user_safe_oracle_response'
  input: OracleResponseInput
  output: OracleResponseOutput
  laws: {
    oracleDoesNotCalculate: true
    oracleDoesNotScore: true
    oracleRendersOnlyFinalizedPayload: true
    stabilizeBeforeReveal: true
    regulateAfterConsequence: true
    mechanicsHiddenByDefault: true
    chipsBranchFromPayloadOnly: true
  }
}

export const ORACLE_RESPONSE_CONTRACT: OracleResponseContract = {
  schemaVersion: '1.0.0',
  fileResponsibility: 'render_generator_payload_into_user_safe_oracle_response',
  input: {
    schemaVersion: '1.0.0',
    payloadId: '',
    sessionId: '',
    transcriptEventIds: [],
    factSignals: [],
    feelingSignals: [],
    interpretationSignals: [],
    patternSignals: [],
    modifierIds: [],
    requestedDepth: 'STAY_HERE',
    priorResponseIds: [],
    mechanicsHidden: true,
    finalizedByGenerator: true,
  },
  output: {
    schemaVersion: '1.0.0',
    responseId: '',
    sessionId: '',
    sections: [],
    chips: ['STAY_HERE', 'GO_DEEPER', 'REGULATE'],
    savedSession: true,
    safeForUser: true,
    mechanicsHidden: true,
    readyForTraversalMemory: true,
  },
  laws: {
    oracleDoesNotCalculate: true,
    oracleDoesNotScore: true,
    oracleRendersOnlyFinalizedPayload: true,
    stabilizeBeforeReveal: true,
    regulateAfterConsequence: true,
    mechanicsHiddenByDefault: true,
    chipsBranchFromPayloadOnly: true,
  },
}
