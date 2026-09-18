# SEEN FULL SYSTEM MAP

Point a builder here.
This is the whole product in build order.
A layer with a HOLE cannot be built. Fill the hole in this repo first.
Do not invent lists. Do not invent the relationship model.

Repo: seanmphelps-ai/seen-universe
Branch: closure-and-composure
Sky: Swiss Ephemeris only. `lib/natalChart.ts` → `POST /api/chart`.

---

## Forces (equal, always)

- Seed = natal sky at date + city + locked clock
- Soil = family (after dark cards work)
- Weather = lived places + years (6 months counts). 1993 LA ≠ 2026 LA
- Sensitivity is discovered by recognition. Nothing shouts. Nothing whispers by rule.

---

## UI (whole product)

Horizontal rail. Live HTML cards. Forge atmosphere art with no baked text.
Scroll left / right. Active card snaps center. Helix is this motion, not a drawn tree.
Entry: `/chart`. Splash optional later. Never required to start.

---

## PHASE A — Dark chart (build this)

Files:
- `docs/00_GROK_BOT_FIRST_SLICE.md`
- `docs/00_INTAKE_SCHEMA.md` Stages 0–5
- `docs/00_INTAKE_ORDER_LOCK.md`
- `docs/TIME_NARROWING_LOCK.md`

Chain:

```
Name
→ Date
→ Birth city (lat/long)
→ Lived places + years
→ Hidden runs 06:00 and 18:00
→ Two dark cards, no clocks
→ Pick
→ ±3h / ±2h / ±1h
→ LockedTime
```

Cards: Western + Vedic wound markers only.
Chiron, true Lilith, Ashlesha, Neptune, Mars, Venus.
Paragraph. Trigger, pressure, behavior, collapse, thrive, cost to them, cost to others, what is lost.
Lived years shape sentences. Swiss numbers do not change.

Fallback if two cards do not separate: restore 04:00 / 12:00 / 20:00 as round 1.

HOLE: `docs/examples/` lists five exemplars. None exist. Builder may ship cards without them. Do not use the Bree transcript as a template. It braids and uses the dead invert.

---

## PHASE B — Locked Western tab

Input: LockedTime + BirthAnchor.
Output: full Western at the locked clock. Own plate on the rail.
Still no portals.

---

## PHASE C — Lived-location gift and cost

Three summaries per major place. Each summary has good and bad. Not only wound.
Rural vs projects, year-specific. Same city different years = different cards.

---

## PHASE D — Family as soil

Family intake. Modifies expression on the 45. Does not rewrite Swiss.
HOLE: family questions not locked in one typed file.

---

## PHASE E — Lists that must exist before portals

HOLE: `docs/45_LIFE_SECTIONS.md` does not exist. 45 named ids required. Do not invent.
HOLE: `docs/64_PORTALS.md` does not exist. 64 names + the question each asks. Do not invent.
HOLE: 25 Maisel lenses mentioned in canon. No canonical list file. Do not invent.

Builder stops here until those three files are in the repo.

---

## PHASE F — Systems as agents, portals as questions

One agent per system. Each starts cold from the same BirthAnchor + LockedTime + LivedExposure.
No shared memory mid-run.

Agents:
- Western
- Vedic
- Hellenistic
- BaZi / Four Pillars
- Numerology
- Tzolk'in
- Galactic signature
- Human Design / I Ching degree-to-gate map
- 25 lenses (after the list exists)

Not 64 agents. Portals are I Ching bones with Human Design depth. SEEN adds lived years, dark time pick, and soil. That is the extra support I Ching and HD do not have.

Each agent returns `{ sectionId, finding, source, arc }` and files it. Source tag never stripped.

---

## PHASE G — It (Document 4)

File: `docs/04_IT.md`

No bypass.
Native marker keeps full weight.
Degree maps to gate / hexagram where the mapping is real.
Composite = marker × degree × gate × lived years.
SEEN asks: pressure, trigger, adaptation, behavior, payoff, cost, consequence, people, place, time, recurrence, failure, potential.
File into a Life Section. Keep source.

Pluto conjunct Ascendant does not become Gate 28.
An old spicy reading line is not a calculation rule.

Three operations:
1. Discovery — each modality finds what it knows
2. Resolution — cross only on a real map (degree → gate)
3. Dissection — ask the lattice of the higher-resolution signal

No mash. No rewrite of the original marker.

---

## PHASE H — Sovereignty then Cadence

Sovereignty: what is actually possible if they get out of their own way. After dark protocol.
Cadence: daily trigger tracker. Typed handoff. Not this build until Sovereignty ships.

---

## PHASE I — Relationship field — NOT SPECIFIED

Do not build.
The picture is two expressed systems at a time and a place:

```
(A seed × A soil × A weather × time)
                 ↕
(B seed × B soil × B weather × time)
```

That is not compatibility of two static charts.
Rules, questions, and outputs for this layer have not been walked in this thread.
Leave a stub. Do not implement. Do not invent edges, snapshots, or scoring.

---

## PHASE J — Narrative script (not a mash)

Last. A script pulls from the 45 by keys. Each source still sounds like itself.
No synthesize. No braid. Conduct, do not blend.

---

## Dead files

- `docs/phase-one/00_PHASE_ONE_INTAKE_ARCHITECTURE.md` — environment before date. Dead.
- Optional time. Dead.
- One-line / sentence-only cards. Dead.
- The word stack with no type. Use `LivedExposure`.
- 108 portals. There are 64.
- Shipper / dyad / stackblitz memory. Dead.

---

## Builder command

```
Read docs/00_FULL_SYSTEM_MAP.md.
Build PHASE A until a stranger can pick a dark card.
Do not invent PHASE E lists.
Do not implement PHASE I.
```
