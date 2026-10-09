// PROVENANCE: bot=grok session=2026-10-08 task=rewrite .agents/ to positive-only instructions
---
# Narrative Extract

## Purpose

Transform retrieved location-period evidence into structured environmental signals.

## Task

Extract structured environmental signals from location-period evidence.

## Inputs

- Location-period evidence records

## Actions

1. Extract prevalence.
2. Extract severity.
3. Extract physical exposure.
4. Extract digital exposure.
5. Extract social amplification.
6. Extract participant breadth.
7. Extract spatial concentration.
8. Extract response framing / valence.
9. Extract trend.
10. Extract presence.
11. Extract absence.
12. Extract contradiction.
13. Extract confidence inputs.

## Outputs

- Structured environmental signals ready for Environmental Pressure Field construction and later synthesis

## Completion checks

- Every extracted claim points back to evidence.
- Confidence is kept separate from intensity.
- Contradictory signals remain distinct in the extracted records.
- Environmental records describe observed pressure and exposure. Claims about belief, participation, identity, adoption, or harm require their own supporting evidence.
- This skill outputs environmental signals and preserves chart calculations for the chart-gen stage.
