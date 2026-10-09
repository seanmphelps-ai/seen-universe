// PROVENANCE: bot=grok session=2026-10-08 task=rewrite .agents/ to positive-only instructions
---
# Chart Gen

## Purpose

Run source calculations independently and preserve their original outputs before synthesis.

## Task

Produce versioned independent source-calculation records ready for routing and synthesis.

## Inputs

- SEEN intake/runtime
- lib/natalChart.ts
- swisseph-wasm
- NatalChartResult
- lib/seen/westernBridge.ts

## Actions

1. Use lib/natalChart.ts for Western natal calculations.
2. Use swisseph-wasm with Swiss Ephemeris for astronomical positions.
3. Convert local birth time through the resolved IANA timezone before calculation.
4. Preserve unknown-time limits: planetary positions may be calculated, while houses, Ascendant, and Midheaven remain absent until a supported birth time exists.
5. Complete the Western calculation independently before Location, environmental, portal, convergence, or narrative interpretation reads it.
6. Pass the completed NatalChartResult forward without changing its astronomical facts.
7. Keep Western, Hellenistic, Vedic, Lots, nakshatras/dashas, and other approved source systems independent; route findings separately into SEEN's own 64 Portals.
8. Preserve source-system identity, calculation version, inputs, outputs, confidence, and provenance.

## Outputs

- Versioned independent source-calculation records ready for routing and synthesis

## Completion checks

1. swisseph-wasm remains installed in package.json.
2. The runtime resolves Western through calculateNatalChart() in lib/natalChart.ts.
3. The completed Western result reaches buildWesternPortalBridge() without an external chart API replacing the source calculation.
