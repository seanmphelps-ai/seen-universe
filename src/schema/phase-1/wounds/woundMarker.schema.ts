import { z } from 'zod'

/**
 * SEEN — Phase 1 Wound Marker Runtime Contract
 *
 * A wound marker is any factor that carries one or more qualifying destabilizing,
 * wound-bearing, dissolving, severing, compulsive, binding, collapsing, grief-bearing,
 * shame-carrying, abandonment-signaling, power-distorting, identity-fracturing,
 * obsessive, addictive, dissociative, predatory, annihilating, entrapping, or
 * martyrdom-generating qualities.
 *
 * The governing rule defines eligibility. Example lists never define or limit it.
 */

export const WoundMarkerCategorySchema = z.enum([
  'PLANETARY',
  'ASTEROID',
  'FIXED_STAR',
  'NAKSHATRA',
  'LOT',
  'HOUSE_CONDITION',
  'ASPECT_PATTERN',
  'NODAL',
  'ARABIC_PART',
  'GENERATIONAL',
  'EPIGENETIC',
  'ENVIRONMENTAL',
  'RELATIONAL',
  'BEHAVIORAL',
  'OTHER',
])
export type WoundMarkerCategory = z.infer<typeof WoundMarkerCategorySchema>

export const WoundQualifyingQualitySchema = z.enum([
  'destabilizing',
  'wound_bearing',
  'dissolving',
  'severing',
  'compulsive',
  'shadow_intensifying',
  'karmic_repetitive',
  'collapsing',
  'rageful',
  'binding',
  'chaotic',
  'predatory',
  'self_undoing',
  'grief_bearing',
  'shame_carrying',
  'abandonment_signaling',
  'power_distorting',
  'identity_fracturing',
  'obsessive',
  'addictive',
  'dissociative',
  'persecutory',
  'annihilating',
  'seductive_entrapping',
  'martyrdom_generating',
  'other_supported_quality',
])
export type WoundQualifyingQuality = z.infer<typeof WoundQualifyingQualitySchema>

export const LifeDomainSchema = z.enum([
  'MONEY',
  'RELATIONSHIPS',
  'SEXUALITY',
  'HEALTH',
  'CAREER',
  'FAMILY',
  'COMMUNITY',
  'AUTHORITY',
  'CREATIVITY',
  'SPIRITUALITY',
  'REPUTATION',
  'AGING',
  'LEGACY',
  'HOME',
  'IDENTITY',
  'BODY',
])
export type LifeDomain = z.infer<typeof LifeDomainSchema>

export const BaselinePressureEffectSchema = z.object({
  amplification: z.number().min(0).max(1),
  suppression: z.number().min(0).max(1),
  sensitization: z.number().min(0).max(1),
  delay: z.number().min(0).max(1),
  distortion: z.number().min(0).max(1),
  rerouteWeight: z.number().min(0).max(1),
  recurrenceRate: z.number().min(0).max(1),
  splitFactor: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  sourceFieldIds: z.array(z.string().trim().min(1)).min(1),
  unresolvedVariables: z.array(z.string().trim().min(1)).default([]),
}).strict()
export type BaselinePressureEffect = z.infer<typeof BaselinePressureEffectSchema>

export const AgeArcWindowSchema = z.object({
  startAge: z.number().min(0),
  endAge: z.number().min(0),
  expressionType: z.string().trim().min(1),
  peakRisk: z.string().trim().min(1),
  confidence: z.number().min(0).max(1),
}).strict().superRefine((arc, context) => {
  if (arc.endAge < arc.startAge) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endAge'],
      message: 'endAge must be greater than or equal to startAge',
    })
  }
})
export type AgeArcWindow = z.infer<typeof AgeArcWindowSchema>

export const JungInversionSchema = z.object({
  complex: z.string().trim().min(1),
  defenseArmor: z.string().trim().min(1),
  projectionStyle: z.string().trim().min(1),
  compensationPattern: z.string().trim().min(1),
  relationalLoop: z.string().trim().min(1),
  unconsciousLoyalty: z.string().trim().min(1),
  identityDistortion: z.string().trim().min(1),
  regulatedCapacity: z.string().trim().min(1),
  sovereigntyExpression: z.string().trim().min(1),
  giftEmergence: z.string().trim().min(1),
  transmissionCapacity: z.string().trim().min(1),
  inversionRequirement: z.string().trim().min(1),
  cadenceMarker: z.string().trim().min(1),
}).strict()
export type JungInversion = z.infer<typeof JungInversionSchema>

export const InversionCadenceMarkerSchema = z.object({
  markerId: z.string().trim().min(1),
  portalId: z.number().int().min(1).max(108),
  behaviorToWatch: z.string().trim().min(1),
  triggerResponseChange: z.string().trim().min(1),
  relationalChange: z.string().trim().min(1),
  selfReportMarker: z.string().trim().min(1),
  observationWindowDays: z.number().int().min(1),
  observedState: z.enum(['not_observed', 'emerging', 'repeating', 'stabilizing', 'contradictory']),
  evidenceIds: z.array(z.string().trim().min(1)).default([]),
}).strict()
export type InversionCadenceMarker = z.infer<typeof InversionCadenceMarkerSchema>

export const WoundEvidenceSchema = z.object({
  evidenceId: z.string().trim().min(1),
  sourceModel: z.string().trim().min(1),
  sourceObjectId: z.string().trim().min(1),
  observedSignal: z.string().trim().min(1),
  strength: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  contradictory: z.boolean(),
  provenance: z.string().trim().min(1),
}).strict()
export type WoundEvidence = z.infer<typeof WoundEvidenceSchema>

export const ShadowCategorySchema = z.enum([
  'obsessive_patterns',
  'compulsive_behaviors',
  'projection_mechanisms',
  'sabotage_patterns',
  'manipulation_strategies',
  'avoidance_tactics',
  'victim_narratives',
  'trauma_responses',
])

export const ShadowExtractionSchema = z.object({
  category: ShadowCategorySchema,
  extraction: z.string().trim().min(1),
  evidenceIds: z.array(z.string().trim().min(1)).min(1),
  confidence: z.number().min(0).max(1),
}).strict()

export const LensExtractionSchema = z.object({
  lensIndex: z.number().int().min(1).max(25),
  lensId: z.string().trim().min(1),
  distinctExtraction: z.string().trim().min(1),
  updatedFields: z.array(z.enum([
    'shadowExpression',
    'triggerMechanic',
    'collapsePattern',
    'relationalDistortion',
    'behavioralConsequence',
    'jungInversion',
    'regulationMarkers',
    'cadenceMarkers',
  ])).min(1),
  evidenceIds: z.array(z.string().trim().min(1)).min(1),
  confidence: z.number().min(0).max(1),
}).strict()

export const TwentyFiveLensExtractionSetSchema = z.array(LensExtractionSchema)
  .length(25)
  .superRefine((records, context) => {
    const indexes = new Set(records.map((record) => record.lensIndex))
    const ids = new Set(records.map((record) => record.lensId))
    const extractions = new Set(records.map((record) => record.distinctExtraction.trim().toLowerCase()))
    if (indexes.size !== 25) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'All 25 lens indexes must be present exactly once' })
    }
    if (ids.size !== 25) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'All 25 lens IDs must be distinct' })
    }
    if (extractions.size !== 25) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Each lens must produce distinct non-redundant extraction' })
    }
  })

export const WoundMarkerDefinitionSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: WoundMarkerCategorySchema,
  qualifyingQualities: z.array(WoundQualifyingQualitySchema).min(1),
  customQualifyingQualities: z.array(z.string().trim().min(1)).default([]),
  shadowExpression: z.string().trim().min(1),
  triggerMechanic: z.string().trim().min(1),
  collapsePattern: z.string().trim().min(1),
  relationalDistortion: z.string().trim().min(1),
  behavioralConsequence: z.string().trim().min(1),
  domainImpact: z.array(LifeDomainSchema).min(1),
  recursionEligible: z.boolean(),
  corePortalRouting: z.array(z.number().int().min(1).max(64)).default([]),
  expansionPortalRouting: z.array(z.number().int().min(65).max(108)).default([]),
  ageArc: z.array(AgeArcWindowSchema).default([]),
  jungInversion: JungInversionSchema,
  schemaVersion: z.string().trim().min(1),
}).strict()
export type WoundMarkerDefinition = z.infer<typeof WoundMarkerDefinitionSchema>

export const WoundMarkerRuntimeInputSchema = z.object({
  requestId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  marker: WoundMarkerDefinitionSchema,
  biomeFieldIds: z.array(z.string().trim().min(1)).min(1),
  abioticFieldIds: z.array(z.string().trim().min(1)).min(1),
  geoPresenceFieldIds: z.array(z.string().trim().min(1)).min(1),
  attachmentFieldIds: z.array(z.string().trim().min(1)).default([]),
  sourceEvidence: z.array(WoundEvidenceSchema).min(1),
  requestedAt: z.string().datetime(),
  rules: z.object({
    environmentalStackRunsFirst: z.literal(true),
    qualifyingRuleOverridesExampleLists: z.literal(true),
    preserveStrongNonOverlappingSignals: z.literal(true),
    allCorePortalsFirstClass: z.literal(true),
    corePortalScanCount: z.literal(64),
    expansionReadyPortalCount: z.literal(108),
    twentyFiveLensSetClosed: z.literal(true),
    allTwentyFiveLensesRequiredForCanonicalUpdate: z.literal(true),
  }).strict(),
}).strict()
export type WoundMarkerRuntimeInput = z.infer<typeof WoundMarkerRuntimeInputSchema>

export const WoundActivationStateSchema = z.enum([
  'active',
  'weak',
  'dormant',
  'contradictory',
  'insufficient_signal',
])

export const WoundMarkerRuntimeOutputSchema = z.object({
  requestId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  markerId: z.string().trim().min(1),
  activationState: WoundActivationStateSchema,
  activationScore: z.number().min(0).max(1),
  baselinePressureEffect: BaselinePressureEffectSchema,
  shadowExtractions: z.array(ShadowExtractionSchema).length(8),
  lensExtractions: TwentyFiveLensExtractionSetSchema,
  activePortalIds: z.array(z.number().int().min(1).max(64)).default([]),
  expansionPortalIds: z.array(z.number().int().min(65).max(108)).default([]),
  lifeSectionDepositIds: z.array(z.string().trim().min(1)).default([]),
  attachmentDepositIds: z.array(z.string().trim().min(1)).default([]),
  regulationMarkerIds: z.array(z.string().trim().min(1)).default([]),
  cadenceMarkers: z.array(InversionCadenceMarkerSchema).default([]),
  evidenceUsed: z.array(WoundEvidenceSchema).min(1),
  contradictionNotes: z.array(z.string().trim().min(1)).default([]),
  unresolvedVariables: z.array(z.string().trim().min(1)).default([]),
  confidence: z.number().min(0).max(1),
  completedAt: z.string().datetime(),
  versions: z.object({
    schemaVersion: z.string().trim().min(1),
    engineVersion: z.string().trim().min(1),
    oracleVersion: z.string().trim().min(1),
    renderVersion: z.string().trim().min(1),
  }).strict(),
}).strict()
export type WoundMarkerRuntimeOutput = z.infer<typeof WoundMarkerRuntimeOutputSchema>

export const WoundMarkerHandoffSchema = z.object({
  output: WoundMarkerRuntimeOutputSchema,
  handoffTargets: z.tuple([
    z.literal('portal_deposit_engine'),
    z.literal('life_section_accumulator'),
    z.literal('attachment_interaction_engine'),
    z.literal('jung_inversion_tracker'),
    z.literal('cadence_tracker'),
    z.literal('oracle_payload_builder'),
  ]),
  userFacingRules: z.object({
    rawMarkerNamesHiddenByDefault: z.literal(true),
    markersDepositRatherThanReport: z.literal(true),
    noStandaloneDeterministicClaim: z.literal(true),
    convergenceRequiredBeforeSurface: z.literal(true),
    weakConfidenceReducesCertainty: z.literal(true),
    inversionTrackedNotPromised: z.literal(true),
    mechanicsHiddenByDefault: z.literal(true),
  }).strict(),
}).strict()
export type WoundMarkerHandoff = z.infer<typeof WoundMarkerHandoffSchema>

export const WOUND_MARKER_RUNTIME_RULES = {
  environmentalStackRunsFirst: true,
  qualifyingRuleOverridesExampleLists: true,
  preserveStrongNonOverlappingSignals: true,
  allCorePortalsFirstClass: true,
  corePortalScanCount: 64,
  expansionReadyPortalCount: 108,
  twentyFiveLensSetClosed: true,
  allTwentyFiveLensesRequiredForCanonicalUpdate: true,
} as const

export const WOUND_MARKER_USER_FACING_RULES = {
  rawMarkerNamesHiddenByDefault: true,
  markersDepositRatherThanReport: true,
  noStandaloneDeterministicClaim: true,
  convergenceRequiredBeforeSurface: true,
  weakConfidenceReducesCertainty: true,
  inversionTrackedNotPromised: true,
  mechanicsHiddenByDefault: true,
} as const

WoundMarkerRuntimeInputSchema.shape.rules.parse(WOUND_MARKER_RUNTIME_RULES)
WoundMarkerHandoffSchema.shape.userFacingRules.parse(WOUND_MARKER_USER_FACING_RULES)
