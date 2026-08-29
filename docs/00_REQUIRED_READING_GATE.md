# 00_REQUIRED_READING_GATE

Purpose: require explicit review proof before changing SEEN product, schema, runtime, or implementation files.

## Required Reading

1. `CLAUDE.md`
2. `00_SEEN_APPLICATION_ENTRY.md`
3. `docs/00_START_HERE_CANON_LOCK.md`
4. `docs/SEEN_CANONICAL_UI_LANGUAGE.md`
5. `README_CORE_SCHEMA_ORDER.md`
6. `docs/01_SEEN_FOUNDATION_AND_THREE_COORDINATES.md`
7. `docs/02_CLOSURE_COMPOSURE_RUNTIME_ORDER_LOCK.md`
8. `docs/03_ZOD_INPUT_OUTPUT_CONTRACT_LOCK.md`
9. `docs/10_SCHEMA_REVIEW_PROTOCOL.md`
10. The file being changed
11. Adjacent files in the active contract and implementation path

## Applies To

- `app/**`
- `src/**`
- `public/**`
- `docs/**`
- `schemas/**`
- `runtime/**`
- `governance/**`
- `phase-zero/**`
- `phase-one/**`
- `README_CORE_SCHEMA_ORDER.md`

## Required Checks

- SEEN Runtime, Generator, Oracle, Portal, and Cadence ownership stays explicit
- every runtime layer has a Zod input schema and Zod output schema
- every schema exports its inferred TypeScript type
- every runtime boundary parses input and output
- handoff targets exist
- load order is clear
- hidden mechanics and user-facing boundaries are clear
- current application slice remains complete
- Closure & Composure remains served
- SEEN mission, vision, and purpose remain served
- product language remains repository-sourced
- visual implementation follows the canonical UI language
- Hormozi value review passes
- Socratic contradiction review passes
- 80/20 necessity review passes
- typecheck passes
- production build passes
- mobile interaction is verified
- the change advances the clickable, usable, sellable SEEN application

A change is ready when every applicable check passes.
