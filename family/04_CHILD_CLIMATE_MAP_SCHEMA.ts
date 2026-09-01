// SEEN — Child Climate Map Schema
// Position: downstream of SEEN Core, Masquerade, and Couples Corridor.
// Purpose: map what a child may inherit, absorb, mirror, resist, or overcorrect from the combined parental field.

export type PersonId = string;
export type CoupleId = string;
export type ChildId = string;
export type SignalId = string;

export type ChildClimateModulePosition = {
  module: "child_climate_map";
  position: "after_couples_corridor";
  dependsOn: [
    "seen_core",
    "masquerade",
    "couples_corridor",
    "environment_modifiers"
  ];
  feedsInto: ["parental_impact_calibration", "family_pattern_map"];
  purpose: "map_probable_child_developmental_climate";
};

export type ChildClimateDomain =
  | "attachment"
  | "emotional_regulation"
  | "conflict_exposure"
  | "repair_modeling"
  | "power_modeling"
  | "emotional_labor_modeling"
  | "trust_climate"
  | "money_climate"
  | "desire_and_affection_climate"
  | "family_pressure"
  | "environment"
  | "timing"
  | "lineage_pattern"
  | "overcorrection";

export type ChildClimateInputSignal = {
  signalId: SignalId;
  domain: ChildClimateDomain;
  sourceModule:
    | "seen_core"
    | "masquerade"
    | "couples_corridor"
    | "environment_modifiers"
    | "manual_observation";
  parentAContribution?: string;
  parentBContribution?: string;
  relationshipFieldContribution?: string;
  environmentContribution?: string;
  timingContribution?: string;
  confidence: "low" | "medium" | "high";
};

export type ChildClimateProbabilityBand =
  | "low"
  | "moderate"
  | "high"
  | "unknown";

export type ChildClimatePattern = {
  patternId: string;
  domain: ChildClimateDomain;
  likelyChildExperience: string;
  likelyAdaptation: string;
  likelyStrengthExpression: string;
  likelyStressExpression: string;
  probabilityBand: ChildClimateProbabilityBand;
  sourceSignals: SignalId[];
};

export type ChildClimateOutput = {
  childId?: ChildId;
  coupleId: CoupleId;
  modulePosition: ChildClimateModulePosition;
  sourceParents: {
    parentAId: PersonId;
    parentBId: PersonId;
  };
  inputSignals: ChildClimateInputSignal[];
  likelyInheritedTraits: ChildClimatePattern[];
  likelyAbsorbedPatterns: ChildClimatePattern[];
  likelyModeledPatterns: ChildClimatePattern[];
  likelyOvercorrections: ChildClimatePattern[];
  likelySensitivityPoints: ChildClimatePattern[];
  stabilizingConditions: string[];
  summary: {
    likelyHomeClimate: string;
    strongestProtectiveFactor: string;
    strongestDevelopmentalPressure: string;
    highestLeverageParentalRepair: string;
  };
  guardrails: {
    predictsDestiny: false;
    labelsChildAsFixed: false;
    requiresBothParentProfiles: true;
    requiresEnvironmentContext: true;
    supportsProbabilityBandsOnly: true;
  };
};

export const CHILD_CLIMATE_MODULE_POSITION: ChildClimateModulePosition = {
  module: "child_climate_map",
  position: "after_couples_corridor",
  dependsOn: [
    "seen_core",
    "masquerade",
    "couples_corridor",
    "environment_modifiers",
  ],
  feedsInto: ["parental_impact_calibration", "family_pattern_map"],
  purpose: "map_probable_child_developmental_climate",
};
