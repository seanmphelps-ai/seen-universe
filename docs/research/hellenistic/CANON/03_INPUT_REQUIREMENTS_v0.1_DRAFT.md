# INPUT REQUIREMENTS v0.1 DRAFT

Governing: SEEN_HELLENISTIC_CANONICAL_BUILD.md step 3  
Status: DRAFT / UNAUDITED / NOT CANON

## Observed inputs (Layer 1)
| Input | Required? | Notes |
|---|---|---|
| Calendar date of birth | YES | Proleptic Gregorian or Julian flag required for historical |
| Civil clock time | CONDITIONAL | Unknown time → SEEN dark-window protocol (04/12/20) — SEEN Layer 6 policy, not ancient |
| Place of birth (name) | YES | For geocode |
| Latitude / longitude | YES (derived or supplied) | Declare source of coords |
| Timezone / UTC offset | YES | IANA preferred; DST status at date |
| Calendar system note | YES if non-modern | e.g. Egyptian wandering year in Valens examples — do not silently convert |

## Insufficient input handling
| Condition | Module behavior |
|---|---|
| No time | Emit multi-window charts; **no** single ASC; lots that need ASC remain multi-valued |
| No place | Cannot compute ASC/MC; refuse angular lots; tropical planet λ still possible from UT alone |
| Ambiguous timezone | OPEN — block production until resolved or multi-hypothesis |

## Not Hellenistic inputs (do not pretend tradition requires)
Exact GPS of hospital room; modern “birth certificate second”; Placidus house preference.
