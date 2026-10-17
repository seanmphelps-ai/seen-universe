# AGENT B AUDIT — NUMEROLOGY RUNTIME BUILD v0.1

| Field | Value |
|---|---|
| Auditor | Agent B (Numerology Auditor). Adversarial, independent check |
| Artifact | `/workspace/seen-numerology/numerology.patch` (3 new files vs `origin/closure-and-composure` @ 41022b8) |
| Files | `lib/seen/numerology/calc.ts` (75 lines), `lib/seen/numerology/contributions.ts` (68), `lib/seen/__tests__/numerology.test.ts` (46) |
| Authority | `SOURCE_LOCK/00–08`, `LIBRARY/08_modalities/numerology_schema_t514.md`, `LIBRARY/13_schemas/CONFLICTS.md`, `ROUTING.md` Numerology row (line 14) |
| Date (America/Denver) | 2026-10-12 ~15:15 MDT |
| Builder worktree / patch / SOURCE_LOCK modified by B? | **NO**. Re-runs done in throwaway git worktrees under `/tmp/numaudit` (now removed) |

---

## VERDICT: **FAIL**

| Question | Answer |
|---|---|
| PASS / PASS_WITH_DEFECTS / FAIL | **FAIL** |
| Builder's test/regression claim holds? | **YES**. 6/6 pass; repo-wide failures are the same on base |
| Smoke V1–V3 digits correct? | **YES** (hand-checked) |
| Every emitted rule traceable to a SOURCE_LOCK mechanic? | **NO**. Pinnacles, challenges, personal/universal cycles, and maturity have no mechanic in the lock |
| Layer D honestly flagged? | **NO**. Every row carries a wound/shadow label with `seenDerived:false` and `layer:'B'` |
| Lock cleared for implementation? | **UNKNOWN**. The lock still reads "LOCK PENDING CoS clearance" and "do not implement" |

The arithmetic for the core five numbers is right. The build still fails because it ships rules the lock doesn't contain, labels SEEN derivation as Layer B, contradicts the lock on karmic-debt scope and Y/W, and silently corrupts names that have diacritics.

---

## Method

1. Read all three patched files line by line. `cmp` confirms that the worktree files are byte-identical to the patch applied on 41022b8.
2. Read SOURCE_LOCK 00, 02–08 in full, the t514 schema (lines 1–187), CONFLICTS.md, and ROUTING.md:14.
3. Re-ran `tsc --noEmit`, `vitest run`, and `next build` on base 41022b8 and on base plus the patch, in separate `/tmp` worktrees.
4. Ran a throwaway probe test (deleted afterward) for boundary cases: master LP, leap day, invalid date, diacritics, hyphen, Y name, and personal cycles.
5. Hand-computed the V1/V2/V3 fixtures.

---

## Builder claim re-verification

| Check | Base 41022b8 | Patched | Match builder? |
|---|---|---|---|
| tsc | exit 2, 5 errors (execution.test parallelLimit/any, flowise executeSeenWorkers, orchestrator natalChart, chartEngine portals64) | identical 5 errors, 0 numerology errors | YES |
| vitest | 4 files / 5 tests fail; 321/326 pass | same 4 files / 5 tests fail; 327/332 pass (+6 numerology) | YES |
| next build | fails: `Can't resolve './portals64'` (chartEngine.ts) | same | YES |

## Hand-checked arithmetic

| Case | Hand | Code | OK |
|---|---|---|---|
| V1 ANN LEE 1979-08-01 | LP 8+1+(1979→26→8)=17→8; BD 1; Expr ANN 1+5+5=11 kept, LEE 13→4, 15→6; SU A1 + EE10→1 = 2; Pers NN10→1 + L3 = 4 | 8,1,6,2,4 (test:12) | YES |
| V2 1992-11-11 | 11+11+(1992→21→3)=25→7 | `25/7`, components 11/11 (test:16-19) | YES |
| V3 day 16 | 16/7 birthday debt | `16/7` location birthday (test:23-27) | YES |
| PY ANN 2026 | 8+1+(2026→10→1)=10→1 | 1 | YES |
| PM ANN Oct 2026 | 1+10=11 | 11 (master kept; see MF-NUM-007) | arithmetic YES / policy NO |
| Pinnacles ANN | m8 d1 y8: P1 9, P2 9, P3 18→9, P4 16→7; C 7,7,0,0; P1 end 36−8=28 | matches (test:29-33) | YES |
| JOSÉ (expression) | J1 O6 S1 E5 = 13/4 (karmic 13) | **8**, É dropped, debt lost | **NO** (MF-NUM-005) |
| 1990-11-29 master LP components | 11 + 29→11 + 1990→19→10→1 = 23→5 | 5 | YES |
| 2000-02-29 leap | 2 + 11 + 2 = 15→6 | 6 | YES |
| 2000-02-31 (invalid) | should reject | accepted, LP 8 | **NO** (ADV-NUM-004) |

---

## Ruling table (builder calls 1–7)

| # | Builder call | Lock position | Ruling | Evidence |
|---|---|---|---|---|
| 1 | Masters 11/22 only; 33 reduced + tagged `33-unresolved` | 02:19 "keep 11 or 22… do not keep 33/44"; 05:5 D1; 06:7 U1 | **SUPPORTED** (implementation incomplete: ADV-NUM-003) | calc.ts:10,21; contributions.ts:44,47 |
| 2 | Y always consonant, flagged MISSING | 02:47 M6: Y/W **conditional** under Goodwin rules; 05:8 D4 "Follow Goodwin rules"; only the override UI is unresolved (06:12 U6) | **CONTRADICTS** (MF-NUM-006) | calc.ts:9; contributions.ts:24,37-38 |
| 3 | Pinnacle/challenge inputs single-digit; P1 ends at 36−LP | No pinnacle/challenge mechanic in 02 (M1–M9). t514:142-177 gives only the type shape | **SILENT** (orphan rule: MF-NUM-002). Master LP: `single(11)=2` → P1 ends at 34 (probe 1990-11-29). Whether Decoz uses 36−2 or 36−11 is **UNKNOWN** from the lock | calc.ts:59-70 |
| 4 | Personal month keeps 11 as master | Lock silent (no cycle mechanic). t514:135,146 say personalYear/personalMonth are a "1-9 cycle" | **SILENT in lock; CONTRADICTED by t514** (MF-NUM-007). Personal year also keeps 11/22 (calc.ts:74) | calc.ts:74-75; test:35 |
| 5 | Karmic debt on 5 core numbers, not Maturity | 02:60 M8 INPUT = Life Path, Expression, Soul Urge, Birthday (**four**); 06:10 U3 | **PARTLY CONTRADICTS**. Excluding Maturity is consistent; including **Personality** is not in M8 (MF-NUM-004). The "Decoz: core five" comment has no lock citation | contributions.ts:48 |
| 6 | Shadow text MISSING everywhere | 05:10 D6 "quote locked school text only; no invent"; 07:13 | **SUPPORTED**. Correct refusal | contributions.ts:23,30; test:43 |
| 7 | Existing `lib/numerologyCalc.ts` not used | Lock silent on code. The old file wraps `@csessh/sochumenh@0.3.0` (numerologyCalc.ts:3-26), a package with no named school (cf. 08:5, 03:14) | **SILENT**. There are now two live calc engines. The old one **is imported**: `lib/agents/execution.ts:8` (calcAuthority string :109, :231) and `agent/subagents/numerology/agent.ts:3`. Numeric divergence between the two engines: **UNKNOWN** (not run) | ADV-NUM-001 |

---

## Must-fix (blockers)

| ID | Finding | Evidence | Required fix |
|---|---|---|---|
| MF-NUM-001 | Implemented against a lock that says not to implement yet | 00_README:6,53 "LOCK PENDING CoS clearance… Do not begin implementation"; RUNTIME_PACK.md:5,166,174 | Produce a CoS clearance artifact, or hold the patch. B found no clearance record (**UNKNOWN** whether CoS cleared it out of band) |
| MF-NUM-002 | Orphan rules: emitted factors with no lock mechanic. sourceRefs say only "Decoz", with no chapter or page | Pinnacles/challenges calc.ts:59-70; PY/PM/UY calc.ts:72-75; Maturity calc.ts:52, contributions.ts:41; 02 contains only M1–M9 | Add M10+ mechanics with SOURCE→RULE to SOURCE_LOCK (CoS-approved), or stop emitting these factors |
| MF-NUM-003 | Layer D not flagged. Wound/shadow is SEEN packaging (00:16, 07:3,7,15), but every row sets `seenDerived:false` and `provenance.layer:'B'`. Typing all core numbers as "shadow" and challenges/debts as "wound" is an uncited SEEN mapping | contributions.ts:30 (`seenDerived: false`), :45,49,51,59,61,66 | Set `seenDerived:true` on the signalType assignment (or split the calc row from the D-label), and cite 07_SEEN_LAYER_D |
| MF-NUM-004 | Karmic debt scope includes Personality, which M8 doesn't cover | 02:60 vs contributions.ts:48 | Restrict to LP/Expression/SoulUrge/Birthday, or get the lock amended |
| MF-NUM-005 | Diacritics silently dropped, which corrupts numbers and hides debts. `JOSÉ` → 8 instead of 13/4 | calc.ts:37 `replace(/[^A-Z]/g,'')`; 06:11 U4 unresolved | Fail closed or emit `missing[]` "MISSING: non-ASCII orthography (U4)" and suppress affected name numbers. Never drop silently |
| MF-NUM-006 | Y/W rule contradicts M6. W isn't flagged at all. Soul Urge/Personality are emitted as authoritative values even when the name contains Y/W | 02:47; calc.ts:9; contributions.ts:24,37-38 | Implement the Goodwin conditional, or withhold SU/Pers (MISSING) only when the name contains Y or W |
| MF-NUM-007 | Personal year/month keep 11/22 against t514's "1-9 cycle" | t514:135,146; calc.ts:74-75; test:35 asserts 11 | Reduce PY/PM to 1–9, or get a CONFLICTS.md entry plus a CoS ruling |
| MF-NUM-008 | Citation drift: the header cites titles the lock doesn't list | calc.ts:2 "The Numerology Workbook"/"Meaning of Numbers" vs 03:5 "Numerology: The Complete Guide Vol. 1" | Cite exactly the locked titles; no unlisted sources |

## Advisory

| ID | Finding | Evidence |
|---|---|---|
| ADV-NUM-001 | Duplicate engine. `lib/numerologyCalc.ts` (sochumenh) is still the calc authority for agents (execution.ts:8,109,231; agent/subagents/numerology/agent.ts:3). The new module is imported by nothing except its test. Divergence between the two is UNKNOWN. CoS should pick one and retire the other | rg results |
| ADV-NUM-002 | M7 footnote `personalityAlsoKnownAs: "Secret Self (Goodwin)"` missing | 02:55; 05:6 D2 |
| ADV-NUM-003 | `has33` checks only the total's compounds. A 33 reached inside a name part or LP component isn't flagged. Part-level masters (V1 note "ANN carried master 11", 04:37) aren't surfaced | calc.ts:55; contributions.ts:43-56 |
| ADV-NUM-004 | No date validation (2000-02-31 is accepted). Leap day 02-29 computes correctly | calc.ts:30-34 |
| ADV-NUM-005 | Hyphenated names count as one part ("MARY-ANN" = 32/5). The lock is silent on hyphen splitting | calc.ts:44 |
| ADV-NUM-006 | Pinnacle/challenge `reducedFrom` is `String(number)`, so the compound is lost. P4/C4 `endAge:null` vs t514 `endAge: number` (t514:163,173) | contributions.ts:60,62 |
| ADV-NUM-007 | Shape drift vs t514 (no gift/amplification/portalModification) is intentional per the CoS-locked shape. Field set matches the CoS 11 fields exactly (test:41). No prose, gift, or score found. `portalId` is always null. Accepted | contributions.ts:7-19 |
| ADV-NUM-008 | Chaldean: not implemented, every row is tagged `pythagorean`. **No silent merge found** | contributions.ts:30 |
| ADV-NUM-009 | Dead code calc.ts:22 (`/* noop */`); odd ternary calc.ts:31 | — |
| ADV-NUM-010 | Year intermediate 19 (e.g. 1990→19→10) isn't flagged. That's consistent with U3 (06:10) staying open | probe |

## What would flip this to PASS_WITH_DEFECTS
MF-NUM-002 to MF-NUM-008 closed in code or by a lock amendment, with a CoS clearance artifact for MF-NUM-001 and regression tests for JOSÉ, a Y/W name, and personal-cycle 1–9.

## Deliverable path
`/workspace/seen-numerology/AUDIT/B_01_RUNTIME_BUILD_v0.1.md`
