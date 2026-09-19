# GROK BOT — FIRST SLICE ONLY

Read this file. Then `docs/00_INTAKE_SCHEMA.md`. Then `docs/TIME_NARROWING_LOCK.md`. Then `docs/LOCATION.md`.

## Order

1. Name of the system being read
2. Birth date
3. Birth city (lat/long)
4. Lived places + years (6 months counts)
5. Three hidden runs: 04:00, 12:00, 20:00
6. Three dark cards. No clocks. User picks one.
7. If 04:00 → 01:00 / 04:00 / 07:00
   If 12:00 → 09:00 / 12:00 / 15:00
   If 20:00 → 17:00 / 20:00 / 23:00
8. Then ±2h
9. Then ±1h

## Forbidden

- Place / environment before date
- Optional time
- Typed clock on first screen
- Round 1 at 06:00 / 18:00
