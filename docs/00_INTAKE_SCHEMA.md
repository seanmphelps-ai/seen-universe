// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# INTAKE SCHEMA — typed inputs and outputs, chained

Every stage has a defined INPUT and a defined OUTPUT.
The output of one stage is the input of the next.

Grok Bot first slice: `docs/00_GROK_BOT_FIRST_SLICE.md`.
First slice is Stage 0 through Stage 5: three hidden runs at `04:00`, `12:00`, and `20:00`, then ±3h, ±2h, and ±1h. Stages 6–10 exist as types only.

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

This is data collection.
1993 Los Angeles and 2026 Los Angeles are two separate entries.

---

## Stage 3 — Hidden Runs

**Input**
- `LivedExposure`
- three fixed local clocks: `04:00`, `12:00`, `20:00`

- Julian Day from date + clock + birthCity timezone
- planetary positions: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, true Lilith
- houses and lots = null until time is locked; signs and aspects still valid
- wound findings: all applicable, source-identified findings from each complete native reading — preserve the underlying placements and aspects where that modality supports them

**Output per run**
- `HiddenRun { clock, positions, woundMarkers[], livedExposure }`

Three runs. Three outputs. None shown to the user yet. Round 1 is these clocks.

---

## Stage 4 — Dark Cards

**Input**
- `HiddenRun[]` (three: `04:00`, `12:00`, `20:00`)
- `LivedExposure`

**For each run the generator produces one card:**
- a paragraph, minimum three sentences
- must contain: trigger, pressure point, behavior, where it collapses, where it thrives, cost to them, cost to others, what is lost if it runs one more cycle
- the lived exposure shapes the sentence: same Chiron in 1995 Compton and 2026 Whitefish is a different card

**Output**
- `DarkCard[]` (three), each `{ runId, paragraph, livedExposureRef }`

If a card reads like a horoscope, reject it.

---

## Stage 5 — Pick and Narrow

**Input**
- `DarkCard[]`

**Round 1**: three hidden runs (`04:00`, `12:00`, `20:00`). User picks the summary they recognize.
**Round 2**: ±3h around the pick → three new cards. `04:00` → `01:00` / `04:00` / `07:00`. `12:00` → `09:00` / `12:00` / `15:00`. `20:00` → `17:00` / `20:00` / `23:00`.
**Round 3**: ±2h around the latest pick → three new cards.
**Round 4**: ±1h around the latest pick → three new cards.

**Output**
- `LockedTime { localClock, timezone, confidence, rounds[] }`

FIRST SLICE ENDS HERE.

---

## Stage 6 — Locked Western — DEFERRED IMPLEMENTATION

**Input**
- `LockedTime`
- `BirthAnchor`

**Output**
- full Western chart at the locked clock

---

## Stage 7 — Lived-Location Gift and Cost — DEFERRED IMPLEMENTATION

---

## Stage 8 — Family as Soil — DEFERRED IMPLEMENTATION

---

## Stage 9 — Sovereignty — DEFERRED IMPLEMENTATION

---

## Stage 10 — Portals and Helix — DEFERRED IMPLEMENTATION

64 portals file into 45 life sections later.
This is where other builders lost the plot.

---

## The chain, one line

`Identity → BirthAnchor → LivedExposure → HiddenRun[3] → DarkCard[3] → Pick/Narrow (±3h → ±2h → ±1h) → STOP`

Each arrow is a typed handoff.

---

## UI

Horizontal scroll rail of live HTML cards over Forge atmosphere art.

---

## Forbidden

- Environment before date
- Optional time
- Noon as a stand-in
- Round 1 at 06:00 / 18:00
- Clock on dark cards
- One-line or sentence-only cards
- Planet names or house numbers in user-facing text
- Jung on dark cards
- Personality bands
- Scoring engines on the first cards
- Building Stage 6–10 because the file lists them
- `docs/phase-one/00_PHASE_ONE_INTAKE_ARCHITECTURE.md`
