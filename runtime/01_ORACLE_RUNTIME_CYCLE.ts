// SEEN
// 01_ORACLE_RUNTIME_CYCLE.ts

export type OracleRuntimeState =
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

export type OracleRuntimeEvent =
  | 'USER_INPUT_RECEIVED'
  | 'PAYLOAD_READY'
  | 'OVERLOAD_DETECTED'
  | 'BLAME_DETECTED'
  | 'SELF_BLAME_DETECTED'
  | 'FLOODING_DETECTED'
  | 'FIXATION_DETECTED'
  | 'READY_FOR_DEPTH'
  | 'USER_INTERRUPTS'
  | 'USER_REQUESTS_MORE'
  | 'USER_REQUESTS_STOP'
  | 'SIGNAL_EXHAUSTED'
  | 'REGULATION_COMPLETE'

export type OracleRuntimeTransition = {
  from: OracleRuntimeState
  event: OracleRuntimeEvent
  to: OracleRuntimeState
  requiresRegulation: boolean
  allowReveal: boolean
  allowDepthIncrease: boolean
}

export type OracleRuntimeCycle = {
  schemaVersion: '1.0.0'
  fileResponsibility: 'govern_oracle_runtime_state_transitions'

  laws: {
    stabilizeBeforeReveal: true
    regulateAfterConsequence: true
    userCanPauseTraversal: true
    overloadBlocksDepthIncrease: true
    signalExhaustionClosesTraversal: true
    continuationRequiresPayload: true
    oracleNeverCalculates: true
    oracleRendersOnlyFinalizedPayload: true
  }

  transitions: OracleRuntimeTransition[]
}

export const ORACLE_RUNTIME_CYCLE: OracleRuntimeCycle = {
  schemaVersion: '1.0.0',
  fileResponsibility: 'govern_oracle_runtime_state_transitions',

  laws: {
    stabilizeBeforeReveal: true,
    regulateAfterConsequence: true,
    userCanPauseTraversal: true,
    overloadBlocksDepthIncrease: true,
    signalExhaustionClosesTraversal: true,
    continuationRequiresPayload: true,
    oracleNeverCalculates: true,
    oracleRendersOnlyFinalizedPayload: true,
  },

  transitions: [
    {
      from: 'ENTRY',
      event: 'USER_INPUT_RECEIVED',
      to: 'INTAKE_RECEIVED',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'INTAKE_RECEIVED',
      event: 'PAYLOAD_READY',
      to: 'STABILIZE',
      requiresRegulation: true,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'STABILIZE',
      event: 'REGULATION_COMPLETE',
      to: 'PATTERN_SUMMARY',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'PATTERN_SUMMARY',
      event: 'PAYLOAD_READY',
      to: 'FACT_STORY_SEPARATION',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'FACT_STORY_SEPARATION',
      event: 'PAYLOAD_READY',
      to: 'REVEAL',
      requiresRegulation: false,
      allowReveal: true,
      allowDepthIncrease: false,
    },
    {
      from: 'REVEAL',
      event: 'PAYLOAD_READY',
      to: 'ANCHOR',
      requiresRegulation: false,
      allowReveal: true,
      allowDepthIncrease: false,
    },
    {
      from: 'ANCHOR',
      event: 'PAYLOAD_READY',
      to: 'CONSEQUENCE',
      requiresRegulation: false,
      allowReveal: true,
      allowDepthIncrease: false,
    },
    {
      from: 'CONSEQUENCE',
      event: 'PAYLOAD_READY',
      to: 'REGULATE',
      requiresRegulation: true,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'REGULATE',
      event: 'REGULATION_COMPLETE',
      to: 'DEPTH_CHECK',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'DEPTH_CHECK',
      event: 'USER_REQUESTS_MORE',
      to: 'CONTINUE',
      requiresRegulation: false,
      allowReveal: true,
      allowDepthIncrease: true,
    },
    {
      from: 'DEPTH_CHECK',
      event: 'SIGNAL_EXHAUSTED',
      to: 'CLOSE',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'CONTINUE',
      event: 'PAYLOAD_READY',
      to: 'STABILIZE',
      requiresRegulation: true,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'ENTRY',
      event: 'USER_REQUESTS_STOP',
      to: 'PAUSE',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'STABILIZE',
      event: 'USER_INTERRUPTS',
      to: 'PAUSE',
      requiresRegulation: false,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'REVEAL',
      event: 'OVERLOAD_DETECTED',
      to: 'REGULATE',
      requiresRegulation: true,
      allowReveal: false,
      allowDepthIncrease: false,
    },
    {
      from: 'CONSEQUENCE',
      event: 'FLOODING_DETECTED',
      to: 'REGULATE',
      requiresRegulation: true,
      allowReveal: false,
      allowDepthIncrease: false,
    },
  ],
}
