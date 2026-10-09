// PROVENANCE: bot=codex session=2026-10-08 task=affirmative repository instruction follow-up
# SEEN APPLICATION ENTRY — CURRENT BUILD

This file is the entry point for implementation work in the active SEEN application.

## Source of truth

- Active repository: `seanmphelps-ai/seen-universe`
- Active branch: `closure-and-composure`
- `seanmphelps-ai/SEEN_universal` is a reference/salvage repository only.
- Compare each candidate from `SEEN_universal` against the current build before copying it.

## First rule

Inspect before creating.

Reuse existing working implementations. Evaluate older Universal contracts against current behavior and acceptance criteria, then adapt the valid missing functionality into the existing implementation.

For every Universal file or commit:

`KEEP / ADAPT / MERGE / REPLACE / RETIRE`

Then either connect the valid work to the active application or leave it retired/reference-only.

## Current product entry

Reuse the application intake that already collects the core user inputs.

```text
Location
→ Date of Birth
→ Time Rectification
→ Begin SEEN
```

Location uses birthplace, locations lived for at least six months, and current location. The lived period belongs to the Location record so the environment can be reconstructed for the years actually lived there.

## Runtime rule

Connect committed files to the intended runtime to implement a feature.

A feature is complete only when it is:

- implemented;
- imported/called by the intended runtime;
- reachable from the actual application flow;
- tested;
- production verified.

Verify feature completeness through the reachable application flow, tests, and production behavior in addition to the build.

## Location architecture

Location reconstructs the environment first. Establish personal events through separately attributed person-level evidence.

The core question is:

> What did this environment repeatedly put in front of people who lived there during this period?

Location evidence may come from independent layers including:

- social/public signals;
- circadian/light exposure;
- temperature, heat, cold, humidity, and seasonal climate;
- noise/acoustic environment;
- chemical and biological exposure;
- geophysical/electromagnetic conditions where measurable;
- built environment and access;
- structured social, economic, institutional, and official data.

Preserve every layer as measurable, time-specific, provenance-aware, and confidence-aware evidence. Evaluate each contribution explicitly and retain the distinct Location dimensions through synthesis.

## Current Location engine

The active Location V2 code already contains:

- source-family contracts;
- observation/provenance types;
- marker registry;
- incident dedupe with exposure preservation;
- ten-dimension measurement architecture;
- persistence runtime;
- source-family fusion;
- confidence separation;
- FORGED interrogation rules;
- explicit unsupported/gap handling.

Reuse the existing scoring system; establish and document its insufficiency before implementing a replacement within the authorized scope.

Current implementation gap: the V2 scoring runtime begins after normalized evidence has already been supplied. The primary SEEN runtime still uses the older Location field path rather than a fully collected V2/FORGED Location result.

## Location execution target

Use the existing application intake. The missing work is connecting the existing intake to the runtime.

```text
existing Location + lived period
→ collect available evidence
→ normalize/classify
→ existing V2 measurement + confidence
→ FORGED interrogation
→ supported Location findings
→ active SEEN runtime
```

Later natal, wound, shadow, portal, or other systems may interrogate the established Location field. Keep their interpretations linked to the independently collected Location evidence.

## Universal salvage rule

Audit and integrate Universal one concept at a time.

When the current build reaches a concern such as schemas, runtime, Generator, Oracle, UX, visual system, persistence, or recovery:

1. inspect the corresponding Universal files and commits;
2. identify the latest valid idea in that chain;
3. compare it to the active implementation;
4. port only what is still valid;
5. connect it to the active runtime;
6. verify it before moving to the next concept.

## Infrastructure

Current target architecture:

- GitHub — source control
- Vercel — application hosting/deployment
- Cloudflare — DNS/security/edge protection
- Railway — excluded
- Dyad — excluded

Audit the current production configuration before making an authorized deployment architecture change.

## Read order for implementation work

1. `CLAUDE.md`
2. this file
3. the actual files involved in the requested feature
4. relevant tests
5. only then the corresponding `SEEN_universal` reference material, if needed

The repository and running application outrank stale documentation.
