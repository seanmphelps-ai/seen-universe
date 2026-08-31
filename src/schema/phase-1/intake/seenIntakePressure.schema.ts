/**
 * SEEN
 * Phase 1 Environmental Field Pressure Schema
 *
 * Purpose:
 * Build the environmental pressure field before birth date, chart interpretation,
 * temporal narrowing, portal routing, or Oracle rendering.
 *
 * The first shell does not collect a personal-history questionnaire.
 * It derives biome, abiotic, GeoPresence, and place-phase pressure from location data.
 *
 * Environment is the first pressure container.
 * Birth date enters only after this field exists.
 */

export type YesNoUnknown = 'yes' | 'no' | 'unknown'

export type Intensity =
  | 'none'
  | 'low'
  | 'moderate'
  | 'high'
  | 'severe'
  | 'unknown'

export type Stability =
  | 'stable'
  | 'mixed'
  | 'unstable'
  | 'unknown'

export type LocationPhase =
  | 'birthplace'
  | 'early_childhood'
  | 'adolescence'
  | 'major_lived_location'
  | 'current_location'
  | 'event_relevant_location'
  | 'unknown'

export type ModifierPurpose =
  | 'build_environmental_pressure_field'
  | 'amplify_existing_signal'
  | 'suppress_existing_signal'
  | 'identify_survival_adaptation'
  | 'separate_chart_from_environmental_pressure'
  | 'identify_environmental_conditioning'
  | 'identify_regulation_support'
  | 'identify_distortion_field'
  | 'pre_map_wound_trigger_field'

export type SilentModifier = {
  id: string
  label: string
  present: YesNoUnknown
  intensity?: Intensity
  confidence?: number
  purpose: ModifierPurpose[]
  notes?: string
}

export type BiomePressure = {
  ruralUrbanDensity:
    | 'rural'
    | 'small_town'
    | 'suburban'
    | 'urban'
    | 'high_density'
    | 'unknown'

  terrainType:
    | 'mountain'
    | 'coastal'
    | 'desert'
    | 'forest'
    | 'plains'
    | 'island'
    | 'city'
    | 'mixed'
    | 'unknown'

  natureExposure: Stability
  climateHarshness: Intensity
  seasonalLightVariation: Intensity
  ecologicalIntensity: Intensity
}

export type AbioticPressure = {
  elevation?: number
  terrainType?: string
  waterProximity?: string
  mineralOrLandSignature?: string
  environmentalPace: 'slow' | 'mixed' | 'fast' | 'unknown'
  altitudePressure?: Intensity
  lightCyclePressure?: Intensity
  seasonalPressure?: Intensity
  sensoryLoad?: Intensity
}

export type GeoPresencePressure = {
  rechargeEffect:
    | 'restoring'
    | 'neutral'
    | 'draining'
    | 'activating'
    | 'unknown'

  signalType:
    | 'grounding'
    | 'amplifying'
    | 'absorbing'
    | 'scattering'
    | 'compressing'
    | 'unknown'

  confidence?: number
}

export type EnvironmentalMarkerSet = {
  biome: BiomePressure
  abiotic: AbioticPressure
  geoPresence: GeoPresencePressure
  climateField?: SilentModifier
  terrainField?: SilentModifier
  densityOrIsolationField?: SilentModifier
  resourceStabilityField?: SilentModifier
  culturalPaceField?: SilentModifier
  mobilityAccessField?: SilentModifier
  safetyThreatField?: SilentModifier
  originCurrentFrictionField?: SilentModifier
}

export type PlaceFieldLocation = {
  placeName: string
  country?: string
  region?: string
  latitude?: number
  longitude?: number
  timezone?: string
  phase: LocationPhase
  startAge?: number
  endAge?: number
  livedMoreThanOneYear?: boolean
  environmentalMarkers: EnvironmentalMarkerSet
}

export type PreDateWoundTriggerMap = {
  abandonmentPressure: SilentModifier
  rejectionSensitivityPressure: SilentModifier
  shameExposurePressure: SilentModifier
  controlResponsePressure: SilentModifier
  invisibilityPressure: SilentModifier
  responsibilityDistortionPressure: SilentModifier
  emotionalSuppressionPressure: SilentModifier
  relationalTestingPressure: SilentModifier
  powerStrugglePressure: SilentModifier
  safetyScanningPressure: SilentModifier
  scarcityResponsePressure: SilentModifier
  isolationAdaptationPressure: SilentModifier
  overstimulationAdaptationPressure: SilentModifier
  displacementPressure: SilentModifier
  belongingPressure: SilentModifier
}

export type EnvironmentalFieldProfile = {
  userId?: string
  createdAt?: string
  updatedAt?: string

  locations: PlaceFieldLocation[]

  birthplace?: PlaceFieldLocation
  earlyChildhoodLocations?: PlaceFieldLocation[]
  adolescentLocations?: PlaceFieldLocation[]
  majorLivedLocations?: PlaceFieldLocation[]
  currentLocation?: PlaceFieldLocation
  eventRelevantLocation?: PlaceFieldLocation

  preDateWoundTriggerMap: PreDateWoundTriggerMap

  rules: {
    environmentRunsBeforeBirthDate: true
    birthDateMayNotBeInterpretedBeforeEnvironment: true
    noRequiredQuestionnaireBeforeFirstRead: true
    mechanicsHiddenByDefault: true
    environmentalMarkersMayNotCreateStandaloneClaims: true
    convergenceRequiredForUserFacingClaims: true
  }
}

/**
 * Compatibility alias.
 * Existing imports may still reference IntakePressureProfile, but the semantic contract is now
 * environmental field pressure, not questionnaire intake.
 */
export type IntakePressureProfile = EnvironmentalFieldProfile

export type SilentAmplifierSet = {
  biomePressureAmplifier: SilentModifier
  abioticPressureAmplifier: SilentModifier
  geoPresenceSignalAmplifier: SilentModifier
  terrainPressureAmplifier: SilentModifier
  altitudePressureAmplifier: SilentModifier
  densityIsolationAmplifier: SilentModifier
  seasonalLightAmplifier: SilentModifier
  resourceStabilityAmplifier: SilentModifier
  culturalPaceAmplifier: SilentModifier
  adolescentPlaceAmplifier: SilentModifier
  currentTerrainAmplifier: SilentModifier
  originCurrentFrictionAmplifier: SilentModifier
}

export type EnvironmentalModifierStack = {
  silentAmplifiers: SilentModifier[]
  silentSuppressors: SilentModifier[]
  silentDistortionFactors: SilentModifier[]
  silentRegulationSupports: SilentModifier[]
  silentSurvivalAdaptations: SilentModifier[]
  silentRerouteSignals: SilentModifier[]
}

export type IntakeModifierStack = EnvironmentalModifierStack

export type EnvironmentalOutputRule = {
  exposeInReading: false
  exposeMechanicsByDefault: false
  exposeWoundMarkerNamesByDefault: false
  useAs: 'environmental_pressure_prepass'
  questionnaireRequiredBeforeFirstRead: false
}

export const SEEN_INTAKE_OUTPUT_RULE: EnvironmentalOutputRule = {
  exposeInReading: false,
  exposeMechanicsByDefault: false,
  exposeWoundMarkerNamesByDefault: false,
  useAs: 'environmental_pressure_prepass',
  questionnaireRequiredBeforeFirstRead: false,
}

export type SeenIntakeSchema = {
  product: 'SEEN'
  phase: 'PHASE_1_ENVIRONMENTAL_FIELD_PREPASS'

  userId: string
  createdAt: string
  updatedAt?: string

  environmentalField: EnvironmentalFieldProfile
  silentAmplifiers: SilentAmplifierSet
  modifierStack?: EnvironmentalModifierStack

  rules: EnvironmentalOutputRule
}

export const SEEN_INTAKE_PROCESSING_RULE = {
  ruleName: 'ENVIRONMENTAL_FIELD_PREPASS',

  environmentFirst:
    'Generate the environmental pressure field before birth date, temporal anchors, natal baseline, chart interpretation, or Oracle rendering.',

  birthDateBoundary:
    'Birth date enters only after birthplace, lived-location phases, biome, abiotic, GeoPresence, and pre-date wound-trigger mapping have been stored.',

  questionnaireBoundary:
    'No personal-history questionnaire is required before the first read. Lived experience may refine the map after the initial Generator scan.',

  purpose:
    'Use location phases and derived environmental markers to build the first pressure container, pre-map likely wound triggers, and separate chart structure from environmental cooking.',

  userFacingRule:
    'Do not repeat raw mechanics literally in readings. Translate environmental effects only when supported by convergence.',

  convergenceRule:
    'Do not elevate a single environmental marker into a major claim unless it converges with chart structure, wound markers, attachment, portal routing, or repeated user data.',

  mechanicsRule:
    'Mechanics remain hidden by default. The user may request mechanics through Oracle depth controls.',
} as const
