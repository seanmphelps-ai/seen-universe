# Calculation wheels

Each row is the installed calculation package and the function the modality agent calls. Interpretive editions are not included.

| Modality | Package | Entry | Input | Output |
|---|---|---|---|---|
| Western | `swisseph-wasm` | `calculateNatalChart` in `lib/natalChart.ts`, called by `agent/subagents/western/agent.ts` `readWesternChart` | `name`, `birthDate`, `birthTime` or null, `latitude`, `longitude` | `NatalChartResult` |
| Hellenistic | `swisseph-wasm` | `calculateNatalChart`, called by `agent/subagents/hellenistic/agent.ts` `readHellenisticPositions` | same natal input | `NatalChartResult`. Lots, sect, and whole-sign houses are not called |
| Jyotisha | `swisseph-wasm` | `calculateJyotishaAstronomy` in `lib/seen/jyotishaAstronomy.ts`, called by `agent/subagents/jyotish/agent.ts` `readJyotishaAstronomy` | birth date, exact time, coordinates, `siderealMode` of `lahiri`, `raman`, or `fagan-bradley` | sidereal longitudes and Swiss provenance, including the library ayanamsha |
| BaZi | `lunar-javascript@1.7.7` | `Solar.fromYmdHms` → `getLunar().getEightChar`, via `lib/baziCalc.ts` `calculateBazi` and `agent/subagents/bazi/agent.ts` `readBazi` | `birthDate` `YYYY-MM-DD`, `birthTime` `HH:mm` | year, month, day, and time pillars, hidden stems, and the library `sect` |
| Dreamspell | `@oshimishi/dreamspell-math@0.3.2` | `dreamdate`, via `lib/dreamspellCalc.ts` `calculateDreamspell` and `agent/subagents/dreamspell/agent.ts` `readDreamspell` | `birthDate` `YYYY-MM-DD` | kin, year kin, moon day, and oracle kin fields |
| Traditional Tzolk'in | `@drewsonne/maya-dates@1.3.14` (GPL-3.0-only) | `LongCount.fromGregorian` with `getCorrelationConstant(584283)`, via `lib/tzolkinCalc.ts` `calculateTzolkin` and `agent/subagents/tzolkin/agent.ts` `readTzolkin` | `birthDate` `YYYY-MM-DD` | long count, Tzolk'in, and Haab strings. Correlation name from the package is GMT |
| Numerology | `@csessh/sochumenh@0.3.0` | `parseDob` and the package numeric calculators, via `lib/numerologyCalc.ts` `calculateNumerology` and `agent/subagents/numerology/agent.ts` `readNumerology` | `name`, `birthDate` `YYYY-MM-DD` | numeric `{ value, karmicDebtHits }` fields. Interpretation strings are not returned |

`readNative` in `lib/agents/execution.ts` calls these same functions. Jyotisha does not run without an explicit `siderealMode` and birth time. BaZi does not run without a birth time. Human Design and I Ching have no modality agent folder and no calculation package here.
