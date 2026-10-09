// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
## MISSION

Build a production-grade Hellenistic astrology knowledge and calculation module for SEEN that can withstand independent historical, astrological, mathematical, and engineering audit.

It contains architectural decisions, hypotheses, corrections, candidate schemas, discovered omissions, and unresolved questions.

Extract those distinctions before building.

The historical source corpus determines the domain.

---

# DEFINITION OF SUCCESS

The completed module must allow a qualified independent reviewer to trace any production output backward:

OUTPUT\
→ TESTIMONY\
→ DELINEATION RULE\
→ TECHNIQUE\
→ CONDITION\
→ CALCULATION\
→ INPUT\
→ PRIMARY SOURCE

And reproduce the result independently.

---

# NON-NEGOTIABLE ARCHITECTURE

Preserve these layers independently:

1. OBSERVED INPUT
2. ASTRONOMICAL CALCULATION
3. HELLENISTIC DERIVED MECHANIC
4. SOURCE-BASED DELINEATION
5. MODULE SYNTHESIS
6. SEEN-DERIVED CONVERGENCE

---

# SOURCE LOCK

Establish the authoritative corpus before defining the final system.

Separate:

PRIMARY HISTORICAL SOURCES

SCHOLARLY / CRITICAL SOURCES

ASTRONOMICAL / CALCULATION AUTHORITIES

INDEPENDENT VERIFICATION SOURCES

Every production rule must retain exact provenance.

---

# DISCOVERY RULE

It is a candidate inventory.

Reconstruct the Hellenistic system independently from the locked corpus.

Actively search for:

missing techniques

missing conditions

missing lots

source-specific formula variants

terminological differences

day/night differences

sect dependencies

planetary-condition rules

configuration rules

topical procedures

time-lord systems

predictive procedures

delineation dependencies

textual disputes

translation problems

historical transmission issues

later techniques incorrectly attributed to the Hellenistic period

modern reconstructions incorrectly presented as ancient

---

# MECHANICS CONTRACT

Every production mechanic must ultimately resolve to:

SOURCE\
→ INPUT\
→ CALCULATION OR RULE\
→ RESULT\
→ INTERPRETIVE AUTHORITY\
→ TESTIMONY

---

# PERSISTENT MODULE INTELLIGENCE

Maintain:

SOURCE_LOCK

CANON

CORRECTION_LEDGER

OPEN_QUESTIONS

VALIDATION_CASES

Verified corrections become binding module knowledge.

Every verified correction must identify:

previous rule

failure

evidence

corrected rule

affected artifacts

required regression test

validator

module version

A previously corrected failure that appears again is a regression and blocks completion.

---

# INDEPENDENT AUDIT

Use two logically independent roles.

## AGENT A — BUILDER

Researches and constructs each artifact from the locked corpus.

## AGENT B — ADVERSARIAL AUDITOR

Independently reconstructs the expected domain from the locked sources.

Compare the independent reconstruction against Agent A's artifact.

Report defects using explicit categories including:

MISSING

INCORRECT

UNSUPPORTED

SOURCE_CONFLICT

FORMULA_CONFLICT

INSUFFICIENT_INPUT

MISSING_PROVENANCE

AMBIGUOUS_TERM

HISTORICAL_MISCLASSIFICATION

UNVALIDATED_IMPLEMENTATION

Agent A must either correct each finding or rebut it with exact evidence.

Agent B then performs final verification.

Blocking failures prevent canon lock.

---

# RECURSIVE VALIDATION

For every major subsystem:

BUILD\
→ ATTACK\
→ CORRECT\
→ VERIFY\
→ REGRESSION TEST\
→ VERSION\
→ LOCK

Apply the same process recursively to complex subsystems such as Lots, planetary condition, configurations, topical analysis, and time-lord procedures.

---

# LOTS REQUIREMENT

Discover the inventory from authoritative sources.

Preserve:

author

work

original terminology

formula

day/night procedure

historical period

tradition

topical meaning

delineation procedure

ruler dependencies

source variants

textual uncertainty

provenance

Keep Hellenistic material historically distinct from later Persian/Arabic development while recording supported transmission relationships.

---

# GRAPH MODEL

Model the knowledge so relationships can be traversed.

At minimum support relationships among:

SOURCE\
AUTHOR\
TRADITION\
TECHNIQUE\
FORMULA\
RULE\
INPUT\
CALCULATED RESULT\
PLANET\
PLACE\
LOT\
RULER\
CONDITION\
CONFIGURATION\
TOPIC\
TESTIMONY\
TEMPORAL ACTIVATION\
OUTPUT

---

# IMPLEMENTATION RULE

Research determines the canonical mechanics.

Canonical mechanics determine the schema.

The validated schema determines implementation.

---

# WORK SEQUENCE

Build and validate it in bounded artifacts.

Begin with:

1. SOURCE MANIFEST / SOURCE LOCK

Then:

2. COMPLETE TECHNIQUE INVENTORY
3. INPUT REQUIREMENTS
4. ASTRONOMICAL CALCULATION REQUIREMENTS
5. CHART FRAMEWORK
6. SECT
7. PLANETARY CONDITION
8. CONFIGURATIONS / RECEPTIONS / BONIFICATION / MALTREATMENT
9. LOTS
10. TOPICAL ANALYSIS
11. TIME-LORD AND PREDICTIVE SYSTEMS
12. ADVANCED / SOURCE-SPECIFIC TECHNIQUES
13. TESTIMONY MODEL
14. FINAL OUTPUT SCHEMA
15. VALIDATION MATRIX
16. PRODUCTION SCHEMA

Complex sections may be decomposed further whenever independent validation requires it.

Complete and validate one bounded artifact before treating it as canon.

---

# FINAL PRINCIPLE

The purpose is to determine, preserve, calculate, and expose the most historically defensible Hellenistic system possible, with sufficient provenance and independent verification that SEEN can safely build upon it.

---

# PRODUCTION READING EXECUTION AND DELIVERY CONTRACT

The Hellenistic module is complete only when verified canon can execute a real chart from intake through a delivered Hellenistic reading.

After Jobs 01–16 clear their required audit gates, execute the production reading pipeline:

```text
BIRTH INTAKE
→ INPUT VALIDATION
→ ASTRONOMICAL CHART CALCULATION
→ VERIFIED HELLENISTIC DERIVED MECHANICS
→ SOURCE-SPECIFIC DELINEATION
→ ATOMIC TESTIMONIES
→ WITHIN-TRADITION SYNTHESIS
→ HELLENISTIC READING
→ DELIVERY
```

## Reading intake

The production runner must accept, at minimum: birth date and calendar; birth place and coordinate precision; local birth time, certainty, and source; historical time-zone conversion and uncertainty; ephemeris/version/calculation policy; and the locked Hellenistic tradition/source packet to execute.

Unknown or uncertain birth time must propagate uncertainty.

## Mandatory execution

For a reading, run every production-eligible verified mechanic whose required inputs and source/tradition conditions are satisfied. This includes, when verified and applicable: chart framework; sect; planetary condition; configurations; receptions; bonification/maltreatment; Lots; topical procedures; time-lord/predictive procedures; advanced/source-specific techniques; and any additional mechanics discovered and locked by the canon.

Record it as NOT_RUN with the reason.

## Reading output

The delivered Hellenistic reading must contain:
1. calculation/result trace sufficient to reproduce the chart state;
2. the applicable verified Hellenistic findings;
3. atomic testimonies with source/rule provenance;
4. source/tradition-specific interpretation;
6. temporal/predictive findings when requested and verified;
7. explicit uncertainty and NOT_RUN mechanics;
8. a final human-readable Hellenistic reading generated from the verified testimony set.

The Generator converts verified testimonies into coherent prose while retaining machine-readable provenance behind every claim.

## Handoff and delivery gate

```text
VERIFIED CANON
→ PRODUCTION SCHEMA
→ CALCULATION RUNNER
→ TESTIMONY GENERATOR
→ SYNTHESIS
→ READING RENDERER
→ DELIVERY
```

Each handoff passes versioned artifact IDs, input fingerprint, source-lock version, calculation trace references, testimony IDs, uncertainty state, and validation status.

Research-only mechanics remain excluded from production.

## Completion test

DONE requires at least one end-to-end regression fixture demonstrating:

```text
KNOWN BIRTH INPUT
→ REPRODUCIBLE CALCULATIONS
→ VERIFIED MECHANICS
→ VERIFIED TESTIMONIES
→ SYNTHESIZED READING
→ RENDERED DELIVERY
```

Failure returns to the responsible artifact; correction, regression, version, and lock repeat before delivery.
