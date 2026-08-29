# 03_ZOD_INPUT_OUTPUT_CONTRACT_LOCK

## Authority

Every SEEN runtime layer defines a Zod-validated input contract and a Zod-validated output contract.

Every schema exports its inferred TypeScript type.

Every runtime boundary parses input before execution and parses output before handoff.

Every payload carries schema version, runtime version, source IDs, provenance, confidence, contradictions, unresolved variables, and Life Section routes where applicable.

Loose objects, prose-only handoffs, and unvalidated payloads remain outside the production runtime.

## Contract Pattern

Each runtime layer implements:

```ts
export const ExampleInputSchema = z.object({
  schemaVersion: z.string(),
  runtimeVersion: z.string(),
  runId: z.string(),
  // layer-specific validated input
});

export type ExampleInput = z.infer<typeof ExampleInputSchema>;

export const ExampleOutputSchema = z.object({
  schemaVersion: z.string(),
  runtimeVersion: z.string(),
  runId: z.string(),
  // layer-specific validated output
});

export type ExampleOutput = z.infer<typeof ExampleOutputSchema>;
```

Runtime execution follows:

```text
unknown input
→ InputSchema.parse
→ runtime execution
→ OutputSchema.parse
→ typed handoff
```

## Required Schema Pairs

### Experience Mode

- `ExperienceModeInputSchema`
- `ExperienceModeOutputSchema`

### Environmental Intake

- `EnvironmentalIntakeInputSchema`
- `EnvironmentalIntakeOutputSchema`

### Place Resolution

- `PlaceResolutionInputSchema`
- `PlaceResolutionOutputSchema`

### Place-Period Temporalization

- `PlacePeriodTemporalizationInputSchema`
- `PlacePeriodTemporalizationOutputSchema`

### Baseline Environmental Pressure

- `BaselineEnvironmentalPressureInputSchema`
- `BaselineEnvironmentalPressureOutputSchema`

### Portal Pre-Charge

- `PortalPrechargeInputSchema`
- `PortalPrechargeOutputSchema`

### Birth Foundation

- `BirthFoundationInputSchema`
- `BirthFoundationOutputSchema`

### Numerology

- `NumerologyInputSchema`
- `NumerologyOutputSchema`

### Swiss Ephemeris Candidate Runs

- `SwissEphemerisCandidateInputSchema`
- `SwissEphemerisCandidateOutputSchema`

### Western Interpretation

- `WesternInterpretationInputSchema`
- `WesternInterpretationOutputSchema`

### Vedic Interpretation

- `VedicInterpretationInputSchema`
- `VedicInterpretationOutputSchema`

### Hellenistic Interpretation

- `HellenisticInterpretationInputSchema`
- `HellenisticInterpretationOutputSchema`

### Maternal and Family Pressure

- `MaternalFamilyPressureInputSchema`
- `MaternalFamilyPressureOutputSchema`

### Childhood Safety / Belonging / Reward Triangle

- `ChildhoodFormationTriangleInputSchema`
- `ChildhoodFormationTriangleOutputSchema`

### Attachment Evaluation

- `AttachmentEvaluationInputSchema`
- `AttachmentEvaluationOutputSchema`

### Wound Evaluation

- `WoundEvaluationInputSchema`
- `WoundEvaluationOutputSchema`

### Shadow Evaluation

- `ShadowEvaluationInputSchema`
- `ShadowEvaluationOutputSchema`

### Recognition Summary Generation

- `RecognitionSummaryGenerationInputSchema`
- `RecognitionSummaryGenerationOutputSchema`

### Recognition Selection

- `RecognitionSelectionInputSchema`
- `RecognitionSelectionOutputSchema`

### Full Helix Ignition

- `HelixIgnitionInputSchema`
- `HelixIgnitionOutputSchema`

### 64-Portal Scan

- `PortalScanInputSchema`
- `PortalScanOutputSchema`

### Dr. Maisel 25-Lens Inspection

- `DrMaiselLensInspectionInputSchema`
- `DrMaiselLensInspectionOutputSchema`

### Recursive Passes

- `RecursivePassInputSchema`
- `RecursivePassOutputSchema`

### Convergence

- `ConvergenceInputSchema`
- `ConvergenceOutputSchema`

### Divergence

- `DivergenceInputSchema`
- `DivergenceOutputSchema`

### Drama Triangle Evaluation

- `DramaTriangleEvaluationInputSchema`
- `DramaTriangleEvaluationOutputSchema`

### Sovereignty Role Inversion

- `SovereigntyRoleInversionInputSchema`
- `SovereigntyRoleInversionOutputSchema`

### Jungian Sovereignty Inversion

- `JungInversionInputSchema`
- `JungInversionOutputSchema`

### 45 Life Section Routing

- `LifeSectionRoutingInputSchema`
- `LifeSectionRoutingOutputSchema`

### Person Generator

- `PersonGeneratorInputSchema`
- `PersonGeneratorOutputSchema`

### Person Oracle Reveal

- `PersonOracleRenderInputSchema`
- `PersonOracleRenderOutputSchema`

### Relationship Comparison

- `RelationshipComparisonInputSchema`
- `RelationshipComparisonOutputSchema`

### Relational Recognition Summaries

- `RelationalRecognitionSummaryInputSchema`
- `RelationalRecognitionSummaryOutputSchema`

### Closure & Composure Generator

- `ClosureComposureGeneratorInputSchema`
- `ClosureComposureGeneratorOutputSchema`

### Closure & Composure Oracle Reveal

- `ClosureComposureOracleInputSchema`
- `ClosureComposureOracleOutputSchema`

### Cadence Handoff

- `CadenceHandoffInputSchema`
- `CadenceHandoffOutputSchema`

## Shared Output Fields

Every applicable output preserves:

- `id`
- `runId`
- `schemaVersion`
- `runtimeVersion`
- `createdAt`
- `inputIds`
- `sourceIds`
- `provenance`
- `confidence`
- `contradictions`
- `unresolvedVariables`
- `lifeSectionRoutes`
- `complete`
- `completionStatus`

`completionStatus` uses:

- `complete`
- `incomplete`
- `blocked`
- `unresolved`
- `provider_credential_required`
- `canonical_interpretation_required`
- `calculation_implementation_required`
- `validation_dataset_required`

## Runtime Gate

A runtime layer advances only when:

1. its input parses successfully;
2. its required dependencies are complete or explicitly unresolved;
3. its execution returns a schema-valid output;
4. its output includes the required source and version metadata;
5. the next layer accepts that output through its own input schema.

Typed recoverable errors preserve the active stage and valid prior state.

## Implementation Requirement

The runtime-order lock and this Zod contract lock operate together.

`docs/02_CLOSURE_COMPOSURE_RUNTIME_ORDER_LOCK.md` defines sequence.

`docs/03_ZOD_INPUT_OUTPUT_CONTRACT_LOCK.md` defines the validated contract at every sequence boundary.
