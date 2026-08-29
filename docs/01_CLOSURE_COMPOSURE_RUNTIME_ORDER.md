# SEEN™ CLOSURE & COMPOSURE — CONTROLLING RUNTIME ORDER

## Repository Continuity and Source-of-Truth Rule

Build the complete production-grade SEEN™ Closure & Composure application within the active SEEN repository.

This specification is the controlling source of truth for:

- product scope;
- runtime order;
- data contracts;
- architecture;
- interaction flow;
- visual implementation;
- testing;
- commercial readiness;
- privacy;
- production acceptance.

Inspect the active repository and branch before implementation.

Evaluate existing code, schemas, assets, infrastructure, documentation, and completed application behavior against this specification.

Retain and extend existing work when it:

- conforms to this specification;
- supports the required production outcome;
- preserves the defined runtime boundaries;
- integrates cleanly with the required architecture;
- passes the required quality gates;
- reduces duplicated work;
- remains maintainable within the final application.

Existing work gains authority through alignment with this specification, rather than through age, location, naming, or prior completion status.

When prior implementation conflicts with this specification:

1. Treat this specification as authoritative.
2. Identify the affected files, contracts, routes, or runtime assumptions.
3. Determine whether the underlying work remains reusable.
4. Retain, revise, migrate, replace, or retire the affected implementation.
5. Preserve user data and working infrastructure where technically sound.
6. Record material architectural decisions in `BUILD_DECISIONS.md`.
7. Continue implementation through the next production acceptance gate.

Preserve working systems that already satisfy this specification.

Replace obsolete architecture, incomplete flows, temporary fixtures, weak contracts, duplicated canon, unsupported terminology, and incorrect runtime assumptions.

The final application may reuse valid prior work. Every retained element must serve the controlling specification and the complete Closure & Composure product outcome.

## Product Entry

```text
Splash
→ Ready
→ Experience Mode Selection
   ├── Single Person
   └── Multi-Person
```

`ExperienceModeIntakeSchema` records:

- `single_person`;
- `multi_person`;
- required person count;
- active person index;
- session progression state.

## Independent Person Law

Every person completes the individual runtime independently.

Relationship data enters only after Person A and Person B each hold a validated independent Generator output.

A relationship run references independent person states. It does not rewrite either baseline.

## Canonical Individual Runtime

```text
Environmental Intake
→ Place Resolution
→ Place-Period Temporalization
→ Baseline Environmental Pressure
→ Portal Pre-Charge
→ Birth Foundation Intake
→ Numerology
→ Swiss Ephemeris Candidate Runs
→ Western / Vedic / Hellenistic Interpretation
→ Maternal / Family Pressure
→ Childhood Formation Triangle
→ Attachment Evaluation
→ Wound Evaluation
→ Shadow Evaluation
→ Recognition Summary Generation
→ Recognition Selection
→ Full Helix Ignition
→ 64-Portal Scan
→ Dr. Maisel 25-Lens Inspection
→ Recursive Passes
→ Convergence / Divergence
→ Drama Triangle Evaluation
→ Jungian Sovereignty Inversion
→ 45 Life Section Routing
→ Person Generator Output
→ Person Oracle Reveal
```

Every stage defines runtime-validated input and output schemas. Every output preserves provenance, confidence, contradictions, unresolved variables, source versions, schema version, and runtime version.

## Environmental Intake

The environmental intake collects, in order:

1. birth location;
2. every location lived for one year or longer;
3. approximate exposure range for each residence;
4. current location.

Birth location remains distinct from residence.

Environmental execution produces:

- resolved locations;
- place-period fields;
- developmental-stage exposure;
- baseline environmental pressure;
- support, pressure, mitigation, and net-effect vectors;
- wound-quality candidates;
- portal deposits;
- provenance;
- confidence;
- contradictions;
- unresolved variables.

## Portal Pre-Charge

Environmental pressure enters the portal field before birth-date and chart interpretation.

Portal pre-charge records environmental receptivity across all 64 portals, including:

- amplification;
- suppression;
- sensitization;
- delay;
- distortion;
- reroute weight;
- recurrence rate;
- split factor.

Portal pre-charge prepares the field. Full portal evaluation occurs after recognition calibration and Full Helix Ignition.

## Birth Foundation and Time Calibration

Birth foundation collects:

- birth date;
- optional birth time;
- birth-time certainty;
- optional birth name;
- current name;
- optional pronouns.

Unknown birth time initiates hidden candidate-time comparison using the configured canonical candidate set.

The user receives behavioral recognition summaries rather than candidate clock times.

Recognition selection becomes calibration evidence. It does not claim a proven birth time.

## Childhood Formation Triangle

The childhood formation triangle evaluates:

- Safety;
- Belonging;
- Reward.

It identifies:

- what produced safety;
- what protected belonging;
- what received reward;
- what threatened exclusion;
- what adaptation became necessary;
- how the adaptation later appears under relational pressure.

Required contracts:

- `ChildhoodFormationTriangleInputSchema`;
- `ChildhoodFormationTriangleOutputSchema`.

## Recognition Calibration

Each hidden candidate run produces one recognition summary.

The Oracle presents three distinct summaries.

The user selects the summary with the strongest resonance.

Required contracts:

- `RecognitionSummaryGeneratorInputSchema`;
- `RecognitionSummaryCardSchema`;
- `RecognitionSummaryGeneratorOutputSchema`;
- `RecognitionSelectionInputSchema`;
- `RecognitionSelectionOutputSchema`.

The selected summary anchors the calibrated individual run.

## Full Helix Ignition

Full Helix Ignition begins after recognition selection.

It activates the complete calibrated person field across:

- environmental pressure;
- numerology;
- astronomical state;
- Western, Vedic, and Hellenistic interpretation;
- maternal and family pressure;
- childhood formation;
- attachment;
- wound and shadow fields;
- recursive passes;
- portal convergence;
- Life Section routing.

Required contracts:

- `HelixIgnitionInputSchema`;
- `HelixIgnitionOutputSchema`.

The output identifies activated signals, convergences, divergences, surfaced portals, routed Life Sections, and Generator readiness.

## Dr. Maisel 25-Lens Inspection

The 25 Dr. Maisel lenses inspect the stabilized portal and signal field after the full 64-portal scan.

Execution position:

```text
64-Portal Scan
→ Dr. Maisel 25-Lens Inspection
→ Recursive Passes
→ Convergence / Divergence
→ Jungian Inversion
```

Each lens result preserves:

- inspected signal IDs;
- findings;
- confidence;
- Life Section routes;
- provenance;
- contradictions;
- unresolved variables.

Required contracts:

- `DrMaiselLensInspectionInputSchema`;
- `DrMaiselLensResultSchema`;
- `DrMaiselLensInspectionOutputSchema`.

## Drama Triangle and Sovereignty Roles

The relational role evaluation recognizes:

- Victim;
- Rescuer;
- Persecutor.

Sovereignty inversion maps:

```text
Victim → Creator
Rescuer → Coach
Persecutor → Challenger
```

The evaluation records:

- active role;
- role transitions;
- protected need;
- hidden fear;
- cost;
- relational impact;
- regulation requirement;
- sovereignty role;
- embodied action;
- Life Section routes.

Required contracts:

- `DramaTriangleEvaluationInputSchema`;
- `DramaTriangleEvaluationOutputSchema`;
- `SovereigntyRoleInversionInputSchema`;
- `SovereigntyRoleInversionOutputSchema`.

The Drama Triangle is one input to the broader Jungian inversion. It does not replace the complete Jungian inversion field.

## Jungian Inversion

Jungian inversion receives:

- surfaced portals;
- wound and shadow fields;
- attachment results;
- childhood formation;
- Dr. Maisel lens results;
- Drama Triangle roles;
- recursive pass results;
- convergence and divergence;
- active Life Section routes.

It produces:

- shadow strategy;
- protective function;
- projection;
- relational consequence;
- cost;
- inverted capacity;
- sovereignty direction;
- regulation direction;
- gift emergence;
- Life Section routes.

## 45 Life Sections Registry

The 45 Life Sections exist as a versioned canonical registry.

Every registry entry contains:

- stable ID;
- canonical label;
- definition;
- supported source categories;
- valid portal routes;
- valid Generator destinations;
- valid Oracle destinations;
- version.

Every active signal, portal deposit, wound result, lens result, relational finding, Jungian inversion, recognition summary, reveal section, and deeper path carries one or more valid Life Section routes.

Required contracts:

- `LifeSectionRegistryEntrySchema`;
- `LifeSectionRouteInputSchema`;
- `LifeSectionRouteSchema`;
- `LifeSectionRoutingOutputSchema`.

## Single-Person Completion

```text
Completed Individual Runtime
→ Person Generator Payload
→ Person Oracle Reveal
→ Dark Chart
→ Jungian Inversion
→ Sovereignty
→ Save
```

The first release may complete at Sovereignty. Cadence receives a typed future handoff boundary and remains outside the Closure & Composure product build unless a later controlling specification activates it.

## Multi-Person Completion

```text
Completed Person A
+
Completed Person B
+
Selected Relationship Place-Period
+
Relationship Context
→ Relational Convergence
→ Three Relational Recognition Summaries
→ Recognition Selection
→ Closure & Composure Generator Output
→ Closure & Composure Oracle Reveal
→ What Neither Could See
→ Jungian Inversion
→ Sovereignty
→ Save
```

Relationship convergence evaluates completed independent states only.

Required contracts:

- `MultiPersonSessionSchema`;
- `IndividualRunReferenceSchema`;
- `RelationshipComparisonInputSchema`;
- `RelationshipComparisonOutputSchema`;
- `SharedFieldOutputSchema`.

## Generator Boundary

The Generator calculates, scans, routes, deposits, scores, preserves evidence, and assembles machine-readable fields.

The Generator owns:

- environmental fields;
- numerology;
- Swiss Ephemeris calculations;
- Western, Vedic, and Hellenistic interpretation;
- wound and shadow evaluation;
- attachment evaluation;
- childhood formation;
- portal scanning;
- Dr. Maisel lens inspection;
- recursive passes;
- convergence and divergence;
- Drama Triangle evaluation;
- Jungian inversion structures;
- 45 Life Section routing;
- independent person states;
- relational convergence;
- confidence;
- contradictions;
- provenance;
- unresolved variables.

The Generator produces structured evidence rather than persuasive user-facing prose.

## Oracle Boundary

The Oracle receives finalized Generator output and renders paced human recognition.

The Oracle may select, sequence, translate, name, pace, and disclose established evidence.

The Oracle preserves uncertainty and does not fabricate missing calculations.

## Implementation Law

Implement the application in verified vertical slices while preserving this complete runtime order.

A slice is complete when its screen behavior, state transition, schemas, runtime execution, persistence, recovery, tests, and production build all work together.

The Builder constructs the complete PWA application.

The SEEN Runtime orchestrates product and session progression.

The Generator establishes structured evidence.

The Oracle renders recognition.

Portals route evidence.

Life Sections organize application and interpretation domains.

Sovereignty completes the first Closure & Composure product journey.