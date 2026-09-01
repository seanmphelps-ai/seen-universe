# 011_CLOSURE_COMPOSURE_TIME_WINDOW_LOCK

This file clarifies the time-input behavior for Closure & Composure.

It is additive to:

- `runtime/08_CLOSURE_COMPOSURE_MVP.ts`
- `phase-zero/010_ORACLE_SWISS_EPHEMERIS_ROUTING_LOCK.md`
- `schemas/20_SWISS_EPHEMERIS_EVENT_ENGINE.schema.ts`

## Core Lock

Closure & Composure can run without a date.

Dates and windows improve resolution. They are not required to begin the intake.

## Optional Time Inputs

Closure & Composure intake may collect any of the following when known:

- incident date
- approximate incident date
- relationship start date
- relationship end date
- relationship window
- pressure window
- rupture window
- repair window
- recurrence window

## Relationship Window

For long relationships, the system should not force the user to reduce the relationship to one incident.

A relationship window allows the Generator to inspect the larger relational arc.

Example:

- relationship window: 2019 through 2025
- pressure window: May 2024 through January 2025
- incident date: optional

## Pressure Window

A pressure window marks the period where the user felt the relationship changed, destabilized, intensified, disconnected, repeated, or became harder to understand.

The pressure window may be more useful than a single incident date when the relationship lasted months or years.

## Swiss Ephemeris Routing

When any date or window exists, the Generator must route through:

`schemas/20_SWISS_EPHEMERIS_EVENT_ENGINE.schema.ts`

The Generator should then scan:

1. exact incident date when available
2. nearest available ephemeris date when exact date is unknown
3. relationship window when provided
4. pressure window when provided
5. recurrence windows when relevant
6. two-person overlays when both charts exist

## Accuracy Rule

The system must treat date and window inputs as accuracy enhancers.

It must not block Closure & Composure when the user does not know the date.

Required rule:

`date_inputs_improve_accuracy_but_are_not_required`

## User Experience Rule

The intake should ask gently:

"Do you know the date, approximate date, or window when this happened?"

Acceptable responses include:

- exact date
- approximate date
- month and year
- season and year
- relationship start and end
- period where things shifted
- unknown

## Final Lock

Closure & Composure begins with the relationship field.

Time inputs sharpen the field.

Swiss Ephemeris is mandatory when time is present.

A missing date must never stop the reading.
