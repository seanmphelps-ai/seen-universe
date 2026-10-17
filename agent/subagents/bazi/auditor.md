# Independent BaZi Auditor

Agent B for BaZi (Four Pillars, Ziping). Independently reconstruct the pillars, luck pillars and relations from the locked sources before reviewing the reader's output. Check the source, calculation trace, school convention, uncertainty and Layer A/B/C/D separation. Report pass, fail, corrections and unresolved items. Never rubber-stamp. Verdicts go to Chief of Staff (CoS).

Authority: the BaZi source lock (`/workspace/seen-bazi/SOURCE_LOCK/`: MODULE_SOURCE_MANIFEST, MECHANICS_MANIFEST, CALCULATION_AUTHORITY, VALIDATION_MATRIX, DISAGREEMENT_REGISTER, UNRESOLVED_REGISTER). Not cleared by CoS: the lock's implementation gate still reads "not started."

## Bazi Auditor derivation logic and verification status (2026-10-16)

Recorded by the Bazi Auditor (Agent B). Statuses: VERIFIED = independently reproduced; DEFECT = reproduced and wrong; UNVERIFIED = not independently checked.

### Calculation stack (Layer B mechanics)
| Step | Rule | Status |
|---|---|---|
| R1 Normalize instant | Civil time → UTC with DST removed via IANA tzdb. If true-solar is on: + 4 min × (lon − zone meridian) + equation of time. Record civil and apparent times. | **DEFECT D1**: the hour is taken from the raw wall clock (baziCalc.ts:148), so DST isn't stripped and there's no lon/EoT step. |
| R2 Year pillar | Ganzhi year with 立春 (Sun λ 315°) ≤ instant < next 立春. Never Lunar New Year. Evaluated on the absolute instant (UTC+8 labelling is cosmetic). | **VERIFIED**: Li Chun 1990 = 02-04 10:14 UTC+8 matches HKO. Engine source is a D2 issue. |
| R3 Month pillar | Branch from the 12-jie interval. Stem by 五虎遁 (甲己→丙, 乙庚→戊, 丙辛→庚, 丁壬→壬, 戊癸→甲). | **VERIFIED** on the test charts. Engine source is a D2 issue. |
| R4 Day pillar | index = (JDN + 49) mod 60; stem = idx mod 10, branch = idx mod 12. Local civil date. | **VERIFIED** on 1990-02-04 庚子, 1984-06-15 庚辰, 1985-07-04 甲辰, 1985-01-04 癸卯. |
| R5 Hour pillar | 2-hour shichen from 23:00 on local standard (or apparent) time. Stem by 五鼠遁 (甲己→甲子, 乙庚→丙子, 丙辛→戊子, 丁壬→庚子, 戊癸→壬子). The 23:00–00:00 day policy must be declared. | **DEFECT D1, D4**: LA 1985-07-04 15:30 PDT gives 申 (should be 未). Late-子 (sect 2) is undeclared. |
| R6 Hidden stems 藏干 | Table lookup. | **UNVERIFIED**: the table edition isn't pinned in the lock. |
| R7 Ten Gods | Element and polarity vs the Day Master: 比劫 / 食伤 / 财 / 官杀 / 印. Same polarity = 比肩 / 食神 / 偏财 / 七杀 / 偏印. | **VERIFIED** (`tenGod()`, all cases). |
| R8 Relations | Classical 六冲 / 六害 / 六破 / 六合 (as resolvers), 寅巳申 / 丑戌未 / 子卯 punishments, self-punishment 辰午酉亥, 天克地冲. Month-command and day-branch clashes are flagged. | **VERIFIED** against the classical tables. |
| R9 七杀 restraint (Zhen Quan) | Give a true/false verdict only if 食神 or 印 is revealed or rooted in the month command; otherwise MISSING. Flag 官杀混杂. The Di Tian Sui path = MISSING. | **DEFECT D5**: any visible or hidden 食神/印 counts, unweighted (relations.ts ~308). |
| R10 Luck direction | Yang-year male / yin-year female go forward; yin-year male / yang-year female go reverse. | **VERIFIED** for yin-male, yang-male and yang-female. Yin-female has no fixture yet. |
| R11 Luck start age | Days to the adjacent jie ÷ 3 = years. | **VERIFIED** against a hand count (1990 pair: 9y10m). The HKO comparison is **UNVERIFIED**. Citation **DEFECT D6** (miscited to 子平真诠; the rule is from the 渊海子平/三命通会 tradition). |
| R12 Provenance log | Log the ephemeris version, HKO table year, EoT method, day-epoch formula, true-solar flag, zi policy and `year_boundary=li_chun`. | **DEFECT D2**: missing. |
| R13 Contributions | CoS locked shape; portalId null; dark markers only; Layer D tagged `seenDerived`. | Shape **VERIFIED**. sourceRefs have no chapter references: **DEFECT D7**. |

### Layers
A = raw data; B = calculated mechanics; C = traditional interpretation with citation; D = SEEN-derived. Wound and sabotage framing is allowed only in Layer D. Blood Dragon / blood-type items are tagged Layer D, and Di Tian Sui is marked MISSING (both checked).

### School disagreements (accepted, must be logged)
- 午未 combination element omitted; it's used only to resolve clashes.
- Punishment fires on 2 of 3 branches with a `complete` flag; 子卯 is complete as a pair.

### Audit history
| Build | Verdict | Blocking | Notes |
|---|---|---|---|
| 7412982f (2026-10-12) | **DEFECTS** | 2 | Blockers: D1 (DST / true solar time), D2 (lock gate not cleared, lunar-javascript in place of Swiss Ephemeris + HKO cross-check, no provenance log). Majors: D3 (24 tests claimed, 19 run), D4 (undeclared 子-hour policy), D5 (permissive 七杀 check). Minors: D6, D7. |

### Status
**NOT VALIDATED.** No CoS clearance. Open: D1 and D2 (blockers), D3, D4 and D5 (majors), D6 and D7 (minors). Independently verified so far: the relation tables, Ten Gods, day pillars, Li Chun 1990 against HKO, luck direction (3 of 4 polarity × sex cases) and luck start age against a hand count. Re-audit is required after D1 to D5 are fixed. Required fixtures: DST, 23:00 子-hour, western longitude, yin-year female.
