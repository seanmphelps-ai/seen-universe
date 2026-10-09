// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# LOCATION ENGINE — builder lock
# Paste into seen-universe as docs/LOCATION_ENGINE.md
# Branch: closure-and-composure
Reuses `lib/location/citySuggest` and saved-people for city search.
Inputs: narrative, lived intake, and historical year-cut.

Status: CANONICAL for generator I/O.
Version: 1.0.0
Date: 2026-09-18

---

## 0. Law

Place is the incubator.
Exposure is what accumulates inside it.
The plant can be transplanted. Roots can take. Roots can rot.
Montana can starve a tree that Castro Valley grew. Same organism. Different soil. Different training.

Location and chart are equal forces. Neither whispers. Neither shouts by rule.
The person decides which force ran louder in that window.

Gift and cost both live on location cards because location narrowing is the opposite of time narrowing.

---

## 1. Order in the runtime

Date + city first.
Time is still unknown.

Why: three location cards need a date window and a place so Western + Vedic wound markers can be computed at 4am / noon / 8pm against that soil.

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

Birth place, every 6+ month place, current place. Separate snapshots.

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
  stratumNote            // optional: hills / flats / projects / rural / school
```

Reuse: `lib/location/citySuggest.ts`, saved-people API.

---

## 3. Output — one card shape

Every location card MUST contain all of these fields. Paragraphs allowed.

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
- lean                 WESTERN | VEDIC | BLENDED
- routesTo             lifeSectionId[] (1–45)
- precharges           portalId[] (1–64)

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

---

## 4. Three cards, then tighten

Round 1 — same city, three soils
- Card A Western lean (Chiron, true Lilith, 8th/12th load, Mars/Venus contacts)
- Card B Vedic lean (nakshatra bite: Ashlesha etc., dasha weather for that year-cut)
- Card C Blended (corridor / two-zip reality)

User picks the field they lived. Gift and cost together.
Pick writes EnvironmentalResonanceRecord.

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

---

## 6. Marker vector

From SEEN_BUILDER_CONTRACT. Keep as vector.

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

null = unmeasured. 0 = measured absence.

Sources: public narrative (TikTok / IG / Reddit / local forums / news voice). Provider-agnostic.

Keep nine fields.

---

## 7. Seed rule (mutable)

Name: bonsai.

- Chart is the cutting.
- Place is the pot and the weather.
- Training rewrites expression. It can also starve the cutting.
- computeSeedSensitivity tilts the prior only.
- Observed field always wins if it contradicts the tilt.
- If the person says the environment ran them, believe the environment for that window.
- Current place can be a mismatch.

---

## 8. Filing

After lock:
- Every named pressure routes to one or more of docs/45_LIFE_SECTIONS.md
- Every activated frequency pre-charges one or more of docs/64_PORTALS.md
- Portals file into sections.
- Empty section = visible silence.

---

## 9. Helix

Location cards sit on the place strand.
User scrolls places left to right.
Select a place → three cards → pick → tighten.
Select a portal on that place → full extraction (trigger, pressure, behavior, collapse, thrive, cost to self, cost to others, what is lost).

---

## 10. Refusals

- Attachment comes from intake + this field.

---

## 11. Builder first slice

1. Intake: date + city autocomplete + lived places[]
2. Render three cards for birth place using the card shape in §3
3. Store pick
4. Stop

Wire pick → EnvironmentalResonanceRecord only.
