// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
# 13_REVIEW_PROTOCOL_EXECUTION

Purpose: apply only protocol-approved changes after FOUNDATION, STRUCTURE, and ALIGNMENT have completed.

This protocol is the only review protocol allowed to apply fixes.

## PASS 16 - Full Fix Plan

Produce the exact required plan.

Allowed operations:

- mkdir -p
- git mv
- touch
- surgical content edits only where canon conflict, missing protocol content, wrong read order, broken reference, or missing required protocol file requires it

Forbidden operations:

- rm
- rm -rf
- git reset
- git clean
- force push
- broad rewrites
- content compression
- concept renaming
- architecture invention

## PASS 17 - Approval Gate Internal

Confirm every proposed change is allowed by protocol.

Each change must be classified as:

- locked
- likely
- uncertain

## PASS 18 - Apply Fixes

Apply only approved changes.

Use the smallest edit that satisfies the protocol.

## PASS 19 - Verify Output

Rerun:

- git status --short
- git branch --show-current
- git rev-parse HEAD
- git log --oneline --reverse -26
- git ls-tree -r HEAD --name-only
- find . -maxdepth 3 -type f | sort

Verify final tree follows intended SEEN order.

## PASS 20 - Final Lock

Commit only after final verification.

Final response must include:

1. Current branch
2. Current commit before changes
3. Final commit hash
4. Final tree
5. Latest 26 commits oldest to newest
6. Protocol files created or updated
7. Files moved
8. Files touched
9. Content edits made
10. Missing files remaining
11. Unresolved conflicts
12. Drift risks removed
13. Drift risks remaining
14. Suggested next file
15. Confidence per finding: locked / likely / uncertain

Suggested commit message:

Add maximum review protocol stack and align SEEN universal order
