// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
## Purpose

Use this gate whenever multiple PDFs, recovered documents, thread exports, screenshots, notes, or prior canon candidates must be reconciled before implementation.

It is a bounded evidence-ordering step inside the existing repository workflow.

## Required order

1. INTAKE
   - Place every recovered or candidate source in `docs/incoming/` before canonization.
   - Preserve original filenames and source provenance.

2. INVENTORY
   - Add one row per source to `docs/source-analysis/SOURCE_SEQUENCE_MATRIX.csv`.
   - Record module, unique contribution, dependencies, overlaps, contradictions, authority, status, and proposed order.

3. COMPARE
   - Compare every candidate against current controlling canon and implementation.
   - Mark each contribution as one of:
     - KEEP
     - MERGE
     - REPLACE
     - RETIRE
     - HOLD / UNRESOLVED

4. PRESERVE UNIQUES
   - Before merging or replacing anything, extract every unique mechanism, rule, schema field, calculation, handoff, example, acceptance criterion, and warning.

5. RESOLVE CONFLICTS
   - For every contradiction record:
     - source A
     - source B
     - exact conflict
     - controlling rule or unresolved decision
     - evidence for resolution
   - Unresolved conflicts remain visible and block canonization of the affected mechanic.

6. ORDER BY DEPENDENCY
   - Default dependency logic:
     INPUT → CALCULATION → NORMALIZATION → ROUTING → CONVERGENCE → RENDERING → USER SELECTION → HANDOFF
   - Product-specific canon may override this order.

7. BUILD COMPLETE HANDOFF EXAMPLES
   - Add at least one worked example for every major multi-stage path.
   - The example must show the actual payload or state passed from one stage to the next.

8. AUDIT
   - Reconstruct expected coverage independently from the source set.
   - Compare expected coverage with the proposed sequence.
   - Flag missing mechanics, silent deletions, duplicate authority, circular dependencies, and unsupported additions.

9. CANONIZE
   - Only accepted, conflict-resolved material moves from `docs/incoming/` into canonical docs.
   - Update the matrix row with final destination and status.
   - Update `docs/MASTER_BUILD_CHECKLIST.md` when the accepted material changes an implementation requirement.

10. IMPLEMENT
    - Code only against the accepted sequence.
    - Preserve typed handoffs and provenance.
    - Run verification before marking complete.

## Non-negotiable rules

- Examples must show complete stage-to-stage handoffs.
- The matrix is the visual audit surface; canon remains in the repository documents.
- Repository authority rules in `docs/00_START_HERE_CANON_LOCK.md` remain controlling.

## Completion test

A source-convergence pass is complete only when:

- every source is inventoried;
- every unique contribution has a disposition;
- every conflict is resolved or explicitly open;
- dependencies are ordered;
- worked handoff examples exist;
- an independent audit has been recorded;
- final destinations are known;
