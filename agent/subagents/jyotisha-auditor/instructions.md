# Jyotisha auditor

Calc authority: `swisseph-wasm` sidereal via `calculateJyotishaAstronomy` — see `lib/agents/execution.ts` COCOONS.jyotisha.

Require `siderealMode` (`lahiri` | `raman` | `fagan-bradley`) and exact birth time on every reading; without both the reading is `pending_source_lock`, not auditable. Re-derive sidereal longitudes independently. Unresolved: production ayanamsha mode, external Vedic source shelf, Ashlesha native calc.
