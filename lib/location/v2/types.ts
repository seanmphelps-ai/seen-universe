// SEEN Location V2 — Universal Collection Contract.
//
// V2 supersedes nothing in V1: the V1 Material Field slice (Census ACS +
// BLS LAUS behind lib/location/buildLocationField) remains the "official
// data" source family and feeds V2 as one family among many. V2 adds the
// contract V1 deliberately omitted — multi-family collection, incident
// dedupe with exposure preservation, the [M,L,T] evidence vector,
// normalization/pooling, family fusion, separated confidence, and
// person-location exposure dose.
//
// Three rules hold everywhere in this module and are enforced by types:
//   1. Provider absence lowers confidence; it never becomes a zero.
//      A missing family is omitted from the score and charged to
//      confidence — see fuse.ts and confidence.ts. There is no code path
//      that substitutes a default value for an unobserved family.
//   2. Score and confidence are separate quantities and never multiplied
//      together into one number.
//   3. Dedupe collapses incidents, never exposure. Every raw observation
//      survives in the exposure table regardless of clustering.

/** Lawfully accessible source families named by the collection contract. */
export type SourceFamily =
  | 'SOCIAL_PUBLIC'
  | 'LOCAL_FORUM'
  | 'REVIEWS'
  | 'ADS'
  | 'MARKETPLACE'
  | 'SEARCH_INTEREST'
  | 'LOCAL_NEWS'
  | 'EVENTS'
  | 'INSTITUTIONS'
  | 'OFFICIAL_DATA'
  | 'MOVEMENT_PLACE'
  | 'POPULATION_GRID'
  | 'OSM'
  | 'ACLED'
  | 'GDELT';

export type EvidenceType =
  | 'REPORT'
  | 'POST'
  | 'COMMENT'
  | 'REVIEW'
  | 'LISTING'
  | 'ADVERTISEMENT'
  | 'ARTICLE'
  | 'EVENT_RECORD'
  | 'ADMINISTRATIVE_RECORD'
  | 'STATISTICAL_ESTIMATE'
  | 'GEOSPATIAL_FEATURE'
  | 'SEARCH_INDEX';

/** Direction of the observation relative to the marker's polarity. */
export type ObservationDirection = 'TOWARD' | 'AGAINST' | 'AMBIGUOUS';

export type ResponseFrame =
  | 'CONDEMN'
  | 'SUPPORT'
  | 'GLORIFY'
  | 'FEAR'
  | 'GRIEF'
  | 'ANGER'
  | 'AID'
  | 'DEFENSE'
  | 'MOBILIZE'
  | 'CELEBRATE'
  | 'HUMOR'
  | 'NEUTRAL';

export const RESPONSE_FRAMES: ResponseFrame[] = [
  'CONDEMN',
  'SUPPORT',
  'GLORIFY',
  'FEAR',
  'GRIEF',
  'ANGER',
  'AID',
  'DEFENSE',
  'MOBILIZE',
  'CELEBRATE',
  'HUMOR',
  'NEUTRAL',
];

/** Geographic precision actually achieved, not requested. */
export type GeographicResolution =
  | 'point'
  | 'block_group'
  | 'tract'
  | 'place'
  | 'county'
  | 'state'
  | 'country'
  | 'unknown';

/**
 * The five quality terms. Every term is optional: a missing term is
 * omitted from the geometric mean, never coerced to 0. Coercing to 0
 * would silently annihilate an otherwise good observation, which is the
 * exact failure mode the contract forbids.
 */
export type ObservationConfidenceTerms = {
  geo?: number; // 0-1, geographic match certainty
  classifier?: number; // 0-1, calibrated classifier probability
  source?: number; // 0-1, source reliability
  authenticity?: number; // 0-1, inauthentic-amplification screen
  recency?: number; // 0-1, decay against the requested interval
};

export type ObservationEngagement = {
  reposts?: number;
  comments?: number;
  reactions?: number;
  /** Distinct days the item kept attracting engagement. */
  persistenceDays?: number;
  /** Distinct providers/platforms the same content appeared on. */
  crossPlatformCount?: number;
  /** Distinct accounts reached, deduplicated where the provider allows. */
  uniqueReach?: number;
};

/**
 * One stored observation. Every field the storage rule names is present;
 * fields that cannot be obtained are null, never invented.
 */
export type Observation = {
  observationId: string;

  provider: string; // concrete provider, e.g. "GDELT DOC 2.0"
  sourceFamily: SourceFamily;
  sourceUrl: string | null;
  sourceId: string | null;

  publishedAt: string | null; // ISO 8601
  retrievedAt: string; // ISO 8601

  requestedGeography: string;
  matchedGeography: string | null;
  geographicResolution: GeographicResolution;

  evidenceType: EvidenceType;
  markerIds: string[];
  direction: ObservationDirection;

  /** Marker-declared severity rubric value, 0-1. Null for ambient markers. */
  severity: number | null;
  responseFrame: ResponseFrame | null;

  /**
   * Stable hash of (marker, place, time bucket, actors) used to cluster
   * reports of the same underlying event. Observations sharing a
   * fingerprint are candidates for the same event e.
   */
  eventFingerprint: string | null;

  engagement: ObservationEngagement | null;
  /** Estimated share (0-1) of engaged accounts that are local. */
  localAccountEstimate: number | null;

  /**
   * Opaque id of the account/actor that produced this observation, when
   * obtainable. Distinct from eventFingerprint (which identifies the
   * underlying event) — this identifies the underlying reporter, and is
   * what lets PREV's ambient-content path (see vector.ts) tell "4,000
   * independent residents" apart from "the same 200 accounts posting
   * 4,000 times": repeated content from one account is capped, not
   * summed, so account repetition cannot manufacture prevalence. Null
   * when the account could not be identified — each such observation is
   * treated as its own singleton rather than grouped with others.
   */
  accountId: string | null;

  confidenceTerms: ObservationConfidenceTerms;
};

/** Marker unit — the contract's registry rule. */
export type MarkerUnit = 'event' | 'ambient';

export type MarkerDenominator =
  | 'population'
  | 'local_content'
  | 'active_accounts'
  | 'places'
  | 'none';

/** Polarity: does more of this marker read as pressure or as support? */
export type MarkerPolarity = 'PRESSURE' | 'SUPPORT' | 'NEUTRAL';

export type SeverityRubricLevel = {
  value: number; // 0-1
  label: string;
  definition: string;
};

export type MarkerRegistryEntry = {
  markerId: string;
  label: string;
  unit: MarkerUnit;
  denominator: MarkerDenominator;
  polarity: MarkerPolarity;
  /** Explicit, disclosed exclusion rules — what does NOT count as this marker. */
  exclusions: string[];
  severityRubric: SeverityRubricLevel[];
  /** Downstream SEEN surfaces this marker conditions. Never a claim of validation. */
  seenMappings: string[];
};

/** A [M,L,T] cell: one marker, one location, one time window. */
export type VectorKey = {
  markerId: string;
  locationId: string;
  windowStart: string;
  windowEnd: string;
};

export type SeverityDistribution = {
  median: number;
  upperTail: number; // p90
  polarity: MarkerPolarity;
  n: number;
};

export type FrameVector = Record<ResponseFrame, number>;

export type TrendEstimate = {
  /** Posterior median of log(current rate / baseline rate). */
  logRateRatio: number;
  lower95: number;
  upper95: number;
  currentEvents: number;
  baselineEvents: number;
  currentWindowDays: number;
  baselineWindowDays: number;
};

/**
 * CONC — spatial/demographic clustering of the CONDITION itself: is it
 * spread evenly across the environment's sub-units, or concentrated in a
 * small share of them? This is an environmental property.
 *
 * Not to be confused with account HHI (EvidenceIndependenceDiagnostic,
 * in confidence.ts), which measures whether the EVIDENCE is dominated by
 * a few accounts — a confidence/provenance question, not an
 * environmental one. The two are computed independently and never mixed.
 */
export type SpatialConcentrationEstimate = {
  /** Normalized HHI in [0,1] over sub-unit shares of total occurrences; 1 = all occurrences in one sub-unit. */
  normalizedHhi: number;
  top1PercentShare: number;
  top10PercentShare: number;
  subUnitCount: number;
};

/**
 * Account HHI — an evidence-quality diagnostic, not an environmental
 * measurement. High concentration here means a handful of accounts
 * produced most of the CIRCULATION evidence; it says nothing about how
 * the underlying condition is distributed and must never inform CONC.
 */
export type EvidenceIndependenceDiagnostic = {
  accountHhi: number;
  top1PercentShare: number;
  top10PercentShare: number;
  accountCount: number;
};

/**
 * The evidence vector for one [M,L,T] cell, computed inside a single
 * source family. Every component is nullable: a component whose inputs
 * were not obtainable is null and is charged to confidence, never
 * defaulted to 0.
 */
export type EvidenceVector = {
  key: VectorKey;
  sourceFamily: SourceFamily;

  prev: number | null;
  sev: SeverityDistribution | null;
  phys: number | null;
  dig: number | null;
  amp: number | null;
  brd: number | null;
  conc: SpatialConcentrationEstimate | null;
  frame: FrameVector | null;
  trend: TrendEstimate | null;

  /** Raw counts kept alongside normalized values, per the contract. */
  raw: {
    uniqueEvents: number;
    exposureObservations: number;
    population: number | null;
  };

  /** True when DIG used a proxy denominator rather than a measured one. */
  digIsProxy: boolean;
  notes: string[];
};

export type ConfidenceBand = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';

export type ConfidenceComponents = {
  /** Effective independent evidence, after dedupe (Kish-style). */
  effectiveEvidence: number;
  sourceFamilyCoverage: number;
  geographicPrecision: number;
  timeCoverage: number;
  classifierCalibration: number;
  authenticity: number;
  provenanceCompleteness: number;
};

export type ConfidenceReport = {
  components: ConfidenceComponents;
  familiesPresent: SourceFamily[];
  familiesMissing: SourceFamily[];
  /** 0-100, after the hard family caps. */
  score: number;
  /** The cap that applied, for disclosure. */
  capApplied: number;
  band: ConfidenceBand;
  /**
   * Account-level source concentration diagnostic. Null when no
   * per-account participation data was supplied. Reported alongside
   * confidence, per the contract, but is not folded into `score` — it is
   * a diagnostic about the evidence, and score/confidence must not
   * silently absorb a third quantity.
   */
  evidenceIndependence: EvidenceIndependenceDiagnostic | null;
  notes: string[];
};
