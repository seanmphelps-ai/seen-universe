# Wound-marker document — source-to-repository filing

This is a filing/index of the uploaded source, **not new product canon**. The verbatim document is in [00_SOURCE_DOCUMENT_UNVALIDATED.md](00_SOURCE_DOCUMENT_UNVALIDATED.md). Its final section retracts the large directive as unverified. Preserve the source, compare to governing specifications and implementation, then correct only demonstrated gaps.

## Verified comparison (read directly from branch closure-and-composure)

| Source topic | Existing repository location | Observed state | Filing |
|---|---|---|---|
| 1. Full qualifying wound rule | `lib/seen/woundMarkers.ts` | Updated to accept independently calculated candidates using qualifying qualities and preserve provenance; still depends on callers to supply non-Western calculations | PARTIAL; validate native calculations and canonical quality list |
| 2. Potential vs pressure vs activation vs expression | `lib/seen/woundMarkers.ts`, `lib/seen/geoPresence.ts` | Updated extractor records potential and unresolved activation/expression; old chartEngine still supplies a global baseline and portal expression still uses it | PARTIAL; downstream integration missing |
| 3. Eight pressure behaviors | `lib/seen/geoPresence.ts` | Six baseline fields; recurrence and splitting absent from this type | GAP |
| 4. Independent source/provenance | `docs/contexts/CLAUDE_GENERATOR_HELIX.md`, `lib/seen/woundMarkers.ts` | Governing requirement exists; updated extractor supports source references; entire runtime not verified | PARTIAL |
| 5. Convergence | `docs/contexts/CLAUDE_GENERATOR_HELIX.md`; `lib/location/v2/fuse.ts` | Canon requires convergence; Location V2 has fusion but this is not evidence of full wound/Helix convergence | NEEDS TRACE |
| 6. Individual evidence across 64 portals | `lib/seen/portals64.ts` | Original chartEngine path still uses wound count, amplification and early-portal bonus | GAP |
| 7. Wound routing without automatic activation | `lib/seen/woundMarkers.ts`, `lib/seen/portals64.ts` | Updated marker type has optional routes; portal scorer does not consume them | GAP |
| 8. Age arcs | `lib/seen/woundMarkers.ts` | Updated marker type accepts ageArcs; no verified active evaluation | GAP |
| 9. Natal vs active timing | `lib/seen/chartEngine.ts` | Natal calculation present; no verified wound timing evaluation in this path | NEEDS TRACE |
| 10. Environmental modulation | `lib/seen/geoPresence.ts`, `lib/location/v2/*` | Keyword-based legacy GeoPresence exists; separate official-data Location V2 used by main API | TWO PATHS; NEEDS RECONCILIATION |
| 11. Independent Person A/B plus relationship field | `docs/00_START_HERE_CANON_LOCK.md` | Spec requires independent execution; not established in examined route | NEEDS TRACE |
| 12. Recursive extraction | `docs/00_START_HERE_CANON_LOCK.md` | Spec requires recursive passes; updated marker records eligibility but does not execute passes | GAP IN EXAMINED PATH |
| 13. Jung inversion | `docs/00_START_HERE_CANON_LOCK.md` | Spec requires it; marker type has placeholder capacity field; no verified implementation in examined path | NEEDS TRACE |
| 14. Life Sections | `app/api/seen/run/route.ts` | Western bridge returns life-section routing; wound marker deposits not verified as connected | PARTIAL |
| 15. Oracle after Generator | `docs/contexts/CLAUDE_GENERATOR_HELIX.md` | Spec requires calculation before rendering; active route examined does not implement full Oracle | NEEDS TRACE |

## Actual runtime connection verified

- `lib/seen/chartEngine.ts` imports `extractWoundMarkers`, `computeGeoPresence`, and `expressPortals`. It still calls `expressPortals(woundMarkers.length, geo.baselinePressure.amplification)`.
- `app/api/seen/run/route.ts` uses `buildLocationField`, Location V2 fusion, `calculateNatalChart` and `buildWesternPortalBridge`; it does **not** import the wound-marker extractor.
- `lib/location/v2/forged.ts` still imports the retired force-interrogation module.
- No build, end-to-end execution or deployment validation is claimed here.

## Filing policy

Original source is preserved in full; this file is the cross-reference. Do not blindly execute the source's retracted large directive. For each topic, prefer existing canonical implementations when they satisfy the requirement, replace demonstrably inferior logic where needed, and verify behavior with tests before declaring completion.
