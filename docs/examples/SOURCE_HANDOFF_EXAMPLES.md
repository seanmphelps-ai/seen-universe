# SOURCE HANDOFF EXAMPLES

These examples define the minimum level of completeness expected when sequence analysis says one stage hands off to another.

## Example A — Location path

### 1. User input

```json
{
  "city": "Kalispell",
  "region": "Montana",
  "country": "US",
  "start": "2025-01",
  "end": "present"
}
```

### 2. Location resolution

```json
{
  "placeId": "provider-id",
  "latitude": 48.19,
  "longitude": -114.31,
  "timezone": "America/Denver",
  "period": {
    "start": "2025-01",
    "end": "present"
  }
}
```

### 3. Environmental source outputs

Keep GeoPresence, biome, and abiotic outputs separate before synthesis.

```json
{
  "geoPresence": { "signals": [], "provenance": [] },
  "biome": { "classification": null, "signals": [], "provenance": [] },
  "abiotic": { "signals": [], "provenance": [] }
}
```

### 4. Environmental Pressure Field

```json
{
  "locationPeriodId": "lp-001",
  "contributions": [],
  "confidence": null,
  "contradictions": [],
  "provenance": []
}
```

### 5. Portal routing

Every supported contribution routes into relevant portals without deleting low-pressure portals.

```json
{
  "portalLayer": [
    {
      "portalId": "P01",
      "pressure": 0,
      "evidence": [],
      "provenance": []
    }
  ]
}
```

### 6. Life Section routing

Portal findings retain their source trail when routed onward.

```json
{
  "lifeSectionId": "section-id",
  "signals": [
    {
      "portalId": "P01",
      "source": "environment",
      "evidenceRefs": []
    }
  ]
}
```

## Example B — Source-document convergence

Given three uploaded documents:

- Document A defines an intake rule.
- Document B repeats that rule and adds validation.
- Document C contradicts the order but contains a unique UI example.

The matrix must resolve them as:

```text
A → KEEP governing intake rule
B → MERGE validation into A
C → RETIRE conflicting order, KEEP unique UI example
```

The final canon must contain both the governing rule and the unique UI example. The rejected order remains recorded in the matrix conflict column.

## Example C — Calculation module handoff

```text
raw source evidence
→ verified mechanic
→ typed calculation output
→ source-specific extraction
→ portal contribution
→ convergence record
→ Oracle-ready payload
```

At every arrow, preserve:

- source identity
- protocol/version
- evidence
- confidence
- contradictions
- unresolved variables

Do not collapse these fields merely because the user-facing output is simple.
