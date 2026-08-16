// Environmental training inference — step 6 of the contract.
//
//   Environment → pressure/reward → trigger → adaptation →
//   behavior/belief → capacity → cost → consequence
//
// The question this layer answers is not "what is this place like?" but
// "what does prolonged exposure to this environment tend to train?" —
// and it answers it as a claim about what an environment repeatedly
// rewards, punishes, normalizes and makes adaptive, never as a claim
// about who any resident is.
//
// Three invariants are enforced in code, not left to the prompt or to
// reviewer discipline, because every one of them has a failure mode that
// looks fine on the page:
//
//   1. LANGUAGE. "may reward", "appears normalized", "evidence suggests"
//      are permitted. "residents are", "this place makes you", and any
//      language of fate are rejected outright — renderInference throws.
//   2. SUPPORT. An inference must cite at least MINIMUM_SUPPORTING_SOURCES
//      distinct supporting observations. Below that it does not render.
//   3. COUNTEREVIDENCE. Every inference must carry a counterevidence
//      field. "None found" is an acceptable value; omitting the search
//      is not, so the field is required and its absence is an error.
//
// Both capacity AND cost are always emitted. An environment that trains
// vigilance trains both a capability and a liability, and reporting only
// one half is the distortion this layer exists to prevent.

import type { ConfidenceReport, MarkerPolarity } from './types';

/** Bump when any rule's semantics change. Stored with every inference. */
export const RULES_VERSION = '2.0.0';

export type InferenceStage =
  | 'ENVIRONMENT'
  | 'PRESSURE_REWARD'
  | 'TRIGGER'
  | 'ADAPTATION'
  | 'BEHAVIOR_BELIEF'
  | 'CAPACITY'
  | 'COST'
  | 'CONSEQUENCE';

export const INFERENCE_CHAIN: InferenceStage[] = [
  'ENVIRONMENT',
  'PRESSURE_REWARD',
  'TRIGGER',
  'ADAPTATION',
  'BEHAVIOR_BELIEF',
  'CAPACITY',
  'COST',
  'CONSEQUENCE',
];

/**
 * Every stage of the chain is rendered at ENVIRONMENT scope. Location
 * reconstructs what a place asks of anyone living in it; it never
 * concludes that a particular person answered that demand.
 *
 * ADAPTATION is the terminal stage Location may assert on its own
 * evidence. Stages after it (BEHAVIOR_BELIEF, CAPACITY, COST,
 * CONSEQUENCE) are rendered as CANDIDATE demands and possibilities the
 * environment creates — they are handed to later SEEN systems, which
 * decide whether any of it actually appears in this person. See
 * interrogation.ts's ADAPTIVE_DEMAND_BOUNDARY.
 *
 * The distinction is not cosmetic. "This environment may train
 * vigilance" is an environmental claim Location can support. "This
 * person is vigilant" is a psychological claim it cannot, and the
 * language rules below exist to keep the second from being written.
 */
export const LOCATION_TERMINAL_STAGE: InferenceStage = 'ADAPTATION';

export const CANDIDATE_STAGES: InferenceStage[] = [
  'BEHAVIOR_BELIEF',
  'CAPACITY',
  'COST',
  'CONSEQUENCE',
];

export function isCandidateStage(stage: InferenceStage): boolean {
  return CANDIDATE_STAGES.includes(stage);
}

/** Minimum distinct supporting observations before an inference may render. */
export const MINIMUM_SUPPORTING_SOURCES = 3;

/**
 * Phrasings that assert determinism or identity. Matched case-insensitively
 * against rendered text. This list is deliberately literal: a regex broad
 * enough to catch every possible deterministic phrasing would also catch
 * legitimate hedged text, and a false rejection is cheaper to notice than
 * a false acceptance is to catch in production.
 */
export const FORBIDDEN_PHRASES: string[] = [
  'residents are',
  'people here are',
  'locals are',
  'this place makes you',
  'this place will make you',
  'makes you become',
  'you will become',
  'destined',
  'destiny',
  'fate',
  'fated',
  'inevitable',
  'guarantees',
  'guaranteed to',
  'determines who',
  'always produces',
  'never escape',
];

/** At least one of these must appear — the inference has to hedge explicitly. */
export const REQUIRED_HEDGES: string[] = [
  'may reward',
  'may train',
  'may make',
  'appears normalized',
  'appears to',
  'evidence suggests',
  'tends to',
  'is associated with',
  'more often',
];

export class InferenceLanguageError extends Error {}
export class InsufficientSupportError extends Error {}

export type SupportingObservation = {
  observationId: string;
  sourceUrl: string | null;
  provider: string;
  /** Short excerpt or measured value that supports the claim. */
  excerpt: string;
};

export type Counterevidence = {
  /** Observations that cut against the inference. May be empty. */
  observations: SupportingObservation[];
  /**
   * Required narrative. When no counterevidence was found, this must say
   * so explicitly and say where it was looked for — an empty array with
   * no explanation is indistinguishable from never having looked.
   */
  statement: string;
};

export type EnvironmentalInference = {
  inferenceId: string;
  rulesVersion: string;
  markerId: string;
  locationId: string;

  /** One rendered sentence per stage of the canonical chain. */
  chain: Record<InferenceStage, string>;

  /** Adaptive capacity the environment may build. Always populated. */
  capacity: string;
  /** Possible cost or liability of that same adaptation. Always populated. */
  cost: string;

  supporting: SupportingObservation[];
  counterevidence: Counterevidence;
  confidence: ConfidenceReport;
};

/**
 * Validates rendered inference text against the language contract.
 * Throws rather than sanitizing: silently rewriting a deterministic claim
 * into a hedged one would hide that a rule is producing bad output.
 */
export function assertPermittedLanguage(text: string, context: string): void {
  const lowered = text.toLowerCase();

  for (const phrase of FORBIDDEN_PHRASES) {
    if (lowered.includes(phrase)) {
      throw new InferenceLanguageError(
        `Inference text for ${context} contains the forbidden phrase "${phrase}". ` +
          `This layer describes what an environment may reward or normalize — ` +
          `it never asserts what residents are, nor anything about fate. Text: "${text}"`,
      );
    }
  }

  if (!REQUIRED_HEDGES.some((hedge) => lowered.includes(hedge))) {
    throw new InferenceLanguageError(
      `Inference text for ${context} contains no permitted hedge ` +
        `(one of: ${REQUIRED_HEDGES.join(', ')}). Unhedged environmental claims are not renderable. ` +
        `Text: "${text}"`,
    );
  }
}

export type InferenceDraft = {
  inferenceId: string;
  markerId: string;
  locationId: string;
  chain: Record<InferenceStage, string>;
  capacity: string;
  cost: string;
  supporting: SupportingObservation[];
  counterevidence: Counterevidence;
  confidence: ConfidenceReport;
};

/**
 * Renders a draft into a displayable inference, enforcing all three
 * invariants. The only way to produce an EnvironmentalInference is
 * through this function.
 */
export function renderInference(draft: InferenceDraft): EnvironmentalInference {
  const distinctSupport = new Set(draft.supporting.map((s) => s.observationId));
  if (distinctSupport.size < MINIMUM_SUPPORTING_SOURCES) {
    throw new InsufficientSupportError(
      `Inference "${draft.inferenceId}" cites ${distinctSupport.size} distinct supporting ` +
        `observation(s); ${MINIMUM_SUPPORTING_SOURCES} are required before it may render. ` +
        `An under-supported inference is withheld, not weakened and shown anyway.`,
    );
  }

  if (!draft.counterevidence || draft.counterevidence.statement.trim() === '') {
    throw new InsufficientSupportError(
      `Inference "${draft.inferenceId}" has no counterevidence statement. The field is required: ` +
        `"no counterevidence found in <families searched>" is acceptable, silence is not.`,
    );
  }

  for (const stage of INFERENCE_CHAIN) {
    const text = draft.chain[stage];
    if (!text || text.trim() === '') {
      throw new InferenceLanguageError(
        `Inference "${draft.inferenceId}" is missing chain stage ${stage}. ` +
          `The full Environment → … → Consequence chain must be rendered; partial chains are not displayable.`,
      );
    }
    // ENVIRONMENT states what was measured and is the one stage that does
    // not hedge — it reports observation, not inference.
    if (stage !== 'ENVIRONMENT') {
      assertPermittedLanguage(text, `${draft.inferenceId}/${stage}`);
    }
  }

  assertPermittedLanguage(draft.capacity, `${draft.inferenceId}/capacity`);
  assertPermittedLanguage(draft.cost, `${draft.inferenceId}/cost`);

  return {
    inferenceId: draft.inferenceId,
    rulesVersion: RULES_VERSION,
    markerId: draft.markerId,
    locationId: draft.locationId,
    chain: draft.chain,
    capacity: draft.capacity,
    cost: draft.cost,
    supporting: draft.supporting,
    counterevidence: draft.counterevidence,
    confidence: draft.confidence,
  };
}

/**
 * The environmental questions the inference layer is built to answer.
 * Stored as data so the rule set and the UI stay in sync, and so that
 * what SEEN claims to examine is auditable rather than implicit.
 */
export type EnvironmentalQuestion = {
  id: string;
  question: string;
  /** Which stage of the chain this question informs. */
  stage: InferenceStage;
};

export const ENVIRONMENTAL_QUESTIONS: EnvironmentalQuestion[] = [
  { id: 'rewarded', question: 'What gets rewarded here?', stage: 'PRESSURE_REWARD' },
  { id: 'punished', question: 'What gets punished or ignored?', stage: 'PRESSURE_REWARD' },
  { id: 'attention', question: 'What gets attention?', stage: 'PRESSURE_REWARD' },
  { id: 'status', question: 'What earns status?', stage: 'PRESSURE_REWARD' },
  { id: 'belonging', question: 'What creates belonging?', stage: 'PRESSURE_REWARD' },
  { id: 'exclusion', question: 'What creates exclusion?', stage: 'PRESSURE_REWARD' },
  { id: 'aspiration', question: 'What do people aspire toward?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'loss_fear', question: 'What are people afraid of losing?', stage: 'TRIGGER' },
  { id: 'discretionary_spend', question: 'What do people spend money on when they have choice?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'sacrifice', question: 'What do they sacrifice when resources get tight?', stage: 'TRIGGER' },
  { id: 'immediate_action', question: 'What produces immediate action?', stage: 'TRIGGER' },
  { id: 'tolerated', question: 'What do people tolerate as normal?', stage: 'ADAPTATION' },
  { id: 'complaints', question: 'What do they complain about repeatedly?', stage: 'PRESSURE_REWARD' },
  { id: 'celebrated', question: 'What do they celebrate publicly?', stage: 'PRESSURE_REWARD' },
  { id: 'repeat_accomplishments', question: 'What accomplishments appear over and over?', stage: 'CONSEQUENCE' },
  { id: 'repeat_breakdowns', question: 'What failures or breakdowns repeat?', stage: 'CONSEQUENCE' },
  { id: 'status_markers', question: 'What work, education, relationships, bodies, lifestyles, possessions or beliefs confer status?', stage: 'PRESSURE_REWARD' },
  { id: 'required_capacities', question: 'What capacities does a person need in order to function well there?', stage: 'CAPACITY' },
  { id: 'easing_adaptations', question: 'What adaptations make life easier there?', stage: 'ADAPTATION' },
  { id: 'portable_liabilities', question: 'Which adaptations become liabilities somewhere else?', stage: 'COST' },
  { id: 'teaches_money', question: 'What does the environment teach about money?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_trust', question: 'What does it teach about trust?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_safety', question: 'What does it teach about safety?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_intimacy', question: 'What does it teach about intimacy and relationships?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_authority', question: 'What does it teach about authority?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_achievement', question: 'What does it teach about achievement and failure?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_scarcity', question: 'What does it teach about scarcity and abundance?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_risk', question: 'What does it teach about risk?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_outsiders', question: 'What does it teach about outsiders and difference?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'teaches_possibility', question: 'What does it teach about leaving, staying, and possibility?', stage: 'BEHAVIOR_BELIEF' },
  { id: 'reachable', question: 'What does it make seem reachable?', stage: 'CONSEQUENCE' },
  { id: 'unimaginable', question: 'What does it make seem impossible or unimaginable?', stage: 'CONSEQUENCE' },
];

/**
 * Abundance is a pressure too. An environment that supplies a great deal
 * of something can train its own liabilities, and a system that only
 * flags scarcity would miss half of what it claims to examine.
 */
export function pressureDirectionLabel(polarity: MarkerPolarity, normalizedValue: number): string {
  if (polarity === 'NEUTRAL') return 'neither pressure nor support in the disclosed rubric';
  const elevated = normalizedValue >= 75;
  const suppressed = normalizedValue <= 25;
  if (polarity === 'PRESSURE') {
    if (elevated) return 'elevated pressure relative to the comparison baseline';
    if (suppressed) return 'low pressure relative to the comparison baseline';
    return 'pressure near the comparison baseline';
  }
  if (elevated) return 'abundant supply relative to the comparison baseline';
  if (suppressed) return 'scarce supply relative to the comparison baseline';
  return 'supply near the comparison baseline';
}
