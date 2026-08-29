# CLAUDE.md

## ECC HARNESS — GOVERNING STRUCTURE

ECC is the harness. Do not place another orchestration layer above it.

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

### Execution law

- ECC governs memory, instincts, security, and budgets.
- Caveman compresses output only. It does not alter architecture, evidence, scope, or governing rules.
- MCPs provide capabilities. They do not make product or architectural decisions.
- Skills execute bounded jobs. They do not expand their own scope.
- Hooks enforce deterministic boundaries where enforcement is possible.
- `verify` is required before work is considered complete.
- Existing SEEN architecture remains authoritative. No skill, MCP, hook, or model may replace or redesign adjacent architecture unless explicitly requested.
- For repository work, read this file, `docs/MASTER_BUILD_CHECKLIST.md`, and the matching context module before changing implementation files.

Project-specific skill contracts live under `.claude/skills/`.
Pipeline definition lives at `docs/ECC_SEEN_PIPELINE.md`.

## EXECUTION FIRST

1. **take the initiative- search for the top producers and respected names in the field that we are covering. assume the role/ words of those top tier specialist in the field we  are working in-  DO THE TASK-solve the problem .**
2. **Use existing context-if a specific name is given dive right into that name, don't stay around it compare sources verify validate  spend atleast 1 minute actively searching and comparing  .**
3. ** not wait to be asked immediately find the facts cross check McGrath other sources  is checkable, retrieve it.**
4. **return discovery directly- not hownor why but what are the steps to a solution as wuiclly  as possoble  If the next action is obvious and authorized, take it.**
5. **Do not narrate or repeat  and work before doing it.**
6. **Do not make the user repeat established decisions.**
7. **Corrections change the working rule immediately; preserve who corrected what.**
8. **Ask only when a missing decision cannot be resolved from context or tools.**

## Coding rules

1. **Think Before Coding** — surface assumptions, don't pick silently
2. **Simplicity First** — minimum code, nothing speculative
3. **Surgical Changes** — touch only what you must
4. **Goal-Driven Execution** — define success criteria, verify

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## SEEN CONTEXT ROUTING

For SEEN work:

1. Read `docs/MASTER_BUILD_CHECKLIST.md`.
2. Load only the context module matching the task:
   - Closure, relationships, comparisons → `docs/contexts/CLAUDE_CLOSURE.md`
   - Location, exposure, trips, place, time → `docs/contexts/CLAUDE_LOCATION.md`
   - Generator, portals, layers, shadows, convergence, Helix → `docs/contexts/CLAUDE_GENERATOR_HELIX.md`
   - Life Map, source-system tabs, historical provenance, visual rendering, narrative/cinematic presentation → `docs/contexts/CLAUDE_LIFE_MAP_RENDERING.md`
   - Oracle, voice, chat → `docs/contexts/CLAUDE_ORACLE.md`
   - Cadence, tracker, widget, daily follow-through → `docs/contexts/CLAUDE_CADENCE.md`
   - Child, parent, sibling, teacher, caregiver → `docs/contexts/CLAUDE_FAMILY.md`
   - Eden, dating, sharing, consent → `docs/contexts/CLAUDE_EDEN.md`
3. Load only matching examples from `docs/examples/`.
4. Do not load every module unless the task genuinely spans them.
5. Put recovered material in `docs/incoming/` before canonizing it.
