# SEEN APPLICATION ENTRY — CURRENT BUILD

This file is the entry point for implementation work in the active SEEN application.

## Source of truth

- Active repository: `seanmphelps-ai/seen-universe`
- Active branch: `closure-and-composure`
- `seanmphelps-ai/SEEN_universal` is a reference/salvage repository only.
- Nothing is copied from `SEEN_universal` without checking it against the current build.

## First rule

Inspect before creating.

Do not build a second version of something that already exists. Do not replace a working current implementation with an older Universal contract just because the older file is more complete on paper.

For every Universal file or commit:

`KEEP / ADAPT / MERGE / REPLACE / RETIRE`

Then either connect the valid work to the active application or leave it retired/reference-only.

## Current product entry

The application already collects the core user inputs. Do not invent a parallel intake system.

```text
Location
→ Date of Birth
→ Time Rectification
→ Begin SEEN
```

Location uses birthplace, locations lived for at least six months, and current location. The lived period belongs to the Location record so the environment can be reconstructed for the years actually lived there.

## Runtime rule

A committed file is not an implemented feature.

A feature is complete only when it is:

- implemented;
- imported/called by the intended runtime;
- reachable from the actual application flow;
- tested;
- production verified.

A green build alone does not prove feature completeness.

## Location architecture

Location reconstructs the environment first. It does not declare what happened to the person.

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

No layer automatically outranks or erases another. Keep each layer measurable, time-specific, provenance-aware, and confidence-aware. Do not collapse all Location evidence into one generic score.

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

Do not create a replacement scoring system unless the existing one is first proven insufficient.

Current implementation gap: the V2 scoring runtime begins after normalized evidence has already been supplied. The primary SEEN runtime still uses the older Location field path rather than a fully collected V2/FORGED Location result.

## Location execution target

Use the existing application intake. The missing work is runtime connection, not another intake model.

```text
existing Location + lived period
→ collect available evidence
→ normalize/classify
→ existing V2 measurement + confidence
→ FORGED interrogation
→ supported Location findings
→ active SEEN runtime
```

Later natal, wound, shadow, portal, or other systems may interrogate the established Location field. They do not manufacture Location evidence.

## Universal salvage rule

Audit Universal one concept at a time, not by bulk migration.

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

Do not change deployment architecture until the current production configuration is audited.

## Read order for implementation work

1. `CLAUDE.md`
2. this file
3. the actual files involved in the requested feature
4. relevant tests
5. only then the corresponding `SEEN_universal` reference material, if needed

The repository and running application outrank stale documentation.
