# SEEN — Closure & Composure: Compiled Project State

Single reference. Read this before re-deriving architecture from scratch.

## What this is

SEEN's first product, Closure & Composure. A person (or two, for relationship mode) enters birth data once. The system runs it through every modality's **complete native reading**, independently, then synthesizes. Not astrology alone — nine systems. Not reinvented — real installed calculation libraries per modality. Not scored/merged until each is independently audited.

Two complete people enter → three recognizable comparative shadows return → user selects the true pattern → SEEN explains what happened → Cadence begins.

## The nine modalities — real packages, not reinvented

| Modality | Package | Entry point | Status |
|---|---|---|---|
| Western | `swisseph-wasm` | `lib/natalChart.ts :: calculateNatalChart` | positions only |
| Hellenistic | `swisseph-wasm` + `kriya-ephemeris-timelords` | `lib/hellenisticCalc.ts :: calculateHellenistic` | positions only, blocked on SOURCE_LOCK |
| Jyotisha | `swisseph-wasm` (sidereal) | `lib/seen/jyotishaAstronomy.ts :: calculateJyotishaAstronomy` | positions only, ayanamsha unresolved |
| BaZi | `lunar-javascript` | `lib/baziCalc.ts :: calculateBazi` | positions only |
| Numerology | custom (Pythagorean, Goodwin+Decoz sourced) | `lib/seen/numerology` | calc done, shadow text missing |
| Tzolk'in | `@drewsonne/maya-dates` (GPL-3.0) | `lib/tzolkinCalc.ts :: calculateTzolkin` | positions only |
| Dreamspell | `@oshimishi/dreamspell-math` | `lib/dreamspellCalc.ts :: calculateDreamspell` | positions only |
| Human Design | `free-human-design` | `lib/humanDesignCalc.ts :: calculateHumanDesign` | candidate calc only |
| I Ching | none — fails closed | `lib/ichingCalc.ts :: calculateIChing` | no calc authority yet |

64-Portal layer stays separate from I Ching (`docs/64_PORTALS.md`).

## Chief agent + subagent + auditor — already built

`lib/agents/execution.ts`:
- `readNative(modality, input)` — one isolated subagent per modality, returns a `NativeReading` with `calcAuthority` (cited source), `interpretiveAuthority` (named school), `trace`, `unresolved[]`
- `auditNative(reading)` — the auditor step. **Currently a stub**: marks status `pending_auditor`, does not yet independently re-derive or verify
- `runIsolatedModalities(input)` — the chief agent. Runs all 9 modalities isolated, audits each, returns 9 independent readings

This is the real architecture. It matches what was asked for: one agent per modality, one auditor per agent, real libraries, no reinvention.

## The actual gap (not what I guessed earlier)

1. **Production `/api/seen/run` only computes Western.** The other 8 modalities exist in `lib/agents/execution.ts` but aren't wired into the live endpoint.
2. **`auditNative()` doesn't audit yet.** It's a status stub, not independent verification.
3. **No interpretive/shadow layer.** Every modality is raw calculated positions. The "whole native reading" (favorable + difficult findings per named school) doesn't exist yet for any modality.
4. **Source locks unresolved per modality** — named school/edition/ayanamsha/sect choice still pending for most. See `COCOONS` object in `lib/agents/execution.ts` for the exact unresolved list per modality.
5. **Two confirmed fakes to remove:**
   - `lib/seen/woundMarkers.ts` unconditionally appends a hardcoded `"Ashlesha (pending Vedic native)"` wound — not a real calculation
   - `lib/seen/chartEngine.ts` has a hardcoded bonus for portal IDs 1–14 in its ranking — unexplained, not derived
6. `lib/seen/westernBridge.ts` fills a 64-portal column with `insufficient_signal` but labels the run "independently completed" — mislabeled, not actually complete.
7. The `eve/orchestrator-first-slice` 64-interrogator work (`lib/seen/interrogators/`) predates this instruction set and is a separate, older experiment — not part of the `lib/agents/execution.ts` path. Production Agent Runs showed zero use over 30 days. Do not treat it as the canonical pipeline.

## Governing docs (read before implementing)

- `docs/incoming/2026-09-24_full_modality_pipeline_source_audit.md` — current product instruction, acceptance gate for all 9 modalities
- `docs/CALC_WHEELS.md` — package/entry table, time-rectification input law
- `docs/01_CLOSURE_COMPOSURE_RUNTIME_ORDER.md` — full runtime order, Generator/Oracle boundary
- `docs/MASTER_BUILD_CHECKLIST.md` — build status tracker

## Full-pipeline acceptance gate (from the 9/24 audit, still governing)

For each modality: source manifest with edition/version and rights; complete named-school method inventory; input/calculation contract; whole native reading with favorable and difficult findings; independent reconstruction with a boundary case; complete source-specific wound-rule inventory; passing provenance tests. Missing native component blocks that modality's wound extraction. One validated intake starts nine isolated runs and nine independent audits. Delivery presents nine separate readings; a missing/unaudited result stays visibly pending in its own slot — never silently merged or faked.

## Branch

Built on `final-seen-cc-runtime`, cut from `closure-and-composure` (the repo's actual default branch — there is no separate "main").
