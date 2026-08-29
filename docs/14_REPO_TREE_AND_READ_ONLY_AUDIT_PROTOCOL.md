# 14_REPO_TREE_AND_READ_ONLY_AUDIT_PROTOCOL

Repository:
SEEN_universal

Purpose:
Lock the repository audit lane so future repo reviews begin from existing canon order, remain read-only until a visible diff is shown, and preserve findings across passes.

## 1. Existing order sources

Use the repository's existing order sources:

1. README.md
2. README_CORE_SCHEMA_ORDER.md

Do not create docs/00_REPO_TREE_INDEX.md yet.

If a dedicated repo tree index is later created, it must not override README.md or README_CORE_SCHEMA_ORDER.md unless those canon order files are explicitly updated.

## 2. Correct audit read order

Audit begins with the current repo-defined order:

1. docs/00_START_HERE_CANON_LOCK.md
2. docs/01_SEEN_FOUNDATION_AND_THREE_COORDINATES.md
3. docs/10_SCHEMA_REVIEW_PROTOCOL.md
4. schemas/10_SCHEMA_REVIEW_PROTOCOL.schema.ts
5. governance/00_ORACLE_GOVERNANCE_CANON.ts
6. phase-zero/000_PHASE_ZERO_ORIGINATING_ORACLE_LOCK.md
7. phase-zero/001_PHASE_ZERO_ORACLE_DISCOVERY_RULES.md
8. phase-zero/002_PHASE_ZERO_ORACLE_DEPTH_AND_CHIPS.md
9. phase-zero/003_SEEN_MVP_CLOSURE_COMPOSURE_FLOW.md
10. phase-zero/004_SEEN_CADENCE_CONTINUITY_AND_SHARING_GUARDRAILS.md

Continue from the repo-defined order after item 10.

## 3. Tree-first structure rule

Repository structure must be inspectable before audit claims are made.

Tree inspection may be used to resolve:

- canonical order disputes
- missing numbered files
- duplicate numbering
- folder/file hierarchy
- routing gaps

Tree inspection supports audit accuracy. It does not replace the existing canon order sources unless the repo is explicitly updated to do so.

## 4. Read-only audit mode

During audit mode, allowed actions are:

- repo search
- fetch file
- fetch commit
- tree inspection
- audit notes

Repository mutation requires:

- exact visible proposed diff first
- review first
- approval first

This applies to:

- new commit
- file creation
- file update
- pull request
- schema modification
- runtime modification

## 5. Per-file audit requirements

For each audited file, record:

- order
- exact path
- file SHA or commit SHA when available
- purpose
- type: doc / runtime / schema / lock / governance / unknown
- requires input?
- input exists?
- requires output?
- output exists?
- order correct?
- routes from
- routes to
- exact problem
- exact proposed fix

## 6. Type distinction

If a file is a doc, lock, or governance file and input/output is not required, mark:

not required

Do not mark it missing.

If a file appears to be a schema or runtime contract and lacks required input/output structure, flag it for review.

Do not force schema requirements onto non-schema canon docs.

## 7. Structure classification

Audit findings must distinguish between:

1. missing structure
2. intentionally not applicable
3. unresolved / unclear
4. structurally present but weak or incomplete
5. structurally present and sufficient

## 8. Pass preservation

Later passes preserve earlier passes.

Allowed:

Pass 1
+ verified GitHub finding
+ exact delta

Prior findings remain unless GitHub directly disproves them.

Not allowed:

- compression
- dropped audit fields
- silent rewrites
- replacing a prior finding without citing the GitHub evidence that changed it

## 9. No assumptions

If repo order is unclear, state unresolved.

If file type is unclear, state unresolved.

If file is missing, state missing.

If routing is unclear, state unresolved.

Only GitHub-grounded findings may be presented as findings.

## 10. Audit output format

FILES 1-10 AUDIT

01 / path:
Status:
SHA:
Purpose:
Type:
Input:
Output:
Order:
Routes from:
Routes to:
Problem:
Proposed fix:

02 / path:
Status:
SHA:
Purpose:
Type:
Input:
Output:
Order:
Routes from:
Routes to:
Problem:
Proposed fix:

Continue in exact sequence.

END
