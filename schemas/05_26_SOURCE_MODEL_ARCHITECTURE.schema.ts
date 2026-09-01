import { z } from 'zod'

export const SourceModelStageSchema = z.enum([
  'GEOPRESENCE',
  'WESTERN_ASTROLOGY',
  'VEDIC_ASTROLOGY',
  'NUMEROLOGY',
  'GALACTIC_SIGNATURE',
  'I_CHING',
  'HUMAN_DESIGN',
  'PORTAL_GATE_SYNTHESIS',
  'DEVELOPMENTAL_ARC',
  'CORE_IDENTITY_NARRATIVE',
])
export type SourceModelStage = z.infer<typeof SourceModelStageSchema>

export const SourceModelOutputLayerSchema = z.enum([
  'TERRAIN',
  'ROADBLOCKS',
  'SOVEREIGNTY_ACTION',
])
export type SourceModelOutputLayer = z.infer<typeof SourceModelOutputLayerSchema>

export const SourceModelIntakeSchema = z.object({
  personId: z.string().min(1),
  birthDate: z.string().min(1),
  birthTime: z.string().min(1).optional(),
  birthLocation: z.string().min(1),
  currentLocation: z.string().min(1).optional(),
  locationsLivedOverOneYear: z.array(z.string().min(1)).default([]),
  livedExperienceSignalIds: z.array(z.string().min(1)).default([]),
})
export type SourceModelIntake = z.infer<typeof SourceModelIntakeSchema>

export const SourceModelStageInputSchema = z.object({
  stage: SourceModelStageSchema,
  intakeId: z.string().min(1),
  upstreamOutputIds: z.array(z.string().min(1)).default([]),
  sourceSchemaIds: z.array(z.string().min(1)).min(1),
})
export type SourceModelStageInput = z.infer<typeof SourceModelStageInputSchema>

export const SourceModelStageOutputSchema = z.object({
  outputId: z.string().min(1),
  stage: SourceModelStageSchema,
  sourceSchemaIds: z.array(z.string().min(1)).min(1),
  rawSignalIds: z.array(z.string().min(1)).default([]),
  validated: z.literal(true),
  readyForNextStage: z.boolean(),
})
export type SourceModelStageOutput = z.infer<typeof SourceModelStageOutputSchema>

export const SourceModelFinalOutputSchema = z.object({
  personId: z.string().min(1),
  stageOutputs: z.array(SourceModelStageOutputSchema).min(1),
  outputLayers: z.tuple([
    z.literal('TERRAIN'),
    z.literal('ROADBLOCKS'),
    z.literal('SOVEREIGNTY_ACTION'),
  ]),
  narrativeOutputId: z.string().min(1),
  validatedBeforeRender: z.literal(true),
})
export type SourceModelFinalOutput = z.infer<typeof SourceModelFinalOutputSchema>

export const SourceModelRuntimeBoundarySchema = z.object({
  modalitiesRemainIndependentUntilSynthesis: z.literal(true),
  shadowBeforeGifts: z.literal(true),
  horoscopeVoiceAllowed: z.literal(false),
  narrativeMayInventUnsupportedClaims: z.literal(false),
  environmentModifiesInterpretation: z.literal(true),
  livedExperienceModifiesInterpretation: z.literal(true),
  userFacingDeliveryMustRemainNonDeterministic: z.literal(true),
})
export type SourceModelRuntimeBoundary = z.infer<typeof SourceModelRuntimeBoundarySchema>

export const SourceModelValidationSchema = z.object({
  confirmSequenceOrder: z.literal(true),
  identifyMissingModalities: z.literal(true),
  identifySkippedSteps: z.literal(true),
  validateEachStageOutput: z.literal(true),
  validateFinalOutputBeforeRender: z.literal(true),
  stopBeforeSynthesisOnDiscrepancy: z.literal(true),
})
export type SourceModelValidation = z.infer<typeof SourceModelValidationSchema>

export const SourceModelArchitectureSchema = z.object({
  schemaVersion: z.literal('1.1.0'),
  sourceFile: z.literal('docs/source-models/05_26_SOURCE_MODEL_ARCHITECTURE.md'),
  purpose: z.literal('govern_independent_source_model_execution_and_synthesis_order'),
  intakeContract: SourceModelIntakeSchema,
  stageInputContract: SourceModelStageInputSchema,
  stageOutputContract: SourceModelStageOutputSchema,
  finalOutputContract: SourceModelFinalOutputSchema,
  sequence: z.tuple([
    z.literal('GEOPRESENCE'),
    z.literal('WESTERN_ASTROLOGY'),
    z.literal('VEDIC_ASTROLOGY'),
    z.literal('NUMEROLOGY'),
    z.literal('GALACTIC_SIGNATURE'),
    z.literal('I_CHING'),
    z.literal('HUMAN_DESIGN'),
    z.literal('PORTAL_GATE_SYNTHESIS'),
    z.literal('DEVELOPMENTAL_ARC'),
    z.literal('CORE_IDENTITY_NARRATIVE'),
  ]),
  independentStages: z.tuple([
    z.literal('GEOPRESENCE'),
    z.literal('WESTERN_ASTROLOGY'),
    z.literal('VEDIC_ASTROLOGY'),
    z.literal('NUMEROLOGY'),
    z.literal('GALACTIC_SIGNATURE'),
    z.literal('I_CHING'),
    z.literal('HUMAN_DESIGN'),
  ]),
  firstSynthesisStage: z.literal('PORTAL_GATE_SYNTHESIS'),
  narrativeWrittenLast: z.literal(true),
  outputLayers: z.tuple([
    z.literal('TERRAIN'),
    z.literal('ROADBLOCKS'),
    z.literal('SOVEREIGNTY_ACTION'),
  ]),
  runtimeBoundaries: SourceModelRuntimeBoundarySchema,
  validation: SourceModelValidationSchema,
})
export type SourceModelArchitecture = z.infer<typeof SourceModelArchitectureSchema>

export const SOURCE_MODEL_ARCHITECTURE: SourceModelArchitecture = {
  schemaVersion: '1.1.0',
  sourceFile: 'docs/source-models/05_26_SOURCE_MODEL_ARCHITECTURE.md',
  purpose: 'govern_independent_source_model_execution_and_synthesis_order',
  intakeContract: {
    personId: 'person_id',
    birthDate: 'YYYY-MM-DD',
    birthLocation: 'city_region_country',
    locationsLivedOverOneYear: [],
    livedExperienceSignalIds: [],
  },
  stageInputContract: {
    stage: 'GEOPRESENCE',
    intakeId: 'intake_id',
    upstreamOutputIds: [],
    sourceSchemaIds: ['schema_id'],
  },
  stageOutputContract: {
    outputId: 'output_id',
    stage: 'GEOPRESENCE',
    sourceSchemaIds: ['schema_id'],
    rawSignalIds: [],
    validated: true,
    readyForNextStage: true,
  },
  finalOutputContract: {
    personId: 'person_id',
    stageOutputs: [
      {
        outputId: 'output_id',
        stage: 'GEOPRESENCE',
        sourceSchemaIds: ['schema_id'],
        rawSignalIds: [],
        validated: true,
        readyForNextStage: true,
      },
    ],
    outputLayers: ['TERRAIN', 'ROADBLOCKS', 'SOVEREIGNTY_ACTION'],
    narrativeOutputId: 'narrative_output_id',
    validatedBeforeRender: true,
  },
  sequence: [
    'GEOPRESENCE',
    'WESTERN_ASTROLOGY',
    'VEDIC_ASTROLOGY',
    'NUMEROLOGY',
    'GALACTIC_SIGNATURE',
    'I_CHING',
    'HUMAN_DESIGN',
    'PORTAL_GATE_SYNTHESIS',
    'DEVELOPMENTAL_ARC',
    'CORE_IDENTITY_NARRATIVE',
  ],
  independentStages: [
    'GEOPRESENCE',
    'WESTERN_ASTROLOGY',
    'VEDIC_ASTROLOGY',
    'NUMEROLOGY',
    'GALACTIC_SIGNATURE',
    'I_CHING',
    'HUMAN_DESIGN',
  ],
  firstSynthesisStage: 'PORTAL_GATE_SYNTHESIS',
  narrativeWrittenLast: true,
  outputLayers: ['TERRAIN', 'ROADBLOCKS', 'SOVEREIGNTY_ACTION'],
  runtimeBoundaries: {
    modalitiesRemainIndependentUntilSynthesis: true,
    shadowBeforeGifts: true,
    horoscopeVoiceAllowed: false,
    narrativeMayInventUnsupportedClaims: false,
    environmentModifiesInterpretation: true,
    livedExperienceModifiesInterpretation: true,
    userFacingDeliveryMustRemainNonDeterministic: true,
  },
  validation: {
    confirmSequenceOrder: true,
    identifyMissingModalities: true,
    identifySkippedSteps: true,
    validateEachStageOutput: true,
    validateFinalOutputBeforeRender: true,
    stopBeforeSynthesisOnDiscrepancy: true,
  },
}
