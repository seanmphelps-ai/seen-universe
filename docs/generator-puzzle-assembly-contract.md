# SEEN Generator Puzzle Assembly Contract

## Purpose

SEEN generators do not jump from a clue to a conclusion.

They reconstruct a picture the way a person solves a jigsaw puzzle: first classify the piece, then determine what it can legitimately connect to, then assemble compatible pieces into clusters, and only then reveal the larger pattern.

This contract applies to Location first and is intended to govern every SEEN generator that works from heterogeneous evidence.

---

## Core Rule

**Collect the piece. Classify its geometry. Determine its valid connections. Assemble only compatible pieces. Reveal the picture only when the assembled evidence supports it.**

A clue is not a conclusion.

A clue is a puzzle piece.

The generator must preserve the difference.

---

## Puzzle Geometry

Every incoming observation must be classified before interpretation.

A jigsaw piece can have:

- flat edges
- tabs / knobs
- blanks / sockets
- different shapes, depths, widths, orientations, and connection patterns

The equivalent in SEEN is that every observation has a specific evidence geometry.

That geometry determines:

- what the observation directly establishes
- what dimensions it may contribute to
- what markers it may support
- what transitions it may support
- what it cannot establish
- what additional evidence is still required
- what other observations it may legitimately connect to

Not all evidence is interchangeable simply because it concerns the same subject.

Two observations may both mention violence, money, status, aspiration, family, religion, safety, or belonging while having completely different admissible connections.

---

## Piece Classes

### 1. Corner Pieces

Corner pieces establish hard anchors that constrain the entire assembly.

Examples:

- geographic identity
- geographic precision
- location role: BIRTH / LIVED / CURRENT
- applicable time period
- historical versus current evidence
- source identity
- evidence provenance
- explicit user-provided facts

A corner piece narrows what can belong to the reconstruction.

It must never be silently widened. A region cannot become a city. Current evidence cannot silently become historical evidence. A source claim cannot become a verified event without supporting evidence.

### 2. Edge Pieces

Edge pieces establish boundaries on interpretation.

Examples:

- allowed evidence channels
- prohibited inference rules
- source-family competence
- marker definitions
- temporal rules
- normalization rules
- confidence limits
- unsupported transitions

An edge piece tells the generator where the picture stops.

If the evidence does not cross an edge, the generator stops rather than inventing what lies beyond it.

### 3. Interior Pieces

Interior pieces are observations that contribute detail to the environmental picture.

Examples:

- public posts
- reviews
- event records
- marketplace activity
- search behavior
- commercial signals
- public reaction
- movement/place signals
- institutional data when useful

Interior pieces become meaningful through valid connection, not through isolated interpretation.

---

## Connection Points

Each observation may expose one or more valid connection points.

Examples include:

- marker identity
- dimension contribution
- event identity
- geographic fit
- temporal fit
- source-family relationship
- response framing
- recurrence
- breadth
- spatial concentration
- digital amplification
- physical exposure
- severity
- persistence
- trend
- dependency / correlation group

A connection point is not merely topical similarity.

The generator must ask:

1. What does this piece actually support?
2. What does it not support?
3. Which other pieces are compatible with it?
4. Is the connection independent or correlated?
5. Does the connection strengthen an existing cluster or merely repeat the same source/event/account?
6. What evidence is still missing before the next inference can be made?

---

## Shape Compatibility

A tab only fits the correct blank.

Likewise, an observation may contribute strongly to one dimension while being inadmissible for another.

Examples:

- circulation may support DIG or AMP but cannot by itself establish PREV
- one event may establish an occurrence while hundreds of posts about it establish digital exposure and amplification, not hundreds of independent events
- a marketplace listing may support commerce behavior but cannot establish theft without contextual evidence
- a regional signal may support regional context but cannot be promoted to city-level evidence without geographic support
- a culturally common behavior may describe an environment but cannot establish the belief or motive of an individual

The generator must preserve these distinctions at every stage.

---

## Assembly Sequence

The generator must follow this order:

1. **Interrogate** — use the governing question/marker registry.
2. **Collect** — retrieve candidate observations from available providers.
3. **Normalize** — convert raw provider material into common observation records.
4. **Classify geometry** — identify anchors, boundaries, admissible dimensions, marker links, provenance, geo/time fit, event/account/source relationships, and prohibited inferences.
5. **Deduplicate correctly** — separate underlying event, origin, source, account, circulation, and reaction rather than collapsing them into one count.
6. **Find valid connections** — connect observations only through compatible evidence channels and marker/dimension rules.
7. **Build clusters** — accumulate mutually supporting pieces while preserving contradictions, dependence, and confidence.
8. **Test the picture** — determine what environmental findings are actually supported and which remain unresolved.
9. **Translate only supported chains** — pass findings through SEEN's evidence-gated translation architecture.
10. **Stop at the missing piece** — if a required connection is unsupported, return the partial picture and the unresolved gap rather than completing it speculatively.

---

## Cluster Before Conclusion

The generator must prefer assembled evidence over isolated clues.

One piece can be notable.

A cluster can establish a pattern.

A pattern still requires confidence, provenance, geographic fit, temporal fit, source diversity, and independence before it becomes a finding.

The generator must never treat repeated copies of the same underlying origin as equivalent to independent convergence.

At the same time, repeated circulation is not discarded. It may legitimately contribute to digital exposure, amplification, breadth, framing, or persistence.

---

## Contradictory Pieces Stay on the Table

Not every valid piece will point in the same direction.

Examples:

- instability + strong mutual aid
- deprivation + high aspiration
- violence + community defense
- economic pressure + entrepreneurship
- social isolation + intense digital community

Do not force contradictory pieces into a single flattened conclusion.

Preserve them as part of the actual picture.

---

## No Premature Human Interpretation

Location generation reconstructs the environment first.

It does not immediately convert an environmental observation into a claim about a specific person.

The Location generator answers what was present, repeated, rewarded, punished, normalized, absent, amplified, feared, desired, reachable, difficult, or structurally constrained in the environment.

Person-specific translation happens only after the environmental picture has been assembled and connected to the subject through supported SEEN transitions.

---

## Generator Output Requirement

Every generator result should make it possible to distinguish:

- the raw pieces collected
- the geometry/classification of each piece
- the valid connections made
- the clusters formed
- contradictory pieces
- missing pieces
- confidence and provenance
- the supported picture
- where inference stopped

The user-facing Oracle may hide this machinery, but the generator must retain it.

---

## Governing Principle

**SEEN does not guess the picture from one piece.**

It assembles the picture from evidence whose shapes actually fit.

The larger pattern emerges from legitimate connection, accumulation, contradiction, and convergence — not from premature interpretation.
