// SEEN
// 06_RECURSIVE_PASS_EXECUTION.ts

export type RecursivePassNumber =
  | 1 | 2 | 3 | 4 | 5
  | 6 | 7 | 8 | 9 | 10

export type RecursivePassInput = {
  schemaVersion: '1.0.0'
  passNumber: RecursivePassNumber
  inheritedStateId: string
  targetFile: string
  passLens: string
  priorFindingIds: string[]
}

export type RecursivePassExecution = {
  schemaVersion: '1.0.0'
  passNumber: RecursivePassNumber
  inheritedStateId: string
  deltaId: string
  accumulatedStateId: string
  preservesPriorValidStructure: true
  restartsInterpretation: false
}

export type RecursivePassOutput = {
  schemaVersion: '1.0.0'
  execution: RecursivePassExecution
  findingIds: string[]
  readyForNextPass: boolean
}

export type RecursiveExecutionInput = {
  schemaVersion: '1.0.0'
  executionId: string
  targetFile: string
  initialStateId: string
  requiredPasses: RecursivePassNumber[]
}

export type RecursiveExecutionLog = {
  schemaVersion: '1.0.0'
  executionId: string
  targetFile: string
  passes: [
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution,
    RecursivePassExecution
  ]
  finalMergeProduced: true
  weakerVersionsPreserved: false
}

export type RecursiveExecutionOutput = {
  schemaVersion: '1.0.0'
  log: RecursiveExecutionLog
  finalStateId: string
  readyForFinalMerge: boolean
}

export type RecursivePassExecutionContract = {
  schemaVersion: '1.0.0'
  input: RecursiveExecutionInput
  output: RecursiveExecutionOutput
}
