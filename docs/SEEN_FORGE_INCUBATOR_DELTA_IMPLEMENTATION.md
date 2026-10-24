# SEEN — FORGE / Incubator / Delta implementation brief
Source: user-provided 🍀🥜🔗 conversation (981 lines). Target branch: final-siteS. Status: implementation brief, not an assertion that features are missing.

## Preserve the existing spine
Build on the existing Location Engine, environmental evidence pipeline, modality agents/auditors, 64 archetype interrogators, Dark Chart Generator, and Oracle. Preserve the existing intake and evidence contracts. Keep the source conversation as conceptual input; verify all chart examples with the native calculators before treating them as computed facts.

## Priority 1 — Seed × Incubator × Forge
- **Seed:** retain each modality's independently calculated and audited chart evidence, with source identifiers, placements, dignity, aspects, houses, nodes, wound markers, and uncertainty.
- **Incubator:** treat each lived place and its time window as a first-class environmental exposure. Reuse Location Engine's BIRTH/LIVED/CURRENT places, historical year-cut, EnvironmentalResonanceRecord, and pressure chain.
- **Soil:** model family, close relationships, social reinforcement, and formative wounds as their own evidence-linked inputs inside the lived environment.
- **Forge:** assemble compatible chart, environmental, family, and behavioral observations into interactions, then route evidence-backed distinctions through the existing interrogators and Oracle. Preserve provenance and uncertainty at every handoff.

## Priority 2 — Eight cross-examination lenses
These are **interaction lenses** applied to existing modality evidence, not replacements for the nine modality agents or 64 interrogators.
1. Element × biome/abiotic exposure → compression, dispersion, retention, saturation, rooting, anchoring, rarefaction, condensation.
2. Cardinal/fixed/mutable × environmental tempo → initiation, persistence, adaptation under local pace, hierarchy and novelty.
3. Planetary function × social/economic rewards and penalties → expression, suppression, redirection.
4. Planetary dignity × incubator demands/support → strength under support or constraint.
5. Planet/house × corresponding lived domain → activation, available outlet, missing platform.
6. Aspect × environmental outlets → friction, containment, coexistence.
7. Node axis × environmental directional pressure → alignment or divergence, within the source modality's interpretive rules.
8. Wound indicators (including Chiron where the modality uses it) × family/soil responses → met, unmet, contradicted, reinforced.

Each distinction carries: seed finding IDs; incubator observation IDs; lens; mechanism; alternative plausible readings; user-confirmed/contradicted status; and narrative rendering. Interpretive labels are hypotheses, with specific behavior confirmed through user testimony rather than inferred as fact.

## Priority 3 — Incubator encoding and seasonal resolution
- Reuse existing location collectors, Census adapters, historical-year logic, evidence scoring and persistence.
- Extend only where needed: altitude, climate/biome, daylight, temperature and precipitation normals, population density, economic opportunity, mobility, lived social tempo, and user-described cultural rewards.
- Attach data source, geographic resolution, historical validity, time window, and confidence to each observation.
- Support 6+ consecutive-month lived-place windows as the conversation's default eligibility, plus shorter event/travel windows with explicit duration.
- Add seasonal sub-incubators (month/season): photoperiod, climate, biome state, seasonal work and visitor exposure. Contrast winter and summer at identical coordinates.
- Ask nested questions where environmental data are personal or underdetermined: what the place rewards → who rewards it → what behavior follows → what it costs → what changes across seasons.

## Priority 4 — Delta: same seed, different incubation
- Hold audited seed evidence constant; evaluate the same lenses under incubator A and B.
- Emit per-lens A distinction, B distinction, and a concise difference statement, grounded in changed environmental inputs.
- Support comparisons between lived places, historical eras, and seasons at the same place.
- Distinguish observed change from hypothetical counterfactual. The delta is an interpretable comparison, rather than proof of causation.
- Provide a compact machine-readable delta to the Generator and a third-person, dark-chart-appropriate narrative to the Oracle.

## Priority 5 — Astrological Recollection (subsequent feature)
- Capture reference event: location, date range, participants, lived environmental conditions, user-described felt experience, and remembered relationship dynamics.
- Compute independently audited person-to-location chart frames, pairwise synastry in location context, date-specific transits, incubator, and seasonal sub-incubator.
- Preserve a configuration signature with source references, uncertainties, and subjective felt tags.
- Search candidate location/date windows under travel, budget and preference constraints; compare the five components with transparent adjustable weights.
- Return candidate comparisons and deltas from the reference event, with interpretation presented as a possible resonance rather than an assured future experience.
- Validate location chart calculation conventions and avoid presenting illustrative placements or numerical scores from the conversation as verified results.

## Nested interrogation pattern
For each relevant interaction, ask progressively:
1. What precise native modality finding is present?
2. Which environment and time window exposed it?
3. What did that place reward, punish, normalize, or make scarce?
4. Which behavior emerged, and who witnessed it?
5. What immediate relief or benefit reinforced the behavior?
6. What accumulated cost, consequence, or relationship pressure followed?
7. What changed after relocation or across seasons?
8. What evidence would distinguish competing explanations?
9. What remains a user recollection versus an inferred interpretation?

Use existing identifying archetype interrogators to select and deepen questions; preserve their original archetype identities.

## Narrative quality
- Render chart/environment collisions as an integrated lived event, retaining planet, house, nakshatra and other native provenance in the underlying evidence.
- Preserve the source's forceful **FORGE** language and concrete consequences; tune to the established Dark Chart / Oracle voice.
- Express hypotheses proportionately to evidence. User-reported events remain user-reported; natal symbolism alone does not establish a person's actions or motives.

## Integration and acceptance
1. Inspect current Location Engine, v2 evidence contracts, archetype pipeline, modality/auditor output, and Dark Chart Generator before coding.
2. Map each item above to **existing / partial / absent** using actual code and tests.
3. Add schema/adapter changes only for confirmed gaps; preserve branch ownership.
4. Test: same chart across two locations; same location across winter/summer; family soil change; contradictory environmental observations; missing birth time; unsupported chart claim; multiple people and reference event.
5. Confirm deterministic environmental data and audited chart calculations precede interpretive synthesis.
6. Publish only reviewed changes from final-siteS through explicit cherry-picks or pull requests; keep final-seen-cc-runtime untouched.

## Scope
This brief is the actionable extraction from the supplied conversation. It adds a comparison and interaction layer to SEEN's existing architecture; it does not establish a new repository, replace the current agent topology, or prescribe an unverified rewrite.
