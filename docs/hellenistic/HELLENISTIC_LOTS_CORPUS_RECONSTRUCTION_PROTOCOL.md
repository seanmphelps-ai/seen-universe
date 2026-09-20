# Hellenistic Lots / Kleroi — Exhaustive Corpus Reconstruction Protocol

**Status:** Research/evidence gate. Not production implementation.

## Objective
Reconstruct every Lot attested anywhere in the locked Hellenistic source corpus.

Do not assume how many Lots exist, which are important, that the Seven Hermetic Lots are complete, that identically named Lots use identical formulas, that different authors share one formula tradition, or that a modern English name uniquely identifies an ancient Lot.

The Seven Hermetic Lots are a required subset, not the inventory boundary.

### Required known-coverage check
Fortune; Spirit/Daimon; Eros; Necessity; Courage; Victory; Nemesis.

Their presence does not establish completeness. Every additional Lot encountered in the locked corpus must be added.

## Locked corpus to traverse
Search each source independently and preserve author/witness identity.

1. Vettius Valens — Anthologies. Greek control: Pingree 1986. Translation control: Riley 2022. Earlier textual control: Kroll 1908.
2. Dorotheus — Carmen Astrologicum. Pingree 1976. Treat Arabic transmission, surviving Greek fragments, and Latin fragments separately; preserve transmission path.
3. Ptolemy — Tetrabiblos. Robbins Loeb Greek/English 1940. Record only what Ptolemy actually attests.
4. Firmicus Maternus — Mathesis. Critical Latin: Kroll/Skutsch/Ziegler. English control: Bram 1975.
5. Paulus Alexandrinus — Eisagogika. Boer 1958 Greek; Greenbaum 2001 English control.
6. Commentary on Paulus. Keep commentator attribution unresolved until source lock resolves it.
7. Hephaestion — Apotelesmatica. Pingree 1973–1974 Greek.
8. Rhetorius — Compendium Astrologicum. Pingree/Heilen 2015 Greek; Holden 2009 English control. Preserve later-witness status and explicit earlier attributions.
9. Anonymous of 379. Provisional until exact Greek base/CCAG location and variants are pinned.
10. Pseudo-Porphyry. Preserve disputed authorship; store PSEUDO_PORPHYRY separately from traditional attribution.
11. Fragmentary authorities: Antiochus; Nechepso/Petosiris; Critodemus; Teucer; Serapio. Identify transmitting witness, edition, quotation/paraphrase status, and attribution certainty.

A bibliographically known source without passage-level access is an ACCESS GAP, not completed coverage.

## PASS 1 — Sequential corpus reading
Traverse every accessible primary text BOOK → CHAPTER → SECTION → PASSAGE before relying on a known-Lot search list.

Capture every passage containing:
1. explicitly named Lot/kleros;
2. mathematical construction projected from a horoscope point;
3. rule explicitly identified as a Lot;
4. unnamed calculated point functioning as a Lot;
5. alternate Lot name;
6. formula without delineation;
7. delineation without repeated formula;
8. reference to another author's Lot;
9. quotation/paraphrase concerning a Lot;
10. derived place counted from a Lot;
11. ruler/lord/dispositor of a Lot;
12. testimony/aspect/configuration involving a Lot;
13. timing derived from a Lot;
14. zodiacal releasing or another releasing procedure explicitly performed from a Lot;
15. sect-dependent alteration;
16. formula reversal;
17. competing formula;
18. textual corruption or ambiguous mathematical instruction.

Capture first; judge importance later.

## PASS 2 — Lexical search
After sequential extraction search original-language terminology, transliterations, translations, synonyms, and grammatical variants.

Minimum seeds:
κλῆρος; κλῆροι; kleros; klēros; lot; lots; part; parts;
Τύχη / tychē / fortune;
Δαίμων / daimōn / daemon / spirit;
Ἔρως / erōs / eros / love / desire;
Ἀνάγκη / anankē / necessity;
Τόλμα / tolma / courage / boldness;
Νίκη / nikē / victory;
Νέμεσις / nemesis.

Add every new term, synonym, spelling, grammatical form, and Lot name discovered in Pass 1 to the dictionary and rerun. Discovery expands its own vocabulary.

## PASS 3 — Formula-pattern discovery
Search independently for Lot-like mathematical operations even when a translator does not use "Lot": distance/arc between A and B projected from C; A→B from Ascendant; B→A from Ascendant; analogous constructions using Sun, Moon, Ascendant, Fortune, Spirit, planets, rulers, angles, signs, other Lots, or other horoscope points.

FLAG rather than automatically classify uncertain constructions.

## PASS 4 — Index/apparatus discovery
Search critical-edition indices, translation indices, TOCs, editorial notes, footnotes, critical apparatus, glossaries, and manuscript notes. Every discovery must return to the primary passage. Secondary material is a discovery aid, not implementation evidence.

## PASS 5 — Author inventories
Produce independently:
VALENS_LOTS[]
DOROTHEUS_LOTS[]
PTOLEMY_LOTS[]
FIRMICUS_LOTS[]
PAULUS_LOTS[]
COMMENTARY_ON_PAULUS_LOTS[]
HEPHAESTION_LOTS[]
RHETORIUS_LOTS[]
PSEUDO_PORPHYRY_LOTS[]
ANONYMOUS_379_LOTS[]
FRAGMENTARY_AUTHORITY_LOTS[]

Do not merge them.

## PASS 6 — Lot-centric inventory
Invert the evidence for every discovered Lot so both AUTHOR→LOT and LOT→AUTHOR exist and reconcile.

## PASS 7 — Documentary evidence
Search ancient documentary horoscopes and papyri independently from literary manuals. Scholarly controls include Neugebauer & Van Hoesen, Greek Horoscopes (1959), Alexander Jones, Astronomical Papyri from Oxyrhynchus (1999), and additional documentary witnesses found through verified scholarship.

Keep LITERARY_ATTESTATION and DOCUMENTARY_ATTESTATION separate.

For documentary witnesses record document identifier, date, provenance if known, edition/publication, relevant passage/data, calculated Lots, reconstruction method, uncertainty, and relationship to literary traditions.

## PASS 8 — Formula identity
A Lot name is not a formula ID. Preserve lotConceptId, formulaTraditionId, and authorFormulaId separately.

For Eros and every divergent Lot, never select a global formula. Establish WHO used WHICH formula, in WHICH witness, under WHICH conditions.

## PASS 9 — Formula normalization
Preserve both SOURCE EXPRESSION and NORMALIZED COMPUTATIONAL EXPRESSION. Never store only normalization. It must trace back to source instruction.

Determine explicitly: day formula; night formula; whether reversal exists; whether explicit or inferred; starting point; ending point; projection point; counting/zodiacal direction; longitude convention; 360° normalization; boundary behavior; required astronomical inputs; dependencies on other Lots/rulers.

If evidence does not establish a field: UNKNOWN.

## PASS 10 — Delineation
For each Lot extract only where attested: signification; ruler/lord signification; sign; house/place; condition; ruler condition; angularity; benefic/malefic testimony; aspects/configurations; derived places; relationships with Fortune/Spirit/other Lots; topical uses; timing uses; actual authorial delineation sequence; worked examples.

Do not manufacture a universal delineation algorithm from different authors.

## PASS 11 — Timing
Treat CALCULATION, DELINEATION, and TIMING as separate mechanics.

For every timing use record source Lot, technique, starting condition, period sequence, level structure, peak/bond-loosing/transition rules where attested, author/witness, passage, worked example, uncertainty.

Modern extensions must be labeled MODERN and excluded from ancient canon.

## PASS 12 — Evidence record
For every discovered Lot record at minimum:
canonicalId; ancientNames[]; transliterations[]; translatedNames[]; attributedAuthor; transmittingWitness; sourcePassages[];
formula { dayFormula; nightFormula; reversalExplicit; reversalInferred; formulaSource };
calculation { startingPoint; endingPoint; projectedFrom; zodiacalDirection; normalizationRule; degreeResult };
sectRequirements; rulerProcedure; derivedHouseProcedure; aspectOrTestimonyProcedure; delineationProcedure; timingUses[]; topicalUses[]; authorVariants[]; conflictingFormulas[]; transmissionProblems[]; textualVariants[]; uncertainties[]; provenance[]; validationCases[].

No field may be filled from model memory. Unsupported fields = UNKNOWN.

## PASS 13 — Reproducible validation
Every implemented formula requires:
A ordinary day chart;
B ordinary night chart;
C wrap across 0° Aries;
D exact sign boundary;
E source worked example when available;
F independently calculated reference result.

Record inputs, expected intermediate arc, expected projection, normalized longitude, sign, degree, and source supporting expected result.

Without reproducible validation: NOT IMPLEMENTATION_READY.

## PASS 14 — Conflict preservation
Never resolve historical disagreement by majority vote.

Persist mechanic; witness A; witness B; competing formulas/procedures; textual evidence; chronology; transmission relationship if known; scholarly discussion; resolution status.

DISTINCT_AUTHOR_TRADITIONS is a valid resolution. Multiple historically correct implementations may be required.

## PASS 15 — Eros mandatory deep extraction
Eros is first-class.

Search every locked source for Eros / Erōs / Ἔρως / Love / Desire plus contextual Lot terminology. Verify that each occurrence actually refers to a calculated Lot.

Do not substitute modern relationship astrology, generic Venus interpretation, compatibility interpretation, or unsourced modern formulas.

Do not assume a universal Eros formula. Record every attested Eros formula, reversal rule, delineation, ruler procedure, derived-place use, timing use, variant, and conflict independently before comparing traditions.

## PASS 16 — Independent completeness audit
The auditor receives the LOCKED SOURCE CORPUS but not the extractor's final Lot list initially.

The auditor independently reconstructs all Lots, passages, formulas, variants, delineation procedures, timing uses, and documentary witnesses. Then compare EXTRACTOR INVENTORY vs AUDITOR INVENTORY. Every mismatch returns to source.

Persist for each finding: auditFindingId; evidence; resolution = CORRECT | REBUT | OPEN; canonChange; correction history; auditor verification status.

Do not self-certify extractor work as independent audit.

## PASS 17 — Negative coverage audit
For every locked author/witness record:
FOUND
NOT_FOUND_AFTER_FULL_SEARCH
SOURCE_INCOMPLETE
ACCESS_BLOCKED
TEXT_CORRUPT
UNCERTAIN

Silence is not evidence of absence.

## Completion gate
LOTS_DISCOVERY_COMPLETE = TRUE only when:
- every accessible locked source traversed;
- lexical search complete;
- formula-pattern search complete;
- indices/apparatus checked;
- author inventories complete;
- Lot inventories complete;
- documentary evidence checked;
- formula traditions separated;
- delineation extracted;
- timing uses extracted;
- validation cases complete;
- conflicts preserved;
- negative coverage recorded;
- independent audit complete;
- all discrepancies resolved or explicitly OPEN.

If any condition fails:
LOTS_DISCOVERY_COMPLETE = FALSE.
NO PRODUCTION IMPLEMENTATION.

## Required outputs
Persist:
HELLENISTIC_LOTS_SOURCE_MAP
HELLENISTIC_LOTS_INVENTORY
HELLENISTIC_LOTS_VARIANTS
HELLENISTIC_LOTS_CONFLICTS
HELLENISTIC_LOTS_VALIDATION_CASES
HELLENISTIC_LOTS_OPEN_QUESTIONS
HELLENISTIC_LOTS_CORRECTION_HISTORY
HELLENISTIC_LOTS_AUDIT_REPORT

Only after source/inventory audit may exact implementation schemas be designed. Only after schema audit may production calculation code be written.

## Scope boundary
This protocol covers Lots/kleroi only. It does not certify complete Hellenistic astrology. Every other Hellenistic technique family requires its own exhaustive source-discovery and independent-audit protocol before the Hellenistic module can be considered complete.
