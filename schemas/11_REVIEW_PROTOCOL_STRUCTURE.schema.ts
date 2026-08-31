export type ReviewConfidence = 'locked' | 'likely' | 'uncertain'

export type StructurePassId =
  | 'PASS_6_NAMING'
  | 'PASS_7_NUMBERING'
  | 'PASS_8_FOLDER_PLACEMENT'
  | 'PASS_9_DEPENDENCY_ORDER'
  | 'PASS_10_REFERENCE_INTEGRITY'

export type SeenDirectory =
  | 'docs'
  | 'phase-zero'
  | 'governance'
  | 'runtime'
  | 'schemas'
  | 'scoring'
  | 'validation'

export type StructureFinding = {
  id: string
  passId: StructurePassId
  filePath: string
  finding: string
  confidence: ReviewConfidence
}

export type StructureReviewProtocol = {
  schemaVersion: '1.0.0'
  protocolFile: 'docs/11_REVIEW_PROTOCOL_STRUCTURE.md'
  purpose: 'verify_file_order_naming_numbering_folder_placement_dependency_order_and_reference_integrity'
  mayApplyChanges: false
  requiredDirectories: SeenDirectory[]
  passes: [
    'PASS_6_NAMING',
    'PASS_7_NUMBERING',
    'PASS_8_FOLDER_PLACEMENT',
    'PASS_9_DEPENDENCY_ORDER',
    'PASS_10_REFERENCE_INTEGRITY'
  ]
  output: {
    namingFindings: StructureFinding[]
    numberingFindings: StructureFinding[]
    folderPlacementFindings: StructureFinding[]
    dependencyOrderFindings: StructureFinding[]
    referenceIntegrityFindings: StructureFinding[]
    exactFilesRequiringMoveOrRename: StructureFinding[]
  }
}

export const STRUCTURE_REVIEW_PROTOCOL: StructureReviewProtocol = {
  schemaVersion: '1.0.0',
  protocolFile: 'docs/11_REVIEW_PROTOCOL_STRUCTURE.md',
  purpose: 'verify_file_order_naming_numbering_folder_placement_dependency_order_and_reference_integrity',
  mayApplyChanges: false,
  requiredDirectories: [
    'docs',
    'phase-zero',
    'governance',
    'runtime',
    'schemas',
    'scoring',
    'validation',
  ],
  passes: [
    'PASS_6_NAMING',
    'PASS_7_NUMBERING',
    'PASS_8_FOLDER_PLACEMENT',
    'PASS_9_DEPENDENCY_ORDER',
    'PASS_10_REFERENCE_INTEGRITY',
  ],
  output: {
    namingFindings: [],
    numberingFindings: [],
    folderPlacementFindings: [],
    dependencyOrderFindings: [],
    referenceIntegrityFindings: [],
    exactFilesRequiringMoveOrRename: [],
  },
}
