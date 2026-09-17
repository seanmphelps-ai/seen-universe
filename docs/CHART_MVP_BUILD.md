# CHART MVP — BUILDER BRIEF

Do not rebuild SEEN. Do not start 64 portals. Do not start Cadence.

Sellable surface already exists:

- Page: `app/chart/page.tsx` → `/chart`
- API: `app/api/chart/route.ts` → POST `/api/chart`
- Calculator: `lib/natalChart.ts` (local Swiss Ephemeris)
- View: `components/NatalChartView`

## Product for money this week

A website. One page. Name + date + optional time + birth city → Western natal chart.
Charge after the chart renders, or gate Calculate behind payment. $20 is fine.

## Do

1. Make `/chart` the public entry for ads. Home can keep the Forge, but ads link straight to `/chart`.
2. Keep calculation server-side. `runtime = 'nodejs'`. Do not move Swiss Ephemeris to edge.
3. If time is missing, omit houses / Asc / MC. Do not invent noon.
4. Add payment (Stripe Checkout is enough). One product: Natal Chart $20.
5. After pay, show the same `NatalChartView` already in the repo.
6. Optional: email or download the result. Not required for launch.

## Do not

- Rewrite `calculateNatalChart`.
- Mix Vedic / BaZi / helix into this page.
- Block launch on location-v2 scoring, Maisel, or rectification.
- Use BLS/Census for this page.

## Known leftover incorrect items (not blockers for /chart)

- Some canon docs still say “one year” lived locations. Code is 6 months. Ignore docs if they conflict with `lib/foundation/intakeSchema.ts`.
- `/chart` city picker uses bundled `lib/cities.ts`. Fine for launch. Upgrade later to the location suggest API.
- No payment code exists yet. That is the only missing sell piece.

## Builder acceptance

- `/chart` loads on the deployed domain.
- Date + city produces planets without a birth time.
- Date + city + time produces houses.
- A test payment can be completed in Stripe test mode.
- Live mode takes $20 and still returns the chart.
