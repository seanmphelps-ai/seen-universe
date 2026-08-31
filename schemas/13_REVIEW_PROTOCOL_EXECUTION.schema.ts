export type ReviewConfidence = 'locked' | 'likely' | 'uncertain'

export type ExecutionPassId =
  | 'PASS_16_FULL_FIX_PLAN'
  | 'PASS_17_APPROVAL_GATE_INTERNAL'
  | 'PASS_18_APPLY_FIXES'
  | 'PASS_19_VERIFY_OUTPUT'
  | 'PASS_20_FINAL_LOCK'

export type AllowedOperation =
  | 'mkdir -p'
  | 'git mv'
  | 'touch'
  | 'surgical_content_edit'

export type ForbiddenOperation =
  | 'rm'
  | 'rm -rf'
  | 'git reset'
  | 'git clean'
  | 'force_push'
  | 'broad_rewrite'
  | 'content_compression'
  | 'concept_renaming'
  | 'architecture_invention'

export type ExecutionFinding = {
  id: string
  passId: ExecutionPassId
  filePath: string
  finding: string
  confidence: ReviewConfidence
}

export type ExecutionReviewProtocol = {
  schemaVersion: '1.0.0'
  protocolFile: 'docs/13_REVIEW_PROTOCOL_EXECUTION.md'
  purpose: 'apply_only_protocol_approved_changes_after_foundation_structure_and_alignment_complete'
  mayApplyChanges: true
  commitOnlyAfterFinalVerification: true
  allowedOperations: AllowedOperation[]
  forbiddenOperations: ForbiddenOperation[]
  passes: [
    'PASS_16_FULL_FIX_PLAN',
    'PASS_17_APPROVAL_GATE_INTERNAL',
    'PASS_18_APPLY_FIXES',
    'PASS_19_VERIFY_OUTPUT',
    'PASS_20_FINAL_LOCK'
  ]
  output: {
    currentBranch: string
    currentCommitBeforeChanges: string
    finalCommitHash: string | null
    finalTree: string[]
    latest26CommitsOldestToNewest: string[]
    protocolFilesCreatedOrUpdated: string[]
    filesMoved: string[]
    filesTouched: string[]
    contentEditsMade: string[]
    missingFilesRemaining: ExecutionFinding[]
    unresolvedConflicts: ExecutionFinding[]
    driftRisksRemoved: ExecutionFinding[]
    driftRisksRemaining: ExecutionFinding[]
    suggestedNextFile: string | null
    confidencePerFinding: ExecutionFinding[]
  }
}

export const EXECUTION_REVIEW_PROTOCOL: ExecutionReviewProtocol = {
  schemaVersion: '1.0.0',
  protocolFile: 'docs/13_REVIEW_PROTOCOL_EXECUTION.md',
  purpose: 'apply_only_protocol_approved_changes_after_foundation_structure_and_alignment_complete',
  mayApplyChanges: true,
  commitOnlyAfterFinalVerification: true,
  allowedOperations: [
    'mkdir -p',
    'git mv',
    'touch',
    'surgical_content_edit',
  ],
  forbiddenOperations: [
    'rm',
    'rm -rf',
    'git reset',
    'git clean',
    'force_push',
    'broad_rewrite',
    'content_compression',
    'concept_renaming',
    'architecture_invention',
  ],
  passes: [
    'PASS_16_FULL_FIX_PLAN',
    'PASS_17_APPROVAL_GATE_INTERNAL',
    'PASS_18_APPLY_FIXES',
    'PASS_19_VERIFY_OUTPUT',
    'PASS_20_FINAL_LOCK',
  ],
  output: {
    currentBranch: '',
    currentCommitBeforeChanges: '',
    finalCommitHash: null,
    finalTree: [],
    latest26CommitsOldestToNewest: [],
    protocolFilesCreatedOrUpdated: [],
    filesMoved: [],
    filesTouched: [],
    contentEditsMade: [],
    missingFilesRemaining: [],
    unresolvedConflicts: [],
    driftRisksRemoved: [],
    driftRisksRemaining: [],
    suggestedNextFile: null,
    confidencePerFinding: [],
  },
}
