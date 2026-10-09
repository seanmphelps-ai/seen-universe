// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

export const CONTRACT_VERSION = 'SEEN Location Execution Contract v0.1';


export type EvidenceChannel =
  /** Deduplicated event table. One shooting is one row, always. */
  | 'INCIDENT'

  | 'CIRCULATION'

  | 'AMBIENT_CONTENT_SAMPLE'
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

  uniqueInformation: string;
  /** Channels this dimension is permitted to read. */
  admissibleChannels: EvidenceChannel[];

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
    admissibleChannels: ['INCIDENT', 'AMBIENT_MEASURE', 'AMBIENT_CONTENT_SAMPLE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Discussion and occurrence are separate evidence channels. Mixing circulation into occurrence creates ' +
          'the failure that lets one viral event read as a high base rate. (A directly-classified ' +
          'ambient content sample is admissible — see AMBIENT_CONTENT_SAMPLE — because it IS an ' +
          'instance of the condition.)',
      },
      {
        channel: 'ACTOR_DISTRIBUTION',
        reason: 'Occurrence frequency requires condition evidence. Account identity belongs to source diagnostics.',
      },
      {
        channel: 'INTERPRETATION',
        reason: 'Condition rate requires occurrence evidence; sentiment belongs to FRAME.',
      },
    ],
    denominator:
      'Population at risk for event markers (per 10k residents per 30 days); the measure\'s own ' +
      'universe for ambient markers (e.g. persons for whom poverty status is determined).',
    globalNormalization:
      'Rate per population, percentile-ranked against same-marker cells in the same settlement-type ' +
      'peer group. Population normalization supports comparison across countries.',
    range: 'Rate ≥ 0, plus a 0-100 percentile against the peer group.',
  },
  {
    id: 'SEV',
    label: 'Severity',
    layer: 'MAGNITUDE',
    question: 'When the condition occurs, how intense is it?',
    uniqueInformation:
      'Intensity per occurrence. Rank severity separately from occurrence rate.',
    admissibleChannels: ['INCIDENT', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Intensity measures occurrence severity. Discussion volume belongs to DIG.',
      },
      {
        channel: 'INTERPRETATION',
        reason:
          'Outrage is a framing response belonging to FRAME.',
      },
    ],
    denominator: 'Severity is a distribution over occurrences with occurrence-level units.',
    globalNormalization:
      'Marker-declared severity rubric with explicit level definitions, so the same rubric applies ' +
      'in every country. Report both the median and upper tail to retain rare extremes.',
    range: '0-1 per occurrence; reported as {median, upperTail}.',
  },
  {
    id: 'PHYS',
    label: 'Physical exposure',
    layer: 'MAGNITUDE',
    question:
      'How likely was someone actually living there to encounter this condition in their physical world?',
    uniqueInformation:
      'Lived encounter probability. A common condition can be physically remote from a resident. ' +
      'PHYS measures street exposure, DIG measures feed exposure, and PREV measures occurrence.',
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
        reason: 'Physical proximity requires location evidence.',
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
      'Presence in the information environment. A condition can have low physical ' +
      'prevalence and still dominate local attention.',
    admissibleChannels: ['CIRCULATION', 'ACTOR_DISTRIBUTION'],
    inadmissible: [
      {
        channel: 'INCIDENT',
        reason:
          'DIG uses encountered-content evidence and compares it with the deduplicated incident count. ' +
          'Reading it here would make DIG partly a restatement of PREV.',
      },
      {
        channel: 'AMBIENT_MEASURE',
        reason: 'Information exposure requires evidence of content residents encounter.',
      },
    ],
    denominator: 'Connected local population.',
    globalNormalization:
      'Reach saturation 1-exp(-deduped local reach / connected local population), plus a mandatory ' +
      'composition split (see DIG_COMPOSITION), keeping platform activity and lived prevalence distinct.',
    range: '0-1, always accompanied by its composition.',
  },
  {
    id: 'AMP',
    label: 'Amplification',
    layer: 'MAGNITUDE',
    question:
      'How disproportionately visible or consequential was this condition relative to its raw prevalence?',
    uniqueInformation:
      'The GAP between attention and occurrence. AMP measures the ratio of DIG to PREV. ' +
      'One murder that reorganizes a small town is high AMP at low PREV.',
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
        reason: 'The location of a condition informs BRD and CONC.',
      },
    ],
    denominator: 'Its own prevalence — AMP is computed as attention relative to PREV.',
    globalNormalization:
      'Log ratio of normalized digital exposure to normalized prevalence, percentile-ranked against ' +
      'the provider/marker baseline. Because it is a ratio of two already-normalized quantities it ' +
      'adjusts for platform and country size.',
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
      'localized pocket. Count distinct affected units.',
    admissibleChannels: ['SPATIAL_DISTRIBUTION', 'ACTOR_DISTRIBUTION', 'AMBIENT_MEASURE'],
    inadmissible: [
      {
        channel: 'CIRCULATION',
        reason:
          'Spread requires distinct affected locations. A thousand posts from one neighborhood represent ' +
          'one geographic unit; the distinct-unit count informs BRD.',
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
        reason: 'Spatial concentration requires occurrence-location evidence.',
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
      'Collective interpretation of the condition. The same underlying condition ' +
      'produces different human pressure depending on whether it is treated as criminality, tragedy, ' +
      'normal life, or cause for celebration. Kept in the vector but classified as a MEANING layer: ' +
      'it is a distribution over stances, reported separately from magnitude dimensions.',
    admissibleChannels: ['INTERPRETATION', 'CIRCULATION'],
    inadmissible: [
      {
        channel: 'INCIDENT',
        reason: 'Reception requires evidence of expressed reactions.',
      },
      {
        channel: 'AMBIENT_MEASURE',
        reason: 'Stance requires evidence of expressed interpretation.',
      },
    ],
    denominator: 'Total quality-weighted stance-bearing observations.',
    globalNormalization:
      'Probability distribution over the twelve declared response frames, summing to 1. A ' +
      'distribution supports direct comparison across cultures.',
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
      'adaptation that difference is decisive: adaptation is driven by duration.',
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
        reason: 'Condition duration requires temporal evidence.',
      },
    ],
    denominator: 'Length of the requested exposure window.',
    globalNormalization:
      'Active-time fraction of the window, plus a declared regime classification. Both are ' +
      'window-relative, so a 20-year residence and a 2-year residence are each scored against ' +
      'their own lived interval.',
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
          'the condition. Trend requires occurrence evidence.',
      },
      {
        channel: 'INTERPRETATION',
        reason: 'Shifting attitudes form a FRAME trend.',
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


export function assertChannelAdmissible(id: DimensionId, channel: EvidenceChannel): void {
  if (!isChannelAdmissible(id, channel)) {
    const dimension = getDimension(id);
    const rule = dimension.inadmissible.find((r) => r.channel === channel);
    throw new InadmissibleEvidenceError(
      `${id} requires declared admissibility for the ${channel} channel. ${rule?.reason ?? 'Channel requires declared admissibility.'}`,
    );
  }
}


export type DigitalComposition = {

  livedTestimonyShare: number;

  mediaShare: number;
  /** Non-local accounts discussing the place. */
  outsiderShare: number;

  viralConcentrationShare: number;
};


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
