import { z } from 'zod';

// Mirrored from SEEN_universal/schemas/01_PORTAL_PENETRATION_CONTRACT.schema.ts.
// Keep this shape aligned with canonical schema version 1.0.0.
export const PortalIdSchema = z.number().int().min(1).max(64);

export const SourceLayerStateSchema = z.enum([
  'layered',
  'contradictory',
  'insufficient_signal',
  'no_applicable_signal',
]);

export const SourceEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  sourceReference: z.string().min(1),
  summary: z.string().min(1),
  confidence: z.number().min(0).max(1),
  provenance: z.array(z.string().min(1)).min(1),
});

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
});

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
});

export type PortalSourceLayer = z.infer<typeof PortalSourceLayerSchema>;
export type PortalPenetrationRun = z.infer<typeof PortalPenetrationRunSchema>;
