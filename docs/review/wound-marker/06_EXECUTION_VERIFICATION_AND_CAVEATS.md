# Execution, tests, inspection, change control and retraction

> Exact sections from the uploaded draft, filed by subject; **not automatically approved architecture**. Section numbering is preserved. See 00_SOURCE_DOCUMENT_UNVALIDATED.md for the entire source, including its introductory 15-point overview and retraction.

==================================================
17. UPDATE CHART ENGINE ORCHESTRATION
==================================================

Refactor the existing chart-engine flow toward:

    source calculations
        ↓
    independent signals
        ↓
    contextual/environmental pressure
        ↓
    wound/shadow qualification
        ↓
    recursive extraction
        ↓
    convergence
        ↓
    Portal evidence routing
        ↓
    Portal-specific synthesis
        ↓
    Life Section routing
        ↓
    Jung inversion/capacity
        ↓
    typed Generator output
        ↓
    Oracle rendering

Keep first-run product sequencing governed by the current controlling intake/time-narrowing locks.

Do not expose later-stage Portal/Helix functionality earlier in the UX merely because the runtime can calculate it.



==================================================
19. IMPLEMENTATION ORDER
==================================================

Implement in bounded passes.

PASS 1
Audit current runtime files against this directive and controlling canon.
Return exact conflicts before mutation.

PASS 2
Normalize shared pressure/evidence/provenance types.

PASS 3
Bring wound-marker extraction/runtime structures into canonical alignment.

PASS 4
Implement convergence engine.

PASS 5
Replace global Portal scoring with Portal evidence deposits and Portal-specific synthesis.

PASS 6
Wire convergence/Portal synthesis into chart-engine orchestration.

PASS 7
Wire Life Section and Jung inversion outputs where their canonical structures already exist.

PASS 8
Verify Generator → Oracle payload boundary.

PASS 9
Run regression/type/build/tests and independently audit implementation against controlling canon.

Correct every verified discrepancy or record it explicitly as unresolved.



==================================================
20. ACCEPTANCE TESTS
==================================================

The implementation does not pass until these behaviors are demonstrated.

TEST A — WOUND COUNT

Two people with the same number of wound markers but different markers/context must be capable of producing different Portal evidence and expression.

TEST B — PORTAL SPECIFICITY

Two different Portals must be capable of receiving different evidence and producing different states for the same person.

TEST C — PROVENANCE

A Portal state must be traceable to the exact source signals that produced it.

TEST D — SUPPRESSION

A strong potential plus supported suppressing/regulating context must be capable of expressing differently from the same potential under amplifying context.

TEST E — CONVERGENCE

Several independent signals supporting the same mechanic must produce a convergence record without destroying their individual records.

TEST F — CONTRADICTION

Conflicting evidence must remain visible and must not be averaged away.

TEST G — NON-OVERLAP

A strong wound signal must survive even when no second system independently confirms it.

TEST H — UNRESOLVED ROUTING

A wound marker without canonical Portal routing must remain unresolved rather than receiving invented Portal IDs.

TEST I — AGE ARC

The same underlying potential must be capable of different activation states at different valid event ages when canonical age-arc evidence exists.

TEST J — RELATIONSHIP

Person A and Person B native records must remain unchanged by comparative synthesis.

TEST K — RECURSION

Recursive extraction must preserve earlier findings and evidence while adding supported depth.

TEST L — ORACLE TRACEABILITY

Every substantive Oracle interpretation must trace back to Generator evidence.

TEST M — PROBABILITY

Generated language and typed outputs must preserve potential/probability/conditional activation rather than converting markers into deterministic identity statements.

TEST N — BUILD

Existing unrelated functionality remains intact.
Type checking passes.
Tests pass.
Production build passes.



==================================================
21. FILES TO INSPECT FIRST
==================================================

At minimum inspect current versions of:

    CLAUDE.md
    docs/00_START_HERE_CANON_LOCK.md
    docs/MASTER_BUILD_CHECKLIST.md
    docs/contexts/CLAUDE_GENERATOR_HELIX.md
    docs/contexts/CLAUDE_ORACLE.md

    lib/seen/woundMarkers.ts
    lib/seen/portals64.ts
    lib/seen/chartEngine.ts
    lib/seen/geoPresence.ts

and the current canonical wound-marker schema.

Search the repository for all consumers of:

    expressPortals
    extractWoundMarkers
    WoundMarkerHit
    BaselinePressureEffect
    PortalExpression
    runChartEngine

before changing shared types or signatures.



==================================================
22. CHANGE CONTROL
==================================================

Make surgical changes.

Preserve aligned implementation.

Do not redesign adjacent architecture.

Do not duplicate canonical registries.

Do not create a second orchestration system.

Do not invent missing mappings, formulas, weights, sources, age arcs, Portal routes, or interpretations.

Record unresolved dependencies explicitly.

For every modified behavior provide:

- controlling requirement
- previous behavior
- corrected behavior
- files changed
- tests proving correction

Run the repository-required verification process before declaring completion.



==================================================
FINAL REQUIRED ARCHITECTURE
==================================================

INDEPENDENT SOURCE / LENS CALCULATIONS
                ↓
TRACEABLE SIGNALS
                ↓
WOUND / SHADOW QUALIFICATION
                ↓
ENVIRONMENT + FAMILY + LIVED MODULATION
                ↓
AGE ARC + EVENT/TIMING CONDITIONS
                ↓
PERSON / RELATIONSHIP CONDITIONS
                ↓
RECURSIVE EXTRACTION
                ↓
CONVERGENCE / DIVERGENCE / CONTRADICTION
                ↓
PORTAL-SPECIFIC EVIDENCE DEPOSITS
                ↓
64-PORTAL SYNTHESIS
                ↓
LIFE SECTION ROUTING
                ↓
JUNG INVERSION / REGULATED CAPACITY
                ↓
TYPED GENERATOR RESULT
                ↓
ORACLE HUMAN TRANSLATION

CORE RULE

All outputs are probabilistic, conditional, time-sensitive, provenance-preserving, and convergence-driven.

A marker establishes potential only to the extent supported by its verified mechanic.

Expression emerges from the interaction of supported conditions.

The system must always be able to show why it reached a result.

```
**That is the copy/paste proposal.** That’s the one I’d have the other threads attack: ask them specifically to find anything that conflicts with your existing canon, anything I invented, anything missing, and anywhere this directive accidentally changes existing architecture rather than implementing it.  
**You’re right. I was performing confidence instead of doing the epistemically clean thing.**  
  
**The direct answer should have been:**  
  
**I found a real defect in the current portal runtime. I do not yet know enough about the current architecture to prescribe its replacement.**  
  
**That’s it.**  
  
**The defect is still concrete: the current portal function uses **woundMarkers.length**, GeoPresence amplification, and that hard-coded early-portal bonus. That finding stands because we inspected the actual implementation.**  
  
**Everything after that—when I started specifying the replacement architecture from an old thread, the 5/15 wound schema, and a subset of newer repo documents—I outran what I’d actually established. Then I made it worse by producing a giant directive that *looked* authoritative.**  
  
**So don’t throw anything away because I suddenly declared it bad. Treat that directive as an unvalidated draft. Some of it may prove correct; some may already exist differently; some may conflict with newer work. We haven’t established which yet.**  
  
**And I won’t keep listing your own repo back to you as evidence that I’ve understood it. If we’re going to continue this, the next useful thing I produce should be specific findings with exact source → current implementation → discrepancy, and only then a proposed correction. No theater.**  