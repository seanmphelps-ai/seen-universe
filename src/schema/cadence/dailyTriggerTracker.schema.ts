import { z } from 'zod'

/**
 * SEEN — Cadence Daily Trigger Tracker Runtime Contract
 *
 * Cadence is the proof layer. It records what happened, what activated,
 * what the person did, what changed, and whether the pattern repeated.
 * Raw chart mechanics remain hidden by default.
 */

export const CadenceConfidenceSchema = z.enum([
  'insufficient',
  'low',
  'moderate',
  'high',
])
export type CadenceConfidence = z.infer<typeof CadenceConfidenceSchema>

export const CadenceRelationContextSchema = z.enum([
  'self',
  'partner',
  'family',
  'friend',
  'work',
  'community',
  'authority',
  'unknown',
])
export type CadenceRelationContext = z.infer<typeof CadenceRelationContextSchema>

export const CadenceRegulationStateSchema = z.enum([
  'regulated',
  'activated',
  'flooded',
  'collapsed',
  'dissociated',
  'overdriven',
  'unknown',
])
export type CadenceRegulationState = z.infer<typeof CadenceRegulationStateSchema>

export const CadenceObservedBehaviorSchema = z.object({
  behaviorId: z.string().trim().min(1),
  label: z.string().trim().min(1),
  intensity: z.number().min(0).max(1),
  durationMinutes: z.number().min(0).optional(),
  interrupted: z.boolean(),
  note: z.string().trim().min(1).optional(),
}).strict()
export type CadenceObservedBehavior = z.infer<typeof CadenceObservedBehaviorSchema>

export const CadenceTriggerEventSchema = z.object({
  triggerId: z.string().trim().min(1),
  occurredAt: z.string().datetime(),
  summary: z.string().trim().min(1),
  relationContext: CadenceRelationContextSchema,
  participantIds: z.array(z.string().trim().min(1)).default([]),
  locationFieldId: z.string().trim().min(1).optional(),
  eventRelevantLocationFieldId: z.string().trim().min(1).optional(),
  userReportedFacts: z.array(z.string().trim().min(1)).min(1),
  userInterpretations: z.array(z.string().trim().min(1)).default([]),
  unknowns: z.array(z.string().trim().min(1)).default([]),
}).strict()
export type CadenceTriggerEvent = z.infer<typeof CadenceTriggerEventSchema>

export const CadencePressureReferenceSchema = z.object({
  pressureStateSnapshotId: z.string().trim().min(1).optional(),
  woundMarkerActivationIds: z.array(z.string().trim().min(1)).default([]),
  portalActivationIds: z.array(z.string().trim().min(1)).default([]),
  attachmentStateIds: z.array(z.string().trim().min(1)).default([]),
  environmentalFieldIds: z.array(z.string().trim().min(1)).default([]),
  relationshipMarkerIds: z.array(z.string().trim().min(1)).default([]),
  timingActivationIds: z.array(z.string().trim().min(1)).default([]),
  lifeSectionDepositIds: z.array(z.string().trim().min(1)).default([]),
  lensExtractionIds: z.array(z.string().trim().min(1)).default([]),
  confidence: z.number().min(0).max(1),
  unresolvedVariables: z.array(z.string().trim().min(1)).default([]),
}).strict()
export type CadencePressureReference = z.infer<typeof CadencePressureReferenceSchema>

export const CadenceInterruptionSchema = z.object({
  interruptionId: z.string().trim().min(1),
  interventionType: z.enum([
    'pause',
    'grounding',
    'movement',
    'breath',
    'boundary',
    'communication',
    'environment_change',
    'cognitive_reframe',
    'somatic_release',
    'support_contact',
    'no_interruption',
    'other',
  ]),
  startedAt: z.string().datetime(),
  completed: z.boolean(),
  userChosen: z.boolean(),
  recommendationId: z.string().trim().min(1).optional(),
  note: z.string().trim().min(1).optional(),
}).strict()
export type CadenceInterruption = z.infer<typeof CadenceInterruptionSchema>

export const CadenceOutcomeSchema = z.object({
  beforeState: CadenceRegulationStateSchema,
  afterState: CadenceRegulationStateSchema,
  beforeIntensity: z.number().min(0).max(1),
  afterIntensity: z.number().min(0).max(1),
  observedBehaviors: z.array(CadenceObservedBehaviorSchema).min(1),
  relationalConsequence: z.string().trim().min(1).optional(),
  bodyConsequence: z.string().trim().min(1).optional(),
  practicalConsequence: z.string().trim().min(1).optional(),
  observedInterruption: z.string().trim().min(1).optional(),
  followThroughObserved: z.boolean(),
  userRecognition: z.string().trim().min(1).optional(),
}).strict()
export type CadenceOutcome = z.infer<typeof CadenceOutcomeSchema>

export const CadenceDailyEntrySchema = z.object({
  entryId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  trigger: CadenceTriggerEventSchema,
  pressure: CadencePressureReferenceSchema,
  interruptions: z.array(CadenceInterruptionSchema).default([]),
  outcome: CadenceOutcomeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  schemaVersion: z.string().trim().min(1),
  engineVersion: z.string().trim().min(1),
}).strict()
export type CadenceDailyEntry = z.infer<typeof CadenceDailyEntrySchema>

export const CadenceLoopDetectionPolicySchema = z.object({
  minimumOccurrences: z.number().int().min(2),
  lookbackDays: z.number().int().min(1),
  minimumConfidence: z.number().min(0).max(1),
  requireBehavioralSimilarity: z.literal(true),
  requirePressureStateSimilarity: z.literal(true),
  allowLocationSpecificLoop: z.literal(true),
  preserveStrongNonOverlappingSignals: z.literal(true),
}).strict()
export type CadenceLoopDetectionPolicy = z.infer<typeof CadenceLoopDetectionPolicySchema>

export const CadenceLoopSignalSchema = z.object({
  loopId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  sourceEntryIds: z.array(z.string().trim().min(1)).min(2),
  repeatedBehaviorIds: z.array(z.string().trim().min(1)).min(1),
  repeatedPressureReferenceIds: z.array(z.string().trim().min(1)).default([]),
  recurrenceCount: z.number().int().min(2),
  firstObservedAt: z.string().datetime(),
  lastObservedAt: z.string().datetime(),
  cadenceBand: z.enum(['emerging', 'repeating', 'entrenched', 'interrupting', 'shifting']),
  interruptionEffectiveness: z.number().min(-1).max(1).optional(),
  confidence: CadenceConfidenceSchema,
  unresolvedVariables: z.array(z.string().trim().min(1)).default([]),
  userFacingClaimAllowed: z.boolean(),
}).strict()
export type CadenceLoopSignal = z.infer<typeof CadenceLoopSignalSchema>

export const CadenceTrackerIntakeSchema = z.object({
  requestId: z.string().trim().min(1),
  personId: z.string().trim().min(1),
  entry: CadenceDailyEntrySchema,
  loopPolicy: CadenceLoopDetectionPolicySchema,
  requestedAt: z.string().datetime(),
}).strict()
export type CadenceTrackerIntake = z.infer<typeof CadenceTrackerIntakeSchema>

export const CadenceTrackerOutputSchema = z.object({
  requestId: z.string().trim().min(1),
  storedEntry: CadenceDailyEntrySchema,
  detectedLoops: z.array(CadenceLoopSignalSchema).default([]),
  newPressureStateSnapshotRequired: z.boolean(),
  recommendedNextActions: z.array(z.object({
    actionId: z.string().trim().min(1),
    actionType: z.enum([
      'observe',
      'repeat_interruption',
      'change_interruption',
      'stabilize',
      'review_pattern',
      'deeper_traversal',
      'pause',
    ]),
    reason: z.string().trim().min(1),
    userFacing: z.boolean(),
  }).strict()).default([]),
  confidence: CadenceConfidenceSchema,
  completedAt: z.string().datetime(),
}).strict()
export type CadenceTrackerOutput = z.infer<typeof CadenceTrackerOutputSchema>

export const CadenceTrackerHandoffSchema = z.object({
  output: CadenceTrackerOutputSchema,
  handoffTargets: z.tuple([
    z.literal('pressure_state_snapshot_store'),
    z.literal('recurrence_engine'),
    z.literal('interruption_effectiveness_store'),
    z.literal('oracle_cadence_renderer'),
  ]),
  rules: z.object({
    cadenceIsProofLayer: z.literal(true),
    rawChartMechanicsHiddenByDefault: z.literal(true),
    userFactsSeparatedFromInterpretations: z.literal(true),
    lowConfidencePreservesAmbiguity: z.literal(true),
    noFixedUniversalLoopThreshold: z.literal(true),
    lensResultsComeFromGeneratorExtraction: z.literal(true),
    dailyEntryDoesNotRequireAllTwentyFiveLensNarrations: z.literal(true),
    progressMustBeObservedNotPromised: z.literal(true),
  }).strict(),
}).strict()
export type CadenceTrackerHandoff = z.infer<typeof CadenceTrackerHandoffSchema>

export const CADENCE_TRACKER_RULES = {
  cadenceIsProofLayer: true,
  rawChartMechanicsHiddenByDefault: true,
  userFactsSeparatedFromInterpretations: true,
  lowConfidencePreservesAmbiguity: true,
  noFixedUniversalLoopThreshold: true,
  lensResultsComeFromGeneratorExtraction: true,
  dailyEntryDoesNotRequireAllTwentyFiveLensNarrations: true,
  progressMustBeObservedNotPromised: true,
} as const

CadenceTrackerHandoffSchema.shape.rules.parse(CADENCE_TRACKER_RULES)
