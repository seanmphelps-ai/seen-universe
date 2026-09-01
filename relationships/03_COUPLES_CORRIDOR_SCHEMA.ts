// SEEN — Couples Corridor Schema
// Position: after SEEN Core + Masquerade; before Child Climate Map.
// Purpose: map relational perception divergence, exposure, repair climate, and downstream child-climate signals.

export type PersonId = string;
export type CoupleId = string;
export type QuestionId = string;
export type SignalId = string;

export type SeenModulePosition = {
  module: "couples_corridor";
  position: "after_seen_core_and_masquerade";
  dependsOn: ["seen_core", "masquerade"];
  feedsInto: ["child_climate_map", "relationship_exposure_map"];
  purpose: "relational_calibration_layer";
};

export type CorridorDomain =
  | "self_image"
  | "partner_image"
  | "assumed_partner_view"
  | "relationship_identity"
  | "public_couple_identity"
  | "power"
  | "repair"
  | "conflict"
  | "trust"
  | "emotional_labor"
  | "desire"
  | "money"
  | "parenting"
  | "future_alignment"
  | "family_pressure"
  | "environment"
  | "child_climate";

export type CorridorPerspective =
  | "how_i_see_myself"
  | "how_i_see_my_partner"
  | "how_i_think_my_partner_sees_me"
  | "how_i_see_us_together"
  | "how_i_think_others_see_us"
  | "who_i_believe_holds_power"
  | "who_i_believe_repairs_more"
  | "who_i_believe_carries_emotional_labor"
  | "what_i_believe_a_child_would_absorb";

export type AnswerMode =
  | "single_choice"
  | "multi_choice"
  | "scale"
  | "ranked_choice"
  | "free_text"
  | "hybrid";

export type QualitativeAnswerValue = {
  selectedOptionIds?: string[];
  rankedOptionIds?: string[];
  scaleValue?: number;
  freeText?: string;
  tags?: string[];
};

export type CorridorQuestion = {
  questionId: QuestionId;
  domain: CorridorDomain;
  perspective: CorridorPerspective;
  answerMode: AnswerMode;
  prompt: string;
  optionIds?: string[];
  allowsFreeText: boolean;
  childClimateRelevant: boolean;
  environmentRelevant: boolean;
};

export type CorridorAnswer = {
  questionId: QuestionId;
  respondentId: PersonId;
  subject:
    | { type: "self"; personId: PersonId }
    | { type: "partner"; personId: PersonId }
    | { type: "relationship"; coupleId: CoupleId }
    | { type: "future_child"; coupleId: CoupleId };
  domain: CorridorDomain;
  perspective: CorridorPerspective;
  value: QualitativeAnswerValue;
  confidence?: "low" | "medium" | "high";
  emotionalCharge?: "low" | "medium" | "high";
  skipped?: boolean;
};

export type PartnerCorridorPacket = {
  personId: PersonId;
  selfView: CorridorAnswer[];
  viewOfPartner: CorridorAnswer[];
  assumedPartnerViewOfSelf: CorridorAnswer[];
  viewOfRelationship: CorridorAnswer[];
  publicCoupleIdentity: CorridorAnswer[];
  perceivedPowerDynamic: CorridorAnswer[];
  perceivedRepairResponsibility: CorridorAnswer[];
  perceivedEmotionalLabor: CorridorAnswer[];
  futureAlignment: CorridorAnswer[];
  childClimateExpectations?: CorridorAnswer[];
};

export type ComparisonMethod =
  | "qualitative_alignment"
  | "qualitative_divergence"
  | "scale_delta"
  | "option_mismatch"
  | "confidence_mismatch"
  | "emotional_charge_mismatch"
  | "pattern_contradiction";

export type AlignmentState =
  | "aligned"
  | "mostly_aligned"
  | "mixed"
  | "divergent"
  | "strongly_divergent"
  | "unknown";

export type CorridorComparisonSignal = {
  signalId: SignalId;
  domain: CorridorDomain;
  comparisonMethod: ComparisonMethod;
  sourceA: CorridorAnswer;
  sourceB: CorridorAnswer;
  alignmentState: AlignmentState;
  numericDelta?: number;
  meaning: string;
  relationalExposure: string;
  costIfUnregulated: string;
  shouldFeedChildClimateMap: boolean;
  shouldFeedRelationshipExposureMap: boolean;
};

export type RelationshipMarketState =
  | "bull"
  | "bear"
  | "sideways"
  | "volatile"
  | "reversal_possible"
  | "breakout_possible"
  | "breakdown_risk"
  | "unknown";

export type RelationalExposureMap = {
  coupleId: CoupleId;
  currentState?: RelationshipMarketState;
  bullConditions: string[];
  bearConditions: string[];
  sidewaysConditions: string[];
  volatilityConditions: string[];
  strongestAttractionDriver: string;
  strongestPressurePoint: string;
  mostLikelyRepeatingLoop: string;
  mostImportantRepairCondition: string;
  evidenceSignals: CorridorComparisonSignal[];
};

export type ChildClimateSignal = {
  coupleId: CoupleId;
  likelyAbsorbedPatterns: string[];
  likelyModeledPatterns: string[];
  likelyOvercorrections: string[];
  likelySensitivityPoints: string[];
  stabilizingConditions: string[];
  sourceSignals: CorridorComparisonSignal[];
  disclaimer: "probability_not_destiny";
};

export type CouplesCorridorOutput = {
  coupleId: CoupleId;
  modulePosition: SeenModulePosition;
  partnerA: {
    personId: PersonId;
    seenCoreProfileId: string;
    masqueradeProfileId?: string;
    corridorPacket: PartnerCorridorPacket;
  };
  partnerB: {
    personId: PersonId;
    seenCoreProfileId: string;
    masqueradeProfileId?: string;
    corridorPacket: PartnerCorridorPacket;
  };
  comparisonSignals: CorridorComparisonSignal[];
  relationalExposureMap: RelationalExposureMap;
  childClimateSignal?: ChildClimateSignal;
  summary: {
    coreRevelation: string;
    strongestAlignment: string;
    strongestDivergence: string;
    highestLeverageRepairPoint: string;
    childClimateHeadline?: string;
  };
  guardrails: {
    detectsLying: false;
    predictsDestiny: false;
    requiresNumericScoring: false;
    supportsQualitativeFirst: true;
    requiresConsentFromBothPartners: true;
  };
};

export const COUPLES_CORRIDOR_MODULE_POSITION: SeenModulePosition = {
  module: "couples_corridor",
  position: "after_seen_core_and_masquerade",
  dependsOn: ["seen_core", "masquerade"],
  feedsInto: ["child_climate_map", "relationship_exposure_map"],
  purpose: "relational_calibration_layer",
};
