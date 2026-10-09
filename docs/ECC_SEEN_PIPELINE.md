// PROVENANCE: bot=codex session=2026-10-08 task=affirmative repository instruction follow-up
# ECC → CAVEMAN → SEEN PIPELINE

## Governing structure

```text
ECC (harness: memory, instincts, security, budgets)
  └── Caveman (output compression)
       └── SEEN pipeline (MCPs + skills + hooks)
            ├── browser-mcp → social pull
            ├── postgres-mcp → storage
            ├── intake skill
            ├── social-pull skill
            ├── narrative-extract skill
            ├── chart-gen skill
            ├── resonance skill
            └── verify skill
```

ECC is the harness. Caveman compresses output within ECC while preserving operational meaning.

## MCP roles

### browser-mcp
Retrieves public observable evidence for the Social layer and other approved external evidence tasks. Retrieval must preserve source, timeframe, geography, precision, and provenance.

### postgres-mcp
Persists structured intake, location-period records, evidence, calculations, provenance, confidence, contradictions, and verified outputs. Storage preserves meaning and independent evidence; synthesis runs in its assigned downstream stage.

Use the MCP slot as a provider-agnostic capability boundary, supporting provider changes through adapters.

## Skill order

1. `intake` — seal the subject, DOB, confirmed locations, and calendar timeframes.
2. `social-pull` — collect timeframe-locked public observable evidence for each location-period independently.
3. `narrative-extract` — convert retrieved evidence into structured environmental signals with every extracted claim linked to retrieved evidence.
4. `chart-gen` — run source calculations independently, including the existing Western/Swiss Ephemeris path where applicable.
5. `resonance` — handle user recognition/calibration evidence while preserving original source calculations.
6. `verify` — validate provenance, timeframe, geography, deterministic calculations, contradictions, and required outputs.

## Hooks

Hooks enforce deterministic checks; reasoning remains with the assigned agent and pipeline stage. Use them for deterministic checks such as:

- required repository/context reads before implementation edits
- protected-file and scope checks
- secret/security checks
- budget limits
- test/verification requirements
- completion gates

Hooks enforce the listed operation checks and return actionable failures. Product decisions and evidence interpretation remain with their assigned owners.

## Location law

Every location-period is evaluated independently before comparison.

Required path:

```text
INTAKE
→ ABIOTIC
→ SOCIAL EVIDENCE
→ STRUCTURED SIGNALS
→ ENVIRONMENTAL PRESSURE FIELD
→ SOURCE CALCULATIONS
→ SYNTHESIS
→ RESONANCE
→ VERIFY
```

Preserve presence and absence, timeframe, provenance, confidence, contradictions, and requested vs matched geography throughout.

## Authorized execution scope

Use the active user request to establish the authorized stages and necessary intermediate work. Repair chart calculations through chart-gen, social retrieval through social-pull, and portal behavior through its assigned implementation. Preserve adjacent stages. Route verification failures to the responsible stage, complete authorized repairs, and continue independent authorized work while a genuine external dependency is unresolved.
