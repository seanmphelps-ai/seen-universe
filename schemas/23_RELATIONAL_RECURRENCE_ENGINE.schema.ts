/**
 * THREAD_ORIGIN:
 * 2026-05-28
 * "Novelty / Timeline Theater / Swiss Ephemeris"
 * DISCOVERED_FROM:
 * - closure and composure timeline review
 * - recurring relationship patterns
 * - Swiss ephemeris historical comparison
 */
export type RelationalRecurrencePrecision = 'exact' | 'approximate' | 'range_only' | 'unknown'
export type RelationalRecurrenceQuestion = 'has_this_happened_before' | 'is_this_happening_now' | 'when_might_this_return' | 'why_does_this_keep_happening' | 'what_interrupted_it_before' | 'what_would_interrupt_it_now'
export type RelationalRecurrenceComparisonBasis = 'same_planetary_marker' | 'same_house_activation' | 'same_relational_dynamic' | 'same_cadence_pattern' | 'same_environmental_pressure' | 'multi_signal_overlap'
export type RelationalRecurrenceStrength = 'weak' | 'moderate' | 'strong' | 'major'
export type RelationalRecurrenceEngine = {
 schemaVersion: '1.0.0'
 engineName: 'RELATIONAL_RECURRENCE_ENGINE'
 input: { actors: { id: string; role: string }[]; recurrenceQuestion?: RelationalRecurrenceQuestion }
 output: {
  actorSpecificPatterns: Record<string,string[]>
  sharedPatterns: string[]
  strongestHistoricalMatches: string[]
  activeRecurrenceNow: string[]
  likelyFutureRecurrence: string[]
  possibleInterruptions: string[]
 }
 hardRules: {
  dateOptional: true
  exactDateImprovesAccuracy: true
  approximateWindowsAllowed: true
  futureSimilarityMayBeMapped: true
  noGuaranteedPrediction: true
  userFacingOutputMustDistinguishPatternFromPromise: true
 }
}
