// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
## Dispatch directive

**Mission:** Build one source-verified Jyotiṣa module at a time. First artifact: import and audit existing Vedic bot source shelf, then version source lock. Discover complete mechanics and inputs from admitted sources. Nakṣatras and daśās are explicit priority; “etc.” means independently discover associated calculations, vargas, graha/bhāva/rāśi, dṛṣṭi, yogas, strength/condition, kārakas, timing and delineation dependencies **when the scoped source supports them**. Preserve Parāśarī, Varāhamihira and Jaimini as separate school packets; later Tājika has its own historical identity.

Success: independent specialist can trace and reproduce any admitted result backward:

```text
VEDIC MODULE OUTPUT → ATOMIC TESTIMONY → SOURCE-BASED INTERPRETATION
→ NAMED TECHNIQUE/RULE → COMPUTED STATE → EXACT INPUT/CONVENTION
→ EDITION + VERSE/INCIPIT + PRIMARY WITNESS
```

Keep layers separate: observed birth input; modern astronomical computation; school-specific derived mechanics; attributed textual rule; within-school synthesis. Exchange validators may be built now; production interpretive calculations wait for source/canon audit.

## Agent A — builder. Copy as job prompt

```text
You are SEEN_JYOTISHA_BUILDER. Work only on assigned bounded artifact and school.
Read 01_SOURCE_LOCK_CANDIDATES.md, existing Vedic bot SOURCE_SHELVES and persistent
module memory first. Import actual shelf records and independently check their
edition, locator, rights and scope. Audit candidate sources; discover omissions.
Establish SOURCE_LOCK
before interpreting any passage. Declare author/work/recension/edition/translator,
original-language passage, verse/incipit, scanned page, rights and textual status.
Separate early Vedic nakshatra attestations from later natal nakshatra rules;
separate Varahamihira's dasha from Parashari Vimshottari and Jaimini rashi dashas.
For each rule, record preconditions, formula, alternatives, conflicts, input needs,
source-specific meaning, calculation trace, negative cases and uncertainty.
Return atomic records plus source citations and an OPEN_QUESTIONS list.
Propose schema changes only after evidence establishes a missing field.
Hand to independent Agent B.
```

## Agent B — adversarial reconstructor. Copy as job prompt

```text
You are SEEN_JYOTISHA_AUDITOR.
Agent A's inventory or conclusions. Independently reconstruct what the named
passages require. Search for missing nakshatra schemes, cusp/Abhijit variants,
pada rules, dasha families/eligibility, birth balance, subperiod order, year
length, interpretive conditions, commentarial differences and historical
misattribution. Cite edition + verse/incipit + page for every finding.
Only after reconstruction, inspect Agent A artifact and diff item by item.
Classify MISSING / INCORRECT / UNSUPPORTED / SOURCE_CONFLICT /
FORMULA_CONFLICT / INSUFFICIENT_INPUT / MISSING_PROVENANCE /
AMBIGUOUS_TERM / HISTORICAL_MISCLASSIFICATION / UNVALIDATED_IMPLEMENTATION.
Build at least one independent worked calculation and adversarial boundary case.
Return defect register, exact correction evidence and unresolved disputes.
Recheck corrections and regression fixtures after Agent A reconciliation.
```

Agent A handles each finding by evidence-backed correction or explicit rebuttal; Agent B verifies. Blocking defects remain open. `BUILD → ATTACK → CORRECT → VERIFY → REGRESSION → VERSION → LOCK` repeats for each subsystem, then for integration. Reflexion `/reflect` checks omissions after each artifact; `/memorize` records **only Agent B-verified corrections**, in module memory.

## Ordered work queue and deliverables

| Job | Bounded output | Admission test |
|---|---|---|
| 03 | `INPUT_REQUIREMENTS`: date/place/time certainty, historical zone, ephemeris, source convention, uncertainty and authority | Every calculation declares required input; impossible calculations stop. |
| 04 | `ASTRONOMICAL_SUBSTRATE`: geocentric/topocentric Moon choice, reference ecliptic, ayanāṃśa, nodes, UTC/timescale, versions | Raw longitude independently verified before any division or daśā. |
| 07 | `CHART_RULE_PACKETS`: only attested graha, rāśi, bhāva, varga, yoga, condition, dṛṣṭi, strength, kāraka, topical procedures | Conditions/conflicts and source-specific precedence explicit; incomplete stays research only. |
| 09 | `VALIDATION_MATRIX` and `CORRECTION_LEDGER`: independent audit and regression suite | Zero blocking defects; production claims reproducible by Agent B. |

First execution is **Job 01: import and audit actual Vedic shelf**. If that source lock already passes the independent gate, continue directly to Jobs 02–09 in bounded school-specific slices, separately auditing nakṣatra and daśā subsystems. Scope completion to source, school, edition and techniques actually audited.

## Native intake contract (stable rails; internal schema evolves after discovery)

```text
jobId; artifactId; moduleVersion; schoolId; techniqueScope;
sourceLockVersion; namedEditionIds[]; birthDate/calendar;
birthPlace/coordinatePrecision; localBirthTime/timeCertainty/timeSource;
historicalTimeZone/version; UTCConversion/uncertaintyInterval;
ephemeris/version/files/flags/timescale; lunarReferenceFrame;
ayanamshaMode/definition/epoch/numericValue; nodePolicy;
nakshatraScheme(27|28|other, sourceRef); boundaryPolicy;
dashaFamilyId/sourceRef; yearLengthPolicy; roundingPolicy;
interpretiveRulePacketId; consent; inputFingerprint
```

Keep astronomical birth location separate from SEEN's independent Incubator/exposure Location lane. Ayanāṃśa choice and Moon coordinate choice can shift nakṣatra/pāda boundaries. “Lahiri” alone is insufficient definition: pin implementation/version and value at instant.

## Atomic exchange record — Required exchange fields

```json
{
  "artifactVersion": "0.1.0",
  "schoolId": "jyotisha_parashari_named_edition",
  "sourceLockVersion": "candidate-unlocked",
  "recordId": "stable-id",
  "layer": "computed_state | derived_mechanic | textual_rule | interpretation | testimony",
  "source": { "workId": "...", "editionId": "...", "verseOrIncipit": "...", "scanPage": "...", "readingStatus": "verified | disputed | unread" },
  "ruleId": "calculation-rule-id or interpretation-rule-id, by layer",
  "dependencyRuleIds": ["source-bound upstream rule IDs"],
  "inputRefs": ["..."],
  "calculationTraceRefs": ["..."],
  "result": "typed value with units or explicit silence",
  "sourceMeaningRefs": ["..."],
  "contradictionRefs": ["..."],
  "dependencyFamilyIds": ["shared astronomical sky", "named textual tradition"],
  "uncertainty": ["..."],
  "status": "research | verified | conflict | insufficient | rejected"
}
```

Schemas use Zod + inferred TypeScript types when application implementation starts; parse at intake, adapter, persistence read, Generator, Oracle and render boundaries, aligned with repo contracts.

**Exchange implementation now present:** `lib/seen/jyotishaExchange.ts` validates source lock, intake, rule, calculation, testimony, audit and correction records. `lib/seen/jyotishaDomainContracts.ts` defines source-specific nakṣatra schemes, conditional nakṣatra results, daśā families and periods, and independent validation cases. `lib/seen/jyotishaDomainRuntime.ts` checks school, source, edition, input, registry and period links.

## Nakṣatra attack list

- Find every source-specific occurrence: early named asterisms, 27/28 lists, Abhijit position, equal sectors, nakṣatra and pāda, lords/deities/symbols, timing use and natal delineation; record where each *actually* appears.
- Preserve transliteration, original term, verse, translation alternatives, cross-edition numbering, missing/uncertain readings and commentary additions.
- Compute sidereal lunar longitude with declared frame; test cusp minus epsilon, exact cusp and plus epsilon, 0°/360°, pāda cusps, and two ayanāṃśa definitions. Propagate birth-time interval through each boundary.

## Daśā attack list

- Inventory **families** first, then each source's applicability trigger.
- Record source-specific starting condition, Moon/nakṣatra or sign basis, period lords, order, duration, balance at birth, antardaśā/pratyantardaśā recursion, exceptions, year unit, calendar conversion, rounding/remainder and interpretive conditions.
- Test Moon just across nakṣatra boundary; initial period near zero/full balance; subperiod durations sum to parent; end-to-start continuity; timezone/DST historical cases; uncertain time straddling a boundary; same chart under competing ayanāṃśa or year lengths.
- Compare independent hand derivation, Swiss Ephemeris raw Moon, and a second published almanac/calculator using explicitly matched settings.

## Persistent module memory and correction gate

Maintain `SOURCE_LOCK`, `CANON`, `CORRECTION_LEDGER`, `OPEN_QUESTIONS`, `VALIDATION_CASES` as versioned artifacts. Each verified correction appends: previous rule, observed failure, primary passage, edition/translator conflict, corrected rule, affected artifacts, new fixture, builder, independent validator, version and supersession. A reappearance of corrected error blocks lock. Unresolved historical disputes stay source-specific and open; one chosen production school may proceed only within its explicitly audited subset.

## Concrete stop and handoff

Inspect it before assigning new research. Screenshot indicates BPHS (Santhanam), *Light on Life*, *Phaladīpikā*, and a calendar committee/IMD standard; confirm actual edition, passage coverage and roles. Production Jyotiṣa output requires corresponding source, calculation and testimony artifacts to clear audit.

---

## Production Jyotiṣa reading execution and delivery contract

The Jyotiṣa module is complete only when verified school-specific canon can execute real birth data through a delivered Jyotiṣa reading.

After the relevant Jobs 01–09 clear audit, execute:

```text
BIRTH INTAKE
→ INPUT VALIDATION
→ ASTRONOMICAL SUBSTRATE
→ SCHOOL-SPECIFIC CHART COMPUTATION
→ NAKṢATRA/PĀDA STATE
→ APPLICABLE DAŚĀ STATE
→ VERIFIED CHART RULE PACKETS
→ ATOMIC TESTIMONIES
→ WITHIN-SCHOOL SYNTHESIS
→ JYOTIṢA READING
→ DELIVERY
```

### Mandatory reading execution

For the selected audited school/source packet, run every production-eligible verified mechanic whose required inputs and applicability conditions are satisfied.

The reading must actually compute and use, when verified and applicable:
- the native's nakṣatra by name (for example Aśleṣā when the verified calculation places the Moon there), its pāda, source-specific ruler/deity/symbol or other attributes only where admitted by the locked source;
- the applicable daśā family, current mahādaśā/antardaśā/pratyantardaśā or other source-attested levels, birth balance, transitions, and timing where the chosen school supports them;
- graha and rāśi states;
- lagna and bhāva states when birth-time certainty permits;
- source-attested vargas;
- dṛṣṭi;
- yogas;
- planetary strength/condition;
- kārakas;
- topical procedures;
- timing/predictive procedures;
- every additional verified mechanic discovered for that school/source packet.

The locked technique inventory determines the complete runnable set.

Cross-school comparison, if requested, remains explicitly separated by school and provenance.

A mechanic that lacks sufficient input, has unresolved blocking conflict, or remains research-only is NOT_RUN with an explicit reason.

### Production reading intake

Use the Native intake contract above. A reading request must resolve the required birth inputs, source-lock version, school packet, astronomical conventions, ayanāṃśa implementation/version/value, node policy, nakṣatra scheme, daśā family applicability, year-length policy, and rule packet IDs before dependent calculations run.

Unknown birth time propagates uncertainty.

### Production reading output

The delivered reading must contain:
1. reproducible computed chart state and convention/version references;
2. named nakṣatra and pāda result when determinable;
3. applicable daśā timeline/state when determinable and source-authorized;
4. all applicable verified chart-rule results for the selected school;
5. atomic testimonies linked to calculation trace and primary-source rule;
6. school-specific synthesis that preserves contradictions and conditional rules;
7. timing/predictive findings when requested and verified;
8. explicit uncertainty and NOT_RUN mechanics;
9. a final human-readable Jyotiṣa reading generated from the verified testimony set.

Machine-readable provenance remains attached behind each claim.

### Handoff and delivery protocol

```text
SOURCE_LOCK
→ VERIFIED SCHOOL CANON
→ PRODUCTION SCHEMA
→ BIRTH INTAKE
→ CALCULATION RUNNER
→ NAKṢATRA/DAŚĀ + CHART RULE EXECUTION
→ TESTIMONY GENERATOR
→ WITHIN-SCHOOL SYNTHESIS
→ READING RENDERER
→ DELIVERY
```

Every handoff carries: module version; source-lock version; school ID; input fingerprint; convention/version IDs; calculation trace IDs; rule/testimony IDs; uncertainty state; audit status; and NOT_RUN reasons.

Once an artifact clears its gate, dispatch the next required job automatically. Once all dependencies for a production reading are locked, dispatch the end-to-end reading fixture and delivery test.

### End-to-end completion gate

DONE requires at least one independently reproducible fixture:

```text
KNOWN BIRTH INPUT
→ VERIFIED ASTRONOMICAL STATE
→ NAMED NAKṢATRA/PĀDA
→ APPLICABLE DAŚĀ STATE
→ VERIFIED SCHOOL-SPECIFIC CHART MECHANICS
→ ATOMIC TESTIMONIES
→ SYNTHESIZED JYOTIṢA READING
→ RENDERED DELIVERY
```

Agent B independently reproduces the calculation and audits the final rendered reading claim-by-claim against the locked source packet. Any unsupported, omitted applicable, miscalculated, cross-school, or untraceable claim blocks delivery and returns to correction/regression/version/lock.
