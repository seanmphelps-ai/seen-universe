// SEEN
// 001_CLOSURE_COMPOSURE_INTAKE.schema.ts

export type ConfidenceLevel = 'low' | 'moderate' | 'high'

export type RelationshipState =
  | 'broken_up'
  | 'in_conflict'
  | 'unclear'
  | 'still_together'
  | 'no_contact'
  | 'unknown'

export type RuntimeRisk =
  | 'BLAME'
  | 'SELF_BLAME'
  | 'FLOODING'
  | 'FIXATION'
  | 'AVOIDANCE'
  | 'OVERLOAD'
  | 'PROJECTION'
  | 'SHAME'

export type PersonSignalInput = {
  personId: string
  role: 'self' | 'partner' | 'ex_partner' | 'family_member' | 'other'
  knownFacts: string[]
  observedPatterns?: string[]
  emotionalSignals?: string[]
  bodySignals?: string[]
}

export type TimelineMarker = {
  id: string
  label: string
  date?: string
  approximateDateAllowed: boolean
  evidenceSources: string[]
}

export type PatternFinding = {
  label: string
  confidence: ConfidenceLevel
  evidenceSources: string[]
  userFacingText: string
}

export type ChoicePoint = {
  label: string
  action: string
  riskIfIgnored: string
}

export type ClosureComposureInput = {
  schemaVersion: '1.0.0'
  sessionId: string
  personA: PersonSignalInput
  personB?: PersonSignalInput
  relationshipState: RelationshipState
  knownTimeline?: TimelineMarker[]
  userQuestion?: string
  transcriptEventIds: string[]
}

export type ClosureComposureOutput = {
  schemaVersion: '1.0.0'
  sessionId: string
  likelyDynamic: PatternFinding
  activatedPattern: PatternFinding
  perceptionSplit?: PatternFinding
  personACarrying?: PatternFinding[]
  personBCarrying?: PatternFinding[]
  repeatedLoop?: PatternFinding
  likelyImpact: PatternFinding[]
  nextChoice: ChoicePoint[]
  risks: RuntimeRisk[]
  confidence: ConfidenceLevel
  nextStepReceives: {
    generatorPayloadId: string
    targetRuntimeFile: 'runtime/10_ORACLE_RESPONSE_CONTRACT.ts'
    renderOnlyUserFacingText: true
    mechanicsHidden: true
  }
}

export type ClosureComposureRunStep =
  | 'RUN_BASELINE_SIGNALS'
  | 'RUN_INTAKE_MODIFIERS'
  | 'RUN_RELATIONSHIP_STATE_CLASSIFIER'
  | 'RUN_PATTERN_CONVERGENCE'
  | 'PRODUCE_CLOSURE_COMPOSURE_OUTPUT'
  | 'RENDER_ONLY_USER_FACING_TEXT'

export type ClosureComposureIntakeContract = {
  schemaVersion: '1.0.0'
  fileResponsibility: 'define_phase_one_closure_composure_intake_input_output_contract'
  input: ClosureComposureInput
  output: ClosureComposureOutput
  requiredRunOrder: [
    'RUN_BASELINE_SIGNALS',
    'RUN_INTAKE_MODIFIERS',
    'RUN_RELATIONSHIP_STATE_CLASSIFIER',
    'RUN_PATTERN_CONVERGENCE',
    'PRODUCE_CLOSURE_COMPOSURE_OUTPUT',
    'RENDER_ONLY_USER_FACING_TEXT'
  ]
  forbidden: {
    productPhilosophyInsideSchema: true
    salesCopyInsideSchema: true
    vagueEmotionalClaimsInsideSchema: true
    oracleCalculates: true
    exposeHiddenMechanicsByDefault: true
    skipEvidenceSources: true
    skipNextStepHandoff: true
  }
}

export const CLOSURE_COMPOSURE_INTAKE_CONTRACT: ClosureComposureIntakeContract = {
  schemaVersion: '1.0.0',
  fileResponsibility: 'define_phase_one_closure_composure_intake_input_output_contract',
  input: {
    schemaVersion: '1.0.0',
    sessionId: '',
    personA: {
      personId: 'person_a',
      role: 'self',
      knownFacts: [],
      observedPatterns: [],
      emotionalSignals: [],
      bodySignals: [],
    },
    relationshipState: 'unknown',
    knownTimeline: [],
    userQuestion: '',
    transcriptEventIds: [],
  },
  output: {
    schemaVersion: '1.0.0',
    sessionId: '',
    likelyDynamic: {
      label: '',
      confidence: 'low',
      evidenceSources: [],
      userFacingText: '',
    },
    activatedPattern: {
      label: '',
      confidence: 'low',
      evidenceSources: [],
      userFacingText: '',
    },
    likelyImpact: [],
    nextChoice: [],
    risks: [],
    confidence: 'low',
    nextStepReceives: {
      generatorPayloadId: '',
      targetRuntimeFile: 'runtime/10_ORACLE_RESPONSE_CONTRACT.ts',
      renderOnlyUserFacingText: true,
      mechanicsHidden: true,
    },
  },
  requiredRunOrder: [
    'RUN_BASELINE_SIGNALS',
    'RUN_INTAKE_MODIFIERS',
    'RUN_RELATIONSHIP_STATE_CLASSIFIER',
    'RUN_PATTERN_CONVERGENCE',
    'PRODUCE_CLOSURE_COMPOSURE_OUTPUT',
    'RENDER_ONLY_USER_FACING_TEXT',
  ],
  forbidden: {
    productPhilosophyInsideSchema: true,
    salesCopyInsideSchema: true,
    vagueEmotionalClaimsInsideSchema: true,
    oracleCalculates: true,
    exposeHiddenMechanicsByDefault: true,
    skipEvidenceSources: true,
    skipNextStepHandoff: true,
  },
}
