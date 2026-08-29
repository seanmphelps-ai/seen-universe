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

ECC is the harness. Caveman is not a second harness and may only compress output.

## MCP roles

### browser-mcp
Retrieves public observable evidence for the Social layer and other approved external evidence tasks. Retrieval must preserve source, timeframe, geography, precision, and provenance.

### postgres-mcp
Persists structured intake, location-period records, evidence, calculations, provenance, confidence, contradictions, and verified outputs. Storage does not change meaning or synthesize evidence.

Do not hard-code a specific MCP provider into product architecture. The MCP slot is the capability boundary; providers may change.

## Skill order

1. `intake` — seal the subject, DOB, confirmed locations, and calendar timeframes.
2. `social-pull` — collect timeframe-locked public observable evidence for each location-period independently.
3. `narrative-extract` — convert retrieved evidence into structured environmental signals without inventing claims.
4. `chart-gen` — run source calculations independently, including the existing Western/Swiss Ephemeris path where applicable.
5. `resonance` — handle user recognition/calibration evidence without changing original source calculations.
6. `verify` — validate provenance, timeframe, geography, deterministic calculations, contradictions, and required outputs.

## Hooks

Hooks are enforcement points, not reasoning layers. Use them for deterministic checks such as:

- required repository/context reads before implementation edits
- protected-file and scope checks
- secret/security checks
- budget limits
- test/verification requirements
- completion gates

Hooks may block an operation. They may not redesign the product or reinterpret evidence.

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

## Non-expansion rule

A pipeline task authorizes only its bounded stage. Fixing `chart-gen` does not authorize replacing intake. Fixing social retrieval does not authorize changing portal architecture. Verification does not authorize rewriting a failed component unless the active task explicitly permits it.
