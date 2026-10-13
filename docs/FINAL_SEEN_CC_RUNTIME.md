# FINAL SEEN CC BRANCH RUNTIME

Chief agent: **Generator** — `lib/seen/chartEngine.ts :: runChartEngine()`

## Consecutive order

| # | Stage | Subagent | File | Input | Output |
|---|---|---|---|---|---|
| 1 | Western source calc | Swiss Ephemeris | `lib/natalChart.ts` (`swisseph-wasm`) | name, birthDate, clock, lat/lng | `NatalChartResult` |
| 2 | Environmental pressure | GeoPresence | `lib/seen/geoPresence.ts` | birthPlaceLabel, lat/lng, livedStack | `GeoPresenceResult` |
| 3 | Wound extraction | WoundMarkers | `lib/seen/woundMarkers.ts` | `chart`, `geo.baselinePressure` | `WoundMarkerHit[]` |
| 4 | Portal expression | Portals64 | `lib/seen/portals64.ts` | (static archetype set) | `PortalExpression[]` |
| 5 | Interrogation | 64 Interrogator sub-agents | `lib/seen/interrogators/makeInterrogator.ts` × `interrogatorRoster.ts` | wound markers mapped to `ChartSignal[]` | `InterrogatorResult[]` (per-portal Q&A, no scoring) |
| — | Assembly | Generator | `runChartEngine()` | all of the above | `ChartEngineResult { chart, geo, woundMarkers, portals, interrogations, darkCardSeed, doctrine }` |

Each interrogator sub-agent is independent: it matches chart signals against its own portal's `woundMarkerAffinity`, runs its fixed question set, returns findings. No interrogator reads another's output. The Generator is the only stage that assembles across sub-agents.

## Built

- Western (Swiss Ephemeris) — canonical, local, no external API (`chart-gen` skill forbids one)
- GeoPresence, WoundMarkers, Portals64
- 64 Interrogator sub-agents wired into `chartEngine.ts`

## Not yet built

- **Vedic/Jyotisha subagent** — research complete (`docs/jyotisha/SEEN_JYOTISHA_CANONICAL_BUILD.md`), no code bridge, not wired into `chartEngine.ts`
- **Hellenistic subagent** — research complete (`docs/hellenistic/`, 13-entry correction ledger, validated test case), no code bridge, not wired into `chartEngine.ts`
- **Numerology subagent** — no implementation found
- **Auditor layer** — no sub-agent currently has an independent auditor re-deriving its output; none exist for Western, Interrogators, or any future Vedic/Hellenistic agent

## Next build order

1. Vedic bridge: `lib/seen/vedicBridge.ts`, mirroring `lib/seen/westernBridge.ts`'s pattern, feeding from the Jyotisha canon doc
2. Hellenistic bridge: `lib/seen/hellenisticBridge.ts`, same pattern, feeding from the Hellenistic canon + lots corpus
3. Wire both into `runChartEngine()` as independent stages (do not let either rewrite Western output — `chart-gen` skill rule)
4. Add one auditor per subagent: re-derive the calculation independently, flag mismatch, do not silently correct
