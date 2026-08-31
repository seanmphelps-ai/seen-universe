// SEEN
// 07_TRAVERSAL_MEMORY.ts

export type TraversalRuntimeState =
  | 'ENTRY'
  | 'INTAKE_RECEIVED'
  | 'STABILIZE'
  | 'PATTERN_SUMMARY'
  | 'FACT_STORY_SEPARATION'
  | 'REVEAL'
  | 'ANCHOR'
  | 'CONSEQUENCE'
  | 'REGULATE'
  | 'DEPTH_CHECK'
  | 'CONTINUE'
  | 'PAUSE'
  | 'CLOSE'

export type TraversalMemoryInput = {
  schemaVersion: '1.0.0'
  sessionId: string
  currentRuntimeState: TraversalRuntimeState
  activeBranchId: string | null
  newRevealIds?: string[]
  newRegulationIds?: string[]
  newlyUnresolvedSignalIds?: string[]
  newlyExhaustedSignalIds?: string[]
}

export type TraversalMemory = {
  schemaVersion: '1.0.0'
  sessionId: string

  activeBranchId: string | null
  priorBranchIds: string[]

  priorReveals: string[]
  priorRegulations: string[]
  unresolvedSignals: string[]
  exhaustedSignals: string[]

  lastRuntimeState: TraversalRuntimeState

  continuationAllowed: boolean
}

export type TraversalMemoryOutput = {
  schemaVersion: '1.0.0'
  memory: TraversalMemory
  shouldContinueTraversal: boolean
  readyForOracleRender: boolean
}

export type TraversalMemoryContract = {
  schemaVersion: '1.0.0'
  input: TraversalMemoryInput
  output: TraversalMemoryOutput
}
