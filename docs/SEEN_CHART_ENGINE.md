# SEEN Chart Engine (smallest working slice)

## Endpoint

`POST /api/seen/chart-engine`

### Single clock
```json
{
  "name": "Subject",
  "birthDate": "1979-08-01",
  "latitude": 34.2,
  "longitude": -118.54,
  "birthPlaceLabel": "Reseda, CA",
  "livedStack": "Reseda 1979–1990. …",
  "clock": "04:00"
}
```

### Three dark windows
```json
{ "...same", "mode": "dark-windows" }
```

## Already real
- `lib/natalChart.ts` — Swiss Ephemeris WASM

## Added
- `lib/seen/geoPresence.ts` — dirt pressure heuristics
- `lib/seen/woundMarkers.ts` — rule-governed extraction from natal
- `lib/seen/portals64.ts` — 64 I Ching spine (never inactive)
- `lib/seen/chartEngine.ts` — orchestration
- `app/api/seen/chart-engine/route.ts`

## Still missing for full foundation UX
- AI Gateway key for `/api/rectification/scenarios` dark-card *prose*
- Forge location→birth payload unify with lat/long
- Rich GeoPresence research layers (incident/social) beyond heuristics
- Vedic Ashlesha native calc (currently pending marker)
