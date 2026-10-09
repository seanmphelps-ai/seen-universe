// PROVENANCE: bot=codex session=2026-10-09 task=remove negative instruction and definition lines
## Purpose

This file locks the boundary between docs, schemas, runtime, and user-facing copy.

### Docs

Docs define why the product exists, what the canon means, what the product promises, and what the system must preserve.

Docs may contain:

- mission
- product truth
- canon
- conceptual boundaries
- voice principles
- source-of-truth order

### Schemas

Schemas define exact generator/runtime contracts.

Every schema must answer:

1. What goes in?
2. What comes out?
3. What fields are required?
4. What order does this run in?
5. What is forbidden?
6. What does the next step receive?

Schemas may contain:

- input types
- output types
- required fields
- confidence levels
- evidence sources
- forbidden moves
- next-step handoff

### Runtime

Runtime defines execution order, state transitions, routing, and orchestration.

Runtime may contain:

- run order
- state transitions
- branch logic
- depth routing
- pause/continue rules
- handoff rules

Runtime must obey schemas.

### UI Copy

UI copy defines the words shown in the app.

UI copy may contain:

- splash copy
- button labels
- onboarding text
- empty states
- response framing

## Generator Law

The generator obeys schemas and runtime.

The generator must count:

1. receive input
2. run required sequence
3. produce typed output
4. hand output to next step

## Oracle Law

The Oracle renders only approved user-facing output.

## Final Lock

Docs explain.

Schemas contract.

Runtime executes.

UI copy speaks.
