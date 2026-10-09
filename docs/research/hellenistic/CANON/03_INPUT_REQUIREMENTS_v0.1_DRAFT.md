// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# INPUT REQUIREMENTS v0.1 DRAFT

Governing: SEEN_HELLENISTIC_CANONICAL_BUILD.md step 3  

## Observed inputs (Layer 1)
| Input | Required? | Notes |
|---|---|---|
| Calendar date of birth | YES | Proleptic Gregorian or Julian flag required for historical |
| Place of birth (name) | YES | For geocode |
| Latitude / longitude | YES (derived or supplied) | Declare source of coords |
| Timezone / UTC offset | YES | IANA preferred; DST status at date |

## Insufficient input handling
| Condition | Module behavior |
|---|---|
| Ambiguous timezone | OPEN — block production until resolved or multi-hypothesis |

## Separate modern input conventions
Exact GPS of hospital room; modern “birth certificate second”; Placidus house preference.
