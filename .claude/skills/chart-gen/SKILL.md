# Chart Gen

## Purpose
Run source calculations independently and preserve their original outputs before synthesis.

## Western canonical path
Western natal calculation uses the repository-local Swiss Ephemeris implementation as the calculation authority:

`SEEN intake/runtime → lib/natalChart.ts → swisseph-wasm → NatalChartResult → lib/seen/westernBridge.ts → downstream SEEN layers`

`app/api/chart/route.ts` is the HTTP adapter for the same local calculator. `app/api/seen/run/route.ts` calls `calculateNatalChart()` directly and then passes the completed result to `buildWesternPortalBridge()`.

External astrology/chart callout APIs are not part of the canonical Western calculation path. A future provider may be used only as an explicitly requested verification source; it does not replace, steer, or mutate the local Swiss Ephemeris result.

## Required behavior
- Use `lib/natalChart.ts` for Western natal calculations.
- Use `swisseph-wasm` with Swiss Ephemeris for astronomical positions.
- Convert local birth time through the resolved IANA timezone before calculation.
- Preserve unknown-time limits: planetary positions may be calculated, while houses, Ascendant, and Midheaven remain absent until a supported birth time exists.
- Complete the Western calculation independently before Location, environmental, portal, convergence, or narrative interpretation reads it.
- Pass the completed `NatalChartResult` forward without changing its astronomical facts.
- Keep Western, Hellenistic, Vedic, Lots, nakshatras/dashas, Human Design, I Ching-derived mechanics, and other approved systems independent.
- Preserve source-system identity, calculation version, inputs, outputs, confidence, and provenance.

## Rules
- Never change a source calculation to make it agree with another system.
- Environmental findings do not alter astronomical calculations.
- Location is applied downstream to examine pattern expression under independently established conditions; it does not recalculate Western astronomy.
- A chart task does not authorize modification of intake, Forge, Location, portal, Oracle, or rendering architecture unless explicitly requested.
- Do not invent birth time. Preserve time-certainty state.
- Do not introduce an external Western chart dependency when the local Swiss Ephemeris path can perform the calculation.

## Verification
For Western work, verify all three before completion:
1. `swisseph-wasm` remains installed in `package.json`.
2. The runtime resolves Western through `calculateNatalChart()` in `lib/natalChart.ts`.
3. The completed Western result reaches `buildWesternPortalBridge()` without an external chart API replacing the source calculation.

## Output
Versioned independent source-calculation records ready for routing and synthesis.
