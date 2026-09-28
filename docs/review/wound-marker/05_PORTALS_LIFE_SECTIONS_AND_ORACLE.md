# Portals, Life Sections, Jung and Oracle

> Exact sections from the uploaded draft, filed by subject; **not automatically approved architecture**. Section numbering is preserved. See 00_SOURCE_DOCUMENT_UNVALIDATED.md for the entire source, including its introductory 15-point overview and retraction.

==================================================
1. CORRECT CURRENT PORTAL-PRESSURE IMPLEMENTATION
==================================================

CURRENT DEFECT

The current runtime calls portal expression approximately as:

    expressPortals(
      woundMarkers.length,
      geo.baselinePressure.amplification
    )

and portal pressure is derived approximately from:

    amplification
    + earlyPortalBonus
    + woundCountAdjustment

This collapses independent evidence into a global score and causes broad groups of portals to receive essentially identical expression states.

Remove this calculation as the basis of Portal expression.

Remove the hard-coded special pressure bonus applied to Portals 1–14 unless a controlling canonical source explicitly requires that exact weighting.

Portal expression must be derived from traceable evidence routed to that individual Portal.



==================================================
12. ROUTE EVIDENCE INTO THE 64 PORTALS
==================================================

Keep the existing canonical 64-Portal registry.

Replace global wound-count-driven Portal expression with evidence deposits.

Each Portal must be capable of holding traceable deposits such as:

    portalId
    sourceSignalId
    sourceSystem
    sourcePerson
    sourceContext
    pressureEffect
    activationCondition
    recurrence
    confidence
    provenance
    unresolvedVariables

Only route a signal to a specific Portal when an existing canonical rule/source supports that routing.

When Portal routing is absent from canon, preserve routing as unresolved.

Do not invent missing marker → Portal mappings.

Portal expression is synthesized from that Portal's own evidence/deposits plus valid contextual modulation.

Portal synthesis must preserve:

- supporting evidence
- restraining/suppressing evidence
- contradictory evidence
- recurrence
- timing/context
- confidence
- unresolved variables

A Portal's final state must be explainable by inspecting its deposits.



==================================================
13. PORTAL EXPRESSION
==================================================

Retain existing expression vocabulary where compatible with controlling canon:

- visible
- sensitized
- distorted
- pressurized
- recurrent

Extend only where controlling canon requires additional states.

Do not assign expression solely from wound count or a single global GeoPresence score.

Portal state must emerge from the Portal-specific convergence record.

Any thresholds/weights used must be canonical, source-supported, or explicitly identified as unresolved/configurable.

Do not invent proprietary numeric weights merely to make the function return a result.



==================================================
14. LIFE SECTION ROUTING
==================================================

Route supported Generator findings into relevant Life Sections while preserving source identity.

Life Sections consume traceable evidence.

They must not manufacture independent findings.

A finding may appear in multiple relevant Life Sections while pointing back to the same underlying evidence record.

Preserve convergence, contradiction, recurrence, confidence, and provenance through Life Section routing.



==================================================
15. JUNG INVERSION / REGULATED CAPACITY
==================================================

Implement the canonical Jung inversion rule:

Ask:

    "What does this exact circuitry do when the wound marker
     no longer controls the output?"

Preserve the doctrine:

    "The capacity was always there. The wound was running it.
     Regulation does not create new wiring. It reveals what the
     wiring was always capable of."

Inversion must derive from the same supported circuitry/evidence as the shadow result.

Do not generate an arbitrary positive opposite.

Reconcile the current schema mismatch in which the richer JungInversion structure exists while WoundMarker currently references the smaller JungCapacity structure.

Choose the smallest canonical type relationship that preserves both:
- reusable regulated capacity
- event/Portal-specific inversion tracking

Document the migration.

Preserve Cadence-compatible inversion markers for future handoff without moving Cadence into the current active product slice.



==================================================
16. GENERATOR → ORACLE HANDOFF
==================================================

Generator owns:

- source calculations
- signal extraction
- wound/shadow qualification
- pressure modulation
- recursive extraction
- convergence/divergence/contradiction
- Portal routing
- Portal synthesis
- Life Section routing
- Jung inversion/capacity derivation
- confidence
- provenance
- unresolved variables

Oracle receives completed Generator records.

Oracle renders:

- recognition
- pattern
- probability
- activation conditions
- observable behavior
- cost/consequence
- regulated capacity
- uncertainty
- deeper disclosure when requested

Mechanics remain backstage by default.

Oracle language must never convert probability into identity or destiny.

Oracle must be able to trace every substantive claim back to Generator evidence.

