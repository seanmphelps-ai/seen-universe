// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# 10_SCHEMA_REVIEW_PROTOCOL

Every schema review must run through 10 passes.

## PASS 1 — Read Only
Identify what the schema says.

## PASS 2 — Purpose
State what this schema is responsible for.

## PASS 4 — Missing Fields
Identify missing fields required for SEEN.

## PASS 5 — Duplicate Fields
Identify duplicated or overlapping fields.

## PASS 7 — Runtime Role
Define whether each field is:
- intake
- input
- output
- silent modifier
- amplifier
- suppressor
- distortion
- routing signal
- user-facing output
- hidden mechanic

## PASS 8 — Input / Output Contract
Every runtime schema must define:
- explicit input type
- explicit output type
- handoff target
- load order
- hidden mechanics boundary
- user-facing boundary

If input or output is missing, the schema fails review.

## PASS 9 — User-Facing Safety
Remove anything that would repeat intake answers literally or expose mechanics too early.

## PASS 10 — Full SEEN Alignment + Final Merge
Check alignment with:
- Closure & Composure
- two-person intake
- silent modifiers
- wound markers
- Jung inversion
- Oracle nesting chips
- hidden time calibration
- baseline before modulation

Produce one clean schema.
