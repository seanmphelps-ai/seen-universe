# CHART MVP — BUILDER BRIEF

Read `docs/00_INTAKE_ORDER_LOCK.md` then `docs/TIME_NARROWING_LOCK.md`.

Date + birth city in first. Not optional. Those two feed the three hidden runs.
Lived-location index is not in yet. That comes after the time pick.

## What to build now

Name + date + birth city in.
Three hidden runs at 04:00 / 12:00 / 20:00.
Each run computes Western + Vedic wound markers: Chiron, Lilith, Ashlesha, Neptune, Mars, Venus, matching Vedic marks.
Three dark pressure cards out. No clocks. Bite on the card.
User picks. Narrow ±3h → ±2h → ±1h.
Lock time. Re-run Western at lock. Stop.

Existing calculator stays:
- `lib/natalChart.ts`
- POST `/api/chart`

Existing stub to finish:
- `app/foundation/rectification/page.tsx`
- `app/api/rectification/scenarios/route.ts`

`app/foundation/page.tsx` must not redirect to location first.
`app/chart/page.tsx` must not render a pretty wheel before the three cards.

## Forbidden

- Optional time field
- Inventing noon
- Rebuilding Swiss Ephemeris
- Starting 64 portals before this ladder works
- Lived-environment scoring before date + birth city
