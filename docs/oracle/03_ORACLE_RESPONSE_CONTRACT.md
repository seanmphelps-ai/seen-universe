# Oracle response contract (ADAPT)

Salvaged from Universal `runtime/10_ORACLE_RESPONSE_CONTRACT.ts`.  
Reference copy: [`contracts/10_ORACLE_RESPONSE_CONTRACT.ts`](contracts/10_ORACLE_RESPONSE_CONTRACT.ts)

## Responsibility

Render a **finalized Generator payload** into a user-safe Oracle response.

## Laws

- `oracleDoesNotCalculate`  
- `oracleDoesNotScore`  
- `oracleRendersOnlyFinalizedPayload`  
- `stabilizeBeforeReveal`  
- `regulateAfterConsequence`  
- `mechanicsHiddenByDefault`  
- `chipsBranchFromPayloadOnly`  

## Sections

`STABILIZE` → `NAME_PATTERN` → `SEPARATE_FACT_FROM_STORY` → `RESTORE_AGENCY` → `CLEAN_NEXT_ACTION` → `REGULATE`

Each rendered section is `userFacing: true` and `exposesMechanics: false`.

## Chips

`STAY_HERE` | `GO_DEEPER` | `REGULATE`

## Input gates

Requires `finalizedByGenerator: true` and `mechanicsHidden: true`. Oracle never receives raw intake answers or raw scoring.
