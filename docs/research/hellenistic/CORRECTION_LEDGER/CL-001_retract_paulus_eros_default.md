# CL-001 — Retract “Paulus Eros = SEEN default”

| Field | Value |
|---|---|
| ID | CL-001 |
| Date (UTC) | 2026-09-20 |
| Module version | hellenistic-research-0.2 |
| Validator | pending Agent B |
| Status | BINDING for research phase |

## Previous rule
Phase-1 SOURCE_LOCK / earlier CoS packets proposed operational default: **Eros = Paulus Hermetic** (day Asc+Venus−Spirit / night Asc+Spirit−Venus), with Schmidt non-reverse as alternate note.

## Failure
Treating one formula tradition as SEEN default **collapses** attested Eros streams. Tarzana 1979-08-01 dark windows already produced mutually disagreeing degrees for:
- Paulus manuscript night-reverse
- Paulus/Schmidt no night-reverse
- Valens-stream reconstruction

A global default erases WHO / WHICH formula / WHICH witness / WHICH conditions — forbidden by CoS directive and by `SEEN_HELLENISTIC_CANONICAL_BUILD.md` + Lots protocol Pass 8/14/15.

## Evidence
- Local VALIDATION_CASE_1979-08-01_TARZANA + SOURCE_LOCK/04_VALIDATION_MATRIX.md (numeric divergence)
- HELLENISTIC_LOTS_CORPUS_RECONSTRUCTION_PROTOCOL.md Pass 15 (Eros mandatory deep extraction; no universal formula)
- CoS DIRECTIVE 2026-09-20: explicit retract

## Corrected rule
1. **No SEEN global default for Eros.**
2. Every Eros output must carry: `author` / `witness` / `formulaTraditionId` / `authorFormulaId` / `sectPolicy` / `sourcePassage` (or UNKNOWN).
3. Multiple historically correct implementations may coexist (`DISTINCT_AUTHOR_TRADITIONS`).
4. Phase-1 “Paulus default” language in `/workspace/seen-hellenistic/SOURCE_LOCK/*` is **superseded** for canon purposes; retain files as audit evidence of prior error.

## Affected artifacts
- SOURCE_LOCK/01_MODULE_SOURCE_MANIFEST.md
- SOURCE_LOCK/03_CALCULATION_AUTHORITY.md
- SOURCE_LOCK/05_DISAGREEMENT_REGISTER.md
- hellenistic-source-shelf.md (workspace root / Phase-1 shelf)
- Any prior CoS shadow packets that stated Paulus default

## Required regression test
Any future runtime or packet that emits unlabeled `Eros` or a single hard-coded Paulus formula without witness metadata = **REGRESSION** → blocks completion.

## Validator
Agent B pass required before canon lock of Lots subsystem.
