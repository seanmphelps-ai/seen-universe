/**
 * SEEN — PHASE 2 TEMPORAL NARROWING SCHEMA
 *
 * Environmental field prepass → birth date → hidden resonance summaries → user selection
 * → recursive narrowing → working temporal anchor.
 *
 * Clock times are never user-facing by default.
 * They exist only as backend chart anchors used to generate distinguishable behavioral summaries.
 *
 * Environmental markers are already active before Phase 2 begins.
 */

export type TimeConfidence =
  | 'UNKNOWN'
  | 'APPROXIMATE'
  | 'REPORTED'
  | 'DOCUMENTED'
  | 'RESONANCE_LOCKED'

export type NarrowingIncrement =
  | 'TWO_HOUR'
  | 'ONE_HOUR'
  | 'HALF_HOUR'

export type DayOffset =
  | -1
  | 0
  | 1

export type EnvironmentalFieldHandoff = {
  environmentalFieldId: string
  includesBirthplace: true
  includesEarlyChildhoodLocations: boolean
  includesAdolescentLocations: boolean
  includesMajorLivedLocations: boolean
  includesCurrentLocation: boolean
  includesEventRelevantLocation: boolean
  includesBiome: true
  includesAbiotic: true
  includesGeoPresence: true
  includesPreDateWoundTriggerMap: true
}

export type PhaseTwoInput = {
  environmentalField: EnvironmentalFieldHandoff
  birthDateISO: string
  birthPlace: {
    city: string
    region?: string
    country: string
    latitude?: number
    longitude?: number
    timezone?: string
  }
  reportedBirthTime24h?: string
  timeConfidence: TimeConfidence
}

export type TemporalAnchor = {
  anchorId: string
  time24h: string
  dayOffset: DayOffset
  label: string
  visibleToUserAsExactTime: false
}

export type TemporalSummary = {
  anchorId: string
  label: string
  environmentalPressureDifference: string
  woundPressureDifference: string
  attachmentPattern: string
  nervousSystemStyle: string
  conflictPattern: string
  relationshipPattern: string
  ruptureBehavior: string
  pressureResponse: string
  shadowExpression: string
  regulationPattern: string
  hiddenMechanics: {
    chartAnchorTime24h: string
    dayOffset: DayOffset
    visibleToUser: false
    sourceSignalIds: string[]
  }
}

export type PhaseTwoSelection = {
  selectedAnchorId: string
  recognitionScore: number
  userNote?: string
}

export type PhaseTwoOutput = {
  summaries: TemporalSummary[]
  selectedWorkingAnchor?: {
    anchorId: string
    time24h: string
    dayOffset: DayOffset
    confidence: 'RESONANCE_LOCKED'
    visibleToUserAsExactTime: false
  }
  nextAnchors?: TemporalAnchor[]
  handoffToPhaseThree?: {
    environmentalFieldId: string
    selectedTime24h: string
    selectedDayOffset: DayOffset
    includeBirthDate: true
    includeBirthPlace: true
    includeBiome: true
    includeAbiotic: true
    includeGeoPresence: true
    includeEnvironmentalMarkers: true
    includePreDateWoundTriggerMap: true
    includeWoundMarkers: true
  }
}

export const PHASE_TWO_TEMPORAL_NARROWING_SCHEMA = {
  phase: 'PHASE_2_TEMPORAL_NARROWING',
  purpose:
    'Use environment-informed hidden recognition summaries to narrow an uncertain birth time into a working temporal anchor.',
  inputContract: {
    requiresEnvironmentalFieldPrepass: true,
    requiresBirthDateAfterEnvironmentalField: true,
    requiresBirthPlace: true,
    allowsReportedBirthTime: true,
    reportedBirthTimeIsClueOnly: true,
    doesNotRequireExactBirthTime: true,
    doesNotRequireQuestionnaire: true,
  },
  outputContract: {
    outputsBehavioralSummaries: true,
    outputsWorkingTemporalAnchor: true,
    exposesExactClockTimeToUser: false,
    handoffTarget: 'PHASE_3_PRESSURE_CONVERGENCE',
  },
  initialAnchors: [
    { label: 'Early Edge', time24h: '02:00', dayOffset: 0, visibleToUserAsExactTime: false },
    { label: 'Center Field', time24h: '12:00', dayOffset: 0, visibleToUserAsExactTime: false },
    { label: 'Late Edge', time24h: '22:00', dayOffset: 0, visibleToUserAsExactTime: false },
  ],
  narrowingRules: {
    defaultIncrement: 'TWO_HOUR',
    allowOneHour: true,
    allowHalfHourFinal: true,
    preservePriorSelections: true,
    selectedAnchorBecomesCenter: true,
    generateAdjacentAnchors: true,
    continueUntilRecognitionThreshold: true,
    allowPreviousDayBoundaryBranch: true,
    allowNextDayBoundaryBranch: true,
    hideClockTimesFromUser: true,
  },
  examplePath: {
    selected0200: ['00:00', '02:00', '04:00'],
    selected0000: ['22:00 previous day', '00:00', '02:00'],
    selected1200: ['10:00', '12:00', '14:00'],
    selected2200: ['20:00', '22:00', '00:00 next day'],
    selected2000: ['19:00', '20:00', '21:00'],
  },
  summaryRules: {
    useEnvironmentalField: true,
    usePreDateWoundTriggerMap: true,
    useBirthDate: true,
    useBirthPlace: true,
    useAnchorTime: true,
    usePatternLanguage: true,
    hideTechnicalMechanics: true,
    askForRecognition: true,
    neverAskUserToChooseAClockTime: true,
    presentAsSummaryA_B_C: true,
    summariesCompareDifferencesNotGenericPersonality: true,
  },
  phaseBoundary: {
    environmentalPressureExistsBeforeTemporalSignal: true,
    biomeExistsBeforeAnchorGeneration: true,
    abioticExistsBeforeAnchorGeneration: true,
    geoPresenceExistsBeforeAnchorGeneration: true,
    preDateWoundTriggerMapExistsBeforeAnchorGeneration: true,
    temporalSummariesCompareAnchorDifferencesInsideEnvironment: true,
    woundMarkersStayCandidateUntilConvergence: true,
  },
  userFacingBoundary: {
    clockTimesAreHidden: true,
    birthCertificateIsNotDebated: true,
    userSelectsRecognitionNotTime: true,
    selectedSummaryBecomesWorkingAnchor: true,
    questionnaireNotRequiredBeforeFirstRead: true,
  },
  outputLaw:
    'Phase 2 receives an already-built environmental field and outputs a hidden working temporal anchor without exposing exact clock-time mechanics to the user.',
} as const
