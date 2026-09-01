export type ReviewConfidence = 'locked' | 'likely' | 'uncertain'

export type FoundationPassId =
  | 'PASS_1_READ_ONLY'
  | 'PASS_2_PURPOSE'
  | 'PASS_3_BOUNDARIES'
  | 'PASS_4_MISSING_PIECES'
  | 'PASS_5_DUPLICATE_OVERLAP'

export type FoundationFinding = {
  id: string
  passId: FoundationPassId
  filePath: string
  finding: string
  confidence: ReviewConfidence
}

export type FoundationReviewInput = {
  schemaVersion: '1.0.0'
  repositoryFullName: string
  branch: string
  currentCommit: string
  fileTree: string[]
  targetFiles: string[]
}

export type FoundationReviewOutput = {
  schemaVersion: '1.0.0'
  currentReality: FoundationFinding[]
  fileResponsibilities: FoundationFinding[]
  fileBoundaries: FoundationFinding[]
  missingPieces: FoundationFinding[]
  duplicateOverlapFindings: FoundationFinding[]
  readyForStructureReview: boolean
}

export type FoundationReviewProtocol = {
  schemaVersion: '1.0.0'
  protocolFile: 'docs/10_REVIEW_PROTOCOL_FOUNDATION.md'
  purpose: 'establish_first_review_gate_before_structure_alignment_execution_edits_commits_or_final_answers'
  mayApplyChanges: false
  mustPreserveIntentionalRepetition: true
  mustNotInventArchitecture: true
  mustNotCompressCanon: true
  input: FoundationReviewInput
  passes: [
    'PASS_1_READ_ONLY',
    'PASS_2_PURPOSE',
    'PASS_3_BOUNDARIES',
    'PASS_4_MISSING_PIECES',
    'PASS_5_DUPLICATE_OVERLAP'
  ]
  output: FoundationReviewOutput
}

export const FOUNDATION_REVIEW_PROTOCOL: FoundationReviewProtocol = {
  schemaVersion: '1.0.0',
  protocolFile: 'docs/10_REVIEW_PROTOCOL_FOUNDATION.md',
  purpose: 'establish_first_review_gate_before_structure_alignment_execution_edits_commits_or_final_answers',
  mayApplyChanges: false,
  mustPreserveIntentionalRepetition: true,
  mustNotInventArchitecture: true,
  mustNotCompressCanon: true,
  input: {
    schemaVersion: '1.0.0',
    repositoryFullName: '',
    branch: '',
    currentCommit: '',
    fileTree: [],
    targetFiles: [],
  },
  passes: [
    'PASS_1_READ_ONLY',
    'PASS_2_PURPOSE',
    'PASS_3_BOUNDARIES',
    'PASS_4_MISSING_PIECES',
    'PASS_5_DUPLICATE_OVERLAP',
  ],
  output: {
    schemaVersion: '1.0.0',
    currentReality: [],
    fileResponsibilities: [],
    fileBoundaries: [],
    missingPieces: [],
    duplicateOverlapFindings: [],
    readyForStructureReview: false,
  },
}
