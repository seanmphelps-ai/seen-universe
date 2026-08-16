// SEEN Location Execution Contract v0.1 — the ten-dimension specification.
//
//   V[m,l,t] = [PREV, SEV, PHYS, DIG, AMP, BRD, CONC, FRAME, PERSIST, TREND]
//   with CONFIDENCE and PROVENANCE deliberately outside the vector.
//
// This module exists to answer one objection, which is the difference
// between a defensible measurement layer and sophisticated-looking
// arbitrary scoring:
//
//   "One widespread violent event could raise prevalence, physical
//    exposure, breadth, concentration, and amplification unless the model
//    explicitly defines what evidence is allowed to affect each one."
//
// The fix is not weighting. It is admissibility. Evidence is sorted into
// disjoint CHANNELS, and each dimension declares which channels it may
// read. A single viral incident lands in the INCIDENT channel once and in
// the CIRCULATION channel many times; because PREV cannot read CIRCULATION
// and DIG cannot read INCIDENT, that one event physically cannot inflate
// both. The separation is structural, not a matter of tuning.
//
// Each dimension below therefore declares: the question it answers, the
// unique information it captures that no other dimension does, the
// channels it MAY read, the channels it MUST NOT read, its denominator,
// and how it normalizes globally.

export const CONTRACT_VERSION = 'SEEN Location Execution Contract v0.1';

/**
 * Disjoint evidence channels. Every observation is routed to exactly the
 * channels it is competent to inform, at ingestion — not at scoring time.
 */
export type EvidenceChannel =
  /** Deduplicated event table. One shooting is one row, always. */
  | 'INCIDENT'
  /** Exposure table. One shooting discussed 800 times is 800 rows. */
  | 'CIRCULATION'
  /** Directly measured environmental quantity: ACS rate, PM2.5, park polygon. */
  | 'AMBIENT_MEASURE'
  /** Where incidents and measures fall across sub-geographies. */
  | 'SPATIAL_DISTRIBUTION'
  /** Which accounts/actors produced the circulation. */
  | 'ACTOR_DISTRIBUTION'
  /** When the condition was active, and for how long. */
  | 'TEMPORAL_EXTENT'
  /** Expressed stance toward the condition. */
  | 'INTERPRETATION';

/**
 * MAGNITUDE dimensions measure properties of the condition itself.
 * MEANING dimensions measure the environment's collective interpretation
 * of the condition. They are not the same kind of variable and are not
 * fused, normalized, or compared as though they were — FRAME is the only
 * MEANING dimension and it carries a distribution, not a magnitude.
 */
export type DimensionLayer = 'MAGNITUDE' | 'MEANING';

export type DimensionId =
  | 'PREV'
  | 'SEV'
  | 'PHYS'
  | 'DIG'
  | 'AMP'
  | 'BRD'
  | 'CONC'
  | 'FRAME'
  | 'PERSIST'
  | 'TREND';

export type DimensionSpec = {
  id: DimensionId;
  label: string;
  layer: DimensionLayer;
  /** The question this dimension, and only this dimension, answers. */
  question: string;
  /** What it captures that no other dimension in the vector captures. */
  uniqueInformation: string;
  /** Channels this dimension is permitted to read. */
  admissibleChannels: EvidenceChannel[];
  /** Channels it must never read, with the reason each is excluded. */
  inadmissible: { channel: EvidenceChannel; reason: string }[];
  denominator: string;
  /** How the dimension is made comparable across countries and data regimes. */
  globalNormalization: string;
  /** Range of the reported value. */
  range: string;
};

export const DIMENSIONS: DimensionSpec[] = [
  {
    id: 'PREV',
    label: 'Prevalence',
    layer: 'MAGNITUDE',
    question: 'What proportion of the relevant environment appears affected by this condition?',
    uniqueInformation:
      'The rate at which the condition actually occurs, independent of how intense, how discussed, ' +
      'how spread out, or how long-lived it is.',
    admissibleChannels: ['INCIDENT', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Talk about a condition is not occurrence of it. Admitting circulation here is exactly ' +
          'the failure that lets one viral event read as a high base rate.',
      },
      {
        channel: 'ACTOR_DISTRIBUTION',
        reason: 'Who is posting says nothing about how often the condition occurs.',
      },
      {
        channel: 'INTERPRETATION',
        reason: 'How a place feels about a condition does not change its rate.',
      },
    ],
    denominator:
      'Population at risk for event markers (per 10k residents per 30 days); the measure\'s own ' +
      'universe for ambient markers (e.g. persons for whom poverty status is determined).',
    globalNormalization:
      'Rate per population, then percentile-ranked against same-marker cells in the same ' +
      'settlement-type peer group. Rate-per-population is comparable across countries in a way ' +
      'raw counts and platform volumes are not.',
    range: 'Rate ≥ 0, plus a 0-100 percentile against the peer group.',
  },
  {
    id: 'SEV',
    label: 'Severity',
    layer: 'MAGNITUDE',
    question: 'When the condition occurs, how intense is it?',
    uniqueInformation:
      'Intensity per occurrence. Ten minor incidents must not outrank two catastrophic ones, ' +
      'which is only possible if intensity is held separate from rate.',
    admissibleChannels: ['INCIDENT', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Volume of discussion is not intensity. A widely discussed minor incident is not a severe one.',
      },
      {
        channel: 'INTERPRETATION',
        reason:
          'Outrage is a framing response, not a severity measurement; it belongs to FRAME.',
      },
    ],
    denominator: 'None — severity is a distribution over occurrences, not a rate.',
    globalNormalization:
      'Marker-declared severity rubric with explicit level definitions, so the same rubric applies ' +
      'in every country. Reported as median AND upper tail so a rare extreme is never averaged away.',
    range: '0-1 per occurrence; reported as {median, upperTail}.',
  },
  {
    id: 'PHYS',
    label: 'Physical exposure',
    layer: 'MAGNITUDE',
    question:
      'How likely was someone actually living there to encounter this condition in their physical world?',
    uniqueInformation:
      'Lived encounter probability. Distinct from PREV because a condition can be common in a ' +
      'metro yet physically remote from a given resident, and distinct from DIG because encountering ' +
      'something in the street is not encountering it in a feed.',
    admissibleChannels: ['INCIDENT', 'AMBIENT_MEASURE', 'SPATIAL_DISTRIBUTION', 'TEMPORAL_EXTENT'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Digital circulation is the definitional opposite of physical exposure. Admitting it here ' +
          'would collapse PHYS and DIG into one number.',
      },
      {
        channel: 'ACTOR_DISTRIBUTION',
        reason: 'Posting behavior does not establish physical proximity.',
      },
    ],
    denominator: 'Resident population within the affected sub-geographies.',
    globalNormalization:
      'Dose-response saturation 1-exp(-Σ p(e)·affected-share·duration·severity), which is unitless ' +
      'and bounded, so it compares across places with very different absolute scales.',
    range: '0-1.',
  },
  {
    id: 'DIG',
    label: 'Digital / information exposure',
    layer: 'MAGNITUDE',
    question: "How present was this condition in the person's information environment?",
    uniqueInformation:
      'Presence in consciousness rather than in the street. A condition can have low physical ' +
      'prevalence and still dominate local attention.',
    admissibleChannels: ['CIRCULATION', 'ACTOR_DISTRIBUTION'],
    inadmissible: [
      {
        channel: 'INCIDENT',
        reason:
          'The deduplicated incident count is what DIG must be compared AGAINST, not built from. ' +
          'Reading it here would make DIG partly a restatement of PREV.',
      },
      {
        channel: 'AMBIENT_MEASURE',
        reason: 'Official statistics are not part of the information environment residents inhabit.',
      },
    ],
    denominator: 'Connected local population.',
    globalNormalization:
      'Reach saturation 1-exp(-deduped local reach / connected local population), plus a mandatory ' +
      'composition split (see DIG_COMPOSITION) so platform activity is never read as lived prevalence.',
    range: '0-1, always accompanied by its composition.',
  },
  {
    id: 'AMP',
    label: 'Amplification',
    layer: 'MAGNITUDE',
    question:
      'How disproportionately visible or consequential was this condition relative to its raw prevalence?',
    uniqueInformation:
      'The GAP between attention and occurrence. AMP is definitionally relational: it is not volume ' +
      '(that is DIG) and not rate (that is PREV) but the ratio between them. One murder that ' +
      'reorganizes a small town is high AMP at low PREV.',
    admissibleChannels: ['CIRCULATION', 'ACTOR_DISTRIBUTION', 'TEMPORAL_EXTENT'],
    inadmissible: [
      {
        channel: 'AMBIENT_MEASURE',
        reason:
          'Ambient measures have no circulation, so they cannot exhibit disproportion between ' +
          'attention and occurrence.',
      },
      {
        channel: 'SPATIAL_DISTRIBUTION',
        reason: 'Where a condition sits is BRD and CONC, not salience.',
      },
    ],
    denominator: 'Its own prevalence — AMP is computed as attention relative to PREV.',
    globalNormalization:
      'Log ratio of normalized digital exposure to normalized prevalence, percentile-ranked against ' +
      'the provider/marker baseline. Because it is a ratio of two already-normalized quantities it ' +
      'is scale-free and does not privilege large platforms or large countries.',
    range: 'Log ratio, plus a 0-100 percentile.',
  },
  {
    id: 'BRD',
    label: 'Breadth',
    layer: 'MAGNITUDE',
    question:
      'How widely distributed is the condition across neighborhoods, classes, ages, occupations and institutions?',
    uniqueInformation:
      'Spread across distinct units of the environment. Distinguishes ambient culture from a ' +
      'localized pocket. Counting distinct affected units, never repeat volume within a unit.',
    admissibleChannels: ['SPATIAL_DISTRIBUTION', 'ACTOR_DISTRIBUTION', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Raw post volume is not spread. A thousand posts from one neighborhood is narrow, not ' +
          'broad — only the distinct-unit count may inform BRD.',
      },
      {
        channel: 'INCIDENT',
        reason:
          'The count of incidents is PREV. BRD reads only WHERE and ACROSS WHOM those incidents fall, ' +
          'via the spatial and actor channels.',
      },
    ],
    denominator: 'Number of sub-units sampled (neighborhoods, groups, or platforms).',
    globalNormalization:
      'Share of distinct sampled sub-units showing the condition. A share of units is directly ' +
      'comparable between a 12-district town and a 200-district metro.',
    range: '0-1.',
  },
  {
    id: 'CONC',
    label: 'Concentration',
    layer: 'MAGNITUDE',
    question: 'Where is exposure clustered within the environment?',
    uniqueInformation:
      'Spatial inequality of the SAME total. Two places with identical PREV differ enormously if ' +
      "one concentrates it in 3% of its geography. This is what stops a citywide statistic from " +
      "being asserted about a specific person's neighborhood.",
    admissibleChannels: ['SPATIAL_DISTRIBUTION', 'INCIDENT', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Where posts come from is a sampling artifact of platform adoption, not where the ' +
          'condition physically clusters.',
      },
      {
        channel: 'INTERPRETATION',
        reason: 'Framing has no spatial distribution of its own here.',
      },
    ],
    denominator: 'Total occurrences across sub-geographies.',
    globalNormalization:
      'Normalized spatial HHI (Σsᵢ² - 1/n)/(1 - 1/n) over sub-geographies, plus the share of ' +
      'occurrences in the top decile of sub-geographies. Normalizing by n makes it comparable ' +
      'between places with different numbers of sub-units.',
    range: '0-1, where 1 means all occurrences sit in one sub-geography.',
  },
  {
    id: 'FRAME',
    label: 'Response framing',
    layer: 'MEANING',
    question: 'How does this environment interpret and respond to the condition?',
    uniqueInformation:
      'Collective interpretation, not any property of the condition. The same underlying condition ' +
      'produces different human pressure depending on whether it is treated as criminality, tragedy, ' +
      'normal life, or cause for celebration. Kept in the vector but classified as a MEANING layer: ' +
      'it is a distribution over stances, has no magnitude, and is never fused with or ranked ' +
      'against the magnitude dimensions.',
    admissibleChannels: ['INTERPRETATION', 'CIRCULATION'],
    inadmissible: [
      {
        channel: 'INCIDENT',
        reason: 'The occurrence of an event says nothing about how it was received.',
      },
      {
        channel: 'AMBIENT_MEASURE',
        reason: 'Official statistics carry no stance toward what they measure.',
      },
    ],
    denominator: 'Total quality-weighted stance-bearing observations.',
    globalNormalization:
      'Probability distribution over the twelve declared response frames, summing to 1. A ' +
      'distribution is directly comparable across cultures; a single "acceptance score" would not be.',
    range: 'Probability vector over 12 frames, sums to 1.',
  },
  {
    id: 'PERSIST',
    label: 'Persistence / duration',
    layer: 'MAGNITUDE',
    question: 'Was this a three-week disruption, seasonal, episodic, chronic, or structural?',
    uniqueInformation:
      'Chronicity. TREND gives direction of change; PERSIST gives how much of the lived window the ' +
      'condition was actually active and in what temporal regime. Two environments with identical ' +
      'PREV and identical TREND can differ completely here, and for environment → pressure → ' +
      'adaptation that difference is decisive: adaptation is driven by duration, not by averages.',
    admissibleChannels: ['TEMPORAL_EXTENT', 'INCIDENT', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'How long people kept talking about something is attention persistence, which belongs to ' +
          'AMP. PERSIST measures how long the CONDITION lasted.',
      },
      {
        channel: 'ACTOR_DISTRIBUTION',
        reason: 'Who spoke has no bearing on how long the condition endured.',
      },
    ],
    denominator: 'Length of the requested exposure window.',
    globalNormalization:
      'Active-time fraction of the window, plus a declared regime classification. Both are ' +
      'window-relative, so a 20-year residence and a 2-year residence are each scored against ' +
      'their own lived interval rather than against calendar time.',
    range: '0-1 active fraction, plus a regime label.',
  },
  {
    id: 'TREND',
    label: 'Direction through time',
    layer: 'MAGNITUDE',
    question: 'Was the condition becoming more or less common over the lived window?',
    uniqueInformation:
      'Rate of change. Someone living through deterioration experienced something different from ' +
      'someone arriving after stabilization, even when their period averages are identical.',
    admissibleChannels: ['INCIDENT', 'AMBIENT_MEASURE', 'TEMPORAL_EXTENT'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Rising discussion tracks platform growth and news cycles at least as much as it tracks ' +
          'the condition. Trend must come from occurrence, not attention.',
      },
      {
        channel: 'INTERPRETATION',
        reason: 'Shifting attitudes are a FRAME trend, not a condition trend.',
      },
    ],
    denominator: 'Prior-period rate over the same geography.',
    globalNormalization:
      'Posterior log rate ratio under a Gamma-Poisson model with interval. Log ratios are scale-free ' +
      'and the posterior keeps a jump from 0 to 2 events from reading as an infinite increase.',
    range: 'Log rate ratio with a 95% interval.',
  },
];

export function getDimension(id: DimensionId): DimensionSpec {
  const dimension = DIMENSIONS.find((d) => d.id === id);
  if (!dimension) throw new Error(`Unknown dimension "${id}".`);
  return dimension;
}

/** Whether a dimension may read a channel. The admissibility gate. */
export function isChannelAdmissible(id: DimensionId, channel: EvidenceChannel): boolean {
  return getDimension(id).admissibleChannels.includes(channel);
}

export class InadmissibleEvidenceError extends Error {}

/**
 * Enforces the admissibility rule at the point evidence is handed to a
 * dimension. Throwing rather than filtering is deliberate: silently
 * dropping inadmissible evidence would hide an adapter routing bug, and
 * those bugs are precisely what re-inflate one event across five
 * dimensions.
 */
export function assertChannelAdmissible(id: DimensionId, channel: EvidenceChannel): void {
  if (!isChannelAdmissible(id, channel)) {
    const dimension = getDimension(id);
    const rule = dimension.inadmissible.find((r) => r.channel === channel);
    throw new InadmissibleEvidenceError(
      `${id} may not read the ${channel} channel. ${rule?.reason ?? 'Channel not declared admissible.'}`,
    );
  }
}

/**
 * DIG composition. "People are talking about it" is not one thing, and
 * conflating its four meanings is how platform activity gets mistaken for
 * lived prevalence. Every DIG value must carry this split.
 */
export type DigitalComposition = {
  /** First-person resident testimony: "you literally cannot walk anywhere here". */
  livedTestimonyShare: number;
  /** Publisher/media circulation rather than resident voice. */
  mediaShare: number;
  /** Non-local accounts discussing the place. */
  outsiderShare: number;
  /**
   * Share of circulation attributable to the single largest event cluster.
   * High values mean one viral event is dominating attention, which
   * supports AMP but must not support PREV.
   */
  viralConcentrationShare: number;
};

/**
 * Which DIG components may inform lived prevalence at all. Only
 * first-person resident testimony can, and only as corroboration —
 * never as the primary basis for PREV in a place with official data.
 */
export const PREVALENCE_CORROBORATING_DIG_COMPONENT: keyof DigitalComposition =
  'livedTestimonyShare';

/** Temporal regimes for PERSIST. */
export type PersistenceRegime =
  | 'ACUTE'
  | 'EPISODIC'
  | 'SEASONAL'
  | 'CHRONIC'
  | 'STRUCTURAL'
  | 'UNKNOWN';

export type PersistenceEstimate = {
  /** Fraction of the exposure window the condition was active, 0-1. */
  activeFraction: number;
  regime: PersistenceRegime;
  /** Longest unbroken active stretch, in days. */
  longestUnbrokenDays: number;
  /** Number of distinct active spells. */
  spellCount: number;
  /** True when the condition was active at both ends of the window. */
  spansEntireWindow: boolean;
};
