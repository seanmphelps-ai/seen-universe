export type SeenRuntimeRole =
  | "intake"
  | "input"
  | "output"
  | "silent_modifier"
  | "amplifier"
  | "suppressor"
  | "distortion"
  | "routing_signal"
  | "user_facing_output"
  | "hidden_mechanic";

export type SeenSchemaReviewPassId =
  | "PASS_1_READ_ONLY"
  | "PASS_2_PURPOSE"
  | "PASS_3_BOUNDARIES"
  | "PASS_4_MISSING_FIELDS"
  | "PASS_5_DUPLICATE_FIELDS"
  | "PASS_6_NAMING"
  | "PASS_7_RUNTIME_ROLE"
  | "PASS_8_INPUT_OUTPUT_CONTRACT"
  | "PASS_9_USER_FACING_SAFETY"
  | "PASS_10_FULL_SEEN_ALIGNMENT_FINAL_MERGE";

export interface SeenSchemaReviewPass {
  id: SeenSchemaReviewPassId;
  order: number;
  name: string;
  instruction: string;
  prohibitedAction?: string;
  requiredOutput: string;
}

export type SeenSchemaReviewInput = {
  schemaVersion: "1.0.0";
  schemaId: string;
  schemaName: string;
  targetFile: string;
  currentSchemaState: unknown;
  priorFindingIds: string[];
};

export type SeenSchemaReviewOutput = {
  schemaVersion: "1.0.0";
  schemaId: string;
  completedPasses: SeenSchemaReviewPassId[];
  runtimeRoleMap: Record<string, SeenRuntimeRole>;
  inputOutputContract: {
    explicitInputType: string;
    explicitOutputType: string;
    handoffTarget: string;
    loadOrder: string;
    hiddenMechanicsBoundary: string;
    userFacingBoundary: string;
  } | null;
  alignmentFindings: string[];
  finalSchema: unknown;
  readyForFinalMerge: boolean;
};

export interface SeenSchemaReviewProtocol {
  protocolName: "10_SCHEMA_REVIEW_PROTOCOL";
  rule: "Every schema review must run through 10 passes before final merge.";
  input: SeenSchemaReviewInput;
  output: SeenSchemaReviewOutput;
  passes: SeenSchemaReviewPass[];
  runtimeRoles: SeenRuntimeRole[];
  alignmentChecks: string[];
  finalMergeRules: string[];
}

export const SEEN_SCHEMA_REVIEW_PROTOCOL: SeenSchemaReviewProtocol = {
  protocolName: "10_SCHEMA_REVIEW_PROTOCOL",
  rule: "Every schema review must run through 10 passes before final merge.",
  input: {
    schemaVersion: "1.0.0",
    schemaId: "",
    schemaName: "",
    targetFile: "",
    currentSchemaState: {},
    priorFindingIds: [],
  },
  output: {
    schemaVersion: "1.0.0",
    schemaId: "",
    completedPasses: [],
    runtimeRoleMap: {},
    inputOutputContract: null,
    alignmentFindings: [],
    finalSchema: {},
    readyForFinalMerge: false,
  },
  runtimeRoles: [
    "intake",
    "input",
    "output",
    "silent_modifier",
    "amplifier",
    "suppressor",
    "distortion",
    "routing_signal",
    "user_facing_output",
    "hidden_mechanic",
  ],
  alignmentChecks: [
    "Closure & Composure",
    "two-person intake",
    "silent modifiers",
    "wound markers",
    "Jung inversion",
    "Oracle nesting chips",
    "hidden time calibration",
    "baseline before modulation",
  ],
  finalMergeRules: [
    "Produce one clean schema.",
    "Do not preserve weaker versions.",
    "Do not add new architecture unless required.",
    "Do not restart the interpretation.",
  ],
  passes: [
    {
      id: "PASS_1_READ_ONLY",
      order: 1,
      name: "Read Only",
      instruction: "Identify what the schema says.",
      prohibitedAction: "Do not improve it yet.",
      requiredOutput: "A plain reading of the current schema.",
    },
    {
      id: "PASS_2_PURPOSE",
      order: 2,
      name: "Purpose",
      instruction: "State what this schema is responsible for.",
      requiredOutput: "A responsibility statement.",
    },
    {
      id: "PASS_3_BOUNDARIES",
      order: 3,
      name: "Boundaries",
      instruction: "State what this schema should not handle.",
      requiredOutput: "A boundary statement.",
    },
    {
      id: "PASS_4_MISSING_FIELDS",
      order: 4,
      name: "Missing Fields",
      instruction: "Identify missing fields required for SEEN.",
      requiredOutput: "A missing-field list.",
    },
    {
      id: "PASS_5_DUPLICATE_FIELDS",
      order: 5,
      name: "Duplicate Fields",
      instruction: "Identify duplicated or overlapping fields.",
      requiredOutput: "A duplicate/overlap list.",
    },
    {
      id: "PASS_6_NAMING",
      order: 6,
      name: "Naming",
      instruction: "Normalize names without changing meaning.",
      requiredOutput: "A naming-normalization list.",
    },
    {
      id: "PASS_7_RUNTIME_ROLE",
      order: 7,
      name: "Runtime Role",
      instruction: "Define whether each field is intake, input, output, silent modifier, amplifier, suppressor, distortion, routing signal, user-facing output, or hidden mechanic.",
      requiredOutput: "A runtime-role map for each field.",
    },
    {
      id: "PASS_8_INPUT_OUTPUT_CONTRACT",
      order: 8,
      name: "Input / Output Contract",
      instruction: "Define explicit input type, explicit output type, handoff target, load order, hidden mechanics boundary, and user-facing boundary. If input or output is missing, the schema fails review.",
      requiredOutput: "A complete input/output contract with handoff target and load order.",
    },
    {
      id: "PASS_9_USER_FACING_SAFETY",
      order: 9,
      name: "User-Facing Safety",
      instruction: "Remove anything that would repeat intake answers literally or expose mechanics too early.",
      requiredOutput: "A safety-filtered field/output list.",
    },
    {
      id: "PASS_10_FULL_SEEN_ALIGNMENT_FINAL_MERGE",
      order: 10,
      name: "Full SEEN Alignment + Final Merge",
      instruction: "Check alignment with Closure & Composure, two-person intake, silent modifiers, wound markers, Jung inversion, Oracle nesting chips, hidden time calibration, and baseline before modulation. Produce one clean schema. Do not preserve weaker versions. Do not add new architecture unless required. Do not restart the interpretation.",
      requiredOutput: "One SEEN-aligned final merged schema.",
    },
  ],
};
