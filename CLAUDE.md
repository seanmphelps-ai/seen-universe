// PROVENANCE: bot=codex session=2026-10-08 task=complete positive-instruction rewrite of repository agent guidance
# Repository Execution Instructions

## Mission

Complete the user's requested work in the existing SEEN implementation. Treat the request as authorization for the intermediate steps needed to deliver and verify it. Use the current branch, existing context, product canon, schemas, and working implementation as the starting point.

A status question about previously requested work initiates inspection, completion of the remaining authorized work, verification, and a concise outcome report. Honor an explicit request for status only or a pause.

## Execution

1. Identify the relevant professional discipline and apply its methods. Research respected practitioners, primary sources, and the user's named references when the task requires domain research. Spend at least one minute actively retrieving, comparing, and validating named sources for a substantive research task.
2. Recover established decisions from repository context and available tools. Apply user corrections immediately and preserve their attribution.
3. Resolve routine implementation choices from evidence and the active request. State material assumptions and tradeoffs. Ask about a missing decision when it genuinely blocks the dependent work; complete independent authorized work first.
4. Take the next obvious authorized action. Deliver the implementation, investigation, or complete rewritten text requested.
5. Keep communication concise and centered on findings, solutions, and verified outcomes.
6. Continue through recoverable failures, authorized repairs, and relevant verification. Report a genuine blocker with the exact user action needed to resolve it.

## Governing structure

ECC provides the harness for memory, instincts, security, and budgets. Caveman compresses presentation while preserving architecture, evidence, scope, and governing meaning. SEEN's pipeline runs within that harness.

- MCPs provide retrieval and storage capabilities through provider-agnostic interfaces.
- Skills execute the bounded stage assigned by the active user task.
- Hooks enforce deterministic checks.
- Existing SEEN architecture remains authoritative; implement authorized product and architectural changes through its existing interfaces.
- Run the relevant verification before declaring the requested work complete.

Project-specific contracts live in `.agents/skills/`. Agent roles live in `.agents/agents/`. The pipeline definition is `docs/ECC_SEEN_PIPELINE.md`. Use these existing instruction locations and update their contents in place.

## Read order and context routing

Before implementation edits, read this file, `docs/MASTER_BUILD_CHECKLIST.md`, the matching context module, and the current implementation.

| Active task | Context module |
| --- | --- |
| Closure, relationships, comparisons | `docs/contexts/CLAUDE_CLOSURE.md` |
| Location, exposure, trips, place, time | `docs/contexts/CLAUDE_LOCATION.md` |
| Generator, portals, layers, shadows, convergence, Helix | `docs/contexts/CLAUDE_GENERATOR_HELIX.md` |
| Life Map, source-system tabs, historical provenance, visual and narrative rendering | `docs/contexts/CLAUDE_LIFE_MAP_RENDERING.md` |
| Oracle, voice, chat | `docs/contexts/CLAUDE_ORACLE.md` |
| Cadence, tracker, widget, daily follow-through | `docs/contexts/CLAUDE_CADENCE.md` |
| Child, parent, sibling, teacher, caregiver | `docs/contexts/CLAUDE_FAMILY.md` |
| Eden, dating, sharing, consent | `docs/contexts/CLAUDE_EDEN.md` |

Load the modules and examples from `docs/examples/` that support the task. Load multiple modules when the task spans their responsibilities.

Place recovered source material in `docs/incoming/`. When reconciling multiple recovered or candidate sources, run `docs/00_SOURCE_CONVERGENCE_SEQUENCE_GATE.md` and update `docs/source-analysis/SOURCE_SEQUENCE_MATRIX.csv` before canonization or implementation.

## Implementation method

1. Inspect the active branch and working code. Reuse completed behavior and established project decisions.
2. Define verifiable success criteria for the requested change and a brief sequence of implementation and verification steps when the task spans several steps.
3. Implement the smallest complete solution within the requested scope. Use concrete behavior and structures appropriate to the task.
4. Match existing style. Trace every changed line to the request. Preserve surrounding code, comments, formatting, and existing functionality.
5. Remove imports, variables, and functions made unused by this change. Report unrelated dead code as a separate finding and preserve it for a separately authorized cleanup.
6. Prefer the simpler sufficient implementation. Keep abstractions and configuration tied to actual requested use cases; handle states that can occur in the supported flow.
7. Preserve parallel workers' edits through coordinated file ownership and integration on `closure-and-composure`.
8. Verify the behavior against the original request. For a bug, reproduce the failure and verify the correction. For a refactor, compare relevant checks before and after. For validation, exercise supported and invalid inputs.
9. Run checks relevant to the change. For integrated runtime changes, run `npm run typecheck`, `npm test`, and `npm run build`.
10. Commit the completed work on the existing active branch and report changed behavior, verification evidence, and material unresolved limits.

## Provenance and delivery

Preserve each rewritten file's existing first-line provenance header. Add the repository's `// PROVENANCE: bot=<bot-name> session=<YYYY-MM-DD> task=<task>` header to changed files that need one. Follow `PROVENANCE.md` and the available repository hook.

Completion reports reflect actions actually performed and evidence actually collected. Mark missing evidence as unresolved, finish independent work, and identify the concrete remaining dependency.

Each session delivers the requested reviewable result, relevant verification, and a concise report. Successful execution produces focused diffs, reused context, preserved operational meaning, and working behavior.
