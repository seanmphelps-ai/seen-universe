// SEEN
// childhoodAdaptationTriangle.ts

export type ChildhoodAdaptationDomain =
  | 'SAFETY'
  | 'BELONGING'
  | 'REWARD'

export type ChildhoodAdaptationStrategy =
  | 'STAY_QUIET'
  | 'LEAVE_ROOM'
  | 'MAKE_JOKES'
  | 'KEEP_PEACE'
  | 'READ_PEOPLE'
  | 'TAKE_CHARGE'
  | 'HIDE_FEELINGS'
  | 'BECOME_USEFUL'
  | 'BE_AGREEABLE'
  | 'BE_HELPFUL'
  | 'BE_SUCCESSFUL'
  | 'BE_SMART'
  | 'BE_RESPONSIBLE'
  | 'BE_FUNNY'
  | 'BE_ATTRACTIVE'
  | 'BE_INDEPENDENT'
  | 'AVOID_CONFLICT'
  | 'DOMINATE_ROOM'
  | 'SHRINK_SELF'
  | 'OTHER'

export type ChildhoodAdaptationResponse = {
  domain: ChildhoodAdaptationDomain
  prompt: string
  selectedStrategies: ChildhoodAdaptationStrategy[]
  otherText?: string
}

export type ChildhoodAdaptationTriangleInput = {
  schemaVersion: '1.0.0'
  sessionId: string
  responses: ChildhoodAdaptationResponse[]
}

export type ChildhoodAdaptationTriangleOutput = {
  schemaVersion: '1.0.0'
  sessionId: string
  safetyStrategies: ChildhoodAdaptationStrategy[]
  belongingStrategies: ChildhoodAdaptationStrategy[]
  rewardStrategies: ChildhoodAdaptationStrategy[]
  safeForUser: true
}

export type ChildhoodAdaptationTriangleSchema = {
  schemaVersion: '1.0.0'
  fileResponsibility: 'collect_childhood_adaptation_strategies_for_intake'

  userFacingPurpose: 'identify_what_worked_in_childhood_without_requiring_trauma_language'

  intakeQuestions: {
    safety: string
    belonging: string
    reward: string
  }

  allowedDomains: ChildhoodAdaptationDomain[]

  forbiddenMoves: {
    diagnoseUser: true
    diagnoseFamily: true
    implyCertainty: true
    forceTraumaLanguage: true
    exposeHiddenMechanics: true
    moralize: true
    overTalk: true
  }

  input: ChildhoodAdaptationTriangleInput
  output: ChildhoodAdaptationTriangleOutput
}

export const CHILDHOOD_ADAPTATION_TRIANGLE_SCHEMA: ChildhoodAdaptationTriangleSchema = {
  schemaVersion: '1.0.0',
  fileResponsibility: 'collect_childhood_adaptation_strategies_for_intake',

  userFacingPurpose: 'identify_what_worked_in_childhood_without_requiring_trauma_language',

  intakeQuestions: {
    safety: 'When things felt tense or unsafe growing up, what worked best for helping you feel safe?',
    belonging: 'When you were growing up, what worked best for keeping friends or staying included?',
    reward: 'When you were growing up, what got you the most appreciation, affection, approval, or reward?',
  },

  allowedDomains: ['SAFETY', 'BELONGING', 'REWARD'],

  forbiddenMoves: {
    diagnoseUser: true,
    diagnoseFamily: true,
    implyCertainty: true,
    forceTraumaLanguage: true,
    exposeHiddenMechanics: true,
    moralize: true,
    overTalk: true,
  },

  input: {
    schemaVersion: '1.0.0',
    sessionId: '',
    responses: [],
  },

  output: {
    schemaVersion: '1.0.0',
    sessionId: '',
    safetyStrategies: [],
    belongingStrategies: [],
    rewardStrategies: [],
    safeForUser: true,
  },
}
