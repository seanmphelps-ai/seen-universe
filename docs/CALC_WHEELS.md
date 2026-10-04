# Calculation wheels

Each row is the installed calculation package and the function the modality agent calls. Interpretive editions are not included.

| Modality | Package | Entry | Input | Output |
|---|---|---|---|---|
| Western | `swisseph-wasm` | `calculateNatalChart` in `lib/natalChart.ts`, called by `agent/subagents/western/agent.ts` `readWesternChart` | `name`, `birthDate`, `birthTime` or null, `latitude`, `longitude` | `NatalChartResult` |
| Hellenistic | `swisseph-wasm` and `kriya-ephemeris-timelords@0.1.2` (peer `kriya-ephemeris@0.3.0`) | `calculateHellenistic` in `lib/hellenisticCalc.ts`, called by `agent/subagents/hellenistic/agent.ts` `readHellenisticPositions` | same natal input. Birth time is required for sect, places, and Lots | `NatalChartResult` from `calculateNatalChart`, sect from `azalt` `SE_ECL2HOR` (`trueAltitude > 0`), whole-sign cusps and places from `houses` system `W`, and Fortune / Spirit / Eros longitudes from `partOfFortuneDeg`, `partOfSpiritDeg`, `partOfErosDeg` on those Swiss longitudes. `partOfErosDeg` is labeled with its package witness. Valens Eros and Schmidt no-reverse are not in the package |
| Jyotisha | `swisseph-wasm` | `calculateJyotishaAstronomy` in `lib/seen/jyotishaAstronomy.ts`, called by `agent/subagents/jyotish/agent.ts` `readJyotishaAstronomy` | birth date, time, coordinates, `siderealMode` of `lahiri`, `raman`, or `fagan-bradley` | sidereal longitudes and Swiss provenance, including the library ayanamsha |
| BaZi | `lunar-javascript@1.7.7` | `Solar.fromYmdHms` → `getLunar().getEightChar`, via `lib/baziCalc.ts` `calculateBazi` and `agent/subagents/bazi/agent.ts` `readBazi` | `birthDate` `YYYY-MM-DD`, `birthTime` `HH:mm` | year, month, day, and time pillars, hidden stems, and the library `sect` |
| Dreamspell | `@oshimishi/dreamspell-math@0.3.2` | `dreamdate`, via `lib/dreamspellCalc.ts` `calculateDreamspell` and `agent/subagents/dreamspell/agent.ts` `readDreamspell` | `birthDate` `YYYY-MM-DD` | kin, year kin, moon day, and oracle kin fields |
| Traditional Tzolk'in | `@drewsonne/maya-dates@1.3.14` (GPL-3.0-only) | `LongCount.fromGregorian` with `getCorrelationConstant(584283)`, via `lib/tzolkinCalc.ts` `calculateTzolkin` and `agent/subagents/tzolkin/agent.ts` `readTzolkin` | `birthDate` `YYYY-MM-DD` | long count, Tzolk'in, and Haab strings. Correlation name from the package is GMT |
| Numerology | `@csessh/sochumenh@0.3.0` | `parseDob` and the package numeric calculators, via `lib/numerologyCalc.ts` `calculateNumerology` and `agent/subagents/numerology/agent.ts` `readNumerology` | `name`, `birthDate` `YYYY-MM-DD` | numeric `{ value, karmicDebtHits }` fields. Interpretation strings are not returned |
| Human Design | `free-human-design@1.0.1` (MIT) | `computeChart`, via `lib/humanDesignCalc.ts` `calculateHumanDesign` and `agent/subagents/humandesign/agent.ts` `readHumanDesign` | `birthDate` `YYYY-MM-DD`, `birthTime` `HH:mm`, `latitude`, `longitude`. Timezone is `tz-lookup` for those coordinates | type, authority, profile, centers, channels, activated gates, personality and design activations, personality and design Julian days. Gene Keys text and the package astrology section are not returned. This calculation does not activate a Human Design interpretation |
| I Ching | none | `calculateIChing` in `lib/ichingCalc.ts` throws `IChingCalcBlocked`. `agent/subagents/iching/agent.ts` `readIChing` calls it. `readNative('iching')` records `pending_source_lock` | a cast is not on intake | no hexagram |

`readNative` in `lib/agents/execution.ts` calls these same functions. Jyotisha does not run without an explicit `siderealMode` and birth time. BaZi and Human Design do not run without a birth time. Hellenistic Lots, sect, and whole-sign places do not run without a birth time; tropical positions still return. I Ching does not return a hexagram.

## I Ching gap

No honest calculation package is installed.

- Intake does not carry a question, a casting method, or six lines. `docs/incoming/2026-09-24_full_modality_pipeline_source_audit.md` says a native I Ching reading needs that cast, and that no birth-date-to-hexagram mapping is specified.
- `i-ching@0.3.5` `ask(question)` does not reproduce a reading for the same question. It is not a calculation.
- `@iching/core` is not published on npm.
- `iching` (sitnin, 2013) is a native addon for He Luo Li Shu birth/core/end numbers. That is a birth-date mapping the audit does not specify, and it is not wired.
- The 64 Portals stay a separate layer. Their names are not a cast.

`calculateIChing` throws instead of emitting a number.
