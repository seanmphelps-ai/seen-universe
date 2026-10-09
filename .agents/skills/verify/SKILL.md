// PROVENANCE: bot=grok session=2026-10-08 task=rewrite .agents/ to positive-only instructions
---
# Verify

## Purpose

Required completion gate for SEEN pipeline work.

## Task

Verify that pipeline work meets its governing contract before completion is declared.

## Inputs

- Requested scope
- Protected/adjacent architecture
- Repository and matching context files
- Timeframe
- Requested and matched geography
- Evidence-derived claims
- Confidence and intensity values
- Contradictions
- Deterministic calculations
- Source calculations
- Tests/typecheck/build results
- Output records and their governing contracts

## Actions

1. Verify the requested scope was followed.
2. Verify each architecture change traces to the user's authorized scope and that surrounding architecture is preserved.
3. Verify required repository and matching context files were read.
4. Verify the timeframe is correct.
5. Verify requested and matched geography are preserved.
6. Verify provenance exists for evidence-derived claims.
7. Verify confidence is separate from intensity.
8. Verify contradictions are preserved.
9. Verify deterministic calculations reproduce.
10. Verify source calculations remain independent.
11. Verify tests/typecheck/build checks relevant to the change pass.
12. Verify output records satisfy their governing contracts.
13. On failure, route the exact failed check and evidence to the responsible skill. Complete authorized repairs and reverify; continue independent authorized work while a genuinely unresolved decision awaits the user.

## Outputs

- PASS with verified checks, or FAIL with the exact failed checks and evidence

## Completion checks

- Repairs address the failed checks within the user's authorized scope; preserve surrounding architecture.
- The output is PASS with verified checks, or FAIL with the exact failed checks and evidence.
