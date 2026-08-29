# SEEN IMPLEMENTATION BREAKDOWN — 2026-08-29

Purpose: convert the 2026-08-29 thread into repo work without losing source knowledge or prematurely canonizing experiments.

## A. Already correct — preserve

### Western runtime bridge
Verified path:

`SEEN intake/runtime -> calculateNatalChart() -> local swisseph-wasm -> NatalChartResult -> buildWesternPortalBridge() -> persistent Western portal layer`

Action:
- preserve this path
- keep external chart APIs outside the canonical runtime
- keep Location downstream of completed Western calculation
- preserve unknown-time limits: no houses/Ascendant/MC without a real candidate time

Acceptance:
- direct code path remains local
- Western raw result remains inspectable before portal routing
- Location cannot alter Western planetary calculations

## B. Canonical architecture additions to implement

### B1. Environmental Resonance
Insert after objective environmental pressure and before pattern interaction.

Contract:
- input: completed EnvironmentalPressureField + provenance/evidence
- generator output: 2–3 distinct evidence-supported experiential summaries
- user response: one / multiple / none + optional strength rating
- persistence: `EnvironmentalResonanceRecord`
- downstream: resonance becomes calibration evidence only

Required fields:
- `resonanceRecordId`
- `subjectId`
- `locationPeriodId`
- `pressureFieldVersion`
- `candidateSummaryIds[]`
- `selectedSummaryIds[]`
- `ratingBySummaryId`
- `noneSelected`
- `createdAt`
- `evidenceRefs[]`
- `provenanceRefs[]`
- `confidence`

Rules:
- objective environmental record stays immutable
- no biography/later behavior used to generate the initial candidate summaries
- non-selection does not erase environmental evidence
- downstream claims distinguish measured environment from remembered experience

Acceptance:
- same EnvironmentalPressureField is identical before/after user resonance input
- resonance can be queried independently
- downstream Generator can cite both environmental evidence and resonance evidence separately

### B2. Life Map
Create a public-facing system map backed by existing source-layer IDs, portal IDs, convergence IDs, and evidence refs.

Map topology:
- center: 64 portals
- source-system strands: independent layers
- Forge/environment field: contextual pressure around pattern
- activation layer: time / relationships / events / wounds / recurrence
- convergence state: intersections between independent supported signals
- outward expression: adaptation / behavior / belief / capacity / cost / consequence
- Life Sections: human-readable perimeter after final registry is locked

Public/private boundary:
- expose system name, source identity, high-level provenance, portal/convergence relationship, user-facing evidence explanation
- keep proprietary weights, prompts, mapping tables, scoring internals, hidden schemas, and server-side routing private

Acceptance:
- user can inspect a visible convergence back to its source records
- source layers remain visually and structurally independent
- map never implies convergence where support is absent
- internal recipe is not serialized to the client

### B3. Source-system views
Implement one view/tab per approved independent system.

Each system view must show:
- native calculated result
- source-system identity
- input provenance
- calculation/version provenance
- time-certainty limitations
- optional route into portal layer after interpretation criteria exist

Convergence remains a separate view.

Acceptance:
- no blended source calculation appears inside a native system tab
- identical raw source record is used by both tab and downstream routing

### B4. Adaptive rendering system
Create rendering as a downstream layer over a supported Generator record.

Initial render modes:
- direct analytic
- narrative / memoir
- cinematic screenplay
- documentary / elder-storyteller
- landscape / natural-force metaphor
- evidence-map explanation

Shared render contract:
- input is immutable Generator result / claim set
- output contains `renderMode`, `renderVersion`, `claimRefs[]`, `evidenceRefs[]`
- rendering can change sequence, voice, metaphor, scene construction, and emphasis
- rendering cannot add unsupported facts or modify source calculations

Acceptance:
- multiple render modes from the same Generator record resolve to the same underlying claim IDs
- every factual/interpretive sentence can be traced to an existing supported claim or is explicitly marked as metaphorical presentation

### B5. Screenwriter rendering skill
Create `.claude/skills/screenwriter/SKILL.md` after the rendering contract exists.

Purpose:
Translate supported SEEN findings into cinematic/narrative form while preserving the underlying evidence.

Required behavior:
- read immutable Generator claims
- stage only supported childhood/place/family/pressure/relationship/turning-point material
- preserve uncertainty
- use metaphor only as metaphor
- return claim/evidence references with the rendered output

## C. Design system work

### C1. Restore Forge continuity
The product should not use isolated Forge decoration. Forge is the continuous visual world of the formative process.

Action:
- restore a continuous dark-celestial / bronze-gold / ivory visual language across Location -> Date -> Rectification/Resonance -> system exploration
- treat type scale, width, spacing, negative space, linework, image proportion, and motion as design-system tokens/behaviors
- preserve mobile-first constraints

### C2. Ownable typography behavior
Research top-tier identity/digital systems before implementation and define one SEEN-specific typographic behavior.

Acceptance:
- identifiable in a crop without celestial artwork
- works at 390–430 px
- consistent rules documented in design system

### C3. Life Map visual prototype
Prototype before production wiring.

Prototype must demonstrate:
- portal center
- multiple independent strands
- Forge/environment field
- one supported convergence
- drill-down to evidence
- historical provenance marker

Do not expose proprietary scoring/routing internals in the prototype.

## D. Historical provenance layer

Research and source before UI copy.

For each system store/display-ready metadata:
- `systemId`
- `displayName`
- `tradition`
- `originRegion`
- `earliestDocumentedEra`
- `laterDevelopmentEra`
- `sourceRefs[]`
- `summaryOfContribution`
- `verificationStatus`

Important:
- approximate conversational dates are not production facts
- the R.H. Naylor / Princess Margaret / mass-market sun-sign history requires direct sources before release

## E. Time rectification experiment — do not replace canon yet

Current canonical UX remains:
- three recognition cards per round
- up to four rounds

Experiment:
- 12 hidden broad candidates at 2-hour increments
- complete chart calculated independently for each
- compact recognition output per candidate
- user resonance input via selection or continuous/hot-cold control
- cluster/heatmap strongest candidate region
- finer second pass inside winning region

Evaluation metrics:
- discrimination between candidates
- user completion rate
- recognition confidence
- Barnum/generalization susceptibility
- runtime/token cost
- time-to-resolution
- final candidate stability across repeated runs

Decision gate:
- keep 3-card model unless 12-candidate experiment materially improves discrimination without unacceptable fatigue/noise/cost

## F. Location scoring/source audit integration

Retain `SEEN_LOCATION_SCORING_VIP_SOURCE_AUDIT.md` as implementation diligence.

Implement its P0 requirements before treating Location scores as production-grade:
- dataset-specific temporal aggregation
- absolute vs relative delta separation
- statistical uncertainty preservation
- orthogonal status fields
- explicit missing-component behavior
- project-defined constant labels
- longitudinal geography comparability
- reproducible provenance

Implement P1 before downstream convergence:
- correlated evidence/dependency groups
- schema completeness
- transition attributes
- aggregate confidence definitions
- approximate residence dates
- birth role separated from residence exposure

P2 is calibration/validation, not prerequisite for scaffolding.

## G. Repo placement

### Canon / task contexts
- `.DOCS/contexts/CLAUDE_LOCATION.md` -> Environmental Resonance invariants
- `.DOCS/contexts/CLAUDE_GENERATOR_HELIX.md` -> Life Map + rendering boundary
- new `.DOCS/contexts/CLAUDE_LIFE_MAP_RENDERING.md` -> visual map, source tabs, provenance, render modes

### Source knowledge / recovered thread material
- `.DOCS/incoming/2026-08-29_THREAD_INDEX_MAP_RENDERING_RECTIFICATION.md`

### Action plan
- this file

### Future code areas
- `lib/location/...` -> Environmental Resonance data contract/runtime
- `lib/seen/...` -> public Life Map projection contract
- `lib/rendering/...` -> rendering contract and modes
- `app/...` -> Life Map + source-system views
- `.claude/skills/screenwriter/SKILL.md` -> only after rendering contract

## H. Build order

1. Environmental Resonance schema + persistence boundary + tests.
2. Location source-audit P0 schema corrections needed by downstream claims.
3. Public Life Map projection contract over existing portal/source/convergence IDs.
4. One static/fixture-backed Life Map prototype proving the navigation model.
5. Native Western source view using the already-canonical local Swiss Ephemeris result.
6. Rendering contract.
7. Screenwriter mode as the first alternate renderer.
8. Historical provenance data registry with sourced dates.
9. Rectification 12-candidate experiment behind a feature flag/test route.
10. Compare experiment to current 3-card/four-round model before changing production rectification.

## I. Non-negotiable invariants

- Source systems remain independent.
- Raw calculations are preserved.
- Environment never changes astronomical calculations.
- User resonance is calibration evidence, not retroactive truth.
- Convergence requires independently supported inputs.
- Creativity/rendering happens after supported findings exist.
- Contradictions survive.
- Weak/insufficient evidence can return `UNKNOWN` / `insufficient_signal`.
- Public visualization can show structure without exposing proprietary implementation internals.
- Final Life Section count remains unchanged until explicitly locked.
