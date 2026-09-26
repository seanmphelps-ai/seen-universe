# EXISTING FILE WIRING

Builder: change these files. Do not create a second city search or a second people table.

## Already built — reuse

| Job | File |
|---|---|
| City typeahead with lat/long | `components/LocationAutocompleteInput.tsx` |
| Suggest API | `app/api/location/suggest/route.ts` |
| City data | `lib/location/citySuggest.ts` |
| Swiss calc | `lib/natalChart.ts` → `POST /api/chart` |
| Card text API | `app/api/rectification/scenarios/route.ts` |
| One user, many names | `app/api/saved-people/route.ts` |
| Person page | `app/people/[personId]/page.tsx` |
| Account | `app/account/page.tsx` |
| Intake Zod | `lib/foundation/intakeSchema.ts` |
| Card Zod | `lib/rectification/schema.ts` |

## Entry that is live

`app/chart/page.tsx`

It already collects name, date, city, lived text, writes `seen.foundation.birth`, routes to `/foundation/rectification`.

Change only this on that page:

1. Replace the local `CITIES` filter with `LocationAutocompleteInput` so the pick includes lat/long from `/api/location/suggest`.
2. Replace the `livedStack` textarea string with `livedPlaces[]` matching `LivedPlaceSchema` (place + startYear + endYear).
3. Copy on the page still says 4 AM / noon / 8 PM. Change it to 06:00 / 18:00 until we switch back.
4. On submit, also `POST /api/saved-people` when the user is signed in.

## Rectification that is live

`app/foundation/rectification/page.tsx`

It already runs `/api/chart` per candidate and `/api/rectification/scenarios`.

Change only this:

1. `INITIAL_MINUTES` is `[4*60, 12*60, 20*60]`. First try: `[6*60, 18*60]`.
2. Round 0 must accept 2 candidates. Later rounds stay 3.
3. Pass `livedPlaces` from `seen.foundation.birth` into the scenarios request. Stop sending nothing.
4. Stop requiring `candidates.length !== 3` before continue on round 0.
5. Cards carry the structured portal extraction fields, not one anonymous folded paragraph, and not a 0–100 rating grid if that grid is still the only chooser. Pick the card. Then narrow.

## Do not use as the first screen

`app/foundation/birth/page.tsx`

It expects location to already exist (`Complete your location first`). That is the old invert. Leave the file. Do not route `/chart` through it.

`components/NatalIntakeForm.tsx`

It still has optional time. Do not use it on the first screen. Keep it for a later locked-time override only.

## Saved people

`app/api/saved-people/route.ts` already upserts by `owner_id + name + birth_date`.

`birthTime` may be null there. That is correct on first save. Write the locked clock into that row after rectification finishes.

## One path

```
/chart
  LocationAutocompleteInput
  LivedPlaceSchema rows
  session seen.foundation.birth
  POST /api/saved-people if signed in
→ /foundation/rectification
  POST /api/chart at 06:00 and 18:00
  POST /api/rectification/scenarios with livedPlaces
  pick card
  narrow
  write locked time onto the saved person
```
