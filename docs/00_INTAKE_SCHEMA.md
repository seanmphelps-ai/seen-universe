# INTAKE SCHEMA — typed inputs and outputs, chained

Every stage has a defined INPUT and a defined OUTPUT.
The output of one stage is the input of the next.
No stage runs on a word that is not defined.

---

## Stage 0 — Identity

**Input**
- `name`: string (the system being read: self / ex / parent / child)

**Output**
- `Identity { name }`

---

## Stage 1 — Birth Anchor

**Input**
- `Identity`
- `birthDate`: ISO date (year, month, day)
- `birthCity`: { name, country, latitude, longitude }

**Output**
- `BirthAnchor { name, birthDate, birthCity }`

Birth city is coordinates only. It exists so Swiss Ephemeris can compute.
No lived places here. No scoring. No environment.

---

## Stage 2 — Lived Exposure

**Input**
- `BirthAnchor`
- `livedPlaces`: array of
  - `place`: { name, country, latitude, longitude }
  - `startYear`: number
  - `endYear`: number | null (null = still there)
  - `yearsLived`: number (derived: endYear - startYear, or currentYear - startYear)

**Rule**: a place counts only when `yearsLived >= 0.5` (six months).

**Output**
- `LivedExposure { birthAnchor, livedPlaces[] }`

This is data collection. No scoring. No sky calculation. No card text yet.
1993 Los Angeles and 2026 Los Angeles are two separate entries.

---

## Stage 3 — Hidden Runs

**Input**
- `LivedExposure`
- three fixed local clocks: `04:00`, `12:00`, `20:00`

**For each clock the engine computes (Swiss Ephemeris, never homemade):**
- Julian Day from date + clock + birthCity timezone
- planetary positions: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, true Lilith
- if clock known: Ascendant, Midheaven, houses, lots
- if clock unknown: houses and lots = null; signs and aspects still valid
- wound markers: Chiron, true Lilith, Ashlesha, Neptune, Mars, Venus — sign, degree, house (when known), aspects

**Output per run**
- `HiddenRun { clock, positions, woundMarkers[], livedExposure }`

Three runs. Three outputs. None shown to the user yet.

---

## Stage 4 — Dark Cards

**Input**
- `HiddenRun[]` (all three)
- `LivedExposure`

**For each run the generator produces one card:**
- a paragraph, minimum three sentences
- no clock shown
- no planet names, house numbers, degrees, or aspect types visible
- must contain: trigger, pressure point, behavior, where it collapses, where it thrives, cost to them, cost to others, what is lost if it runs one more cycle
- the lived exposure shapes the sentence: same Chiron in 1995 Compton and 2026 Whitefish is a different card

**Output**
- `DarkCard[]` (three), each `{ runId, paragraph, livedExposureRef }`

If a card reads like a horoscope, the portal did not run. It got summarized. Reject it.

---

## Stage 5 — Pick and Narrow

**Input**
- `DarkCard[]`

**Round 1**: user picks one of three.
**Round 2**: ±3h around the pick → three new cards.
**Round 3**: ±2h → three new cards.
**Round 4**: ±1h → three new cards.

**Output**
- `LockedTime { localClock, timezone, confidence, rounds[] }`

---

## Stage 6 — Locked Western

**Input**
- `LockedTime`
- `BirthAnchor`

**Output**
- full Western chart at the locked clock: positions, houses, angles, aspects, lots
- rendered in its own tab, not mixed with dark cards

---

## Stage 7 — Lived-Location Gift and Cost

**Input**
- `LivedExposure`
- `LockedWestern`

**Output**
- per lived place: one gift sentence, one cost sentence, both true
- never only-good, never only-bad

---

## Stage 8 — Family as Soil

**Input**
- `LockedWestern`
- family intake (optional, collected here)

**Output**
- soil modifiers applied to the 45 Life sections
- family feeds or starves the seed; it does not replace it

---

## Stage 9 — Sovereignty

**Input**
- dark cards + locked western + lived exposure + family soil

**Output**
- the loop named: trigger → action → destruction → reset → trigger
- what the pattern protects
- what is available if the loop stops
- nothing positive before this stage

---

## Stage 10 — Portals and Helix

**Input**
- everything above

**Output**
- 64 portals, always present, interrogated not filed
- helix runtime: spinning, modalities selectable, interconnected
- Jung layer last, visible only

---

## The chain, one line

`Identity → BirthAnchor → LivedExposure → HiddenRun[3] → DarkCard[3] → Pick/Narrow → LockedTime → LockedWestern → LivedGiftCost → FamilySoil → Sovereignty → Portals/Helix`

Each arrow is a typed handoff. No stage skips its input. No stage invents its output.

---

## Forbidden

- The word "stack" with no type behind it
- Environment before date
- Optional time
- Noon as a stand-in
- Clock on dark cards
- One-line or sentence-only cards
- Planet names or house numbers in user-facing text
- Jung on dark cards
- 108 portals (there are 64)
- Personality bands
- Scoring engines on the first cards
- `docs/phase-one/00_PHASE_ONE_INTAKE_ARCHITECTURE.md` (dead — environment-before-date)
