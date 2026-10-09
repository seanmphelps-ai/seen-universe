// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
## Positions & angles
| Quantity | Authority | Notes |
|---|---|---|
| Planetary / Node / Chiron ecliptic longitude | Swiss Ephemeris 2.10.03 (`FLG_SWIEPH`) | Tropical zodiac |
| ASC / MC | `swe.houses(..., b'P')` angles only | Placidus used **only** to obtain ASC/MC; places are whole-sign from ASC **sign** |
| Geographic | Named place → lat/lon (Tarzana 34.17333 N, 118.55306 W for SEEN subject) | Declare source of coordinates per run |

## Sect
| Rule | Authority | Notes |
|---|---|---|
| Fortune / Spirit reverse | Day: Fort = Asc+Moon−Sun; Spirit = Asc+Sun−Moon. Night: reverse. | Valens / standard Hellenistic; see DISAGREEMENT for edge cases (Sun near horizon) |

## Lots (formulas — both streams preserved)
| Lot | Stream A (Paulus Hermetic) | Stream B (Valens) |
|---|---|---|
| Fortune | Day Asc+Moon−Sun; Night Asc+Sun−Moon | Same core reverse-by-sect |
| Spirit | Inverse of Fortune arc | Same |
| Eros | Day Asc+Venus−Spirit; Night Asc+Spirit−Venus (**manuscript reverse**) | From Fortune↔Spirit arc (different point) |

Phase-1 shelf *proposed* Paulus+manuscript-reverse as operational default for SEEN packets; CoS may override. Until CoS consolidates, both remain first-class in the disagreement register.

## Whole-sign places
Place = sign count from ASC sign (1 = rising sign).

## Time lords (optional module slice)
| Technique | Authority | Gate |
|---|---|---|
| Annual profections | Valens / Brennan Ch.18 | Only when CoS requests |
| Zodiacal releasing | Valens / Brennan Ch.19 | Only when CoS requests; Lot of Fortune/Spirit release origin must be labeled |

## Provenance required on every calc output
`ephemeris=Swiss 2.10.03; zodiac=tropical; places=whole-sign; sect=<day|night>; fortune_spirit=<formula>; eros_stream=<paulus|valens>; eros_night=<reverse|schmidt_no_reverse>; coords=...; tz=...`
