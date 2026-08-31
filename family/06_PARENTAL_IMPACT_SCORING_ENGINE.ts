// SEEN — Parental Impact Scoring Engine
// Position: paired with 05_PARENTAL_IMPACT_CALIBRATION_SCHEMA.ts.
// Purpose: provide a deterministic, inspectable first-pass scoring map for developmental load.

import type {
  DevelopmentalStage,
  EventPatternFrequency,
  ParentingEventDomain,
  ParentingImpactEvent,
  RepairQuality,
} from "./05_PARENTAL_IMPACT_CALIBRATION_SCHEMA";

export type ImpactBand =
  | "minimal_load"
  | "minor_load"
  | "meaningful_load"
  | "pattern_forming_load"
  | "high_developmental_load";

export type ScoreConfidence = "low" | "medium" | "high";

export type PredictabilityInput = ParentingImpactEvent["predictability"];
export type ChildAwarenessInput = ParentingImpactEvent["childAwareness"];

export type SusceptibilityInput = "low" | "moderate" | "high" | "unknown";
export type EnvironmentInput = "buffering" | "neutral" | "stressful" | "highly_stressful" | "unknown";

export type ScoringInput = {
  baseEventLoad: number;
  frequencyMultiplier: number;
  developmentalStageMultiplier: number;
  predictabilityMultiplier: number;
  childAwarenessMultiplier: number;
  susceptibilityMultiplier: number;
  environmentMultiplier: number;
  repairBufferMultiplier: number;
  confidence: ScoreConfidence;
};

export type ScoringOutput = {
  rawScore: number;
  finalScore: number;
  impactBand: ImpactBand;
  confidence: ScoreConfidence;
  explanation: string;
};

export const BASE_EVENT_LOAD: Record<ParentingEventDomain, number> = {
  promise_follow_through: 5,
  birthday_or_milestone_absence: 7,
  emotional_availability: 8,
  physical_presence: 6,
  discipline_consistency: 5,
  boundary_failure: 4,
  sibling_aggression: 7,
  rewarding_dysregulation: 3,
  sleep_routine: 4,
  screen_or_tv_boundary: 3,
  food_or_treat_boundary: 2,
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

export const FREQUENCY_MULTIPLIER: Record<EventPatternFrequency, number> = {
  single_event: 1.0,
  occasional: 1.2,
  repeating: 1.6,
  chronic: 2.3,
  unknown: 1.0,
};

export const DEVELOPMENTAL_STAGE_MULTIPLIER: Record<DevelopmentalStage, number> = {
  prenatal: 1.4,
  infant_0_12_months: 1.6,
  toddler_1_3: 1.5,
  early_childhood_3_6: 1.4,
  middle_childhood_6_12: 1.2,
  adolescence_12_18: 1.3,
  young_adult: 0.9,
};

export const PREDICTABILITY_MULTIPLIER: Record<PredictabilityInput, number> = {
  expected: 1.0,
  unexpected: 1.2,
  promised_then_broken: 1.5,
  unclear: 1.0,
};

export const CHILD_AWARENESS_MULTIPLIER: Record<ChildAwarenessInput, number> = {
  child_unaware: 0.7,
  child_partially_aware: 1.0,
  child_fully_aware: 1.3,
  unknown: 1.0,
};

export const SUSCEPTIBILITY_MULTIPLIER: Record<SusceptibilityInput, number> = {
  low: 0.8,
  moderate: 1.0,
  high: 1.7,
  unknown: 1.0,
};

export const ENVIRONMENT_MULTIPLIER: Record<EnvironmentInput, number> = {
  buffering: 0.8,
  neutral: 1.0,
  stressful: 1.3,
  highly_stressful: 1.6,
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

export function buildScoringInput(args: {
  event: ParentingImpactEvent;
  susceptibility: SusceptibilityInput;
  environment: EnvironmentInput;
  confidence: ScoreConfidence;
}): ScoringInput {
  return {
    baseEventLoad: BASE_EVENT_LOAD[args.event.domain],
    frequencyMultiplier: FREQUENCY_MULTIPLIER[args.event.frequency],
    developmentalStageMultiplier:
      DEVELOPMENTAL_STAGE_MULTIPLIER[args.event.developmentalStage],
    predictabilityMultiplier: PREDICTABILITY_MULTIPLIER[args.event.predictability],
    childAwarenessMultiplier: CHILD_AWARENESS_MULTIPLIER[args.event.childAwareness],
    susceptibilityMultiplier: SUSCEPTIBILITY_MULTIPLIER[args.susceptibility],
    environmentMultiplier: ENVIRONMENT_MULTIPLIER[args.environment],
    repairBufferMultiplier: REPAIR_BUFFER_MULTIPLIER[args.event.repairQuality],
    confidence: args.confidence,
  };
}

export function calculateDevelopmentalLoad(input: ScoringInput): ScoringOutput {
  const rawScore =
    input.baseEventLoad *
    input.frequencyMultiplier *
    input.developmentalStageMultiplier *
    input.predictabilityMultiplier *
    input.childAwarenessMultiplier *
    input.susceptibilityMultiplier *
    input.environmentMultiplier;

  const finalScore = clampScore(rawScore * input.repairBufferMultiplier);

  return {
    rawScore: roundScore(rawScore),
    finalScore,
    impactBand: mapScoreToImpactBand(finalScore),
    confidence: input.confidence,
    explanation: buildLoadExplanation(input, finalScore),
  };
}

export function calculateEventDevelopmentalLoad(args: {
  event: ParentingImpactEvent;
  susceptibility: SusceptibilityInput;
  environment: EnvironmentInput;
  confidence?: ScoreConfidence;
}): ScoringOutput {
  return calculateDevelopmentalLoad(
    buildScoringInput({
      event: args.event,
      susceptibility: args.susceptibility,
      environment: args.environment,
      confidence: args.confidence ?? "medium",
    })
  );
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, roundScore(score)));
}

export function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

export function mapScoreToImpactBand(score: number): ImpactBand {
  if (score < 10) return "minimal_load";
  if (score < 20) return "minor_load";
  if (score < 40) return "meaningful_load";
  if (score < 65) return "pattern_forming_load";
  return "high_developmental_load";
}

export function buildLoadExplanation(input: ScoringInput, finalScore: number): string {
  return [
    `Base load: ${input.baseEventLoad}`,
    `Frequency multiplier: ${input.frequencyMultiplier}`,
    `Developmental stage multiplier: ${input.developmentalStageMultiplier}`,
    `Predictability multiplier: ${input.predictabilityMultiplier}`,
    `Child awareness multiplier: ${input.childAwarenessMultiplier}`,
    `Susceptibility multiplier: ${input.susceptibilityMultiplier}`,
    `Environment multiplier: ${input.environmentMultiplier}`,
    `Repair buffer multiplier: ${input.repairBufferMultiplier}`,
    `Final developmental load score: ${finalScore}`,
  ].join(" | ");
}

export const DEVELOPMENTAL_LOAD_EQUATION =
  "FinalDevelopmentalLoad = BaseEventLoad × FrequencyMultiplier × DevelopmentalStageMultiplier × PredictabilityMultiplier × ChildAwarenessMultiplier × SusceptibilityMultiplier × EnvironmentMultiplier × RepairBufferMultiplier" as const;
