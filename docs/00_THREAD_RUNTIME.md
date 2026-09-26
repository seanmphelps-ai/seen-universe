# THREAD RUNTIME — 2026-09-18

Another thread / Grok Bot: read `docs/00_GROK_BOT_FIRST_SLICE.md` first. Then this. Then run.

## Input you need from the user

Minimum to start:

- name of the system (self / ex / parent / child)
- birth date
- birth city

Also collect if they have it, BEFORE cards:

- lived places 6+ months with years (1993 LA ≠ 2026 LA)

Do not ask for a clock. Do not guess noon.

## Where to run in this repo

```text
/chart
  → writes session seen.foundation.birth { name, birthDate, city{name,country,latitude,longitude}, livedPlaces? }
  → /foundation/rectification
       POST /api/chart twice at 06:00 / 18:00
       POST /api/rectification/scenarios
       two dark cards, no clocks, lived exposure in the extraction fields
       pick → narrow
       STOP
```

Calculator: `lib/natalChart.ts` via `POST /api/chart`.
Sky numbers do not change because of lived places.
Card extraction fields use the lived exposure when present. Location does not rewrite the native reading. Do not fold modalities into one paragraph.

## Forbidden for the other thread

- Start at `/foundation/location`
- Environment-before-date
- Pretty natal wheel before two dark cards
- Optional time field
- Building 64 portals before this ladder works
- Reading `SEEN_universal` as current
- One-line cards
- Sentence-only summaries
- The word "stack" with no type — use `LivedExposure`
- `docs/phase-one/00_PHASE_ONE_INTAKE_ARCHITECTURE.md`

## If cards 503

Scenarios need `AI_GATEWAY_API_KEY` on Vercel. Swiss math still runs without it. Do not fake the cards.
