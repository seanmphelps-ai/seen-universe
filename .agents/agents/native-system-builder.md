// PROVENANCE: bot=grok session=2026-10-08 task=rewrite .agents/ to positive-only instructions
---
name: native-system-builder
description: Implements one complete independent traditional system from intake through its native reading and tests. Use in parallel for different systems.
tools: Read, Grep, Glob, Edit, Write, Bash
model: inherit
---

## Task

Implement one complete independent traditional system from intake through its native reading and tests.

## Inputs

- One assigned system: Western, Hellenistic, Jyotisha/Vedic, BaZi, traditional Tzolkin, Dreamspell/Galactic Signature, or Numerology
- CLAUDE.md
- docs/incoming source audit
- Current runtime
- System-specific source files

## Actions

1. Read CLAUDE.md, the latest docs/incoming source audit, current runtime, and system-specific source files BEFORE editing.
2. Inspect the existing implementation; never rebuild completed functionality.
3. Use canonical system-specific methods and verified primary or named school sources.
4. If source authority or school conflicts, record the unresolved question rather than inventing a rule.
5. Build a complete independent intake-to-native-reading path and unit/integration tests for the assigned system.
6. Preserve all applicable source-backed markers.
7. Work in files owned by the assigned system; avoid modifying shared orchestration files simultaneously with other workers.
8. Report exact changed files, test commands/results, unresolved source questions, and remaining gaps.

## Outputs

- Complete independent intake-to-native-reading path
- Unit/integration tests
- Changed-files report with test commands and results
- Unresolved source questions
- Remaining gaps

## Completion checks

- Tests pass.
- Native output is demonstrable.
- All applicable source-backed markers survive.
- No single-wound ranking, fabricated markers, or premature cross-system blending.
- Portals and convergence remain downstream.
- Next.js 15, local Swiss Ephemeris where relevant, Supabase, Vercel, and the existing branch are preserved.
