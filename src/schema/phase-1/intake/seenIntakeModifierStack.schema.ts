/**
 * SEEN
 * Phase 1 Environmental Modifier Stack Schema
 *
 * Purpose:
 * Convert the environmental field prepass into explicit runtime modifier sets.
 *
 * This file does not collect questionnaire answers.
 * This file derives how birthplace, childhood place, adolescent place, lived locations,
 * current location, biome, abiotic pressure, and GeoPresence change runtime weighting.
 *
 * Generator role:
 * - load after seenIntakePressure.schema.ts
 * - derive modifier stack from environmental field profile
 * - keep mechanics hidden by default
 * - pass silent modifier payload into Phase 2 temporal summaries
 */

import type {
  IntakePressureProfile,
  SilentAmplifierSet,
  SilentModifier,
} from './seenIntakePressure.schema'

export type ModifierStackRole =
  | 'amplifier'
  | 'suppressor'
  | 'distortion_factor'
  | 'regulation_support'
  | 'survival_adaptation'
  | 'early_wound_marker_pressure'
  | 'phase_2_routing_signal'

export type ModifierDerivationConfidence =
  | 'low'
  | 'moderate'
  | 'high'
  | 'unknown'

export type ModifierDerivationSource =
  | 'birthplace'
  | 'early_childhood_location'
  | 'adolescent_location'
  | 'major_lived_location'
  | 'current_location'
  | 'event_relevant_location'
  | 'biome'
  | 'abiotic'
  | 'geopresence'
  | 'terrain'
  | 'altitude'
  | 'light_cycle'
  | 'density_or_isolation'
  | 'resource_stability'
  | 'cultural_pace'
  | 'origin_current_friction'
  | 'early_wound_marker_pressure'

export type ModifierRuntimeEffect = {
  role: ModifierStackRole
  modifier: SilentModifier
  source: ModifierDerivationSource[]
  confidence: ModifierDerivationConfidence
  mayAffectPhaseTwoSummary: boolean
  mayAffectPhaseThreeConvergence: boolean
  userFacingByDefault: false
}

export type SilentSuppressorSet = {
  emotionalExpressionSuppressor: SilentModifier
  relationalTrustSuppressor: SilentModifier
  selfAdvocacySuppressor: SilentModifier
  creativeExpressionSuppressor: SilentModifier
  bodySignalSuppressor: SilentModifier
  intuitionSuppressor: SilentModifier
  socialBelongingSuppressor: SilentModifier
  financialAgencySuppressor: SilentModifier
  attachmentSecuritySuppressor: SilentModifier
}

export type SilentDistortionFactorSet = {
  responsibilityDistortionFactor: SilentModifier
  threatPerceptionDistortionFactor: SilentModifier
  abandonmentDistortionFactor: SilentModifier
  shameDistortionFactor: SilentModifier
  controlDistortionFactor: SilentModifier
  intimacyDistortionFactor: SilentModifier
  authorityDistortionFactor: SilentModifier
  resourceScarcityDistortionFactor: SilentModifier
  identityNarrativeDistortionFactor: SilentModifier
}

export type SilentRegulationSupportSet = {
  natureAccessSupport: SilentModifier
  stableTerrainSupport: SilentModifier
  environmentalRhythmSupport: SilentModifier
  movementAccessSupport: SilentModifier
  creativeOutletSupport: SilentModifier
  spiritualPracticeSupport: SilentModifier
  safeCommunitySupport: SilentModifier
  resourceStabilitySupport: SilentModifier
  environmentalRechargeSupport: SilentModifier
}

export type SilentSurvivalAdaptationSet = {
  hyperIndependenceAdaptation: SilentModifier
  peoplePleasingAdaptation: SilentModifier
  withdrawalAdaptation: SilentModifier
  perfectionismAdaptation: SilentModifier
  caretakerAdaptation: SilentModifier
  emotionalScanningAdaptation: SilentModifier
  controlAdaptation: SilentModifier
  collapseAdaptation: SilentModifier
  performanceIdentityAdaptation: SilentModifier
}

export type EarlyWoundMarkerPressureSet = {
  rejectionSensitivityPressure: SilentModifier
  abandonmentSensitivityPressure: SilentModifier
  shameExposurePressure: SilentModifier
  controlResponsePressure: SilentModifier
  emotionalSuppressionPressure: SilentModifier
  relationalTestingPressure: SilentModifier
  powerStrugglePressure: SilentModifier
  invisibilityPressure: SilentModifier
  boundaryConfusionPressure: SilentModifier
}

export type ModifierStackInput = {
  userId: string
  environmentalFieldProfile: IntakePressureProfile
  earlyWoundMarkerIds?: string[]
  priorModifierStackId?: string
}

export type ModifierStackOutput = {
  modifierStackId: string
  userId: string

  silentAmplifiers: SilentAmplifierSet
  silentSuppressors: SilentSuppressorSet
  silentDistortionFactors: SilentDistortionFactorSet
  silentRegulationSupports: SilentRegulationSupportSet
  silentSurvivalAdaptations: SilentSurvivalAdaptationSet
  earlyWoundMarkerPressure: EarlyWoundMarkerPressureSet

  runtimeEffects: ModifierRuntimeEffect[]

  phaseTwoHandoff: {
    includeEnvironmentalFieldProfile: true
    includeSilentAmplifiers: true
    includeSilentSuppressors: true
    includeSilentDistortionFactors: true
    includeSilentRegulationSupports: true
    includeSilentSurvivalAdaptations: true
    includeEarlyWoundMarkerPressure: true
    exposeMechanicsToUser: false
    exposeRawEnvironmentToUser: false
  }
}

export type SeenIntakeModifierStackSchema = {
  product: 'SEEN'
  phase: 'PHASE_1_ENVIRONMENTAL_FIELD_PREPASS'
  layer: 'ENVIRONMENTAL_MODIFIER_STACK'

  input: ModifierStackInput
  output: ModifierStackOutput

  rules: {
    questionnaireRequiredBeforeFirstRead: false
    modifiersAreRuntimeObjects: true
    modifiersMayShiftWeighting: true
    modifiersMayNotCreateStandaloneClaims: true
    convergenceRequiredForMajorClaims: true
    mechanicsHiddenByDefault: true
    environmentBeforeBirthDate: true
    preservesEnvironmentBeforeChartInterpretation: true
    separatesChartStructureFromEnvironmentalCooking: true
  }
}

export const SEEN_INTAKE_MODIFIER_STACK_LOAD_ORDER = {
  loadAfter: ['src/schema/phase-1/intake/seenIntakePressure.schema.ts'],
  loadBefore: ['schemas/phase-two/02_TEMPORAL_NARROWING_SCHEMA.ts'],
  requiredBy: ['PHASE_2_TEMPORAL_NARROWING', 'PHASE_3_PRESSURE_CONVERGENCE'],
} as const

export const SEEN_INTAKE_MODIFIER_STACK_RULE = {
  ruleName: 'PHASE_1_ENVIRONMENTAL_MODIFIER_STACK',

  purpose:
    'Separate amplifier, suppressor, distortion, regulation support, survival adaptation, reroute, and early wound-marker pressure effects from the environmental field before Phase 2 summaries.',

  inputRule:
    'The input is the Phase 1 environmental field profile. This schema derives runtime modifiers from birthplace, childhood place, adolescent place, lived locations, current location, biome, abiotic pressure, and GeoPresence.',

  outputRule:
    'The output is a hidden environmental modifier stack passed into Phase 2 and later pressure convergence.',

  amplifierRule:
    'Amplifiers increase the likelihood, intensity, or visibility of an already-supported signal.',

  suppressorRule:
    'Suppressors reduce expression, visibility, access, or confidence of an already-supported signal.',

  distortionRule:
    'Distortion factors alter perception, meaning-making, timing, or relational interpretation of a signal.',

  regulationSupportRule:
    'Regulation supports identify stabilizing conditions that may reduce collapse risk or increase integration capacity.',

  survivalAdaptationRule:
    'Survival adaptations describe learned environmental strategies without treating them as natal identity.',

  earlyWoundMarkerPressureRule:
    'Pre-date wound-trigger pressure may sharpen Phase 2 summaries silently. Wound names and mechanics remain hidden by default.',

  convergenceRule:
    'No environmental modifier may create a major user-facing claim without convergence across chart structure, wound markers, attachment, portal routing, or repeated user data.',

  safetyRule:
    'Do not repeat raw mechanics literally. Do not expose mechanics unless the user explicitly opens mechanics through Oracle depth controls.',

  finalLaw:
    'The modifier stack preserves the difference between environmental cooking, natal structure, survival adaptation, current expression, and user-facing summary language.',
} as const
