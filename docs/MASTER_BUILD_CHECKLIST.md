# SEEN MASTER BUILD CHECKLIST

Repository: `seanmphelps-ai/seen-universe`  
Branch: `closure-and-composure`  
Purpose: One printable list of what must be fixed, completed, verified, or supplied.

## STATUS KEY

- `[x]` verified complete
- `[ ]` incomplete or requires verification
- `[?]` decision must be locked

## CURRENT VERIFIED STATE

- [x] GitHub repository confirmed
- [x] `closure-and-composure` is the default production branch
- [x] GitHub pushes automatically trigger Vercel
- [x] Unrequested `/foundation` splash page removed
- [x] `/foundation` redirects to `/foundation/location`
- [x] Location intake route exists
- [x] Birth location, lived locations, current location, birth date, and approximate calendar-year inputs exist in the current Location screen
- [x] City autocomplete component exists

## FIRST COMPLETE PRODUCT PATH

Build this first as one working vertical slice:

- [ ] Entry screen
- [ ] Voice / Chat / Manuscript selection
- [ ] Person A Foundation
- [ ] Person B Foundation
- [ ] Relationship or event context
- [ ] Independent Person A calculation
- [ ] Independent Person B calculation
- [ ] Location-over-time calculation for each person
- [ ] Dark Chart and shadow extraction for each person
- [ ] Comparative Helix convergence
- [ ] Three recognizable comparative-shadow cards
- [ ] User selects the card that is true
- [ ] Closure & Composure result explains what happened
- [ ] First Cadence action begins immediately
- [ ] Daily tracking begins without a second onboarding process

## PRODUCT SPINE

- [ ] SEEN delivers recognition
- [ ] Closure & Composure delivers relational understanding and resolution
- [ ] Cadence delivers daily practice, tracking, repair, and continuity
- [ ] Jung / Sovereignty delivers inversion, integration, individuation, and choice
- [ ] Eden becomes the consent-aware relational and dating layer after users have usable SEEN and Cadence records
- [ ] Preserve this order across navigation, data contracts, copy, and routing

## DISTINCTIVE PRODUCT MECHANICS

- [ ] Treat Location as a primary causal pressure layer
- [ ] Calculate location effects separately for every person
- [ ] Calculate how a shared place affected the relationship field
- [ ] Explain why a trip improved, strained, or changed the relationship
- [ ] Include the exact time period spent in each place
- [ ] Include trip/event location and dates when analyzing a specific event
- [ ] Build the Dark Chart around wound markers, shadow mechanics, protective adaptations, sabotage potential, and recurring loops
- [ ] Preserve the full marker universe instead of reducing the result to a compatibility score
- [ ] Detect convergence across independent source systems
- [ ] Render convergence through the Helix / DNA-strand model
- [ ] Preserve conflicting signals as simultaneous expression
- [ ] Translate the same engine for self, partner, child, parent, sibling, teacher, and caregiver use
- [ ] Continue the reading through Voice Oracle
- [ ] Continue recognition through Cadence tracking
- [ ] Route mature, consent-aware records into Eden

## ENTRY SCREEN AND ONBOARDING

- [ ] Replace the current root experience with the approved product entry
- [ ] Lock the opening hook
- [ ] Lock the supporting promise
- [ ] Lock the first CTA
- [ ] Present Voice, Chat, and Manuscript as interaction modes
- [ ] Make mode selection begin intake immediately
- [ ] Ask one question at a time in Voice and Chat
- [ ] Keep Manuscript available for longer narrative input
- [ ] Preserve the Louis Vuitton-inspired espresso, bronze-gold, ivory, glass, celestial, and botanical visual system
- [ ] Verify mobile composition at 390–430 px
- [ ] Verify keyboard, safe-area, scrolling, tap targets, and microphone states on iPhone
- [ ] Measure qualified start: first validated Person A answer

## PERSON A AND PERSON B FOUNDATION

- [ ] Create a permanent subject record for Person A
- [ ] Create a separate permanent subject record for Person B
- [ ] Keep both source records independent before comparison
- [ ] Collect name
- [ ] Collect relationship role
- [ ] Collect birth date
- [ ] Collect birth location
- [ ] Collect complete location timeline
- [ ] Collect current location
- [ ] Collect location start and end dates or approximate calendar years
- [ ] Collect specific relationship/event dates and locations when relevant
- [ ] Store time certainty separately
- [ ] Begin birth-time rectification only after date and location provide the candidate material
- [ ] Support one-person use when no second subject is supplied
- [ ] Support a second subject without rebuilding Person A

## LOCATION INTAKE FIXES

- [ ] Change the lived-location threshold from 12 months to 6 months everywhere
- [ ] Change visible copy from “More Than 1 Year” to “6 Months or More”
- [ ] Change validation, storage, schemas, tests, and documentation to `minimumResidenceMonths: 6`
- [ ] Require selection of a confirmed geographic record
- [ ] Store place ID, normalized city, region, country, country code, latitude, longitude, timezone, elevation, feature class, and feature code
- [ ] Make selected place data immutable until the user intentionally edits it
- [ ] Remove all production hardcoded cities and personal test data
- [ ] Keep regression locations only in tests
- [ ] Add start/end month or approximate duration where year-only input is insufficient
- [ ] Support current-location “Present” state
- [ ] Support repeated lived locations
- [ ] Support revisiting the same location during different periods
- [ ] Support temporary trips and event locations separately from residence history
- [ ] Validate chronological order without flattening uncertain dates
- [ ] Save intake beyond `sessionStorage`

## LOCATION ENGINE

- [ ] Calculate each location independently
- [ ] Calculate duration-weighted exposure
- [ ] Calculate GeoPresence
- [ ] Calculate biome
- [ ] Calculate abiotic conditions
- [ ] Calculate terrain
- [ ] Calculate elevation
- [ ] Calculate climate
- [ ] Calculate light cycle
- [ ] Calculate seasonal variation
- [ ] Calculate geological conditions
- [ ] Calculate water proximity
- [ ] Calculate ecological density
- [ ] Calculate biological pressure
- [ ] Calculate human pressure
- [ ] Calculate political and institutional pressure
- [ ] Calculate social density
- [ ] Calculate environmental stability and volatility
- [ ] Add astrocartographic conditions when rectified birth time is available
- [ ] Preserve birthplace, lived places, current place, trips, and event places as separate records
- [ ] Produce an `EnvironmentalPressureField` for every location-period pair
- [ ] Route every environmental contribution into all relevant portals
- [ ] Produce a complete 64-record Environmental Portal Layer
- [ ] Represent low pressure explicitly instead of omitting a portal

## LOCATION EVIDENCE PIPELINE

- [ ] Use public observable signals as the primary evidence universe
- [ ] Ingest local social posts, forums, reviews, news, events, commerce, jobs, housing, search, and movement/place signals through provider-agnostic adapters
- [ ] Use official data as baseline, history, corroboration, and validation
- [ ] Store requested geography and matched geography
- [ ] Store geographic precision
- [ ] Store source, timestamp, provenance, confidence, and evidence
- [ ] Deduplicate the underlying event from its social spread
- [ ] Preserve unique events, posts, accounts, reach, persistence, cross-platform presence, and mobilization
- [ ] Measure prevalence, severity, physical exposure, digital exposure, social amplification, participant breadth, spatial concentration, response framing, and trend
- [ ] Keep confidence separate from intensity
- [ ] Preserve contradictions
- [ ] Use current and baseline time windows
- [ ] Apply sampling caps and geographic/time stratification
- [ ] Test Whitefish/Kalispell, Castro Valley, Oakland, Downtown Los Angeles, Compton, and Inglewood only as regression cases

## DATE, CHART, AND TIME RECTIFICATION

- [ ] Confirm birth-date contract
- [ ] Run every date-dependent source calculation independently
- [ ] Verify local Swiss Ephemeris integration
- [ ] Preserve Western calculations
- [ ] Add and verify Hellenistic calculations
- [ ] Add and verify Vedic calculations
- [ ] Add and verify Lots
- [ ] Add and verify nakshatras and dashas
- [?] Lock whether numerology remains in the first product pass
- [ ] Verify Galaxy Signature / Dreamspell calculation protocol
- [ ] Preserve Human Design and I Ching-derived mechanics as source layers
- [ ] Implement time-certainty states
- [ ] Generate rectification candidates after date and location calculations
- [ ] Present three recognition cards per round
- [ ] Allow up to four rectification rounds
- [ ] Preserve the user's resonance selections as calibration evidence
- [ ] Store the final time confidence and provenance

## PERMANENT 64-PORTAL ARCHITECTURE

- [ ] Create one permanent registry of 64 portal identities
- [ ] Attach every modality as a separate complete 64-portal layer
- [ ] Preserve original calculation
- [ ] Preserve original extraction
- [ ] Preserve source-system identity
- [ ] Preserve extraction-template identity
- [ ] Preserve protocol version
- [ ] Preserve confidence
- [ ] Preserve evidence and provenance
- [ ] Preserve contradictions
- [ ] Apply append-first, synthesize-second, render-third
- [ ] Enforce the no-cancellation rule
- [ ] Record simultaneous amplification and restraint
- [ ] Model split, delayed, oscillating, rerouted, context-dependent, and collapsed expression
- [ ] Route portal outputs into Life Sections continuously
- [?] Lock the final Life Section registry count and remove conflicting counts
- [ ] Keep internal portal IDs, signal IDs, candidate keys, and routing backstage

## WOUNDS, DARK CHART, AND SHADOW WORK

- [ ] Register all wound-marker sets independently
- [ ] Include Chiron, Lilith, nodes, Saturn, Pluto, Mars, Neptune, Moon, and houses 4/8/10/12 where their source systems support them
- [ ] Preserve marker-set identity
- [ ] Route a marker into every relevant portal
- [ ] Model amplification, suppression, sensitization, delay, distortion, rerouting, splitting, lowered threshold, and recurrence
- [ ] Extract wound pattern
- [ ] Extract protective adaptation
- [ ] Extract sabotage potential
- [ ] Extract recurring loop
- [ ] Extract trigger
- [ ] Extract pressure point
- [ ] Extract immediate cost
- [ ] Extract long-term cost
- [ ] Extract cost to self
- [ ] Extract cost to others
- [ ] Extract probable consequence
- [ ] Extract capacity and regulated expression
- [ ] Produce a complete 64-record Wound Portal Layer
- [ ] Produce each person's Dark Chart before comparison

## HELIX AND CONVERGENCE

- [ ] Preserve the Helix as the primary convergence model
- [ ] Treat each strand as an independent person, place, time, or modality record
- [ ] Vault signals before synthesis
- [ ] Detect convergence
- [ ] Detect divergence
- [ ] Detect contradiction
- [ ] Detect recurrence across time and context
- [ ] Detect threshold changes
- [ ] Detect amplified and suppressed expression
- [ ] Preserve the full evidence trail behind every convergence
- [ ] Generate a stable convergence ID
- [ ] Render the Helix / DNA strand without flattening source layers
- [ ] Allow the user to inspect the evidence behind a visible strand

## COMPARATIVE ENGINE

- [ ] Compare two complete subject stores
- [ ] Compare their birth patterns
- [ ] Compare their wound and shadow patterns
- [ ] Compare their attachment and regulation needs
- [ ] Compare their locations over time
- [ ] Compare shared place and shared timeframe
- [ ] Compare how each person received the same environment
- [ ] Compare triggers and protective adaptations
- [ ] Compare what each person could provide under pressure
- [ ] Compare what the relationship could sustain
- [ ] Preserve resonance and incompatibility
- [ ] Explain connection, repetition, division, rupture, repair, and limits
- [ ] Generate three recognizable comparative-shadow candidates
- [ ] Include 3–5 statements and one relational-pattern sentence per card
- [ ] Make the user selection a calibration anchor
- [ ] Generate a Closure & Composure result from the selected pattern and preserved evidence
- [ ] Explain what was inherited, acquired, activated, repeated, and unavailable
- [ ] Provide one stabilizing next step
- [ ] Route deeper chips to valid Life Sections

## VOICE ORACLE

- [ ] Make Voice Oracle available from the first interaction
- [ ] Keep Chat and Manuscript available beside Voice
- [ ] Store the chosen mode
- [ ] Collect Foundation answers conversationally
- [ ] Read questions aloud in Voice mode
- [ ] Transcribe answers
- [ ] Confirm parsed names, dates, places, and years before sealing records
- [ ] Show the transcript and extracted structured values
- [ ] Ask only the next needed question
- [ ] Preserve context across Closure & Composure and Cadence
- [ ] Send finalized Generator records to Oracle
- [ ] Keep source calculations and routing inside Generator
- [ ] Render one coherent SEEN voice
- [ ] Support interruption, correction, replay, mute, and resume
- [ ] Verify microphone permission and browser fallbacks on iPhone

## CADENCE — REQUIRED IN THE FIRST COMPLETE PATH

- [ ] Begin Cadence immediately after the first Closure & Composure result
- [ ] Hand off the selected primary pattern
- [ ] Hand off wounds, attachment, regulation need, triggers, collapse risk, recurrence, and composure practice
- [ ] Create the first daily Cadence track automatically
- [ ] Add one-tap positive / neutral / difficult state logging
- [ ] Add happy-face / neutral-face / difficult-face quick input
- [ ] Allow optional journal expansion after a quick input
- [ ] Allow Voice Oracle journaling
- [ ] Capture trigger
- [ ] Capture body state
- [ ] Capture mood
- [ ] Capture sleep
- [ ] Capture stress
- [ ] Capture context, person, place, and time
- [ ] Capture response and consequence
- [ ] Track recurrence
- [ ] Track regulation and repair
- [ ] Track what changed after intervention
- [ ] Provide hourly, daily, and weekly views
- [ ] Show pattern trends like Apple Health shows steps and floors
- [ ] Feed observed Cadence data back into the preserved subject record
- [ ] Keep observed behavior distinct from calculated source layers
- [ ] Update confidence from accumulated evidence
- [ ] Route repeated triggers into the correct portals and Life Sections
- [ ] Produce a daily next action
- [ ] Produce a weekly pattern review
- [ ] Continue into Jung / Sovereignty when the evidence is mature

## PWA AND WIDGET

- [ ] Verify installable PWA shell
- [ ] Verify manifest, icons, service worker, and offline behavior
- [ ] Make the daily tracker reachable in one tap
- [ ] Create home-screen quick logging
- [ ] Add mobile widget design for quick state logging
- [ ] Define the web/PWA implementation available now
- [ ] Define the native wrapper/widget implementation required for lock-screen and home-screen widgets
- [ ] Synchronize widget entries with Cadence
- [ ] Verify entries appear in the user's daily timeline
- [ ] Verify private journal content remains distinct from quick status sharing

## FAMILY, CHILD, PARENT, AND TEACHER USE

- [ ] Create family relationship types
- [ ] Support parent → child understanding
- [ ] Support adult child → parent understanding
- [ ] Support sibling comparison
- [ ] Support caregiver translation
- [ ] Produce a child-facing explanation
- [ ] Produce a parent-facing explanation
- [ ] Produce a teacher-facing explanation
- [ ] Explain current pressure, trigger, adaptation, capacity, and support need
- [ ] Explain how the environment changes the child's expression
- [ ] Explain behavior without reducing the child to a label
- [ ] Provide specific coordination language for school and home
- [ ] Allow ongoing Cadence observations from authorized caregivers
- [ ] Preserve observer identity and provenance

## JUNG AND SOVEREIGNTY

- [ ] Route selected shadow evidence into Jung inversion
- [ ] Identify projection
- [ ] Identify disowned capacity
- [ ] Identify protective identity
- [ ] Identify shadow cost
- [ ] Identify reclaimed capacity
- [ ] Provide an integration practice
- [ ] Track integration through Cadence
- [ ] Make sovereignty the ability to choose after the pattern becomes visible

## EDEN — MASK-FREE DATING

- [ ] Build Eden after the SEEN → Closure & Composure → Cadence path works
- [ ] Use a processed SEEN profile rather than a shallow sign profile
- [ ] Let users choose what to share
- [ ] Allow mutual chart and comparative-field reading
- [ ] Show strengths, active work, regulation needs, and relationship capacities
- [ ] Distinguish journaled private detail from shareable pattern summaries
- [ ] Allow users to share Cadence consistency without exposing raw journal text
- [ ] Show areas of current struggle only through explicit sharing controls
- [ ] Generate a comparative Helix before matching claims
- [ ] Support place and timing compatibility for dates, trips, and relocation
- [ ] Preserve consent history for every shared field
- [ ] Create mask-free prompts from processed insight
- [ ] Track how the actual relationship compares with the original reading

## DATA, ACCOUNTS, AND PRIVACY

- [ ] Add account and email gate at the correct point in onboarding
- [ ] Replace critical `sessionStorage` records with persistent storage
- [ ] Define subject, relationship, location-period, event, portal-layer, evidence, convergence, shadow, reading, Cadence, and sharing tables
- [ ] Version all calculations and extraction templates
- [ ] Preserve provenance for generated claims
- [ ] Encrypt private user records
- [ ] Define deletion and export flows
- [ ] Keep Generator logic, system prompts, portal routing, and proprietary scoring server-side
- [ ] Add authorization checks for every subject and relationship record
- [ ] Add explicit sharing controls for family and Eden
- [ ] Store audit events for edits, consent, generation, and sharing

## GENERATOR / ORACLE SEPARATION

- [ ] Generator validates inputs
- [ ] Generator runs source calculations
- [ ] Generator runs source-specific extraction
- [ ] Generator routes all contributions through 64 portals
- [ ] Generator preserves evidence and provenance
- [ ] Generator detects convergence, divergence, contradiction, and recurrence
- [ ] Generator prepares Dark Chart and comparative shadow candidates
- [ ] Generator routes Life Sections
- [ ] Generator returns finalized records
- [ ] Oracle renders finalized records into questions, cards, explanations, and practices
- [ ] Oracle never invents a missing calculation
- [ ] Missing components produce explicit missing-state records

## VISUAL SYSTEM

- [ ] Preserve deep espresso, rich bronze-gold, warm ivory, crystal glass, illuminated topography, celestial movement, botanicals, and editorial serif typography
- [ ] Build an enchanted-card stack with accumulated completed layers
- [ ] Keep the active card centered and illuminated
- [ ] Keep prior cards visible as sealed layers
- [ ] Implement pulse, turn, dissolve, environmental transformation, and next-question transitions
- [ ] Visualize Location pressure before celestial layers
- [ ] Visualize distinct modality layers interwoven in the Helix
- [ ] Visualize low-pressure portals without removing them
- [ ] Verify animation performance and reduced-motion behavior

## TESTING AND RELEASE

- [ ] Add unit tests for every source calculator
- [ ] Add schema validation tests
- [ ] Add provenance-preservation tests
- [ ] Add no-cancellation tests
- [ ] Add contradiction and convergence tests
- [ ] Add Person A / Person B isolation tests
- [ ] Add location-duration and repeated-location tests
- [ ] Add trip/event-location comparison tests
- [ ] Add time-rectification tests
- [ ] Add three-card calibration tests
- [ ] Add Generator / Oracle boundary tests
- [ ] Add Cadence handoff and recurrence tests
- [ ] Add privacy and sharing tests
- [ ] Add PWA install tests
- [ ] Add iPhone voice, keyboard, scrolling, and safe-area tests
- [ ] Add end-to-end test for the first complete product path
- [ ] Run lint
- [ ] Run typecheck
- [ ] Run unit tests
- [ ] Run production build
- [ ] Deploy through GitHub → Vercel
- [ ] Verify the complete path on the production URL

## PRODUCT LANGUAGE AND SALES

- [ ] Lock one brand-level SEEN promise
- [ ] Lock one Closure & Composure entry hook
- [ ] Lock one result transition
- [ ] Lock one Cadence handoff
- [ ] Keep Location and comparative shadows visible in the differentiating explanation
- [ ] Explain the Helix in plain language
- [ ] Explain family and teacher value
- [ ] Explain Voice Oracle
- [ ] Explain daily follow-through
- [ ] Explain Eden as the later relational layer
- [ ] Separate broad SEEN language from product-specific Closure copy
- [ ] Test qualified-start rate
- [ ] Track completion of Person A Foundation
- [ ] Track completion of Person B Foundation
- [ ] Track comparative-shadow selection
- [ ] Track first Cadence entry
- [ ] Track 7-day Cadence return
- [ ] Track price-view-to-purchase conversion

## RECOVERED MATERIAL TO ADD

- [ ] Add Sean's approved reading exemplar
- [ ] Add father's approved reading exemplar
- [ ] Add mother's approved reading exemplar
- [ ] Add sister's approved reading exemplar
- [ ] Add the family comparative thread
- [ ] Add recovered Helix / DNA-strand documents
- [ ] Add recovered Dark Chart and shadow documents
- [ ] Add recovered Location-over-time documents
- [ ] Add recovered Cadence and widget documents
- [ ] Add recovered Eden documents
- [ ] Add recovered copy and splash research
- [ ] Compare each recovered source with current canon
- [ ] Record additions, reinforcements, and contradictions
- [ ] Update this checklist after every accepted decision

## DECISIONS TO LOCK

- [?] Final entry hook
- [?] Final supporting promise
- [?] Final CTA
- [?] Final Life Section registry count
- [?] Numerology position in the first pass
- [?] Exact account-gate position
- [?] Exact first paid boundary
- [?] Exact shared-data fields for family use
- [?] Exact shared-data fields for Eden
- [?] Native widget delivery phase

## DEFINITION OF FIRST RELEASE COMPLETE

- [ ] A user opens SEEN on their phone
- [ ] Chooses Voice, Chat, or Manuscript
- [ ] Completes Person A and Person B Foundation
- [ ] Supplies the relevant place and timeframe
- [ ] Receives three recognizable comparative shadows
- [ ] Selects the true pattern
- [ ] Receives a source-preserving explanation of what happened
- [ ] Begins a Cadence track immediately
- [ ] Logs the next trigger in one tap or by voice
- [ ] Returns and sees the pattern accumulating over time

