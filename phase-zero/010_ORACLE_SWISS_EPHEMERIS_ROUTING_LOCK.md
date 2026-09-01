# 010_ORACLE_SWISS_EPHEMERIS_ROUTING_LOCK

This file locks Oracle entry routing for any time-based, event-based, historical, relational, or forecast request.

It is additive to the originating Oracle lock and does not replace the Oracle / Generator split.

## Core Lock

When the Oracle receives any request that references time, memory, history, relationship timeline, recurrence, event review, or future date pressure, the Generator must route through:

`schemas/20_SWISS_EPHEMERIS_EVENT_ENGINE.schema.ts`

before any user-facing Oracle response is rendered.

## Trigger Conditions

The Swiss Ephemeris Event Engine is required when the user request contains any of the following:

- a specific date
- an approximate date
- a date range
- a phrase such as "go back to"
- a phrase such as "what was happening then"
- a historical memory
- a childhood event
- a family event
- a relationship conflict
- a separation, fight, rupture, repair, or closure event
- a recurrence question
- a forecast tied to a future date
- a comparison between two people at a point in time
- a question about what universal markers were active during an event

## Required Execution Order

The Generator must execute the following order before Oracle rendering:

1. Detect time or event reference.
2. Load `SWISS_EPHEMERIS_EVENT_ENGINE`.
3. Run local ephemeris lookup.
4. Produce universal field snapshot.
5. Overlay natal chart activation when birth data exists.
6. Overlay relational activation when a second actor exists.
7. Check recurrence windows when relevant.
8. Build behavior pressure map.
9. Attach accountability boundary.
10. Pass finalized payload to the Oracle.

## Non-Bypass Rule

The Oracle must not render a historical chart, time-based chart, relational event review, recurrence review, or future-date forecast without the Swiss Ephemeris Event Engine payload.

Bypass is not allowed unless the request contains no time, date, event, recurrence, history, or forecast signal.

## Accountability Boundary

The engine may reveal pressure, activation, recurrence, and convergence.

It must not excuse harm, remove agency, erase responsibility, or frame behavior as caused by astrology.

Required language:

"Universal timing may describe pressure patterns. It does not remove choice, responsibility, or accountability."

## Oracle / Generator Separation

The Generator calculates, routes, compares, detects recurrence, and builds the payload.

The Oracle renders only after the Swiss Ephemeris Event Engine payload is complete.

The Oracle does not calculate ephemeris data directly.

The Oracle must not improvise universal timing when the engine has not been run.

## Final Lock

Oracle hears time.

Generator loads Swiss Ephemeris.

Oracle speaks only after the time field has been checked.
