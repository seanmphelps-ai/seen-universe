# INTAKE SCHEMA — typed inputs and outputs, chained

Every stage has a defined INPUT and a defined OUTPUT.
The output of one stage is the input of the next.
No stage runs on a word that is not defined.

Grok Bot first slice: `docs/00_GROK_BOT_FIRST_SLICE.md`.
First slice ends at Stage 5 Round 1 working. Stages 6–10 exist as types only. Do not build them yet.

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
- two fixed local clocks: `06:00`, `18:00`

**For each clock the engine computes (Swiss Ephemeris, never homemade):**
- Julian Day from date + clock + birthCity timezone
- planetary positions: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, true Lilith
- houses and lots = null until time is locked; signs and aspects still valid
- wound findings: all applicable, source-identified findings from each complete native reading — preserve the underlying placements and aspects where that modality supports them

**Output per run**
- `HiddenRun { clock, positions, woundMarkers[], livedExposure }`

Two runs. Two outputs. None shown to the user yet.

---

## Stage 4 — Dark Cards

**Input**
- `HiddenRun[]` (both)
- `LivedExposure`

**For each run the generator produces one card:**
- structured extraction fields, not one folded paragraph
- no clock shown
- no planet names, house numbers, degrees, or aspect types visible
- fields: triggers, pressure points, failure modes, costs/consequences, how pressure builds, how it releases, what typically gets destroyed, how long they let it go, show, defend, react, what is lost if it runs one more cycle
- lived exposure shows how the intact seed meets that dirt. It does not rewrite the native reading. Same seed in 1995 Compton and 2026 Whitefish is a different incubation.
- modalities stay whole. Do not mix them into shared prose.

**Output**
- `DarkCard[]` (two), each `{ runId, livedExposureRef, extraction }` where `extraction` is the field list in `docs/canon/PORTAL_TEMPLATE.md`

If a card reads like a horoscope, or if it blends modalities, reject it.

---

## Stage 5 — Pick and Narrow

**Input**
- `DarkCard[]`

**Round 1**: user picks one of two (06:00 vs 18:00).
**Round 2**: ±3h around the pick → three new cards.
**Round 3**: ±2h → three new cards.
**Round 4**: ±1h → three new cards.

**Output**
- `LockedTime { localClock, timezone, confidence, rounds[] }`

FIRST SLICE ENDS HERE.

---

## Stage 6 — Locked Western — DO NOT BUILD YET

**Input**
- `LockedTime`
- `BirthAnchor`

**Output**
- full Western chart at the locked clock

---

## Stage 7 — Lived-Location Gift and Cost — DO NOT BUILD YET

---

## Stage 8 — Family as Soil — DO NOT BUILD YET

---

## Stage 9 — Sovereignty — DO NOT BUILD YET

---

## Stage 10 — Portals and Helix — DO NOT BUILD YET

64 portals file into 45 life sections later. They are not this slice.
This is where other builders lost the plot. Do not start it.

---

## The chain, one line

`Identity → BirthAnchor → LivedExposure → HiddenRun[2] → DarkCard[2] → Pick/Narrow → STOP`

Each arrow is a typed handoff. No stage skips its input. No stage invents its output.

---

## UI

Horizontal scroll rail of live HTML cards over Forge atmosphere art.
No splash required. No sitemap tree. No separate tab per clock.

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
- 108 portals (there are 64, and they are not this slice)
- Personality bands
- Scoring engines on the first cards
- Building Stage 6–10 because the file lists them
- `docs/phase-one/00_PHASE_ONE_INTAKE_ARCHITECTURE.md`
