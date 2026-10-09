// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# Calculation wheels

Each row is the installed calculation package and the function the modality agent calls.

## Time rectification input law

The first rectification round generates three hidden-time summaries from 04:00, 12:00 noon, and 20:00. The user selects the summary that best matches lived experience. Each following round narrows around the selected candidate with three candidates: the selected time and the times three hours before and three hours after it. The rectified candidate time is then supplied to time-dependent modality calculators.

| Modality | Package | Entry | Input | Output |
|---|---|---|---|---|
| Western | `swisseph-wasm` | `calculateNatalChart` in `lib/natalChart.ts`, called by `agent/subagents/western/agent.ts` `readWesternChart` | `name`, `birthDate`, `birthTime` or null, `latitude`, `longitude` | `NatalChartResult` |
| Jyotisha | `swisseph-wasm` | `calculateJyotishaAstronomy` in `lib/seen/jyotishaAstronomy.ts`, called by `agent/subagents/jyotish/agent.ts` `readJyotishaAstronomy` | birth date, time, coordinates, `siderealMode` of `lahiri`, `raman`, or `fagan-bradley` | sidereal longitudes and Swiss provenance, including the library ayanamsha |
| BaZi | `lunar-javascript@1.7.7` | `Solar.fromYmdHms` → `getLunar().getEightChar`, via `lib/baziCalc.ts` `calculateBazi` and `agent/subagents/bazi/agent.ts` `readBazi` | `birthDate` `YYYY-MM-DD`, `birthTime` `HH:mm` | year, month, day, and time pillars, hidden stems, and the library `sect` |
| Dreamspell | `@oshimishi/dreamspell-math@0.3.2` | `dreamdate`, via `lib/dreamspellCalc.ts` `calculateDreamspell` and `agent/subagents/dreamspell/agent.ts` `readDreamspell` | `birthDate` `YYYY-MM-DD` | kin, year kin, moon day, and oracle kin fields |
| Traditional Tzolk'in | `@drewsonne/maya-dates@1.3.14` (GPL-3.0-only) | `LongCount.fromGregorian` with `getCorrelationConstant(584283)`, via `lib/tzolkinCalc.ts` `calculateTzolkin` and `agent/subagents/tzolkin/agent.ts` `readTzolkin` | `birthDate` `YYYY-MM-DD` | long count, Tzolk'in, and Haab strings. Correlation name from the package is GMT |

`readNative` in `lib/agents/execution.ts` calls these same functions.

## I Ching gap

- `iching` (sitnin, 2013) is a native addon for He Luo Li Shu birth/core/end numbers.
- The 64 Portals stay a separate layer.
