# CHART MVP — BUILDER BRIEF

Read `docs/TIME_NARROWING_LOCK.md` first.

Do not ship a page that asks for optional birth time.
That page is the wrong product.

## What to build now

Date + locations in.
Three hidden Western runs: 04:00 / 12:00 / 20:00.
Three pressure cards out. No clocks.
User picks. Narrow ±3h → ±2h → ±1h.
Lock time. Re-run Western at lock. Stop.

Existing calculator stays:
- `lib/natalChart.ts`
- POST `/api/chart`

Existing stub to replace, not admire:
- `app/foundation/rectification/page.tsx`
- `app/api/rectification/scenarios/route.ts`

`app/chart/page.tsx` is a raw dump. Do not advertise it as SEEN.

## Forbidden

- Optional time field
- Inventing noon
- Rebuilding Swiss Ephemeris
- Starting 64 portals before this ladder works
