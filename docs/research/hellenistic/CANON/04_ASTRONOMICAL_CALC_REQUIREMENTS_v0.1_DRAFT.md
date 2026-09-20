# ASTRONOMICAL CALCULATION REQUIREMENTS v0.1 DRAFT

Governing: step 4  
Status: DRAFT / UNAUDITED

## Authority
Swiss Ephemeris 2.10.03 (+ se1 ephemeris files) = Layer 2 truth for tropical longitudes and local angles.

## Must compute
| Quantity | Method | Flags |
|---|---|---|
| UT Julian Day | civil + TZ → UT | |
| λ Sun…Saturn (+ optional Uranus/Neptune/Pluto/Node/Chiron) | swe.calc_ut | Outers **modern extension** — label |
| ASC, MC | swe.houses angles | Use any house algorithm **only** for ASC/MC; discard cusps for topical places |
| Sun altitude | ecliptic→horizontal | Sect test; near-0° policy OPEN |
| Sidereal time / RAMC | as needed for angles | |

## Must NOT claim as Swiss
Lot formulas, whole-sign place topics, bounds tables, chronocrator math beyond astronomy.

## Validation
Recompute fixture VC-1979-08-01-TARZANA; bit-stable λ/ASC; external JPL/Astrodienst spot-check PENDING.
