# Oracle runtime cycle (ADAPT)

Salvaged from Universal `runtime/01_ORACLE_RUNTIME_CYCLE.ts`.  
Reference copy: [`contracts/01_ORACLE_RUNTIME_CYCLE.ts`](contracts/01_ORACLE_RUNTIME_CYCLE.ts)

## Laws

- Stabilize before reveal  
- Regulate after consequence  
- User can pause traversal  
- Overload blocks depth increase  
- Signal exhaustion closes traversal  
- Continuation requires payload  
- Oracle never calculates  
- Oracle renders only finalized payload  

## Happy path

```text
ENTRY → INTAKE_RECEIVED → STABILIZE → PATTERN_SUMMARY → FACT_STORY_SEPARATION
→ REVEAL → ANCHOR → CONSEQUENCE → REGULATE → DEPTH_CHECK
→ CONTINUE (user requests more) or CLOSE (signal exhausted)
```

## Safety transitions

- Overload at REVEAL → REGULATE  
- Flooding at CONSEQUENCE → REGULATE  
- User interrupt / stop → PAUSE  

## Status

Doctrine for pacing. Stub UI implements chips + order; full state machine wiring is a later MERGE into runtime.
