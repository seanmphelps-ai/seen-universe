# GROK BOT — FIRST SLICE ONLY

Read this file. Then `docs/00_INTAKE_SCHEMA.md`. Then build.
Do not read shipper.now, dyad, stackblitz, or chat memory.
Do not build portals, helix, Jung, BaZi, numerology, Tzolk'in, 45 sections, or cadence.

## Stop line

A stranger can enter name + date + birth city + lived places and pick one of two dark cards.
That is the whole job. When that works, stop and wait.

## Order

1. Name of the system being read
2. Birth date
3. Birth city (lat/long)
4. Lived places + years (6 months counts)
5. Two hidden runs: 06:00 and 18:00
6. Two dark cards. No clocks. User picks one.
7. Then ±3h around the pick (03/06/09 or 15/18/21)
8. Then ±2h
9. Then ±1h

## UI

- Entry: `/chart`. No splash required.
- Horizontal scroll rail of live HTML cards over Forge atmosphere art.
- Art has no baked text.
- Not a sitemap tree. Not separate tabs. Not separate files per time.
- One request runs both clocks. One screen shows both cards.

## Cards

Western + Vedic wound markers only: Chiron, true Lilith, Ashlesha, Neptune, Mars, Venus.
Lived years shape the sentences. Swiss numbers do not change.
Paragraph. Minimum three sentences.
Must contain: trigger, pressure point, behavior, collapse, thrive, cost to them, cost to others, what is lost if it runs one more cycle.
No planet names, houses, degrees, or clocks on the card.
If it reads like a horoscope, reject it.

## Calculator

`lib/natalChart.ts` via `POST /api/chart`.
Cards need `AI_GATEWAY_API_KEY` on Vercel. Do not fake cards if it 503s.

## Forbidden

- Place / environment before date
- Optional time
- Typed clock on first screen
- 04:00 / 12:00 / 20:00 as round 1 (retired)
- 64 portals on this slice
- Helix / Jung / BaZi / 25 lenses on this slice
- `docs/phase-one/00_PHASE_ONE_INTAKE_ARCHITECTURE.md`
- Building past the stop line because the rest of the repo exists
