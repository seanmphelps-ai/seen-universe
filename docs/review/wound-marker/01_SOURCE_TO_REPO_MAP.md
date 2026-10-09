// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# Wound-marker document — source-to-repository filing

The verbatim document is in [00_SOURCE_DOCUMENT_UNVALIDATED.md](00_SOURCE_DOCUMENT_UNVALIDATED.md). Its final section retracts the large directive as unverified. Preserve the source, compare to governing specifications and implementation, then correct only demonstrated gaps.

## Verified comparison (read directly from branch closure-and-composure)

| Source topic | Existing repository location | Observed state | Filing |
|---|---|---|---|
| 1. Full qualifying wound rule | `lib/seen/woundMarkers.ts` | Updated to accept independently calculated candidates using qualifying qualities and preserve provenance; still depends on callers to supply non-Western calculations | PARTIAL; validate native calculations and canonical quality list |
| 2. Potential vs pressure vs activation vs expression | `lib/seen/woundMarkers.ts`, `lib/seen/geoPresence.ts` | Updated extractor records potential and unresolved activation/expression; old chartEngine still supplies a global baseline and portal expression still uses it | PARTIAL; downstream integration missing |
| 3. Eight pressure behaviors | `lib/seen/geoPresence.ts` | Six baseline fields; recurrence and splitting absent from this type | GAP |
| 6. Individual evidence across 64 portals | `lib/seen/portals64.ts` | Original chartEngine path still uses wound count, amplification and early-portal bonus | GAP |
| 10. Environmental modulation | `lib/seen/geoPresence.ts`, `lib/location/v2/*` | Keyword-based legacy GeoPresence exists; separate official-data Location V2 used by main API | TWO PATHS; NEEDS RECONCILIATION |

## Actual runtime connection verified

- `lib/seen/chartEngine.ts` imports `extractWoundMarkers`, `computeGeoPresence`, and `expressPortals`. It still calls `expressPortals(woundMarkers.length, geo.baselinePressure.amplification)`.
- `lib/location/v2/forged.ts` still imports the retired force-interrogation module.

## Filing policy

Original source is preserved in full; this file is the cross-reference. For each topic, prefer existing canonical implementations when they satisfy the requirement, replace demonstrably inferior logic where needed, and verify behavior with tests before declaring completion.
