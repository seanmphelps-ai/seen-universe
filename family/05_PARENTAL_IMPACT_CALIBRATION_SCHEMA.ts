// SEEN — Parental Impact Calibration Schema
// Position: after Child Climate Map.
// Purpose: map how parenting events, repetition, timing, repair, environment, and child susceptibility create developmental load or protection.

export type PersonId = string;
export type ChildId = string;
export type ParentId = string;
export type EventId = string;
export type SignalId = string;

export type ParentingImpactModulePosition = {
  module: "parental_impact_calibration";
  position: "after_child_climate_map";
  dependsOn: [
    "seen_core",
    "wound_marker_schema",
    "moon_emotional_baseline",
    "child_climate_map",
    "environment_modifiers"
  ];
  feedsInto: [
    "parenting_guidance",
    "child_developmental_risk_map",
    "repair_recommendation_engine",
    "family_pattern_map"
  ];
  purpose: "score_how_parenting_events_modify_child_developmental_probability";
};

export type ParentingEventDomain =
  | "promise_follow_through"
  | "birthday_or_milestone_absence"
  | "emotional_availability"
  | "physical_presence"
  | "discipline_consistency"
  | "boundary_failure"
  | "sibling_aggression"
  | "rewarding_dysregulation"
  | "sleep_routine"
  | "screen_or_tv_boundary"
  | "food_or_treat_boundary"
  | "school_or_activity_support"
  | "repair_after_rupture"
  | "parental_conflict_exposure"
  | "neglect_pattern"
  | "overcontrol_pattern"
  | "permissiveness_pattern"
  | "shame_or_humiliation"
  | "safety_violation"
  | "family_instability"
  | "environmental_stress";

export type DevelopmentalStage =
  | "prenatal"
  | "infant_0_12_months"
  | "toddler_1_3"
  | "early_childhood_3_6"
  | "middle_childhood_6_12"
  | "adolescence_12_18"
  | "young_adult";

export type EventPatternFrequency =
  | "single_event"
  | "occasional"
  | "repeating"
  | "chronic"
  | "unknown";

export type RepairQuality =
  | "none"
  | "minimized"
  | "apology_only"
  | "acknowledged_and_repaired"
  | "behavior_changed"
  | "unknown";

export type ChildSusceptibilitySignal = {
  childId: ChildId;
  moonEmotionalBaseline?: string;
  woundMarkerSensitivity?: string[];
  attachmentSensitivity?: string;
  nervousSystemSensitivity?: "low" | "moderate" | "high" | "unknown";
  environmentSensitivity?: "low" | "moderate" | "high" | "unknown";
  knownAmplifiers: string[];
  knownBuffers: string[];
};

export type ParentingImpactEvent = {
  eventId: EventId;
  childId: ChildId;
  parentId: ParentId;
  domain: ParentingEventDomain;
  developmentalStage: DevelopmentalStage;
  description: string;
  frequency: EventPatternFrequency;
  severityEstimate: "low" | "moderate" | "high" | "critical" | "unknown";
  predictability: "expected" | "unexpected" | "promised_then_broken" | "unclear";
  childAwareness: "child_unaware" | "child_partially_aware" | "child_fully_aware" | "unknown";
  publicOrPrivate: "private" | "public" | "family_observed" | "sibling_observed" | "unknown";
  repairQuality: RepairQuality;
  notes?: string;
};

export type DevelopmentalLoadScore = {
  eventId: EventId;
  baseLoad: "low" | "moderate" | "high" | "critical" | "unknown";
  frequencyMultiplier: "none" | "mild" | "moderate" | "strong" | "unknown";
  susceptibilityModifier: "low_amplification" | "moderate_amplification" | "high_amplification" | "unknown";
  repairBuffer: "no_buffer" | "weak_buffer" | "moderate_buffer" | "strong_buffer" | "unknown";
  finalImpactBand:
    | "minimal_load"
    | "minor_load"
    | "meaningful_load"
    | "pattern_forming_load"
    | "high_developmental_load"
    | "unknown";
  confidence: "low" | "medium" | "high";
};

export type ParentingPatternSignal = {
  signalId: SignalId;
  parentId: ParentId;
  childId: ChildId;
  repeatedDomains: ParentingEventDomain[];
  likelyChildInterpretation: string;
  likelyAdaptation: string;
  likelyAttachmentEffect: string;
  likelyBehavioralLearning: string;
  likelySiblingSystemEffect?: string;
  costIfUnregulated: string;
  repairPath: string;
  sourceEvents: EventId[];
};

export type ParentalImpactCalibrationOutput = {
  childId: ChildId;
  modulePosition: ParentingImpactModulePosition;
  childSusceptibility: ChildSusceptibilitySignal;
  events: ParentingImpactEvent[];
  loadScores: DevelopmentalLoadScore[];
  patternSignals: ParentingPatternSignal[];
  summary: {
    strongestDevelopmentalPressure: string;
    mostRepeatedParentingPattern: string;
    highestRiskUnrepairedLoop: string;
    strongestProtectiveBuffer: string;
    highestLeverageRepairAction: string;
  };
  guardrails: {
    predictsDestiny: false;
    labelsParentAsBad: false;
    treatsSingleEventAsPermanentDamage: false;
    requiresPatternContext: true;
    requiresRepairContext: true;
    supportsQualitativeFirst: true;
    numericScoringOptional: true;
  };
};

export const PARENTAL_IMPACT_MODULE_POSITION: ParentingImpactModulePosition = {
  module: "parental_impact_calibration",
  position: "after_child_climate_map",
  dependsOn: [
    "seen_core",
    "wound_marker_schema",
    "moon_emotional_baseline",
    "child_climate_map",
    "environment_modifiers",
  ],
  feedsInto: [
    "parenting_guidance",
    "child_developmental_risk_map",
    "repair_recommendation_engine",
    "family_pattern_map",
  ],
  purpose: "score_how_parenting_events_modify_child_developmental_probability",
};
