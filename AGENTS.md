# AGENTS.md

## SEEN shared agent instructions

This repository has one active implementation branch: `closure-and-composure`.

For OpenAI/Codex agents working in this repository:

1. Read `CLAUDE.md` first. Its project rules apply here too.
2. Treat `.claude/agents/*` and `.claude/skills/*` as project-specific supplements to any built-in agent or skill with similar scope.
3. When a built-in capability overlaps a project skill, use the built-in capability for execution and the repository skill for SEEN-specific constraints, inputs, ordering, provenance, and verification.
4. Do not create a second orchestration layer, duplicate runtime, duplicate intake, or duplicate skill solely for another model.
5. Inspect the actual application/runtime before creating files. Existing working code outranks stale documentation.
6. Keep SEEN runtime logic in the runtime path that executes it. Prefer inline calculations/contracts at the point they are used over chains of implementation documents.
7. Use `closure-and-composure` for implementation work unless Sean explicitly approves another branch.
8. Verify reachable application flow, tests/typecheck/build relevant to the change, and production behavior before calling work complete.

## Project skill mapping

- intake → `.claude/skills/intake/SKILL.md`
- chart generation → `.claude/skills/chart-gen/SKILL.md`
- location/social evidence → `.claude/skills/social-pull/SKILL.md`
- evidence extraction → `.claude/skills/narrative-extract/SKILL.md`
- recognition/rectification calibration → `.claude/skills/resonance/SKILL.md`
- completion gate → `.claude/skills/verify/SKILL.md`

## Project agents

Use the intent and constraints in:
- `.claude/agents/agent-conductor.md`
- `.claude/agents/native-system-builder.md`
- `.claude/agents/native-system-auditor.md`

Do not copy these files into parallel model-specific folders unless a runtime actually requires a different file format.
