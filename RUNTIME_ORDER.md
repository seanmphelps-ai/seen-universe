// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# RUNTIME ORDER

One sequence. Other files are reference. This file is the order.

## 1. Name

Who is being read. Self, parent, child, ex, friend. Store the name. Stop.

## 2. Day

Birth date. Store the date.

## 3. Birth city

Search. The pick must carry latitude and longitude. Store the city.

## 4. Places lived

Six months or more. Each place has a start year and an end year. Store them.

## 5. Day is given — Western only

Input is name, date, birth city lat/long. Clock is unknown until a later step.

Run Swiss Ephemeris for that day and that city. Positions only.

## 6. Place is given — that place only

Input is one stored place plus its years.

Say what that place was for this person in those years.

## 7. Clock

Only after 5. Three passes if the clock is unknown: 04:00, 12:00, 20:00. Each pass is its own run.

## 8. Other person

Same steps 1–4 for that person. Their run stays theirs.

## 9. Say it

Only after a run exists. Say what that run found. Their story about the other person first, if that is why they came. Then the same sight on them.

## Phone

`/` opens `/chart`. That page is steps 1–4 only.
The run behind a finished 1–4 is `POST /api/seen/run`.
