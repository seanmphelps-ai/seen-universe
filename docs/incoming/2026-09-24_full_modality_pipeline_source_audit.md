// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# Full modality pipeline — source audit (2026-09-24)

This records the current user instruction before reconciling older repository material.

## Current product instruction

First deliver one separate, whole native reading each for Western, Hellenistic, Jyotisha/Vedic, BaZi, Galactic Signature/Dreamspell, numerology and traditional Tzolk'in. A selected school/edition defines its complete component inventory, input requirements, calculations and traditional interpretation. Its independent auditor verifies that whole method before any wound extraction. The auditor checks every applicable wound against the complete native output and records any uncovered or unresolved rule explicitly. Keep person and place evidence attached to the relevant native reading.

## Candidate source and calculation inventory

| Modality | Native calculation candidate | Primary or originator source candidate | Independent verification and unresolved decision |
|---|---|---|---|
| Galactic Signature / Dreamspell | Installed wheel: `@oshimishi/dreamspell-math@0.3.2` `dreamdate` (`docs/CALC_WHEELS.md`) | Foundation for the Law of Time's Dreamspell material; explicitly identify its edition/version | Keep independent from traditional Maya Tzolk'in. |

## Repository and deployment discrepancies observed

1. Production `POST /api/seen/run` computes only Western and official location. `lib/agents/execution.ts` `readNative` calls each wheel in `docs/CALC_WHEELS.md`. Interpretive modality audits are still unresolved.
2. `lib/seen/woundMarkers.ts` unconditionally appends `Ashlesha (pending Vedic native)` to a Western-chart pass. A shared `wound-extract` agent is outside the immediate independent-modality deliverable.
3. `lib/seen/chartEngine.ts` ranks all 64 portals from a wound count and one location amplification, including a hard-coded bonus for IDs 1–14.
4. `lib/seen/westernBridge.ts` fills a 64-portal column with `insufficient_signal` and labels it an independently completed source run.
5. `eve/orchestrator-first-slice` contains a loop called an Eve orchestrator and one `wound-extract` specialist. It predates the production branch's recent instruction changes. Production Agent Runs returned zero for the inspected 30-day window.
6. Production docs currently exclude independent I Ching and Human Design (`docs/64_PORTALS.md`, `docs/00_FULL_SYSTEM_MAP.md`), whereas historical docs include them. Current instruction is to inspect their actual contribution before changing active status.
7. `docs/00_FULL_SYSTEM_MAP.md` and the source shelf describe multiple modalities, but `docs/MASTER_BUILD_CHECKLIST.md` still treats numerology as undecided. The current instruction includes numerology.
8. Introductory time-window and intake documents differ.
9. Production `lib/rectification/schema.ts` accepted one singular `wound` in `DarkCardSchema`, and `lib/rectification/darkChartGenerator.ts` asked for a singular surface wound. This review branch replaces those with source-identified wound records. Complete native readers and per-finding auditor coverage are still required before the runtime can attest that none were omitted.

## Full-pipeline acceptance gate

For each of the seven active modalities: source manifest with edition/version and rights; complete named-school method/component inventory; input and calculation contract; whole native reading with favorable and difficult findings; independent reconstruction of that whole reading with a boundary case; complete source-specific wound-rule inventory; passing tests for calculation and interpretation provenance. A native component missing from the chosen school's declared scope blocks that modality's completion and wound extraction. Only after the complete native audit does the auditor compare all applicable wound rules and produced findings, including multiple simultaneous wounds, absent signals, unresolved inputs and location-specific expression. One validated intake can start seven isolated runs and seven independent audits. The delivery presents seven separate readings with their names and source traces; a missing/contradictory/unaudited result remains visibly pending in its own slot. Human Design and native I Ching receive separate comparison outputs before any decision to add them to active delivery.

The ChatGPT Astrologic plugin currently exposes a personal birth-chart tool for this conversation. Evaluate a documented server API separately before considering it as an app calculation provider.

Later Jungian translation has its own source-lock stage after the separate native deliveries. Candidate authority: International Association of Analytical Psychology's description of shadow (including positive and negative contents) https://iaap.org/jung-analytical-psychology/short-articles-on-analytical-psychology/the-shadow/ and its Jung *Aion* contents overview https://iaap.org/resources/academic-resources/collected-works-abstracts/volume-9-2-aion-researches-phenomenology-self/ .
