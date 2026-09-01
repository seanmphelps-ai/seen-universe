import { z } from 'zod'

export const ReviewConfidenceSchema = z.enum(['locked', 'likely', 'uncertain'])
export type ReviewConfidence = z.infer<typeof ReviewConfidenceSchema>

export const SchemaFirstStepSchema = z.enum([
  'REGISTER_SCHEMA',
  'VALIDATE_SCHEMA',
  'LOAD_INPUT_CONTRACT',
  'RUN_CALCULATION',
  'PENETRATE_COMPLETE_64_PORTAL_LATTICE',
  'VALIDATE_OUTPUT_CONTRACT',
  'STORE_RESULT',
])
export type SchemaFirstStep = z.infer<typeof SchemaFirstStepSchema>

export const Phase1RequiredSchemaNameSchema = z.enum([
  '64_PORTAL_SCHEMAS',
  'PORTAL_INPUT_OUTPUT_CONTRACTS',
  'PORTAL_PENETRATION_CONTRACT',
  'ENVIRONMENTAL_DOMAIN_REGISTRY',
  'ENVIRONMENTAL_SIGNAL_REGISTRY',
  'GEOPRESENCE_SCHEMAS',
  'BIOME_SCHEMAS',
  'ABIOTIC_SCHEMAS',
  'LIGHT_CYCLE_SCHEMAS',
  'TERRAIN_SCHEMAS',
  'ELEVATION_SCHEMAS',
  'CLIMATE_SCHEMAS',
  'HUMAN_THREAT_SCHEMAS',
  'BIOLOGICAL_THREAT_SCHEMAS',
  'POLITICAL_INSTITUTIONAL_PRESSURE_SCHEMAS',
  'EVIDENCE_AND_PROVENANCE_SCHEMAS',
  'SCORING_AND_NORMALIZATION_SCHEMAS',
  'CONFIDENCE_AND_CONTRADICTION_SCHEMAS',
  'WOUND_MARKER_SCHEMAS',
  'SHADOW_MARKER_SCHEMAS',
  'GLOBAL_AMPLIFIER_SCHEMAS',
  'BASELINE_PRESSURE_EFFECT_SCHEMAS',
  'PHASE_1_STORAGE_OUTPUT_CONTRACTS',
])
export type Phase1RequiredSchemaName = z.infer<typeof Phase1RequiredSchemaNameSchema>

export const Phase1ExecutionStepSchema = z.enum([
  'LOCATION_INTAKE',
  'ENVIRONMENTAL_CALCULATION',
  '64_PORTAL_ENVIRONMENTAL_PENETRATION',
  'PERMANENT_ENVIRONMENTAL_INHERITANCE',
  'BIRTH_DATE',
  'SWISS_EPHEMERIS_CALCULATION',
])
export type Phase1ExecutionStep = z.infer<typeof Phase1ExecutionStepSchema>

export const IndependentSystemNameSchema = z.enum([
  'VEDIC',
  'WESTERN',
  'HELLENISTIC',
  'PERSIAN_ARABIC_LOTS',
  'ATTACHMENT_THEORY',
  'LOVE_LANGUAGE',
  'NUMEROLOGY',
])
export type IndependentSystemName = z.infer<typeof IndependentSystemNameSchema>

export const SourceFieldNameSchema = z.enum([
  'environmental_source_field',
  'vedic_source_field',
  'western_source_field',
  'hellenistic_source_field',
  'persian_arabic_lot_source_field',
  'attachment_field',
  'love_language_field',
  'numerology_field',
])
export type SourceFieldName = z.infer<typeof SourceFieldNameSchema>

export const Phase1SchemaLoadItemSchema = z.object({
  name: Phase1RequiredSchemaNameSchema,
  required: z.literal(true),
  loaded: z.boolean(),
  validated: z.boolean(),
  confidence: ReviewConfidenceSchema,
})
export type Phase1SchemaLoadItem = z.infer<typeof Phase1SchemaLoadItemSchema>

export const PortalPenetrationReferenceContractSchema = z.object({
  contractPath: z.literal('schemas/01_PORTAL_PENETRATION_CONTRACT.schema.ts'),
  requiredBeforePortalExecution: z.literal(true),
  canonicalVerb: z.literal('penetrate'),
  supportingVerbs: z.tuple([
    z.literal('layer'),
    z.literal('occupy'),
    z.literal('accumulate'),
  ]),
  forbiddenExecutionVerb: z.literal('scan'),
  portalCount: z.literal(64),
  everyPortalReceivesSourcePresenceRecord: z.literal(true),
  sourcesLayerWithoutReplacingPriorSources: z.literal(true),
  laterSourcesMayReadExistingLayers: z.literal(true),
  laterSourcesMayOverwriteExistingLayers: z.literal(false),
  preserveSourceIdentityUntilConvergence: z.literal(true),
  convergenceOccursAfterLayering: z.literal(true),
})
export type PortalPenetrationReferenceContract = z.infer<
  typeof PortalPenetrationReferenceContractSchema
>

export const IndependentSystemRunContractSchema = z.object({
  systemName: IndependentSystemNameSchema,
  schemaMustLoadBeforeRun: z.literal(true),
  runIndependentlyBeforeSynthesis: z.literal(true),
  mustPenetrateComplete64PortalLattice: z.literal(true),
  mustPreserveSourceIdentity: z.literal(true),
  mustLayerWithoutReplacement: z.literal(true),
  outputSourceField: SourceFieldNameSchema,
  executionOrder: z.tuple([
    z.literal('REGISTER_SCHEMA'),
    z.literal('VALIDATE_SCHEMA'),
    z.literal('LOAD_INPUT_CONTRACT'),
    z.literal('RUN_CALCULATION'),
    z.literal('PENETRATE_COMPLETE_64_PORTAL_LATTICE'),
    z.literal('VALIDATE_OUTPUT_CONTRACT'),
    z.literal('STORE_RESULT'),
  ]),
})
export type IndependentSystemRunContract = z.infer<
  typeof IndependentSystemRunContractSchema
>

export const LocationResolutionContractSchema = z.object({
  locationDataRequired: z.literal(true),
  removeWhenAvailableLanguage: z.literal(true),
  mustResolveLocation: z.literal(true),
  mustCalculateEnvironmentalField: z.literal(true),
  mustRetainEnvironmentalInheritance: z.literal(true),
  mustStoreEnvironmentalResult: z.literal(true),
})
export type LocationResolutionContract = z.infer<
  typeof LocationResolutionContractSchema
>

export const GeneratorBoundaryContractSchema = z.object({
  mayCalculate: z.literal(true),
  mayScore: z.literal(true),
  mayRoute: z.literal(true),
  mayExtract: z.literal(true),
  mayPenetratePortalLattice: z.literal(true),
  mayLayerSourcePresence: z.literal(true),
  mayValidate: z.literal(true),
  mayStore: z.literal(true),
  mayImproviseMeaning: z.literal(false),
  mayProduceRawIngredientProse: z.literal(false),
  mayPerformOracleNarration: z.literal(false),
  mustProduceStructuredOutput: z.literal(true),
})
export type GeneratorBoundaryContract = z.infer<
  typeof GeneratorBoundaryContractSchema
>

export const OracleBoundaryContractSchema = z.object({
  mayRender: z.literal(true),
  mayCalculate: z.literal(false),
  mayScore: z.literal(false),
  mayDecideWhatIsPresent: z.literal(false),
  receivesValidatedConvergedStructuredPayload: z.literal(true),
})
export type OracleBoundaryContract = z.infer<typeof OracleBoundaryContractSchema>

export const SchemaFirstPhaseExecutionLockSchema = z.object({
  schemaVersion: z.literal('1.1.0'),
  protocolFile: z.literal('docs/04_SCHEMA_FIRST_PHASE_EXECUTION_LOCK.md'),
  purpose: z.literal(
    'require_schema_contracts_before_phase_calculation_portal_penetration_storage_convergence_or_rendering',
  ),
  phase: z.literal('PHASE_1'),
  schemasComeFirst: z.literal(true),
  phase1RequiredSchemas: z.array(Phase1SchemaLoadItemSchema),
  phase1ExecutionOrder: z.tuple([
    z.literal('LOCATION_INTAKE'),
    z.literal('ENVIRONMENTAL_CALCULATION'),
    z.literal('64_PORTAL_ENVIRONMENTAL_PENETRATION'),
    z.literal('PERMANENT_ENVIRONMENTAL_INHERITANCE'),
    z.literal('BIRTH_DATE'),
    z.literal('SWISS_EPHEMERIS_CALCULATION'),
  ]),
  canonicalRunOrder: z.tuple([
    z.literal('REGISTER_SCHEMA'),
    z.literal('VALIDATE_SCHEMA'),
    z.literal('LOAD_INPUT_CONTRACT'),
    z.literal('RUN_CALCULATION'),
    z.literal('PENETRATE_COMPLETE_64_PORTAL_LATTICE'),
    z.literal('VALIDATE_OUTPUT_CONTRACT'),
    z.literal('STORE_RESULT'),
  ]),
  portalPenetration: PortalPenetrationReferenceContractSchema,
  independentSystemRuns: z.array(IndependentSystemRunContractSchema),
  locationResolution: LocationResolutionContractSchema,
  generatorBoundary: GeneratorBoundaryContractSchema,
  oracleBoundary: OracleBoundaryContractSchema,
})
export type SchemaFirstPhaseExecutionLock = z.infer<
  typeof SchemaFirstPhaseExecutionLockSchema
>

const schemaLoadItem = (
  name: Phase1RequiredSchemaName,
): Phase1SchemaLoadItem => ({
  name,
  required: true,
  loaded: false,
  validated: false,
  confidence: 'locked',
})

const independentSystemRun = (
  systemName: IndependentSystemName,
  outputSourceField: SourceFieldName,
): IndependentSystemRunContract => ({
  systemName,
  schemaMustLoadBeforeRun: true,
  runIndependentlyBeforeSynthesis: true,
  mustPenetrateComplete64PortalLattice: true,
  mustPreserveSourceIdentity: true,
  mustLayerWithoutReplacement: true,
  outputSourceField,
  executionOrder: [
    'REGISTER_SCHEMA',
    'VALIDATE_SCHEMA',
    'LOAD_INPUT_CONTRACT',
    'RUN_CALCULATION',
    'PENETRATE_COMPLETE_64_PORTAL_LATTICE',
    'VALIDATE_OUTPUT_CONTRACT',
    'STORE_RESULT',
  ],
})

export const SCHEMA_FIRST_PHASE_EXECUTION_LOCK: SchemaFirstPhaseExecutionLock = {
  schemaVersion: '1.1.0',
  protocolFile: 'docs/04_SCHEMA_FIRST_PHASE_EXECUTION_LOCK.md',
  purpose:
    'require_schema_contracts_before_phase_calculation_portal_penetration_storage_convergence_or_rendering',
  phase: 'PHASE_1',
  schemasComeFirst: true,
  phase1RequiredSchemas: [
    schemaLoadItem('64_PORTAL_SCHEMAS'),
    schemaLoadItem('PORTAL_INPUT_OUTPUT_CONTRACTS'),
    schemaLoadItem('PORTAL_PENETRATION_CONTRACT'),
    schemaLoadItem('ENVIRONMENTAL_DOMAIN_REGISTRY'),
    schemaLoadItem('ENVIRONMENTAL_SIGNAL_REGISTRY'),
    schemaLoadItem('GEOPRESENCE_SCHEMAS'),
    schemaLoadItem('BIOME_SCHEMAS'),
    schemaLoadItem('ABIOTIC_SCHEMAS'),
    schemaLoadItem('LIGHT_CYCLE_SCHEMAS'),
    schemaLoadItem('TERRAIN_SCHEMAS'),
    schemaLoadItem('ELEVATION_SCHEMAS'),
    schemaLoadItem('CLIMATE_SCHEMAS'),
    schemaLoadItem('HUMAN_THREAT_SCHEMAS'),
    schemaLoadItem('BIOLOGICAL_THREAT_SCHEMAS'),
    schemaLoadItem('POLITICAL_INSTITUTIONAL_PRESSURE_SCHEMAS'),
    schemaLoadItem('EVIDENCE_AND_PROVENANCE_SCHEMAS'),
    schemaLoadItem('SCORING_AND_NORMALIZATION_SCHEMAS'),
    schemaLoadItem('CONFIDENCE_AND_CONTRADICTION_SCHEMAS'),
    schemaLoadItem('WOUND_MARKER_SCHEMAS'),
    schemaLoadItem('SHADOW_MARKER_SCHEMAS'),
    schemaLoadItem('GLOBAL_AMPLIFIER_SCHEMAS'),
    schemaLoadItem('BASELINE_PRESSURE_EFFECT_SCHEMAS'),
    schemaLoadItem('PHASE_1_STORAGE_OUTPUT_CONTRACTS'),
  ],
  phase1ExecutionOrder: [
    'LOCATION_INTAKE',
    'ENVIRONMENTAL_CALCULATION',
    '64_PORTAL_ENVIRONMENTAL_PENETRATION',
    'PERMANENT_ENVIRONMENTAL_INHERITANCE',
    'BIRTH_DATE',
    'SWISS_EPHEMERIS_CALCULATION',
  ],
  canonicalRunOrder: [
    'REGISTER_SCHEMA',
    'VALIDATE_SCHEMA',
    'LOAD_INPUT_CONTRACT',
    'RUN_CALCULATION',
    'PENETRATE_COMPLETE_64_PORTAL_LATTICE',
    'VALIDATE_OUTPUT_CONTRACT',
    'STORE_RESULT',
  ],
  portalPenetration: {
    contractPath: 'schemas/01_PORTAL_PENETRATION_CONTRACT.schema.ts',
    requiredBeforePortalExecution: true,
    canonicalVerb: 'penetrate',
    supportingVerbs: ['layer', 'occupy', 'accumulate'],
    forbiddenExecutionVerb: 'scan',
    portalCount: 64,
    everyPortalReceivesSourcePresenceRecord: true,
    sourcesLayerWithoutReplacingPriorSources: true,
    laterSourcesMayReadExistingLayers: true,
    laterSourcesMayOverwriteExistingLayers: false,
    preserveSourceIdentityUntilConvergence: true,
    convergenceOccursAfterLayering: true,
  },
  independentSystemRuns: [
    independentSystemRun('VEDIC', 'vedic_source_field'),
    independentSystemRun('WESTERN', 'western_source_field'),
    independentSystemRun('HELLENISTIC', 'hellenistic_source_field'),
    independentSystemRun(
      'PERSIAN_ARABIC_LOTS',
      'persian_arabic_lot_source_field',
    ),
    independentSystemRun('ATTACHMENT_THEORY', 'attachment_field'),
    independentSystemRun('LOVE_LANGUAGE', 'love_language_field'),
    independentSystemRun('NUMEROLOGY', 'numerology_field'),
  ],
  locationResolution: {
    locationDataRequired: true,
    removeWhenAvailableLanguage: true,
    mustResolveLocation: true,
    mustCalculateEnvironmentalField: true,
    mustRetainEnvironmentalInheritance: true,
    mustStoreEnvironmentalResult: true,
  },
  generatorBoundary: {
    mayCalculate: true,
    mayScore: true,
    mayRoute: true,
    mayExtract: true,
    mayPenetratePortalLattice: true,
    mayLayerSourcePresence: true,
    mayValidate: true,
    mayStore: true,
    mayImproviseMeaning: false,
    mayProduceRawIngredientProse: false,
    mayPerformOracleNarration: false,
    mustProduceStructuredOutput: true,
  },
  oracleBoundary: {
    mayRender: true,
    mayCalculate: false,
    mayScore: false,
    mayDecideWhatIsPresent: false,
    receivesValidatedConvergedStructuredPayload: true,
  },
}

SchemaFirstPhaseExecutionLockSchema.parse(SCHEMA_FIRST_PHASE_EXECUTION_LOCK)
