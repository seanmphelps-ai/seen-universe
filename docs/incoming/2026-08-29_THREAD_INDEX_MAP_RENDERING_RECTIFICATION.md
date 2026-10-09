// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# SEEN THREAD INDEX — MAP, RENDERING, RECTIFICATION, WESTERN, LOCATION

Date: 2026-08-29
Status: recovered thread material; validate/canonize item by item before implementation.

### Verified in repository
- `swisseph-wasm` is installed locally.
- `lib/natalChart.ts` initializes Swiss Ephemeris and calculates Western planetary positions, retrogrades, aspects, houses, Ascendant, and Midheaven when birth time is known.
- `app/api/chart/route.ts` exposes the local calculator.
- `app/api/seen/run/route.ts` calls `calculateNatalChart()` directly, then passes the completed Western result to `buildWesternPortalBridge()`.
- Western calculation remains independent from Location/environment.

### Open
- Canonical portal-specific Western interpretation criteria are still absent.

### Established architecture
- Environment is calculated independently before person-level interpretation.
- One Environmental Pressure Field per location-period pair.
- Preserve public observable evidence, official-data corroboration, provenance, confidence, contradictions, geography precision, and time coverage.

### Environmental Resonance layer
Add a distinct layer between objective environmental pressure and pattern interaction:

`ENVIRONMENTAL REALITY -> REMEMBERED EXPERIENCE -> RESONANCE -> PATTERN INTERACTION`

Rules:
- Generate exactly three evidence-supported experiential summaries from already-collected environmental evidence.
- Each summary carries both gift and cost.
- One leans Western markers, one Vedic, one blended.
- User may select one, multiple, or none.
- Selection records which measured conditions appear to have reached/resonated with the subject.
- Store user response as a separate `Environmental Resonance Record` with provenance and confidence.

## 3. Core product mission / hard hook

Working mission from this thread:

Supporting product distinction:
- Standard systems calculate what they calculate.
- SEEN preserves them independently.
- SEEN adds place, time, exposure, relationships, behavior, wounds, resonance, and lived feedback.
- SEEN identifies what a person is prone to, the conditions that bring it forward, what strengthens/suppresses it, what happens under pressure, what it costs, why it repeats, and what can be done with that knowledge.

Commercial distinction:
- Cosmetic personalization = name insertion + generalized copy.
- SEEN target = earned personalization with traceable source calculations, environmental evidence, convergence, and lived resonance.

## 4. The Forge

Established meaning:
- The Forge is the formative/lived process around the seed/pattern.
- Stars/source systems provide the independent pattern material.
- The Forge represents what that pattern had to grow through: place, environment, exposure, timing, relationships, pressure, adaptation, and expression.

Visual/product implication:
- Location belongs naturally inside the Forge.

## 5. Life Map / system map

Strongly endorsed concept:
- The map is analogous to a family tree/subway map: visible relationships, hidden implementation.

### Proposed visual topology
- Center: permanent 64-portal lattice/sphere/field.
- Independent source systems remain visually separate and feed their own strands toward the portal field.
- Forge/environment/exposure surrounds the central structure as pressure/context.
- Convergence lights up where independent strands hit the same territory.
- Expression moves outward through adaptation, behavior, belief, capacity, cost, consequence.
- Life Sections form a human-readable perimeter.
- User can zoom from overview -> convergence -> portal -> source calculation/evidence.

Core principle:
`Show the subway map; keep the signaling software private.`

## 6. Historical provenance orbit / timeline

Product concept:
- Each independent system can carry a small provenance marker: origin/tradition/era and what it contributes.
- The map can visualize ancient/classical/modern systems across time while connecting them to the same central lattice.
- The contrast with modern mass-market sun-sign astrology can be a major reveal.

Validation requirement:
- Historical dates/origin claims must be sourced before production display.
- The Princess Margaret / R.H.

## 7. Source-system tabs

- Each system should have its own tab/view.
- Examples: Western, Hellenistic, Vedic, BaZi, I Ching-derived, Human Design, etc., only when the corresponding calculation protocol is implemented and approved.
- Convergence gets a separate view where systems meet.
- Life Map provides the visual proof of the complete machine.

## 8. Western visual exploration

Concept:
- Houses can use visual signifiers such as historic houses/homes to embody house territory.

## 9. Adaptive rendering modes

- The same supported Generator result can be rendered through different forms for different users.

Candidate modes from this thread:
- direct analytic reading
- narrative / memoir
- cinematic screenplay
- documentary / elder storyteller
- natural-disaster / landscape metaphor journey
- evidence map / source inspection

Screenwriter skill requirement:
- Can stage childhood, formative places, family atmosphere, pressure, recurring behavior, relationships, turning points, consequences, and change only where supported by preserved evidence.
- Rendering must preserve claim IDs/evidence refs so every creative sentence remains traceable.

Rule:

## 10. Design standard / Chameleon direction

- Study top-tier identity, digital experience, typography, copy, motion, and interaction work before executing each major visual task.
- Thread references: Pentagram for identity/typography logic; BASIC/DEPT-style digital experience logic; top-tier creative/copy discipline.
- Typography must be treated as architecture: width, scale, spacing, negative space, proportion, and motion are deliberate system variables.

## 11. Time rectification — new experiment

Current checklist/canon:
- three recognition cards per round
- up to four rounds
- hidden candidate times
- user resonance selections preserved as calibration evidence

- test 12 evenly spaced hidden time candidates in a broad first pass (e.g. two-hour increments).
- calculate a complete Western candidate for each time.
- collect resonance using click/rating or hot/cold/continuous control.
- generate a resonance heatmap/cluster.
- narrow the winning time neighborhood and run a finer second pass.

Invariant:

Required before canonization:
- compare 3-card/four-round approach against 12-candidate broad sweep for discrimination quality, user fatigue, token/runtime cost, and false-positive/Barnum susceptibility.

## 12. SEEN Location scoring/source audit file

`SEEN_LOCATION_SCORING_VIP_SOURCE_AUDIT.md` should be retained as Location implementation diligence.

It covers:
- dataset-specific temporal aggregation
- absolute vs relative environmental deltas
- statistical uncertainty vs meta-confidence
- orthogonal condition statuses
- missing-component behavior
- project-defined constants labeling
- longitudinal geography comparability
- reproducible provenance
- correlated evidence
- schema completeness
- transition attributes
- aggregate confidence definitions
- approximate residence dates
- birth role vs residence exposure
- threshold/formula sensitivity testing
- calibration
- evidence-governor validation

## 13. Agent/runtime tooling discussed

Source-knowledge only unless separately approved:
- claude-mem as persistent working-memory option for Claude Code sessions.
- Fable remains optional; repo source of truth and tests matter more than which model performs the work.

### Verified implemented
- local Swiss Ephemeris Western calculator
- `/api/chart` path
- SEEN runtime direct Western call
- Western bridge into 64 persistent source layers
- skill contracts including chart-gen, resonance, verify, intake, social-pull, narrative-extract

### Partially implemented / architecture present
- Location v1/v2/scoring infrastructure
- portal-layer contracts
- Helix/convergence concepts
- Forge visual references

### Product features awaiting completion
- Environmental Resonance Record/runtime
- interactive Life Map
- provenance timeline/orbit
- source-system tab suite
- adaptive rendering-mode system
- screenwriter rendering skill
- 12-candidate rectification experiment
- final Life Section registry count

## 15. Implementation law from this thread

1. Standard source systems calculate natively and independently.
2. Preserve raw source output before interpretation.
3. Location/environment is calculated independently.
5. Convergence happens after independent source layers exist.
6. Creative rendering happens after supported findings exist.
7. Public UI can reveal system topology while proprietary mechanics remain server-side.
8. Every production claim should remain traceable to calculation/evidence/provenance.
