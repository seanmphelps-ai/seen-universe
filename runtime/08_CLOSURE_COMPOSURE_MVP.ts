// SEEN
// 08_CLOSURE_COMPOSURE_MVP.ts

export type ClosureComposureCoreFunction =
  | 'EXIT_LOOP'
  | 'RESTORE_ORIENTATION'
  | 'SEPARATE_FACT_FROM_STORY'
  | 'REDUCE_ESCALATION'
  | 'RETURN_AGENCY'
  | 'CLOSE_WITH_REGULATION'

export type ClosureComposureIncidentDate = {
  date: string
  exactDateKnown: boolean
  approximateDateAllowed: boolean
  time?: string
  timezone?: string
  location?: {
    label?: string
    latitude?: number
    longitude?: number
  }
  routesTo: 'SWISS_EPHEMERIS_EVENT_ENGINE'
  requiredForEphemerisLookup: true
}

export type ClosureComposureInput = {
  schemaVersion: '1.0.0'
  sessionId: string
  transcriptEventIds: string[]
  userText: string
  incidentDate?: ClosureComposureIncidentDate
  activeModifierIds?: string[]
}

export type ClosureComposureIntake = {
  incidentDate?: ClosureComposureIncidentDate
}

export type ClosureComposureOracleSection =
  | 'STABILIZE'
  | 'NAME_PATTERN'
  | 'SEPARATE_FACT_FROM_STORY'
  | 'RESTORE_AGENCY'
  | 'CLEAN_NEXT_ACTION'
  | 'REGULATE'

export type ClosureComposureOutput = {
  schemaVersion: '1.0.0'
  sessionId: string
  sections: ClosureComposureOracleSection[]
  renderedResponseId: string
  nextChipOptions: Array<'STAY_HERE' | 'GO_DEEPER' | 'REGULATE'>
  savedSession: true
  safeForUser: true
}

export type ClosureComposureMvp = {
  schemaVersion: '1.0.0'
  mvpCore: 'CLOSURE_AND_COMPOSURE'

  input: ClosureComposureInput

  functions: ClosureComposureCoreFunction[]

  intake: ClosureComposureIntake

  requiredSequence: [
    'STABILIZE',
    'NAME_PATTERN',
    'SEPARATE_FACT_FROM_STORY',
    'RESTORE_AGENCY',
    'CLEAN_NEXT_ACTION',
    'REGULATE'
  ]

  output: ClosureComposureOutput

  requiredRouting: {
    incidentDateRoutesToSwissEphemeris: true
    closureComposureEventReviewRequiresIncidentDateWhenKnown: true
    oracleMustNotRenderTimedEventReviewWithoutEphemerisPayload: true
  }

  forbiddenMoves: {
    diagnoseUser: true
    diagnoseOtherPerson: true
    exposeHiddenMechanics: true
    escalateCertaintyWithoutEvidence: true
    moralize: true
    flatter: true
    overTalk: true
    bypassRegulation: true
  }
}

export const CLOSURE_COMPOSURE_MVP: ClosureComposureMvp = {
  schemaVersion: '1.0.0',
  mvpCore: 'CLOSURE_AND_COMPOSURE',

  input: {
    schemaVersion: '1.0.0',
    sessionId: '',
    transcriptEventIds: [],
    userText: '',
    activeModifierIds: [],
  },

  functions: [
    'EXIT_LOOP',
    'RESTORE_ORIENTATION',
    'SEPARATE_FACT_FROM_STORY',
    'REDUCE_ESCALATION',
    'RETURN_AGENCY',
    'CLOSE_WITH_REGULATION',
  ],

  intake: {},

  requiredSequence: [
    'STABILIZE',
    'NAME_PATTERN',
    'SEPARATE_FACT_FROM_STORY',
    'RESTORE_AGENCY',
    'CLEAN_NEXT_ACTION',
    'REGULATE',
  ],

  output: {
    schemaVersion: '1.0.0',
    sessionId: '',
    sections: [
      'STABILIZE',
      'NAME_PATTERN',
      'SEPARATE_FACT_FROM_STORY',
      'RESTORE_AGENCY',
      'CLEAN_NEXT_ACTION',
      'REGULATE',
    ],
    renderedResponseId: '',
    nextChipOptions: ['STAY_HERE', 'GO_DEEPER', 'REGULATE'],
    savedSession: true,
    safeForUser: true,
  },

  requiredRouting: {
    incidentDateRoutesToSwissEphemeris: true,
    closureComposureEventReviewRequiresIncidentDateWhenKnown: true,
    oracleMustNotRenderTimedEventReviewWithoutEphemerisPayload: true,
  },

  forbiddenMoves: {
    diagnoseUser: true,
    diagnoseOtherPerson: true,
    exposeHiddenMechanics: true,
    escalateCertaintyWithoutEvidence: true,
    moralize: true,
    flatter: true,
    overTalk: true,
    bypassRegulation: true,
  },
}
