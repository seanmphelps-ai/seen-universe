// PROVENANCE: bot=grok session=2026-10-08 task=rewrite .agents/ to positive-only instructions
---
## Purpose

Collect timeframe-locked public observable evidence for one location-period at a time.

## Task

Collect public observable evidence for one location-period.

## Inputs

- One location-period

## Actions

1. Use provider-agnostic adapters across relevant public sources such as social platforms, forums, reviews, local web/news, events, commerce, jobs, housing, search, and movement/place signals.
3. Preserve source and provider.
4. Preserve observation timestamp.
5. Preserve subject timeframe.
6. Preserve requested geography.
7. Preserve matched geography.
8. Preserve geographic precision.
9. Preserve raw evidence reference.
10. Preserve unique event / post / account identity where available.

## Outputs

- Evidence records ready for narrative-extract

## Completion checks

- Match each evidence record to the subject's location-period using its observation timestamp and supported historical timeframe.
- Evaluate representativeness from sampling coverage, geography, timeframe, and participant breadth; record provider popularity separately.
- The underlying event is deduplicated from its social spread.
- Absence and contradiction are preserved.
- Deliver observable evidence records to narrative-extract; source-backed personality interpretation belongs to the downstream interpretation stages.
