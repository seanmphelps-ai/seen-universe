import { z } from 'zod'

/**
 * SEEN — Phase 1 GeoPresence Runtime Contract
 *
 * GeoPresence is the relationship between a person and a resolved place.
 * It does not calculate biome ecology or abiotic physical conditions.
 * Those arrive as independent source fields and may modify GeoPresence scoring.
 *
 * GeoPresence asks:
 * - How was the person situated in this place?
 * - What did belonging, access, density, culture, mobility, safety, and social reception require?
 * - Did the place regulate, activate, constrain, isolate, resource, or dislocate the person?
 * - What place-phase adaptations were deposited into the wider pressure field?
 */

export const GeoPresenceLocationPhaseSchema = z.enum([
  'birthplace',
  'early_childhood',
  'adolescence',
  'major_lived_location',
  'current_location',
  'event_relevant_location',
  'unknown',
])
export type GeoPresenceLocationPhase = z.infer<typeof GeoPresenceLocationPhaseSchema>

export const GeoPresenceConfidenceSchema = z.enum([
  'insufficient',
  'low',
  'moderate',
  'high',
])
export type GeoPresenceConfidence = z.infer<typeof GeoPresenceConfidenceSchema>

export const GeoPresencePressureBandSchema = z.enum([
  'supportive',
  'neutral',
  'mixed',
  'pressurizing',
  'destabilizing',
  'unknown',
])
export type GeoPresencePressureBand = z.infer<typeof GeoPresencePressureBandSchema>

export const GeoPresenceEffectSchema = z.enum([
  'regulating',
  'restoring',
  'grounding',
  'expanding',
  'activating',
  'amplifying',
  'compressing',
  'scattering',
  'isolating',
  'draining',
  'dislocating',
  'protective',
  'mixed',
  'unknown',
])
export type GeoPresenceEffect = z.infer<typeof GeoPresenceEffectSchema>

export const GeoPresenceDomainSchema = z.enum([
  'belonging',
  'social_reception',
  'cultural_fit',
  'language_access',
  'community_access',
  'mobility_access',
  'resource_access',
  'institutional_access',
  'economic_position',
  'safety_and_surveillance',
  'density_and_isolation',
  'pace_and_expectation',
  'identity_expression',
  'family_and_ancestral_location',
  'origin_current_friction',
  'event_location_activation',
])
export type GeoPresenceDomain = z.infer<typeof GeoPresenceDomainSchema>

export const ResolvedGeoPresenceLocationSchema = z.object({
  locationId: z.string().trim().min(1),
  placeName: z.string().trim().min(1),
  country: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().trim().min(1),
  phase: GeoPresenceLocationPhaseSchema,
  startAge: z.number().min(0).optional(),
  endAge: z.number().min(0).optional(),
  livedOneYearOrMore: z.boolean().optional(),
}).strict().superRefine((location, context) => {
  if (
    location.startAge !== undefined &&
    location.endAge !== undefined &&
    location.endAge < location.startAge
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endAge'],
      message: 'endAge must be greater than or equal to startAge',
    })
  }
})
export type ResolvedGeoPresenceLocation = z.infer<typeof ResolvedGeoPresenceLocationSchema>

export const GeoPresenceSourceReferenceSchema = z.object({
  sourceFieldId: z.string().trim().min(1),
  sourceType: z.enum([
    'resolved_location',
    'biome_field',
    'abiotic_field',
    'population_data',
    'mobility_data',
    'economic_data',
    'institutional_data',
    'safety_data',
    'cultural_context',
    'user_recognition',
    'derived_geo_presence_signal',
  ]),
  observedAt: z.string().datetime().optional(),
  confidence: z.number().min(0).max(1),
  note: z.string().trim().min(1).optional(),
}).strict()
export type GeoPresenceSourceReference = z.infer<typeof GeoPresenceSourceReferenceSchema>

export const GeoPresenceDomainSignalSchema = z.object({
  signalId: z.string().trim().min(1),
  domain: GeoPresenceDomainSchema,
  pressureBand: GeoPresencePressureBandSchema,
  effects: z.array(GeoPresenceEffectSchema).min(1),
  intensity: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  basis: z.array(GeoPresenceSourceReferenceSchema).min(1),
  lifeSectionDepositIds: z.array(z.string().trim().min(1)).default([]),
  portalDepositIds: z.array(z.string().trim().min(1)).default([]),
  woundPressureDepositIds: z.array(z.string().trim().min(1)).default([]),
  userFacingClaimAllowed: z.literal(false),
}).strict()
export type GeoPresenceDomainSignal = z.infer<typeof GeoPresenceDomainSignalSchema>

export const GeoPresenceLocationFieldSchema = z.object({
  fieldId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  location: ResolvedGeoPresenceLocationSchema,

  // Independent environmental inputs. GeoPresence may consume their outputs,
  // but may not redefine biome or abiotic calculations.
  biomeFieldId: z.string().trim().min(1),
  abioticFieldId: z.string().trim().min(1),

  domainSignals: z.array(GeoPresenceDomainSignalSchema).min(1),
  dominantEffects: z.array(GeoPresenceEffectSchema).min(1),
  overallPressureBand: GeoPresencePressureBandSchema,
  regulationScore: z.number().min(-1).max(1),
  belongingScore: z.number().min(-1).max(1),
  accessScore: z.number().min(-1).max(1),
  constraintScore: z.number().min(0).max(1),
  adaptationLoadScore: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  unresolvedVariables: z.array(z.string().trim().min(1)).default([]),
  derivedAt: z.string().datetime(),
}).strict()
export type GeoPresenceLocationField = z.infer<typeof GeoPresenceLocationFieldSchema>

export const GeoPresenceIntakeSchema = z.object({
  requestId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  locations: z.array(ResolvedGeoPresenceLocationSchema).min(1),
  biomeFieldIds: z.array(z.string().trim().min(1)).min(1),
  abioticFieldIds: z.array(z.string().trim().min(1)).min(1),
  optionalRecognitionEvidence: z.array(GeoPresenceSourceReferenceSchema).default([]),
  requestedAt: z.string().datetime(),
}).strict().superRefine((input, context) => {
  const phases = new Set(input.locations.map((location) => location.phase))
  if (!phases.has('birthplace')) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['locations'],
      message: 'GeoPresence intake requires a birthplace location field',
    })
  }
})
export type GeoPresenceIntake = z.infer<typeof GeoPresenceIntakeSchema>

export const GeoPresenceRuntimeRequestSchema = z.object({
  intake: GeoPresenceIntakeSchema,
  rules: z.object({
    runAfterLocationResolution: z.literal(true),
    runAfterBiomeAndAbioticFields: z.literal(true),
    runBeforeBirthDateInterpretation: z.literal(true),
    keepBiomeIndependent: z.literal(true),
    keepAbioticIndependent: z.literal(true),
    unansweredOptionalEvidenceLowersConfidence: z.literal(true),
    unansweredOptionalEvidenceBlocksRun: z.literal(false),
  }).strict(),
}).strict()
export type GeoPresenceRuntimeRequest = z.infer<typeof GeoPresenceRuntimeRequestSchema>

export const GeoPresenceOutputSchema = z.object({
  requestId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  locationFields: z.array(GeoPresenceLocationFieldSchema).min(1),
  birthplaceFieldId: z.string().trim().min(1),
  earlyChildhoodFieldIds: z.array(z.string().trim().min(1)).default([]),
  adolescentFieldIds: z.array(z.string().trim().min(1)).default([]),
  majorLivedLocationFieldIds: z.array(z.string().trim().min(1)).default([]),
  currentLocationFieldId: z.string().trim().min(1).optional(),
  eventRelevantLocationFieldIds: z.array(z.string().trim().min(1)).default([]),
  originCurrentFrictionScore: z.number().min(0).max(1).optional(),
  cumulativeAdaptationLoadScore: z.number().min(0).max(1),
  cumulativeRegulationSupportScore: z.number().min(-1).max(1),
  confidence: GeoPresenceConfidenceSchema,
  unresolvedVariables: z.array(z.string().trim().min(1)).default([]),
  completedAt: z.string().datetime(),
}).strict()
export type GeoPresenceOutput = z.infer<typeof GeoPresenceOutputSchema>

export const GeoPresenceHandoffSchema = z.object({
  geoPresenceOutput: GeoPresenceOutputSchema,
  handoffTargets: z.tuple([
    z.literal('environmental_pressure_profile'),
    z.literal('pre_date_wound_trigger_map'),
    z.literal('portal_deposit_engine'),
    z.literal('life_section_accumulator'),
  ]),
  userFacingRules: z.object({
    rawMarkersHidden: z.literal(true),
    markersDepositRatherThanReport: z.literal(true),
    standaloneGeoPresenceClaimsForbidden: z.literal(true),
    convergenceRequiredBeforeSurface: z.literal(true),
    diagnosticNotDeterministic: z.literal(true),
    mechanicsHiddenByDefault: z.literal(true),
  }).strict(),
}).strict()
export type GeoPresenceHandoff = z.infer<typeof GeoPresenceHandoffSchema>

export const GEOPRESENCE_RUNTIME_RULES = {
  runAfterLocationResolution: true,
  runAfterBiomeAndAbioticFields: true,
  runBeforeBirthDateInterpretation: true,
  keepBiomeIndependent: true,
  keepAbioticIndependent: true,
  unansweredOptionalEvidenceLowersConfidence: true,
  unansweredOptionalEvidenceBlocksRun: false,
} as const

export const GEOPRESENCE_USER_FACING_RULES = {
  rawMarkersHidden: true,
  markersDepositRatherThanReport: true,
  standaloneGeoPresenceClaimsForbidden: true,
  convergenceRequiredBeforeSurface: true,
  diagnosticNotDeterministic: true,
  mechanicsHiddenByDefault: true,
} as const

GeoPresenceRuntimeRequestSchema.shape.rules.parse(GEOPRESENCE_RUNTIME_RULES)
GeoPresenceHandoffSchema.shape.userFacingRules.parse(GEOPRESENCE_USER_FACING_RULES)
