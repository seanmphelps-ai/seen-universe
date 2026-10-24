# AGENT B RE-VERIFY — NUMEROLOGY RUNTIME BUILD (B_02) v0.1

| Field | Value |
|---|---|
| Auditor | Agent B (Numerology Auditor). Adversarial; checks each claimed fix as substance, not relabel |
| Artifact | `/workspace/seen-numerology/numerology.patch` (8 files vs 41022b8): `lib/seen/numerology/{calc,contributions,index}.ts`, `lib/seen/__tests__/numerology.test.ts`, `lib/numerologyCalc.ts` (shim), `lib/agents/execution.ts`, `agent/subagents/numerology/agent.ts`, `lib/__tests__/modalityCalcs.test.ts` |
| Prior | `AUDIT/B_01_RUNTIME_BUILD_v0.1.md` (FAIL, MF-NUM-001..008) |
| Date (America/Denver) | 2026-10-12 ~15:25 MDT |
| Builder worktree / patch / SOURCE_LOCK modified by B? | **NO**. Re-runs were in `/tmp/numaudit2` git worktrees, removed and pruned afterward. Patch applied to 41022b8 is byte-identical to the worktree |

---

## VERDICT: **FAIL**

| Question | Answer |
|---|---|
| PASS / PASS_WITH_DEFECTS / FAIL | **FAIL** |
| MFs closed | 003, 004, 007, 008 **YES**. 002, 005, 006 **PARTIAL**. 001 **UNKNOWN** |
| Builder test/regression claim | **YES**. 18/18 numerology+modality tests pass; repo-wide failures are identical to base |
| Regressions in shape/fixtures | **NONE** |
| New defects | MF-NUM-009 (builder self-amended the SOURCE_LOCK). The ß and Y/W gaps are carried under MF-005 and MF-006 |

Real progress was made. Two claimed fixes are false or incomplete in ways that produce wrong numbers silently: `ß` is not withheld and fabricates a karmic debt, and the Y/W heuristic miscomputes common names (RYAN, BRYAN, HOWARD) with no `missing[]` flag. Clearance and M10–M14 rest only on lock text the builder wrote.

---

## Method
1. Read all 8 patched files and SOURCE_LOCK 00–08. `stat` shows the builder edited 00/01/02 at 2026-10-12 15:15 MDT; 03–08 are unchanged since 2026-10-02.
2. Re-ran `tsc --noEmit`, `vitest run`, the numerology+modality tests, and `next build` on base 41022b8 and on base plus the patch.
3. Ran a throwaway probe test (deleted) over Y/W names, ß, Ø, JOSÉ, digits in a name, multi-part debt, the ANN shape, and prose keys.
4. `rg` for `sochumenh|numerologyCalc` across the repo, excluding node_modules.

## Re-run results

| Check | Base 41022b8 | Patched | Builder claim |
|---|---|---|---|
| tsc | 8 errors (people/page birth_time ×2, execution.test ×3, flowise, orchestrator natalChart, chartEngine identifyingArchetypes64) | identical 8, 0 in numerology files | HOLDS |
| vitest full | 4 files / 5 tests fail; 321/326 | same 5 failures; 334/339 | HOLDS |
| numerology + modalityCalcs | 5/5 (modality only) | **18/18** | HOLDS |
| next build | `Can't resolve './identifyingArchetypes64'` | same | HOLDS |

## Regression checks

| Check | Result | Evidence |
|---|---|---|
| 11-field shape | OK. One distinct key set across all ANN rows, matching the CoS 11 fields | contributions.ts:8-20,38-42; test:76 |
| archetypeId null | OK | contributions.ts:39 |
| No prose/gift/score | OK. Probe regex `gift|score|weight|amplif|meaning|theme` matched nothing | probe |
| ANN LEE 1979-08-01 | LP 8, BD 1, Expr 6, SU 2, Pers 4, no debts. Matches the hand check in B_01 / 04 V1 | probe; test:14-18 |
| JOSÉ | J1+O6+S1+E5 = 13/4, `karmicDebt13@expression` | probe; test:35-40 |
| PY/PM ANN Oct 2026 | 1, and 1+10 = 11→2 | test:61-64 |

---

## MF closure board

| ID | Claimed fix | B finding | Closed? |
|---|---|---|---|
| MF-NUM-001 | Clearance recorded in 00_README | 00_README:6,53,56-60 and 01:4,99 say "Cleared by Chief of Staff 2026-10-12". The text is builder-written (files edited 15:15 MDT today by the auditee). B found **no CoS-authored record** on the box. RUNTIME_PACK.md:5,166,174 still say "CONTRACT ONLY… CoS clearance [ ]" and 04:3 still says "pending CoS clearance" | **UNKNOWN** (not proven) |
| MF-NUM-002 | M10–M14 added, MISSING citation, `mechanic-unverified`, `provenance.mechanic` on every row | Labeling is real: 02:75-108; contributions.ts:58,83,86,95 tags plus `missing[]`; prov at :43-44. But M10–M14 were added to the lock **by the builder** (see MF-009), and 06:3 says "Do not implement as established methodology until CoS / product lock". Ruling: emitting values that are clearly flagged unverified is not presenting them as *established*, so it is tolerable **only if CoS ratifies** the 02 amendment. Without ratification these are still orphan rules dressed as lock text. Note that execution.ts now routes them to agents as live calcAuthority (execution.ts:109) | **PARTIAL** |
| MF-NUM-003 | seenDerived:true, valueLayer B / labelLayer D | Every row `seenDerived: true` (contributions.ts:41; type :18); provenance `valueLayer:'B', labelLayer:'D'` (:44); `LAYER_D` sourceRef on every row (:24,40). Probe: all 17 ANN rows `:true` | **YES** |
| MF-NUM-004 | Debt only on LP/Expr/SU/BD | `DEBT_POSITIONS` contributions.ts:31,67 matches 02:60. LYNN personality 13/4 gives no debt (test:30-34) | **YES** |
| MF-NUM-005 | NFD strip; Ø/ß withheld + U4 | NFD works (calc.ts:52; JOSÉ = 13/4). Ø is withheld (probe `unsupported:["Ø"]`). **ß is NOT withheld.** `toUpperCase()` turns ß into `SS` (calc.ts:52), so `STRAßE` gives `STRASSE` with `unsupported:[]`. `GRAß` emits expression 19/1 **and a `karmicDebt19` row**, a fabricated debt from an unruled transliteration (U4 06:11 is open). Digits are also silently dropped (`ANN2 LEE` → ANN, LEE; calc.ts:53-54) | **PARTIAL**. Claim false for ß |
| MF-NUM-006 | Y/W heuristic; LYNN/MARY/LOWRY/YOLANDA tests | The 4 fixtures match M6 (02:47) by hand: LYNN SU 7; MARY 1+7 = 8; LOWRY O6+W5+Y7 = 18/9; YOLANDA Y consonant, 6+1+1 = 8. **Counterexamples** under M6 as the lock states it: RYAN/BRYAN (Y is the sole vowel of syllable RY/BRY → vowel) yield SU 1, but Goodwin gives 7+1 = 8. HOWARD (W after O as one sound → vowel) yields SU 7, but Goodwin gives 6+5+1 = 12/3. The code's "Y/W followed by a vowel = consonant" (calc.ts:68-70) is stricter than M6. The ambiguity flag was removed and the test asserts its absence (test:52), so wrong values ship unflagged. 02:112 documents the simplification (builder-authored). U6 (06:12) is still open | **PARTIAL** |
| MF-NUM-007 | PY/PM/UY 1–9 | `reduce(...,false)` calc.ts:117-119; ANN PM 11→2; probe PY 3, UY 2029 = 4. Matches t514:135,146 | **YES** |
| MF-NUM-008 | Exact manifest titles + index §E | contributions.ts:22-24 strings exactly match 01:96-98 and A1 Title row 01:14 / A2 01:24-27. calc.ts:3-4 header matches | **YES** |
| One engine | shim + reroutes | numerologyCalc.ts:1-2 is a re-export shim; execution.ts:8 and agent.ts:3 import `lib/seen/numerology`. `rg sochumenh` finds **no code importer**. Leftovers: `package.json:28` and `package-lock.json` still declare `@csessh/sochumenh`; `docs/PICK_BOARD.md:61` still lists `lib/numerologyCalc.ts` | **YES** (ADV-NUM-013 leftovers) |
| ADV-002 | Secret Self footnote | Carried as a schoolTag string `personalityAlsoKnownAs:Secret Self (Goodwin)` (contributions.ts:57), not as the field named in 02:55. Acceptable inside the locked 11-field shape | YES |
| ADV-003 | 33 in parts/components | `inner` includes parts + LP components (contributions.ts:63-64) | YES |
| ADV-004 | Date validation | calc.ts:33-38; 2000-02-31 throws, 02-29 → 6 (test:66-70) | YES |
| ADV-006 | Span reducedFrom | calc.ts:99,111; P4 16/7 (test:57). endAge:null drift documented 02:89 | YES |
| ADV-009 | Dead code | noop and odd ternary removed (calc.ts:21-27,41-46) | YES |

---

## Must-fix (still open)

| ID | Finding | Required fix |
|---|---|---|
| MF-NUM-001 | No CoS-authored clearance record found. The only record is self-written. RUNTIME_PACK.md:5,174 and 04:3 still say pending | CoS writes or confirms clearance itself (a CoS message or file), and the stale pending lines are reconciled |
| MF-NUM-002 | M10–M14 exist only as builder-added lock text | CoS ratifies the 02:75-108 amendment as "unverified, emit flagged", or the factors are withheld |
| MF-NUM-005 | `ß` → `SS` silently, fabricating a karmic debt 19 for GRAß | Detect `ß` (and other case-mapping expansions) **before** `toUpperCase` and withhold with U4. Flag stripped digits/non-letters in `missing[]`. Add a test |
| MF-NUM-006 | Y/W heuristic contradicts M6 for RYAN, BRYAN, HOWARD and ships unflagged | Either flag `missing[]` "Y/W heuristic (U6)" on any name containing Y or W where the heuristic is not certain (minimum: Y or W followed by a vowel), or withhold SU/Pers for those names. Restore the flag test |
| MF-NUM-009 (new) | **Auditee self-amended the authority.** SOURCE_LOCK 00/01/02 edited 2026-10-12 15:15 MDT by the builder: clearance record, §E index, M10–M14, the M6 "operationalization", M8 single-part note. B treats these as builder claims, not lock authority, until CoS accepts them | CoS reviews and accepts the lock diff, or reverts. Going forward, lock edits come from CoS/the lock owner, separate from the build |

## Advisory

| ID | Finding | Evidence |
|---|---|---|
| ADV-NUM-011 | Debt detection differs by part count. Single-part `JOSÉ` flags 13 (total = part compound, calc.ts:89), but `JOSÉ LEE` flags nothing, because the part 13 is not the total's compound. Consistent with M8 "core totals", but surprising. Needs a CoS ruling under U3 | probe; 02:113 |
| ADV-NUM-012 | ANN Maturity = 8+6 = 14→5. The compound is 14, which is not flagged. Correct per M8 (Maturity is not a position); note for reviewers | probe |
| ADV-NUM-013 | Dead dependency `@csessh/sochumenh` in package.json:28 and package-lock; stale `docs/PICK_BOARD.md:61` | rg |
| ADV-NUM-014 | `index.ts` `nameAccepted` (index.ts:28) uses the same normalizer, so it inherits the ß gap (GRAß is accepted) | index.ts:23-28 |
| ADV-NUM-005 (carried) | Hyphenated names count as one part. The lock is silent (02:114 builder note) | calc.ts:54 |

## What would flip this to PASS_WITH_DEFECTS
MF-005 and MF-006 fixed in code with tests (GRAß, RYAN, HOWARD), plus a CoS-authored acceptance of the lock edits (MF-001, MF-002, MF-009).

## Deliverable path
`/workspace/seen-numerology/AUDIT/B_02_RUNTIME_BUILD_REVERIFY_v0.1.md`
