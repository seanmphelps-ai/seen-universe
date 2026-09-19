# LOCATION ENGINE — builder lock
# Paste into seen-universe as docs/LOCATION_ENGINE.md
# Branch: closure-and-composure
# Does not replace city search. Reuses lib/location/citySuggest + saved-people.
# Does not call BLS / Census. Narrative + lived intake + year-cut.

Status: CANONICAL for generator I/O.
Version: 1.0.0
Date: 2026-09-18

---

## 0. Law

Place is the incubator.
Exposure is what accumulates inside it.
The person is not a constant seed dropped into dirt.
The plant can be transplanted. Roots can take. Roots can rot.
Montana can starve a tree that Castro Valley grew. Same organism. Different soil. Different training.

Location and chart are equal forces. Neither whispers. Neither shouts by rule.
The person decides which force ran louder in that window.

No sentence cap.
No doctor-report card.
No gift clause on the dark chart.
Gift and cost both live on location cards because location narrowing is the opposite of time narrowing.

---

## 1. Order in the runtime

Date + city first.
Time is still unknown.

Why: three location cards need a date window and a place so Western + Vedic wound markers can be computed at 4am / noon / 8pm against that soil. You cannot date the soil after the clock is locked.

```
INPUT
  identity
  birth date (required)
  birth city (required, autocomplete already in repo)
  lived places[]  each: city, start, end or ongoing, years if known
  current place

THEN
  resolve each place (lat/lon/timezone already in citySuggest)
  year-cut the city (1960 Compton ≠ 1995 Compton)
  build three location cards per place (Western / Vedic / Blended)
  user picks the field they lived
  tighten 2–3 rounds (neighborhood / stratum / era)
  lock EnvironmentalResonanceRecord

THEN
  time narrowing (dark cards, 4am noon 8pm → ±2h → ±1h)
  clock lock

THEN
  64 portals pre-charged by the locked field
  each portal files into 45 life sections
  Oracle later
```

Birth place, every 6+ month place, current place. Separate snapshots. Never one blended city profile.

---

## 2. Input

```
LivedPlace
  placeId
  label                  // "Castro Valley, CA"
  lat, lon, timezone     // from existing city search
  role                   // BIRTH | LIVED | CURRENT
  startDate              // YYYY-MM-DD or year
  endDate                // YYYY-MM-DD | year | null = ongoing
  durationMonths         // computed; < 6 months = do not evaluate as a field
  stratumNote            // optional: hills / flats / projects / rural / school
  eraNote                // optional: "late 90s Compton" not "Compton"
```

Reuse: `lib/location/citySuggest.ts`, saved-people API.
Do not rebuild autocomplete.

---

## 3. Output — one card shape

Every location card MUST contain all of these fields. Paragraphs allowed. No max length.

- fieldName            soil, not wound
- era                  year-cut
- stratum              which version of that city
- gift
- cost
- rewarded             what gets attention, status, belonging
- punished             what gets ignored, excluded, shamed
- normalized           what people stop noticing
- aspiredToward
- afraidOfLosing
- moneyGoesTo          what people spend on when they have a choice
- underPressure        how a body reacts on this soil (not the natal wound)
- lean                 WESTERN | VEDIC | BLENDED
- routesTo             lifeSectionId[] (1–45)
- precharges           portalId[] (1–64)
- honestyCheck         the wrong card must feel wrong, not just less nice

Training chain the generator must name, in this order, for each locked place:

```
Environment
→ Pressure
→ Trigger
→ Adaptation
→ Behavior
→ Belief
→ Capacity
→ Cost
→ Consequence
```

Name the rotting root if the current soil is starving the plant.
Name the taking-root if the current soil is growing something the old soil could not.

---

## 4. Three cards, then tighten

Round 1 — same city, three soils
- Card A Western lean (Chiron, true Lilith, 8th/12th load, Mars/Venus contacts)
- Card B Vedic lean (nakshatra bite: Ashlesha etc., dasha weather for that year-cut)
- Card C Blended (corridor / two-zip reality)

User picks the field they lived. Gift and cost together.
Pick writes EnvironmentalResonanceRecord.
Pick does not rewrite raw signals.

Rounds 2–4 — smaller soil
- hill vs flats
- school vs block
- year-cut
- class stratum
Still three cards. Still gift + cost on every card.

Opposite of time:
- Time → darker, tighter, mask, sabotage
- Location → whole field, gift and cost, then tighter geography

---

## 5. Questions the engine asks the PLACE
(not the user — self-interrogation, same rule as portals)

- What gets rewarded here
- What gets punished here
- What gets ignored
- What gets attention
- What earns status
- What creates belonging
- What creates exclusion
- What people aspire toward
- What people are afraid of losing
- What people spend money on when they have a choice
- What the child learns is safe
- What the child learns is dangerous
- What adaptation this soil trains
- What capacity this soil builds
- What capacity this soil starves
- What this soil costs the body after years
- What happens if you transplant out of it
- What happens if you stay

Same question bank can be reworded for a portal.
Do not invent a second bank.

---

## 6. Marker vector (do not collapse)

From SEEN_BUILDER_CONTRACT. Keep as vector. Never one score.

Required:
- markerId
- locationId
- timeWindow
- eventPrevalence
- physicalExposure
- digitalExposure
- socialAmplification
- participantBreadth
- concentration
- responseValence
- trend
- confidence
- sourceFamilyBreakdown
- seedSensitivityWeight

null = unmeasured. 0 = measured absence. Never render null as 0.

Sources: public narrative (TikTok / IG / Reddit / local forums / news voice). Provider-agnostic.
No Census, no BLS required.
One source family cannot push confidence above 0.6.

Equation for combining dimensions: NOT LOCKED.
Keep nine fields. Do not invent a single “location score.”

---

## 7. Seed rule (mutable)

Name: bonsai.

- Chart is the cutting.
- Place is the pot and the weather.
- Training rewrites expression. It can also starve the cutting.
- computeSeedSensitivity tilts the prior only.
- Observed field always wins if it contradicts the tilt.
- If the person says the environment ran them, believe the environment for that window.
- Current place can be a mismatch. The engine must be allowed to say: this soil does not feed this plant.

Do not write “seed stays constant.”
Do not write “location only whispers.”

---

## 8. Filing

After lock:
- Every named pressure routes to one or more of docs/45_LIFE_SECTIONS.md
- Every activated frequency pre-charges one or more of docs/64_PORTALS.md
- Portals file into sections. Sections do not file into portals.
- Empty section = visible silence. Do not invent.

---

## 9. Helix

Location cards sit on the place strand.
User scrolls places left to right.
Select a place → three cards → pick → tighten.
Select a portal on that place → full extraction (trigger, pressure, behavior, collapse, thrive, cost to self, cost to others, what is lost).
No sentence cap.

---

## 10. Refusals

- Do not put environment before date.
- Do not lock time before location cards exist.
- Do not write one-line summaries.
- Do not require APIs the repo does not have.
- Do not rebuild city autocomplete.
- Do not merge SEEN_universal into this file.
- Do not diagnose attachment from planets. Attachment comes from intake + this field.
- Do not average two places into one person.

---

## 11. Builder first slice

1. Intake: date + city autocomplete + lived places[]
2. Render three cards for birth place using the card shape in §3
3. Store pick
4. Stop

Do not build helix, Oracle, or 64 agents in slice 1.
Wire pick → EnvironmentalResonanceRecord only.
