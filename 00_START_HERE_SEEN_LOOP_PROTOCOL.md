# 00 · START HERE — SEEN Loop Protocol

This file comes before app code, schemas, generators, Oracle wording, UI, and implementation details.

SEEN should not be built by one-pass prompting. SEEN is built by looped convergence: gather signal, run disciplined passes, preserve what each pass adds, verify the result, then commit only the converged artifact.

## Core rule

GitHub is not the scratchpad.

Chat, drafts, and working notes are for passes. GitHub is for converged files.

Do not commit every intermediate version. Run the passes first, collapse the strongest version, then commit the landed artifact.

## When to use a loop

Use a loop only when all of these are true:

1. The task repeats or belongs to a recurring SEEN build pattern.
2. The result can be checked by a clear gate: type check, test, build, schema validation, lint, or explicit human approval.
3. The agent has enough context and tools to inspect the files it changes.
4. The loop has a hard stop: pass count, iteration limit, token limit, or approval boundary.
5. A human reviews before merge, deploy, deletion, architecture changes, auth, payments, medical/legal claims, or irreversible action.

If these are not true, use a focused manual prompt instead of a loop.

## SEEN 10-pass convergence protocol

For foundational files, run these passes before producing the final answer:

1. **Read-only pass** — understand the request and existing repo position before writing.
2. **Purpose pass** — define what the file is responsible for and what it must not do.
3. **Schema pass** — lock the data contract, types, fields, and module boundaries.
4. **Runtime pass** — identify whether logic, scoring, routing, calculation, or output builders are required.
5. **Product pass** — ensure the file supports the actual user flow and not just abstract architecture.
6. **Guardrail pass** — add limits: probability not destiny, no truth detection unless explicitly supported, no unsupported clinical/legal claims, consent where needed.
7. **Dependency pass** — verify what comes before and what the file feeds into.
8. **Naming/path pass** — choose the correct folder, file name, exports, and commit message.
9. **Contradiction pass** — remove conflicts, duplicates, dead assumptions, and unsupported scoring claims.
10. **Final convergence pass** — produce one canonical artifact with no competing versions.

## Maker / verifier split

Do not let the same pass both invent and approve the result.

Use separate roles conceptually even inside one assistant response:

- Maker: drafts the structure.
- Verifier: checks boundaries, contradictions, missing fields, downstream breakage, and whether the artifact is overbuilt.
- Converger: preserves what survived verification and collapses it into one final file.

## State rule

Important SEEN work must preserve state outside the chat whenever possible.

A good state note records:

- files created or changed
- canonical file path
- commit SHA
- open duplicates or cleanup needed
- current module position
- what feeds into it
- what it feeds into
- unresolved questions

The agent forgets. The repo does not.

## Commit rule

Before committing, confirm:

- exact path
- exact commit message
- whether the file already exists
- whether this is a new canonical file, replacement, or cleanup
- whether duplicate older files should remain or be deleted later

Commit only the converged result.

## SEEN-specific build order

Default ordering:

1. Protocol / operating laws
2. State and agent instructions
3. SEEN Core person makeup
4. Wound markers and emotional baseline markers
5. Masquerade / attraction-selection layer
6. Couples Corridor
7. Child Climate Map
8. Parental Impact Calibration
9. Scoring engines and runtime calculators
10. Oracle response structure
11. UI flows
12. Tests and verification gates

## Hard boundaries

Do not loop unattended on:

- architecture rewrites
- auth or payments code
- destructive deletes
- production deployment
- vague product work
- unsupported health, legal, or financial claims
- any file where the acceptance condition is only "sounds good"

## Final answer format for GitHub work

For repository changes, final response should land the plane:

```text
Path:
<exact path>

Commit:
<exact commit SHA>
<commit message>

Status:
<created | updated | verified | needs cleanup>

Use this as canonical:
<yes/no and file path>
```

No duplicate options unless the user explicitly asks for alternatives.

## Lock sentence

SEEN is built by convergence, not prompting: gather the signal, run the passes, preserve what survives, verify the artifact, then commit only the final file.
