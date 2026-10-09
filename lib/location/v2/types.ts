// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

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


export type GeographicResolution =
  | 'point'
  | 'block_group'
  | 'tract'
  | 'place'
  | 'county'
  | 'state'
  | 'country'
  | 'unknown';


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

  exclusions: string[];
  severityRubric: SeverityRubricLevel[];

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


export type SpatialConcentrationEstimate = {
  /** Normalized HHI in [0,1] over sub-unit shares of total occurrences; 1 = all occurrences in one sub-unit. */
  normalizedHhi: number;
  top1PercentShare: number;
  top10PercentShare: number;
  subUnitCount: number;
};


export type EvidenceIndependenceDiagnostic = {
  accountHhi: number;
  top1PercentShare: number;
  top10PercentShare: number;
  accountCount: number;
};


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

  evidenceIndependence: EvidenceIndependenceDiagnostic | null;
  notes: string[];
};
