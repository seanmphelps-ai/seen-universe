# 02_CLOSURE_COMPOSURE_RUNTIME_ORDER_LOCK

## Authority

This file defines the controlling Closure & Composure runtime sequence inside the active SEEN repository.

The controlling build specification governs product scope, runtime order, data contracts, architecture, interaction flow, visual implementation, testing, commercial readiness, privacy, and production acceptance.

Existing repository work is retained when it conforms to the controlling specification and supports the complete Closure & Composure product outcome. Conflicting architecture, terminology, routes, schemas, and runtime assumptions are revised, migrated, replaced, or retired.

## Experience Mode

The first product decision after the splash is experience mode.

```text
SPLASH
→ READY
→ EXPERIENCE_MODE
   ├── SINGLE_PERSON
   └── MULTI_PERSON
```

Required contracts:

- `ExperienceModeInputSchema`
- `ExperienceModeOutputSchema`
- `SinglePersonSessionSchema`
- `MultiPersonSessionSchema`

`ExperienceModeOutputSchema` establishes the person count, active person index, session mode, and next valid state.

## Independent Person Completion Law

Each person completes the full independent SEEN pipeline before relational comparison begins.

```text
Person A complete
+
Person B complete
→ relational convergence permitted
```

Relationship context may reference each person. It does not overwrite either stored baseline, active state, source field, or calibrated recognition anchor.

## Canonical Person Runtime Order

For each person, execute this sequence:

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
→ Childhood Safety / Belonging / Reward Triangle
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

Every runtime layer defines validated input and output contracts. Every handoff preserves IDs, provenance, confidence, contradictions, unresolved variables, version metadata, and valid Life Section routes.

## Environmental Intake and Portal Pre-Charge

Environmental intake precedes birth-derived interpretation.

Collect:

- birth location;
- every location lived for one year or longer;
- approximate start and end for each exposure;
- current location.

Resolve each location into structured records, then temporalize each exposure into a place-period field.

Portal pre-charge receives environmental pressure before chart interpretation.

Required contracts:

- `EnvironmentalIntakeInputSchema`
- `EnvironmentalIntakeOutputSchema`
- `PlaceResolutionInputSchema`
- `PlaceResolutionOutputSchema`
- `PlacePeriodFieldInputSchema`
- `PlacePeriodFieldOutputSchema`
- `PortalPrechargeInputSchema`
- `PortalPrechargeOutputSchema`

Portal pre-charge stores environmental receptivity, amplification, suppression, sensitization, delay, distortion, reroute weight, recurrence rate, split factor, wound-quality receptivity, attachment receptivity, and Life Section routing capacity.

Portal pre-charge prepares the lattice. Full portal scanning occurs after recognition selection and Full Helix Ignition.

## Birth Foundation and Hidden Calibration

Birth foundation collects:

- birth date;
- optional birth time;
- birth-time certainty;
- optional birth name;
- current name;
- optional pronouns.

Unknown birth time activates the canonical hidden candidate set configured for the build. The user receives behavioral recognition summaries and never sees candidate times.

Required contracts:

- `BirthFoundationInputSchema`
- `BirthFoundationOutputSchema`
- `ChartCandidateInputSchema`
- `ChartCandidateOutputSchema`
- `RecognitionSummaryGeneratorInputSchema`
- `RecognitionSummaryGeneratorOutputSchema`
- `RecognitionSelectionInputSchema`
- `RecognitionSelectionOutputSchema`

Recognition selection becomes calibration evidence and the working recognition anchor.

## Full Helix Ignition

Full Helix Ignition begins after recognition selection.

It receives the selected candidate state, environmental pressure, portal pre-charge, numerology, astronomical state, maternal and family pressure, childhood formation, attachment, wound, shadow, and recognition anchor.

Required contracts:

- `HelixIgnitionInputSchema`
- `HelixIgnitionOutputSchema`

The output establishes:

- calibrated candidate state;
- activated signals;
- recursive-pass eligibility;
- convergence and divergence inputs;
- full portal-scan readiness;
- Life Section routing readiness;
- Generator readiness.

## Childhood Formation Triangle

The childhood formation triangle contains:

- Safety;
- Belonging;
- Reward.

It evaluates what produced safety, protected belonging, earned reward, threatened exclusion, and formed adaptation.

Required contracts:

- `ChildhoodFormationTriangleInputSchema`
- `ChildhoodFormationTriangleOutputSchema`

The output preserves axis findings, adaptations, confidence, provenance, contradictions, unresolved variables, and Life Section routes.

## Portal Scan

Full portal scanning occurs after Full Helix Ignition.

All 64 core portals are evaluated for every completed person state.

Each portal receives one status:

- `active`
- `weak`
- `dormant`
- `contradictory`
- `insufficient_signal`

The Generator evaluates activation strength, source convergence, wound and shadow relevance, environmental modulation, relationship-field relevance, recursive-pass results, convergence and divergence, Life Section routing, contradiction flags, and confidence.

The Generator surfaces only the strongest sufficiently converged portals. The Oracle renders only surfaced portals.

Required contracts:

- `PortalScanInputSchema`
- `PortalScanResultSchema`
- `PortalSurfaceOutputSchema`

## Dr. Maisel 25-Lens Inspection

Dr. Maisel lenses inspect stabilized signal after portal scanning and before recursive convergence and Jungian inversion.

The 25 lenses are:

1. Original Personality
2. Formed Personality
3. Available Personality
4. Circumstance
5. Time Passing
6. Mind Space
7. Instinct
8. Individual Psychology
9. Social Psychology
10. Development
11. Biology
12. Family
13. Cognition
14. Behavior
15. Social Connection
16. Experience
17. Endowment
18. Stress
19. Trauma
20. Emotion
21. Culture and Society
22. Environmental Factors
23. Psychiatric Medication and Chemicals
24. Creativity
25. Life Purpose and Meaning

The lenses inspect signal. They remain distinct from wound markers, portals, and Oracle prose.

Required contracts:

- `DrMaiselLensInspectionInputSchema`
- `DrMaiselLensResultSchema`
- `DrMaiselLensInspectionOutputSchema`

## Drama Triangle and Sovereignty Role Inversion

The Drama Triangle evaluates:

- Victim;
- Rescuer;
- Persecutor.

The sovereignty role inversion maps:

```text
Victim → Creator
Rescuer → Coach
Persecutor → Challenger
```

Required contracts:

- `DramaTriangleEvaluationInputSchema`
- `DramaTriangleEvaluationOutputSchema`
- `SovereigntyRoleInversionInputSchema`
- `SovereigntyRoleInversionOutputSchema`

The output preserves active role, role transitions, protected need, hidden fear, cost, relational impact, sovereignty role, regulation requirement, embodied action, provenance, confidence, contradictions, unresolved variables, and Life Section routes.

## Jungian Sovereignty Inversion

Jungian inversion receives stabilized repeated signal after portal scan, Dr. Maisel inspection, recursive passes, and convergence/divergence.

It receives:

- active wound markers;
- surfaced portal routes;
- Dr. Maisel lens results;
- childhood formation results;
- Drama Triangle results;
- recursive-pass results;
- convergence and divergence results;
- active Life Section routes.

It returns:

- shadow strategy;
- protective function;
- cost;
- projection;
- relational consequence;
- inverted capacity;
- sovereignty role;
- regulation direction;
- gift emergence;
- Life Section routes.

Required contracts:

- `JungInversionInputSchema`
- `JungInversionOutputSchema`

Jungian inversion transforms established signal. It preserves source linkage and creates no unsupported source claim.

## 45 Life Sections Registry

The 45 Life Sections form the canonical destination registry for person, relationship, portal, lens, inversion, reveal, and deeper-path routing.

The registry contains stable IDs, canonical labels, descriptions, supported source categories, valid portal routes, valid Oracle destinations, and version metadata.

Every major signal, portal deposit, lens result, wound result, relational finding, Jungian inversion, recognition summary, reveal section, and deeper path carries one or more valid Life Section routes.

Required contracts:

- `LifeSectionRegistrySchema`
- `LifeSectionRouteInputSchema`
- `LifeSectionRouteSchema`
- `LifeSectionRoutingOutputSchema`

## Multi-Person Relational Runtime

After Person A and Person B complete independently:

```text
Completed Person A
+
Completed Person B
+
Selected Relationship Place-Period
+
Relationship Context
→ Relational Convergence
→ Relational Recognition Summaries
→ Recognition Selection
→ Closure & Composure Generator Output
→ Closure & Composure Oracle Reveal
→ What Neither Could See
→ Jungian Inversion
→ Sovereignty
```

Required contracts:

- `IndividualRunReferenceSchema`
- `RelationshipComparisonInputSchema`
- `RelationshipComparisonOutputSchema`
- `SharedRelationshipFieldOutputSchema`
- `RelationalRecognitionSummaryInputSchema`
- `RelationalRecognitionSummaryOutputSchema`

## Generator, Oracle, and Cadence Boundary

The Generator calculates, scans, routes, deposits, compares, scores, preserves evidence, and assembles machine-readable output.

The Oracle receives finalized Generator output and renders paced human recognition.

Cadence receives the completed recognition and sovereignty handoff after Closure & Composure.

Required contracts:

- `GeneratorInputSchema`
- `GeneratorOutputSchema`
- `OracleRenderInputSchema`
- `OracleRenderOutputSchema`
- `CadenceHandoffInputSchema`
- `CadenceHandoffOutputSchema`

The Cadence handoff preserves the selected recognition anchor, active patterns, active Life Sections, sovereignty directions, regulation needs, commitments, provenance, confidence, contradictions, unresolved variables, and version metadata.

## Implementation Gate

A Closure & Composure implementation path is complete when:

- experience mode is explicit;
- every person completes independently;
- environmental intake precedes birth-derived interpretation;
- portal pre-charge precedes chart interpretation;
- recognition selection activates Full Helix Ignition;
- all 64 portals are scanned;
- Dr. Maisel lenses execute in the defined position;
- recursive convergence and divergence complete;
- Drama Triangle and sovereignty role inversion complete;
- Jungian sovereignty inversion completes;
- every output routes to the 45 Life Sections;
- Generator output validates;
- Oracle output derives from finalized Generator evidence;
- Cadence receives the typed handoff.
