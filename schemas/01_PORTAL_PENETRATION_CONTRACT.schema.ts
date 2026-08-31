import { z } from 'zod'

export const PortalIdSchema = z.number().int().min(1).max(64)

export const SourceLayerStateSchema = z.enum([
  'layered',
  'contradictory',
  'insufficient_signal',
  'no_applicable_signal',
])

export const SourceEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  sourceReference: z.string().min(1),
  summary: z.string().min(1),
  confidence: z.number().min(0).max(1),
  provenance: z.array(z.string().min(1)).min(1),
})

export const PortalSourceLayerSchema = z.object({
  sourceSystemId: z.string().min(1),
  sourceFieldId: z.string().min(1),
  portalId: PortalIdSchema,
  layerSequence: z.number().int().nonnegative(),
  state: SourceLayerStateSchema,
  evidence: z.array(SourceEvidenceSchema),
  contradictionRefs: z.array(z.string().min(1)).default([]),
  convergenceNotes: z.array(z.string().min(1)).default([]),
  sourceIdentityPreserved: z.literal(true),
  persistent: z.literal(true),
  replaceExistingLayers: z.literal(false),
})

export const PortalPenetrationRunSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  sourceSystemId: z.string().min(1),
  sourceFieldId: z.string().min(1),
  sourceRunCompletedIndependently: z.literal(true),
  penetrateCompletePortalLattice: z.literal(true),
  portalCount: z.literal(64),
  layers: z.array(PortalSourceLayerSchema).length(64),
  laterSourcesMayReadExistingLayers: z.literal(true),
  laterSourcesMayOverwriteExistingLayers: z.literal(false),
  preserveSourceIdentityUntilConvergence: z.literal(true),
  earlySynthesisForbidden: z.literal(true),
  earlyNarrationForbidden: z.literal(true),
})

export const PortalPenetrationContractSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  purpose: z.literal(
    'layer_each_independent_source_system_through_the_complete_64_portal_lattice_while_preserving_source_identity_and_persistent_cross_source_visibility',
  ),
  terminology: z.object({
    canonicalVerb: z.literal('penetrate'),
    supportingVerbs: z.tuple([
      z.literal('layer'),
      z.literal('occupy'),
      z.literal('accumulate'),
    ]),
    forbiddenExecutionVerb: z.literal('scan'),
  }),
  rules: z.object({
    everyIndependentSourcePenetratesAll64Portals: z.literal(true),
    everyPortalReceivesASourcePresenceRecord: z.literal(true),
    sourcesLayerWithoutReplacingPriorSources: z.literal(true),
    laterSourcesCanEncounterEarlierSourceLayers: z.literal(true),
    portalsHoldPersistentSourceLayers: z.literal(true),
    convergenceOccursAfterLayering: z.literal(true),
    oracleRendersAfterValidatedConvergence: z.literal(true),
  }),
  run: PortalPenetrationRunSchema,
})

export type PortalSourceLayer = z.infer<typeof PortalSourceLayerSchema>
export type PortalPenetrationRun = z.infer<typeof PortalPenetrationRunSchema>
export type PortalPenetrationContract = z.infer<typeof PortalPenetrationContractSchema>
