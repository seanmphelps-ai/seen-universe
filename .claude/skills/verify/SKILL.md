# Verify

## Purpose
Required completion gate for SEEN pipeline work.

## Verify
- requested scope was followed
- protected/adjacent architecture was not changed without authorization
- required repository and matching context files were read
- timeframe is correct
- requested and matched geography are preserved
- provenance exists for evidence-derived claims
- confidence is separate from intensity
- contradictions are preserved
- deterministic calculations reproduce
- source calculations remain independent
- tests/typecheck/build checks relevant to the change pass
- output records satisfy their governing contracts

## Failure rule
A failed verification does not authorize unrelated repair or redesign. Return the failure to the bounded skill responsible for it, or stop when the active task does not authorize repair.

## Output
PASS with verified checks, or FAIL with the exact failed checks and evidence.
