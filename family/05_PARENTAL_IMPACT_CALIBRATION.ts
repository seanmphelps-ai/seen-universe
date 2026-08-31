// family/05_PARENTAL_IMPACT_CALIBRATION.ts

export type PersonId = string;
export type ChildId = string;
export type ParentId = string;
export type EventId = string;
export type SignalId = string;

export type ParentalImpactModulePosition = {
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
  purpose: "calculate_how_parenting_events_modify_child_developmental_probability";
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

export type EventFrequency =
  | "single_event"
  | "occasional"
  | "repeating"
  | "chronic"
  | "unknown";

export type EventSeverity =
  | "low"
  | "moderate"
  | "high"
  | "critical"
  | "unknown";

export type EventPredictability =
  | "expected"
  | "unexpected"
  | "promised_then_broken"
  | "unclear";

export type ChildAwareness =
  | "child_unaware"
  | "child_partially_aware"
  | "child_fully_aware"
  | "unknown";

export type EventVisibility =
  | "private"
  | "public"
  | "family_observed"
  | "sibling_observed"
  | "unknown";

export type RepairQuality =
  | "none"
  | "minimized"
  | "apology_only"
  | "acknowledged_and_repaired"
  | "behavior_changed"
  | "unknown";

export type SensitivityBand =
  | "low"
  | "moderate"
  | "high"
  | "unknown";

export type ImpactBand =
  | "minimal_load"
  | "minor_load"
  | "meaningful_load"
  | "pattern_forming_load"
  | "high_developmental_load";

export type ScoreConfidence = "low" | "medium" | "high";

export type ChildSusceptibilitySignal = {
  childId: ChildId;
  moonEmotionalBaseline?: string;
  woundMarkerSensitivity?: string[];
  attachmentSensitivity?: string;
  nervousSystemSensitivity: SensitivityBand;
  environmentSensitivity: SensitivityBand;
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
  frequency: EventFrequency;
  severity: EventSeverity;
  predictability: EventPredictability;
  childAwareness: ChildAwareness;
  visibility: EventVisibility;
  repairQuality: RepairQuality;
  notes?: string;
};

export type DevelopmentalLoadScore = {
  eventId: EventId;
  baseDomainLoad: number;
  severityMultiplier: number;
  frequencyMultiplier: number;
  developmentalStageMultiplier: number;
  predictabilityMultiplier: number;
  childAwarenessMultiplier: number;
  visibilityMultiplier: number;
  susceptibilityMultiplier: number;
  environmentMultiplier: number;
  repairBufferMultiplier: number;
  rawScoreBeforeRepair: number;
  finalScore: number;
  impactBand: ImpactBand;
  confidence: ScoreConfidence;
  equation: string;
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
  modulePosition: ParentalImpactModulePosition;
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
    numericScoringOptional: false;
  };
};

export const PARENTAL_IMPACT_MODULE_POSITION: ParentalImpactModulePosition = {
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
  purpose: "calculate_how_parenting_events_modify_child_developmental_probability",
};

export const BASE_DOMAIN_LOAD: Record<ParentingEventDomain, number> = {
  promise_follow_through: 5,
  birthday_or_milestone_absence: 7,
  emotional_availability: 7,
  physical_presence: 6,
  discipline_consistency: 5,
  boundary_failure: 4,
  sibling_aggression: 7,
  rewarding_dysregulation: 4,
  sleep_routine: 4,
  screen_or_tv_boundary: 3,
  food_or_treat_boundary: 3,
  school_or_activity_support: 5,
  repair_after_rupture: 6,
  parental_conflict_exposure: 8,
  neglect_pattern: 9,
  overcontrol_pattern: 7,
  permissiveness_pattern: 5,
  shame_or_humiliation: 9,
  safety_violation: 10,
  family_instability: 8,
  environmental_stress: 6,
};

export const SEVERITY_MULTIPLIER: Record<EventSeverity, number> = {
  low: 0.75,
  moderate: 1.0,
  high: 1.35,
  critical: 1.7,
  unknown: 1.0,
};

export const FREQUENCY_MULTIPLIER: Record<EventFrequency, number> = {
  single_event: 1.0,
  occasional: 1.2,
  repeating: 1.6,
  chronic: 2.3,
  unknown: 1.0,
};

export const DEVELOPMENTAL_STAGE_MULTIPLIER: Record<DevelopmentalStage, number> = {
  prenatal: 1.4,
  infant_0_12_months: 1.6,
  toddler_1_3: 1.45,
  early_childhood_3_6: 1.35,
  middle_childhood_6_12: 1.2,
  adolescence_12_18: 1.15,
  young_adult: 0.9,
};

export const PREDICTABILITY_MULTIPLIER: Record<EventPredictability, number> = {
  expected: 1.0,
  unexpected: 1.15,
  promised_then_broken: 1.45,
  unclear: 1.0,
};

export const CHILD_AWARENESS_MULTIPLIER: Record<ChildAwareness, number> = {
  child_unaware: 0.7,
  child_partially_aware: 1.0,
  child_fully_aware: 1.25,
  unknown: 1.0,
};

export const VISIBILITY_MULTIPLIER: Record<EventVisibility, number> = {
  private: 1.0,
  public: 1.25,
  family_observed: 1.15,
  sibling_observed: 1.2,
  unknown: 1.0,
};

export const SENSITIVITY_MULTIPLIER: Record<SensitivityBand, number> = {
  low: 0.85,
  moderate: 1.0,
  high: 1.35,
  unknown: 1.0,
};

export const REPAIR_BUFFER_MULTIPLIER: Record<RepairQuality, number> = {
  none: 1.0,
  minimized: 0.9,
  apology_only: 0.75,
  acknowledged_and_repaired: 0.55,
  behavior_changed: 0.4,
  unknown: 1.0,
};

export type ImpactCalculationInput = {
  event: ParentingImpactEvent;
  childSusceptibility: ChildSusceptibilitySignal;
  environmentSensitivityOverride?: SensitivityBand;
  confidence?: ScoreConfidence;
};

export function calculateParentalImpactScore(
  input: ImpactCalculationInput
): DevelopmentalLoadScore {
  const { event, childSusceptibility } = input;

  const baseDomainLoad = BASE_DOMAIN_LOAD[event.domain];
  const severityMultiplier = SEVERITY_MULTIPLIER[event.severity];
  const frequencyMultiplier = FREQUENCY_MULTIPLIER[event.frequency];
  const developmentalStageMultiplier =
    DEVELOPMENTAL_STAGE_MULTIPLIER[event.developmentalStage];
  const predictabilityMultiplier =
    PREDICTABILITY_MULTIPLIER[event.predictability];
  const childAwarenessMultiplier =
    CHILD_AWARENESS_MULTIPLIER[event.childAwareness];
  const visibilityMultiplier = VISIBILITY_MULTIPLIER[event.visibility];
  const susceptibilityMultiplier = calculateSusceptibilityMultiplier(
    childSusceptibility
  );
  const environmentMultiplier =
    SENSITIVITY_MULTIPLIER[
      input.environmentSensitivityOverride ??
        childSusceptibility.environmentSensitivity
    ];
  const repairBufferMultiplier =
    REPAIR_BUFFER_MULTIPLIER[event.repairQuality];

  const rawScoreBeforeRepair =
    baseDomainLoad *
    severityMultiplier *
    frequencyMultiplier *
    developmentalStageMultiplier *
    predictabilityMultiplier *
    childAwarenessMultiplier *
    visibilityMultiplier *
    susceptibilityMultiplier *
    environmentMultiplier;

  const finalScore = clampScore(
    rawScoreBeforeRepair * repairBufferMultiplier
  );

  return {
    eventId: event.eventId,
    baseDomainLoad,
    severityMultiplier,
    frequencyMultiplier,
    developmentalStageMultiplier,
    predictabilityMultiplier,
    childAwarenessMultiplier,
    visibilityMultiplier,
    susceptibilityMultiplier,
    environmentMultiplier,
    repairBufferMultiplier,
    rawScoreBeforeRepair: roundScore(rawScoreBeforeRepair),
    finalScore,
    impactBand: mapScoreToImpactBand(finalScore),
    confidence: input.confidence ?? "medium",
    equation:
      "finalScore = baseDomainLoad × severityMultiplier × frequencyMultiplier × developmentalStageMultiplier × predictabilityMultiplier × childAwarenessMultiplier × visibilityMultiplier × susceptibilityMultiplier × environmentMultiplier × repairBufferMultiplier",
  };
}

export function calculateSusceptibilityMultiplier(
  childSusceptibility: ChildSusceptibilitySignal
): number {
  const nervousSystem =
    SENSITIVITY_MULTIPLIER[childSusceptibility.nervousSystemSensitivity];
  const environment =
    SENSITIVITY_MULTIPLIER[childSusceptibility.environmentSensitivity];
  const woundMarkerModifier =
    childSusceptibility.woundMarkerSensitivity &&
    childSusceptibility.woundMarkerSensitivity.length >= 3
      ? 1.15
      : 1.0;
  const amplifierModifier =
    childSusceptibility.knownAmplifiers.length >= 3 ? 1.1 : 1.0;
  const bufferModifier =
    childSusceptibility.knownBuffers.length >= 3 ? 0.9 : 1.0;

  return roundScore(
    nervousSystem *
      environment *
      woundMarkerModifier *
      amplifierModifier *
      bufferModifier
  );
}

export function mapScoreToImpactBand(score: number): ImpactBand {
  if (score < 10) return "minimal_load";
  if (score < 20) return "minor_load";
  if (score < 40) return "meaningful_load";
  if (score < 65) return "pattern_forming_load";
  return "high_developmental_load";
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, roundScore(score)));
}

export function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

export const PARENTING_PATTERN_TRANSLATION: Record<
  ParentingEventDomain,
  {
    likelyChildInterpretation: string;
    likelyAdaptation: string;
    likelyAttachmentEffect: string;
    likelyBehavioralLearning: string;
    costIfUnregulated: string;
    repairPath: string;
  }
> = {
  promise_follow_through: {
    likelyChildInterpretation:
      "Promises may feel uncertain when spoken commitment and follow-through do not match.",
    likelyAdaptation:
      "The child may lower expectation, over-monitor adults, or stop asking directly.",
    likelyAttachmentEffect:
      "Trust may become conditional on repeated proof rather than verbal reassurance.",
    likelyBehavioralLearning:
      "Words are tested against consistency, not accepted as stable by themselves.",
    costIfUnregulated:
      "Repeated mismatch can weaken felt reliability and increase guardedness.",
    repairPath:
      "Name the missed commitment, acknowledge the effect, and create a smaller promise that is kept.",
  },
  birthday_or_milestone_absence: {
    likelyChildInterpretation:
      "Important moments may feel emotionally unsupported when absence is unrepaired.",
    likelyAdaptation:
      "The child may minimize needs, inflate performance, or seek validation elsewhere.",
    likelyAttachmentEffect:
      "Milestones may become linked with disappointment, self-protection, or emotional distance.",
    likelyBehavioralLearning:
      "Visibility and celebration may feel conditional rather than secure.",
    costIfUnregulated:
      "Repeated absence around major moments can form a durable expectation of non-priority.",
    repairPath:
      "Acknowledge the missed moment directly and create a specific replacement ritual without excuses.",
  },
  emotional_availability: {
    likelyChildInterpretation:
      "Emotional needs may feel inconvenient, unsafe, or too much.",
    likelyAdaptation:
      "The child may suppress emotion, amplify emotion, or seek regulation from peers instead of caregivers.",
    likelyAttachmentEffect:
      "The bond may organize around distance, pursuit, or emotional self-reliance.",
    likelyBehavioralLearning:
      "Connection is managed by reading adult capacity before expressing need.",
    costIfUnregulated:
      "Chronic emotional absence can shape long-term difficulty with asking, trusting, and receiving.",
    repairPath:
      "Return with presence, name the emotion, and stay engaged long enough for the child to settle.",
  },
  physical_presence: {
    likelyChildInterpretation:
      "Care may feel abstract if the caregiver is rarely physically available.",
    likelyAdaptation:
      "The child may detach, become clingy, or overvalue rare moments of attention.",
    likelyAttachmentEffect:
      "Physical absence can become confused with emotional availability.",
    likelyBehavioralLearning:
      "Attention may be treated as scarce and competed for.",
    costIfUnregulated:
      "Repeated absence can reduce felt security even when material support is present.",
    repairPath:
      "Create predictable presence windows and protect them from cancellation.",
  },
  discipline_consistency: {
    likelyChildInterpretation:
      "Rules may feel negotiable, mood-based, or unsafe to trust.",
    likelyAdaptation:
      "The child may test limits more aggressively or become hypervigilant around adult mood.",
    likelyAttachmentEffect:
      "Safety may become tied to guessing the caregiver’s current state.",
    likelyBehavioralLearning:
      "Boundaries are learned as unstable unless consistently held and repaired.",
    costIfUnregulated:
      "Inconsistent discipline can reinforce testing, avoidance, and distrust of structure.",
    repairPath:
      "State the boundary clearly, apply it consistently, and reconnect after enforcement.",
  },
  boundary_failure: {
    likelyChildInterpretation:
      "Limits may not hold when pressure, emotion, or persistence increases.",
    likelyAdaptation:
      "The child may escalate behavior until the boundary collapses.",
    likelyAttachmentEffect:
      "Containment may feel unreliable.",
    likelyBehavioralLearning:
      "Intensity becomes a strategy for gaining control.",
    costIfUnregulated:
      "Repeated boundary collapse can strengthen dysregulation as an effective tool.",
    repairPath:
      "Reset the boundary calmly and follow through without emotional bargaining.",
  },
  sibling_aggression: {
    likelyChildInterpretation:
      "Power may matter more than safety if aggression is not interrupted.",
    likelyAdaptation:
      "One child may dominate while another becomes guarded, resentful, or retaliatory.",
    likelyAttachmentEffect:
      "Caregiver protection may feel uneven or absent.",
    likelyBehavioralLearning:
      "Harm without repair becomes normalized inside the sibling system.",
    costIfUnregulated:
      "Unaddressed sibling aggression can harden roles of aggressor, victim, and ignored witness.",
    repairPath:
      "Interrupt the aggression, protect the harmed child, require repair, and teach replacement behavior.",
  },
  rewarding_dysregulation: {
    likelyChildInterpretation:
      "Escalation works when calm asking does not.",
    likelyAdaptation:
      "The child may use pouting, tantrums, or collapse to control outcomes.",
    likelyAttachmentEffect:
      "Connection may become tangled with performance of distress.",
    likelyBehavioralLearning:
      "Dysregulation becomes a learned negotiation strategy.",
    costIfUnregulated:
      "Rewarded dysregulation can increase emotional volatility and reduce tolerance for limits.",
    repairPath:
      "Hold the limit, regulate the body first, then reward calm communication.",
  },
  sleep_routine: {
    likelyChildInterpretation:
      "Body rhythms may be secondary to stimulation or negotiation.",
    likelyAdaptation:
      "The child may resist transitions and rely on external stimulation to settle.",
    likelyAttachmentEffect:
      "Bedtime may become a power struggle instead of a secure closing ritual.",
    likelyBehavioralLearning:
      "Fatigue cues are overridden rather than respected.",
    costIfUnregulated:
      "Chronic sleep boundary collapse can intensify emotional reactivity and reduce regulation capacity.",
    repairPath:
      "Rebuild a predictable closing sequence and keep the same limit repeatedly.",
  },
  screen_or_tv_boundary: {
    likelyChildInterpretation:
      "Screens may become the easiest route to comfort, delay, or control.",
    likelyAdaptation:
      "The child may use screens to avoid boredom, emotion, or transition.",
    likelyAttachmentEffect:
      "Co-regulation may be replaced by stimulation.",
    likelyBehavioralLearning:
      "Discomfort is escaped rather than metabolized.",
    costIfUnregulated:
      "Repeated screen-boundary collapse can reduce frustration tolerance and transition flexibility.",
    repairPath:
      "Create a simple screen boundary, hold it, and replace the transition with connection or movement.",
  },
  food_or_treat_boundary: {
    likelyChildInterpretation:
      "Food or treats may become emotional negotiation tools.",
    likelyAdaptation:
      "The child may connect comfort, control, or reward to food access.",
    likelyAttachmentEffect:
      "Nurture may become mixed with bargaining.",
    likelyBehavioralLearning:
      "Pouting or persistence can override body-based limits.",
    costIfUnregulated:
      "Repeated food-boundary collapse can blur hunger, reward, comfort, and control.",
    repairPath:
      "Separate emotional comfort from food reward and offer connection before or after the boundary.",
  },
  school_or_activity_support: {
    likelyChildInterpretation:
      "Effort may not be witnessed unless it becomes urgent or exceptional.",
    likelyAdaptation:
      "The child may overperform, underperform, or stop inviting support.",
    likelyAttachmentEffect:
      "Support may feel unreliable around competence and achievement.",
    likelyBehavioralLearning:
      "Follow-through around commitments teaches whether effort is worth sharing.",
    costIfUnregulated:
      "Repeated lack of support can weaken confidence, motivation, and secure pride.",
    repairPath:
      "Show up predictably for one concrete school or activity commitment and name the child’s effort.",
  },
  repair_after_rupture: {
    likelyChildInterpretation:
      "Conflict may not return to safety unless repair is modeled.",
    likelyAdaptation:
      "The child may avoid conflict, chase repair, or carry unresolved tension.",
    likelyAttachmentEffect:
      "The bond may feel unstable after rupture.",
    likelyBehavioralLearning:
      "Repair is either learned as a real skill or replaced by silence, blame, or avoidance.",
    costIfUnregulated:
      "Unrepaired rupture can teach the child that closeness disappears after conflict.",
    repairPath:
      "Name what happened, own the adult part, validate the child’s experience, and change the next behavior.",
  },
  parental_conflict_exposure: {
    likelyChildInterpretation:
      "Love may feel linked to tension, threat, or instability.",
    likelyAdaptation:
      "The child may mediate, disappear, perform, or become reactive.",
    likelyAttachmentEffect:
      "Security may depend on tracking adult emotional weather.",
    likelyBehavioralLearning:
      "Conflict becomes a template for closeness, power, or abandonment.",
    costIfUnregulated:
      "Repeated exposure to unresolved adult conflict can make vigilance feel normal.",
    repairPath:
      "Reduce exposure, repair in front of the child when appropriate, and clearly remove responsibility from the child.",
  },
  neglect_pattern: {
    likelyChildInterpretation:
      "Needs may not bring response.",
    likelyAdaptation:
      "The child may become self-reliant, shut down, or seek attention through escalation.",
    likelyAttachmentEffect:
      "Attachment may organize around distance, scarcity, or anxious pursuit.",
    likelyBehavioralLearning:
      "Needs are hidden, intensified, or redirected away from caregivers.",
    costIfUnregulated:
      "Repeated neglect patterns can form deep expectations of non-response.",
    repairPath:
      "Increase predictable responsiveness and track small needs before they become crises.",
  },
  overcontrol_pattern: {
    likelyChildInterpretation:
      "Autonomy may feel unsafe or disallowed.",
    likelyAdaptation:
      "The child may comply, rebel, hide, or lose access to inner preference.",
    likelyAttachmentEffect:
      "Connection may feel dependent on obedience.",
    likelyBehavioralLearning:
      "Control becomes confused with care.",
    costIfUnregulated:
      "Repeated overcontrol can weaken self-trust and increase secrecy or collapse.",
    repairPath:
      "Offer bounded choices and let the child experience safe agency.",
  },
  permissiveness_pattern: {
    likelyChildInterpretation:
      "The child may feel powerful but uncontained.",
    likelyAdaptation:
      "The child may push harder to find the edge of safety.",
    likelyAttachmentEffect:
      "Lack of containment may feel like lack of leadership.",
    likelyBehavioralLearning:
      "Freedom without structure becomes unstable.",
    costIfUnregulated:
      "Repeated permissiveness can reduce frustration tolerance and respect for limits.",
    repairPath:
      "Install calm, predictable boundaries and stay emotionally connected while holding them.",
  },
  shame_or_humiliation: {
    likelyChildInterpretation:
      "Mistakes may threaten belonging.",
    likelyAdaptation:
      "The child may hide, attack, freeze, perform, or collapse under correction.",
    likelyAttachmentEffect:
      "Safety may become tied to flawlessness.",
    likelyBehavioralLearning:
      "Correction becomes associated with exposure rather than learning.",
    costIfUnregulated:
      "Repeated shame can shape secrecy, self-attack, and fear of visibility.",
    repairPath:
      "Remove humiliation, name the behavior without attacking identity, and restore dignity quickly.",
  },
  safety_violation: {
    likelyChildInterpretation:
      "The environment may not protect the body or nervous system.",
    likelyAdaptation:
      "The child may become vigilant, numb, aggressive, or avoidant.",
    likelyAttachmentEffect:
      "Caregiver trust may be deeply disrupted if safety is not restored.",
    likelyBehavioralLearning:
      "Threat detection becomes prioritized over exploration.",
    costIfUnregulated:
      "Unrepaired safety violation can produce high protective adaptation and reduced felt security.",
    repairPath:
      "Restore safety immediately, remove the threat, and create repeated proof that protection is active.",
  },
  family_instability: {
    likelyChildInterpretation:
      "Home may feel unpredictable.",
    likelyAdaptation:
      "The child may track shifts, prepare for loss, or attach to control rituals.",
    likelyAttachmentEffect:
      "Security may become tied to anticipating change.",
    likelyBehavioralLearning:
      "Stability is monitored rather than assumed.",
    costIfUnregulated:
      "Repeated instability can increase vigilance and reduce ease in rest or play.",
    repairPath:
      "Create small reliable rhythms that remain stable even when larger circumstances change.",
  },
  environmental_stress: {
    likelyChildInterpretation:
      "The surrounding field may feel pressurized or hard to settle inside.",
    likelyAdaptation:
      "The child may become reactive, withdrawn, restless, or unusually adaptive.",
    likelyAttachmentEffect:
      "Stress may attach to place, season, household rhythm, or caregiver availability.",
    likelyBehavioralLearning:
      "The body learns the environment as either regulating or activating.",
    costIfUnregulated:
      "Unbuffered environmental stress can thicken existing susceptibility and reduce recovery capacity.",
    repairPath:
      "Reduce avoidable stressors and create repeated sensory, relational, and routine-based buffers.",
  },
};

export function buildParentingPatternSignal(params: {
  signalId: SignalId;
  parentId: ParentId;
  childId: ChildId;
  repeatedDomains: ParentingEventDomain[];
  sourceEvents: EventId[];
}): ParentingPatternSignal {
  const primaryDomain = params.repeatedDomains[0];
  const translation = PARENTING_PATTERN_TRANSLATION[primaryDomain];

  return {
    signalId: params.signalId,
    parentId: params.parentId,
    childId: params.childId,
    repeatedDomains: params.repeatedDomains,
    likelyChildInterpretation: translation.likelyChildInterpretation,
    likelyAdaptation: translation.likelyAdaptation,
    likelyAttachmentEffect: translation.likelyAttachmentEffect,
    likelyBehavioralLearning: translation.likelyBehavioralLearning,
    costIfUnregulated: translation.costIfUnregulated,
    repairPath: translation.repairPath,
    sourceEvents: params.sourceEvents,
  };
}

export function createParentalImpactCalibrationOutput(params: {
  childId: ChildId;
  childSusceptibility: ChildSusceptibilitySignal;
  events: ParentingImpactEvent[];
  loadScores: DevelopmentalLoadScore[];
  patternSignals: ParentingPatternSignal[];
  summary: ParentalImpactCalibrationOutput["summary"];
}): ParentalImpactCalibrationOutput {
  return {
    childId: params.childId,
    modulePosition: PARENTAL_IMPACT_MODULE_POSITION,
    childSusceptibility: params.childSusceptibility,
    events: params.events,
    loadScores: params.loadScores,
    patternSignals: params.patternSignals,
    summary: params.summary,
    guardrails: {
      predictsDestiny: false,
      labelsParentAsBad: false,
      treatsSingleEventAsPermanentDamage: false,
      requiresPatternContext: true,
      requiresRepairContext: true,
      supportsQualitativeFirst: true,
      numericScoringOptional: false,
    },
  };
}
