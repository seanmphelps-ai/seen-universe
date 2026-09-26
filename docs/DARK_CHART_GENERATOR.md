# DARK CHART GENERATOR

How the generator must read. Schema: `lib/rectification/schema.ts` `DarkCardSchema`.
Prompt: `lib/rectification/darkChartGenerator.ts`.
Route that calls it: `app/api/rectification/scenarios/route.ts`.

## Can it generate this?

Yes, if `AI_GATEWAY_API_KEY` is on Vercel and the route uses the prompt below.
Without the key the Swiss math still runs. The card text will 503. Do not fake it.

## Read order

1. Date + birth city already computed
2. Lived year-rows (plus-bubble page, not a textarea)
3. Complete native readings, independently audited, with every source-identified wound finding retained
4. Write `DarkCardSchema`
5. Stop

## Card must contain

Structured fields, not one anonymous folded paragraph.
Reveal → pressure → consequence → release
For each source finding: wound → injury → darkness underneath, still tagged to its own modality
Attachment: how they attach, how they sabotage love, what love falls victim to, cost to the other person
Portal extraction, when present: triggers, pressure points, failure modes, costs/consequences, how pressure builds, how it releases, what typically gets destroyed, how long they let it go, show, defend, react, what is lost if it runs one more cycle

If attachment is empty, reject the card.
If modalities are folded into shared prose, reject the card.

## Keep

Breath before the punch (UI, not the generator).
Bree tone: coil, erase, mask.
Each system stays tagged when later layers run.

## Do not generate

Geo-first invert.
108 portals.
HD as a mash hub.
Blood Dragon as math.
Wisdom / gift on this card.
