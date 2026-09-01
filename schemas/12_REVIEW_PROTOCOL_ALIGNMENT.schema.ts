export type ReviewConfidence = 'locked' | 'likely' | 'uncertain'

export type AlignmentPassId =
  | 'PASS_11_ORACLE_FIRST'
  | 'PASS_12_CANON_ALIGNMENT'
  | 'PASS_13_SCHEMA_ALIGNMENT'
  | 'PASS_14_DRIFT_RISK'
  | 'PASS_15_USER_FACING_SAFETY'

export type RuntimeRole =
  | 'intake'
  | 'silent_modifier'
  | 'amplifier'
  | 'suppressor'
  | 'distortion'
  | 'routing_signal'
  | 'user_facing_output'
  | 'hidden_mechanic'
  | 'governance'
  | 'validation'
  | 'runtime_state'

export type AlignmentFinding = {
  id: string
  passId: AlignmentPassId
  filePath: string
  finding: string
  confidence: ReviewConfidence
}

export type AlignmentReviewProtocol = {
  schemaVersion: '1.0.0'
  protocolFile: 'docs/12_REVIEW_PROTOCOL_ALIGNMENT.md'
  purpose: 'verify_oracle_first_presence_closure_composure_schema_contracts_drift_risk_and_user_facing_safety'
  mayApplyChanges: false
  runtimeRoles: RuntimeRole[]
  passes: [
    'PASS_11_ORACLE_FIRST',
    'PASS_12_CANON_ALIGNMENT',
    'PASS_13_SCHEMA_ALIGNMENT',
    'PASS_14_DRIFT_RISK',
    'PASS_15_USER_FACING_SAFETY'
  ]
  output: {
    oracleFirstFindings: AlignmentFinding[]
    canonAlignmentFindings: AlignmentFinding[]
    schemaAlignmentFindings: AlignmentFinding[]
    driftRisks: AlignmentFinding[]
    userFacingSafetyFindings: AlignmentFinding[]
    requiredFixesForExecutionProtocol: AlignmentFinding[]
  }
}

export const ALIGNMENT_REVIEW_PROTOCOL: AlignmentReviewProtocol = {
  schemaVersion: '1.0.0',
  protocolFile: 'docs/12_REVIEW_PROTOCOL_ALIGNMENT.md',
  purpose: 'verify_oracle_first_presence_closure_composure_schema_contracts_drift_risk_and_user_facing_safety',
  mayApplyChanges: false,
  runtimeRoles: [
    'intake',
    'silent_modifier',
    'amplifier',
    'suppressor',
    'distortion',
    'routing_signal',
    'user_facing_output',
    'hidden_mechanic',
    'governance',
    'validation',
    'runtime_state',
  ],
  passes: [
    'PASS_11_ORACLE_FIRST',
    'PASS_12_CANON_ALIGNMENT',
    'PASS_13_SCHEMA_ALIGNMENT',
    'PASS_14_DRIFT_RISK',
    'PASS_15_USER_FACING_SAFETY',
  ],
  output: {
    oracleFirstFindings: [],
    canonAlignmentFindings: [],
    schemaAlignmentFindings: [],
    driftRisks: [],
    userFacingSafetyFindings: [],
    requiredFixesForExecutionProtocol: [],
  },
}
