// PROVENANCE: bot=grok session=2026-10-08 task=rewrite .agents/ to positive-only instructions
---
# Intake

## Purpose

Seal clean subject and location-period inputs before downstream calculation.

## Task

Collect and validate all inputs necessary for all downstream calculations, including first-time rectification.

## Inputs

- Name when requested by the active flow
- Birth date
- Birth location with calendar time frame
- Every lived location of 6 months or more with calendar time frame period
- Current location
- Repeated long stays at the same location if separate calendar time periods
- Trip/event location and dates when relevant
- Confirmed geographic record and provenance
- Calendar timeframe for every location-period

## Actions

1. Collect name when requested by the active flow.
2. Collect birth date.
3. Collect birth location with calendar time frame.
4. Collect every lived location of 6 months or more with calendar time frame period.
5. Collect current location.
6. Collect repeated long stays at the same location if separate calendar time periods.
7. Collect trip/event location and dates when relevant.
8. Confirm the geographic record and provenance.
9. Confirm the calendar timeframe for every location-period.
10. Create a narrowing sequence using 4 AM, 12 noon, and 8 PM three initial summaries, using Western and Vedic if available, to determine shadow chart characteristics and how a system reacts under pressure.
11. Have the user identify which summary resonates with lived experience and narrow down.
12. If the user fixes 4 AM, give 1 AM, another 4 AM, and 7 AM. If they select 7 AM, the next round renders 6 AM, 7 AM, and 9 AM.
13. Use the opportunity to explicitly call out the shadows and the dark chart when the user has the opportunity to agree, so the user tells us a lot by identifying it.
14. Go bold: very dark Chiron, Ashlesha, houses 4, 8, 10, 12, Pluto, Neptune, Mars, Saturn, Lilith.
15. Route date and location material directly into the independent modalities-numerology schema and galaxy trio schema.

## Outputs

- Validated structured intake records suitable for persistence and downstream skills

## Completion checks

- Name is present when requested by the active flow.
- Birth date is present.
- Birth location with calendar time frame is present.
- Every lived location of 6 months or more has a calendar time frame period.
- Current location is present.
- No invented dates, places, coordinates, or time certainty.
- Approximate dates are preserved as approximate.
- Date and location material exists.
- Calculation, rendering, and generator architecture are unmodified by this skill.
