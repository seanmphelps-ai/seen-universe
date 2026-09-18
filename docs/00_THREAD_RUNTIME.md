# THREAD RUNTIME — 2026-09-17

Another thread: read this file first. Then `docs/00_INTAKE_ORDER_LOCK.md`. Then run.

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
  → writes session seen.foundation.birth { name, birthDate, city{name,country,latitude,longitude}, livedStack? }
  → /foundation/rectification
       POST /api/chart three times at 04:00 / 12:00 / 20:00
       POST /api/rectification/scenarios
       three dark cards, no clocks
       pick → narrow
```

Calculator: `lib/natalChart.ts` via `POST /api/chart`.
Sky numbers do not change because of lived places.
Card *sentences* must use the lived stack when present.

## Forbidden for the other thread

- Start at `/foundation/location`
- Environment-before-date
- Pretty natal wheel before three dark cards
- Optional time field
- Building 64 portals before this ladder works
- Reading `SEEN_universal` as current

## If cards 503

Scenarios need `AI_GATEWAY_API_KEY` on Vercel. Swiss math still runs without it. Do not fake the cards.
