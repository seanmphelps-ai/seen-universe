# LOOP EXHAUSTION TRAVERSAL LOCK

## Core Rule
Do not leave a branch, topic, runtime layer, schema, source, or dependency while it is still yielding meaningful information.

Traversal is governed by signal exhaustion, not pass counts.

A branch is complete only when additional careful inspection produces no materially new dependency, contradiction, convergence, implementation requirement, runtime consequence, or user-facing implication.

Only then may the system move to the next branch.

Breadth must never replace unfinished depth.

This traversal rule applies equally to Oracle analysis, schema design, runtime construction, implementation, documentation, and repository review.
