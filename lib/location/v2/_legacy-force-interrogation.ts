// SEEN Location — the universal interrogation registry.
//
// This sits immediately upstream of the scoring engine. It is the
// "WHAT are we measuring?" contract; the engine is the "HOW".
//
//   1. WHAT  — this file. The canonical environmental forces SEEN
//              interrogates in EVERY place, each fully specified so the
//              engine never has to invent semantics at runtime.
//   2. HOW   — dimensions.ts / vector.ts / fuse.ts / confidence.ts.
//   3. WHERE — geographic nesting. Partially specified here via
//              `geographicScope`; the cross-level comparison machinery
//              itself is NOT built (see GEOGRAPHIC_NESTING_TODO).
//
// Canonical schema, one entry per force:
//
//   MARKER ID · DEFINITION · QUESTION · OBSERVABLE SIGNALS ·
//   ALLOWED EVIDENCE · DISALLOWED EVIDENCE/INFERENCE · GEOGRAPHIC SCOPE ·
//   TEMPORAL RULE · SCORING DIMENSIONS · SOURCE COMPETENCE ·
//   NORMALIZATION/BASELINE · OUTPUT · CONFIDENCE+PROVENANCE ·
//   DEPENDENCY/CORRELATION GROUP
//
// Two fields carry most of the weight:
//
//   DISALLOWED INFERENCE closes the gap between "this evidence is
//   admissible" and "this conclusion follows". Admissibility is handled
//   structurally by dimensions.ts; this field blocks the conclusions that
//   remain tempting even from admissible evidence.
//
//   CORRELATION GROUP prevents the double-counting that dimension-level
//   admissibility cannot catch. dimensions.ts stops one viral event from
//   inflating five DIMENSIONS of one marker. It does nothing about four
//   distinct markers that are all really measuring material hardship. If
//   those four feed a downstream composite at full weight, the same
//   underlying phenomenon is counted four times — double-counting
//   recreated one level up. See CORRELATION_GROUPS and decorrelatedWeights.
//
// ─────────────────────────────────────────────────────────────────────
// THE HANDOFF BOUNDARY
//
//   observed environment
//     → rewarded / punished / normalized / scarce / salient conditions
//     → environmental pressures and affordances
//     → CANDIDATE ADAPTIVE DEMANDS        ← Location stops here
//     ─────────────────────────────────────────────────────────────
//     → whether those adaptations appear in this person
//                                          ← a LATER SEEN system, not this one

import type { DimensionId } from './dimensions';
import type { SourceFamily } from './types';
import { familyCompetence } from './competence';

export type EnvironmentalForce =
  | 'REWARD'
  | 'PUNISHMENT'
  | 'STATUS'
  | 'BELONGING'
  | 'EXCLUSION'
  | 'ASPIRATION'
  | 'FEAR'
  | 'ATTENTION'
  | 'NORM'
  | 'SCARCITY'
  | 'SPENDING_PRIORITY'
  | 'SACRIFICE'
  | 'TRUST'
  | 'SAFETY'
  | 'INTIMACY'
  | 'AUTHORITY'
  | 'ACHIEVEMENT'
  | 'FAILURE'
  | 'RISK'
  | 'OUTSIDER_TREATMENT'
  | 'MOBILITY'
  | 'POSSIBILITY'
  | 'REACHABLE_FUTURES'
  | 'REQUIRED_CAPACITIES'
  | 'ADAPTIVE_DEMAND';

/** Levels at which a force is meaningful. A force read at the wrong level is not comparable. */
export type GeographicLevel = 'LOCALITY' | 'METRO' | 'REGION' | 'COUNTRY';

export type TemporalRule = {
  /** How PERSIST is established for this force. */
  persistenceBasis: string;
  /** How TREND is established. */
  changeBasis: string;
  /** Shortest window over which a reading is meaningful. */
  minimumWindowDays: number;
};

export type NormalizationRule = {
  /** What the raw value is compared against. */
  baseline: string;
  /** How it is made comparable across countries and data regimes. */
  method: string;
};

export type ForceSpec = {
  force: EnvironmentalForce;
  /** Exactly what phenomenon this represents. */
  definition: string;
  /** What SEEN is trying to learn. */
  question: string;
  /** What counts as evidence of it. */
  observableSignals: string[];
  /** Which source families may establish it. */
  allowedEvidence: SourceFamily[];
  /**
   * What cannot be used to claim it, and what cannot be concluded from
   * it even on admissible evidence. The second half is the load-bearing
   * one — see module header.
   */
  disallowedEvidence: string[];
  disallowedInference: string[];
  /** Levels at which this force is meaningful. */
  geographicScope: GeographicLevel[];
  temporalRule: TemporalRule;
  /** Which dimensions legitimately carry the answer. */
  scoringDimensions: DimensionId[];
  /**
   * Per-force overrides to the global family × dimension competence table
   * (competence.ts). Empty means the global table applies unchanged.
   * Overrides exist because a family's competence can be force-specific:
   * MARKETPLACE is weak for PREV generally but is a primary instrument
   * for SPENDING_PRIORITY.
   */
  sourceCompetenceOverrides: { family: SourceFamily; dimension: DimensionId; competence: number }[];
  normalization: NormalizationRule;
  /** Exactly what the engine may return. */
  output: string;
  /** Markers in registry.ts that currently evidence it. Empty = declared coverage gap. */
  evidencedByMarkers: string[];
  /** Correlation group id — see CORRELATION_GROUPS. Null when independent. */
  correlationGroup: string | null;
};

const PUBLIC_DISCOURSE: SourceFamily[] = ['SOCIAL_PUBLIC', 'LOCAL_FORUM', 'LOCAL_NEWS'];
const STRUCTURED: SourceFamily[] = ['OFFICIAL_DATA', 'INSTITUTIONS'];

/** Applies to most discourse-derived forces. */
const DISCOURSE_DISALLOWED: string[] = [
  'Content from accounts whose local-account estimate is below 0.5 — outsider discussion is not local environment.',
  'Advertising placed by non-local advertisers targeting the area.',
  'Circulation of a single viral item treated as independent observations (see dedupe.ts).',
];

const STANDARD_TEMPORAL: TemporalRule = {
  persistenceBasis:
    'Active-time fraction of the exposure window, from the condition\'s own temporal extent — never from how long it was discussed.',
  changeBasis: 'Posterior log rate ratio, current window vs prior-period baseline over the same geography.',
  minimumWindowDays: 90,
};

const ALL_LEVELS: GeographicLevel[] = ['LOCALITY', 'METRO', 'REGION', 'COUNTRY'];
const LOCAL_LEVELS: GeographicLevel[] = ['LOCALITY', 'METRO'];

export const FORCE_REGISTRY: ForceSpec[] = [
  {
    force: 'REWARD',
    definition:
      'The set of behaviors, attributes, and choices this environment systematically responds to with ' +
      'resources, praise, access, or advancement.',
    question: 'What gets rewarded here?',
    observableSignals: [
      'Behaviors that attract public praise, promotion, or visible payoff',
      'Occupations and ventures that visibly succeed',
      'Publicly celebrated accomplishments that recur',
      'What local institutions fund, honor, or promote',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'REVIEWS', 'ADS'],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      'That any resident pursues or values the rewarded thing.',
      'That the reward structure is fair, deserved, or attainable by everyone — attainability is BRD and CONC, not REWARD.',
      'That absence of reward for something means it is punished; PUNISHMENT is measured separately.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'BRD', 'FRAME', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Same-force readings in the peer group (same settlement type and region).',
      method: 'Robust percentile against the peer group, with raw rate retained alongside.',
    },
    output:
      'Ranked rewarded behaviors, each with FRAME distribution and BRD (how broadly the reward structure holds).',
    evidencedByMarkers: ['status_competition_signal', 'affluence_saturation', 'institutional_density'],
    correlationGroup: 'social_valuation',
  },
  {
    force: 'PUNISHMENT',
    definition:
      'The set of behaviors and attributes this environment systematically responds to with sanction, ' +
      'exclusion, or enforcement — and, separately, those it conspicuously does not respond to at all.',
    question: 'What gets punished or ignored here?',
    observableSignals: [
      'Behaviors drawing public condemnation, sanction, or enforcement',
      'What is conspicuously not responded to (the "ignored" half)',
      'Enforcement and prosecution patterns',
      'Social exclusion following specific acts',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'ACLED'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Enforcement data used as a proxy for underlying behavior rate — it measures response, not occurrence.',
    ],
    disallowedInference: [
      'That a resident internalized the punishment, was subject to it, or endorses it.',
      'That the punished behavior is rare; punishment and prevalence are independent.',
      'That enforcement intensity reflects community values rather than institutional policy.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['FRAME', 'SEV', 'PREV', 'CONC'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group enforcement and condemnation rates for the same behaviors.',
      method: 'Percentile against peer group; the ignored half is reported as low AMP at measured PREV.',
    },
    output:
      'Punished behaviors with severity distribution and FRAME stance; separately, conditions recurring ' +
      'at measurable prevalence with no detectable response.',
    evidencedByMarkers: ['civil_unrest_event', 'violent_incident'],
    correlationGroup: 'social_valuation',
  },
  {
    force: 'STATUS',
    definition:
      'The attributes, possessions, affiliations and achievements that raise a person\'s standing in ' +
      'this environment\'s prevailing hierarchy.',
    question: 'What confers status here?',
    observableSignals: [
      'Purchases and visible possessions',
      'Occupations and titles',
      'Education and credentials',
      'Bodies and appearance',
      'Affiliations and memberships',
      'Achievements that draw public praise',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, 'MARKETPLACE', 'SEARCH_INTEREST', 'ADS', 'OFFICIAL_DATA'],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      'That a resident sought, held, or was denied that status.',
      'That the status hierarchy is universally endorsed locally — FRAME may show it is resented as often as admired.',
      'That high status markers indicate high wellbeing.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'DIG', 'AMP', 'BRD', 'FRAME', 'PERSIST', 'TREND'],
    sourceCompetenceOverrides: [
      // Commercial listings directly evidence which possessions carry status.
      { family: 'MARKETPLACE', dimension: 'PREV', competence: 0.55 },
    ],
    normalization: {
      baseline: 'Peer-group status-signal prevalence, and the same environment\'s own prior window.',
      method: 'Log1p + robust percentile against provider-specific baselines; TREND from the prior window.',
    },
    output:
      'Ranked status-conferring attributes, each with FRAME distribution (admired / resented / expected) ' +
      'and TREND direction.',
    evidencedByMarkers: ['status_competition_signal', 'affluence_saturation'],
    correlationGroup: 'social_valuation',
  },
  {
    force: 'BELONGING',
    definition: 'The available routes by which a person can become and remain socially included here.',
    question: 'What creates belonging here?',
    observableSignals: [
      'Gathering places and third spaces',
      'Recurring communal events and rituals',
      'Mutual-aid and reciprocity behavior',
      'Membership organizations and congregations',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, 'INSTITUTIONS', 'OSM', 'EVENTS', 'MOVEMENT_PLACE'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Closed or demolished venues still present in map extracts.',
    ],
    disallowedInference: [
      'That a resident experienced belonging. Availability is not receipt.',
      'That presence of belonging routes implies absence of exclusion — EXCLUSION is measured separately and the two coexist.',
    ],
    geographicScope: LOCAL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'BRD', 'PHYS', 'FRAME', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Institution and venue density per resident in the peer group.',
      method: 'Per-capita density, percentile-ranked; PHYS via dose saturation over accessible sites.',
    },
    output: 'Available belonging routes with PHYS accessibility and BRD distribution across sub-units.',
    evidencedByMarkers: ['collective_aid_signal', 'institutional_density', 'green_and_recreation_access'],
    correlationGroup: 'social_infrastructure',
  },
  {
    force: 'EXCLUSION',
    definition:
      'The mechanisms by which access to this environment\'s resources, spaces and networks is withheld ' +
      'from some residents.',
    question: 'What creates exclusion here?',
    observableSignals: [
      'Boundaries of access — cost, membership, geography, language',
      'Segregation patterns across sub-geographies',
      'Publicly expressed in-group/out-group lines',
      'Services present in some sub-units and absent in others',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'OSM', 'MARKETPLACE'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Aggregate geography-level statistics used to assert exclusion of any specific group without group-level data.',
    ],
    disallowedInference: [
      'That a resident was among the excluded.',
      'That exclusion is intentional; the measurement is of effect, not motive.',
      'That a citywide reading describes any particular neighborhood — that is exactly what CONC exists to prevent.',
    ],
    geographicScope: LOCAL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['CONC', 'BRD', 'FRAME', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Within-environment distribution across sub-units, not an external comparator.',
      method: 'Normalized spatial HHI over sub-units; peer-group percentile for the HHI itself.',
    },
    output:
      'Exclusion mechanisms with spatial concentration showing whether exclusion is citywide or a ' +
      'boundary between specific sub-units.',
    evidencedByMarkers: ['economic_deprivation', 'status_competition_signal', 'affluence_saturation'],
    correlationGroup: 'material_conditions',
  },
  {
    force: 'ASPIRATION',
    definition: 'What residents of this environment express wanting, and in what direction they orient.',
    question: 'What do people aspire toward here?',
    observableSignals: [
      'Stated goals and plans in public discourse',
      'Search interest in destinations, careers, credentials',
      'Aspirational purchases and upgrades',
      'Expressed intent to leave or to stay',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, 'SEARCH_INTEREST', 'MARKETPLACE'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Vacation and travel content read as relocation intent.',
    ],
    disallowedInference: [
      'That a resident shared the prevailing aspiration.',
      'That aspiration indicates attainability — REACHABLE_FUTURES measures that separately, and the gap between them is itself meaningful.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'DIG', 'FRAME', 'TREND'],
    sourceCompetenceOverrides: [
      // Query volume is close to a direct instrument for expressed intent.
      { family: 'SEARCH_INTEREST', dimension: 'PREV', competence: 0.55 },
    ],
    normalization: {
      baseline: 'Peer-group aspiration-signal shares over the same content sampling frame.',
      method: 'Share of quality-weighted distinct-account content samples; percentile against peers.',
    },
    output: 'Prevailing aspirations with TREND, and orientation toward or away from the place.',
    evidencedByMarkers: ['status_competition_signal', 'outmigration_intent', 'affluence_saturation'],
    correlationGroup: 'orientation',
  },
  {
    force: 'FEAR',
    definition: 'What residents of this environment express anxiety about losing or encountering.',
    question: 'What are people afraid of losing here?',
    observableSignals: [
      'Recurring expressed anxieties',
      'Protective and defensive purchases',
      'What people organize to prevent',
      'Conditions discussed with fear framing',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, 'SEARCH_INTEREST', 'MARKETPLACE', 'OFFICIAL_DATA'],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      'That a resident held that fear.',
      'That the fear is proportionate to measured risk — FEAR and RISK are separate forces precisely because they diverge.',
      'That absence of expressed fear means absence of danger.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['FRAME', 'SEV', 'DIG', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group FRAME distributions for the same markers.',
      method: 'FRAME probability vector; no magnitude normalization (FRAME is a MEANING-layer dimension).',
    },
    output: 'Objects of fear ranked by FRAME weight, with PERSIST across the window.',
    evidencedByMarkers: ['violent_incident', 'economic_deprivation', 'labor_instability'],
    correlationGroup: 'threat_perception',
  },
  {
    force: 'ATTENTION',
    definition:
      'What occupies this environment\'s collective attention, relative to how often the underlying ' +
      'condition actually occurs.',
    question: 'What gets attention here?',
    observableSignals: [
      'Volume and persistence of local discussion',
      'Search interest spikes',
      'Cross-platform spread of specific topics',
      'What local media returns to repeatedly',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, 'SEARCH_INTEREST', 'GDELT'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Platform-wide trending content with no local-account concentration.',
    ],
    disallowedInference: [
      'That the attended-to condition is common. Attention and prevalence are separate dimensions precisely because they diverge — that divergence IS amplification.',
      'That a resident attended to it, cared about it, or was even aware of it.',
      'That attention reflects importance to residents rather than platform dynamics.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Duration of sustained circulation — this is the one force where attention persistence is the measurement.',
      changeBasis: 'Change in AMP ratio between windows.',
      minimumWindowDays: 30,
    },
    scoringDimensions: ['DIG', 'AMP', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'This environment\'s own PREV for the same marker — AMP is attention relative to occurrence.',
      method: 'Log ratio of normalized DIG to normalized PREV; scale-free, so platform size does not drive it.',
    },
    output: 'Attention-holding conditions ranked by AMP, with the DIG composition split accompanying each.',
    evidencedByMarkers: ['violent_incident', 'civil_unrest_event', 'status_competition_signal'],
    correlationGroup: 'salience',
  },
  {
    force: 'NORM',
    definition:
      'Conditions present at measurable prevalence that this environment treats as unremarkable — ' +
      'high presence with low response.',
    question: 'What do people tolerate as normal here?',
    observableSignals: [
      'Conditions present at high prevalence but drawing little response',
      'Low-affect framing of conditions treated as remarkable elsewhere',
      'Long-persisting conditions with flat trend',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Absence of data read as absence of response — a place with no social data is not thereby normalized.',
    ],
    disallowedInference: [
      'That a resident accepted it as normal.',
      'That normalization means the condition is harmless or that residents are unaffected.',
      'That normalization is a moral failing of the community.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Sustained high PREV across the window with flat TREND.',
      changeBasis: 'Change in the AMP-to-PREV relationship, not in PREV alone.',
      minimumWindowDays: 365,
    },
    scoringDimensions: ['PERSIST', 'PREV', 'FRAME', 'AMP'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group AMP at comparable PREV — normalization is a deficit of amplification given presence.',
      method: 'Residual of AMP against peer-group AMP at matched PREV; requires the confidence floor to be met.',
    },
    output:
      'Normalized conditions identified by high PREV/PERSIST with low AMP and neutral FRAME, reported ' +
      'with the peer comparison that establishes the deficit.',
    evidencedByMarkers: ['violent_incident', 'economic_deprivation', 'household_structure_strain'],
    correlationGroup: 'salience',
  },
  {
    force: 'SCARCITY',
    definition:
      'The availability of material resources and provisions relative to the resident population — ' +
      'including oversupply, which is a condition in its own right.',
    question: 'What is scarce here, and what is abundant?',
    observableSignals: [
      'Availability and price of essentials',
      'Waiting times and service coverage',
      'Density of provision per resident',
      'Conditions of oversupply as well as undersupply',
    ],
    allowedEvidence: [...STRUCTURED, 'OSM', 'MARKETPLACE', 'POPULATION_GRID'],
    disallowedEvidence: [
      'Estimates whose margin of error exceeds the estimate.',
      'Private facilities with no public right of access counted as public provision.',
    ],
    disallowedInference: [
      'That a resident experienced the shortage or the surplus.',
      'That abundance is benign — abundance is tracked as its own pressure, not as absence of pressure.',
      'That per-capita provision implies per-capita access; access is CONC and PHYS.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'CONC', 'BRD', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'State and national provision rates for the same resource and period.',
      method: 'Ratio to comparator with the disclosed ±15% threshold; direction-aware per marker polarity.',
    },
    output:
      'Scarcity/abundance profile per resource with CONC showing whether shortage is universal or concentrated.',
    evidencedByMarkers: ['economic_deprivation', 'green_and_recreation_access', 'affluence_saturation'],
    correlationGroup: 'material_conditions',
  },
  {
    force: 'SPENDING_PRIORITY',
    definition: 'What residents allocate discretionary resources toward when they have choice.',
    question: 'What do people spend money on when they have choice?',
    observableSignals: [
      'Discretionary purchase categories',
      'Local business composition',
      'Advertising targeted at residents',
      'Search interest in purchasable categories',
    ],
    allowedEvidence: ['MARKETPLACE', 'ADS', 'SEARCH_INTEREST', 'OFFICIAL_DATA', 'REVIEWS'],
    disallowedEvidence: [
      'Advertising by non-local advertisers read as local demand.',
      'Spending data not conditioned on local income distribution.',
    ],
    disallowedInference: [
      'That a resident spends this way.',
      'That spending reflects values rather than availability — a place with one category of business produces spending in that category.',
      'That discretionary spending exists at all where SCARCITY shows it does not.',
    ],
    geographicScope: LOCAL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'BRD', 'FRAME', 'TREND'],
    sourceCompetenceOverrides: [
      // Commercial listings are the primary instrument here, not a weak proxy.
      { family: 'MARKETPLACE', dimension: 'PREV', competence: 0.8 },
      { family: 'MARKETPLACE', dimension: 'BRD', competence: 0.55 },
    ],
    normalization: {
      baseline: 'Category shares in the peer group at matched median household income.',
      method: 'Share-of-discretionary percentile, conditioned on measured income so poorer places are not read as ascetic.',
    },
    output: 'Ranked discretionary categories with TREND, explicitly conditioned on measured disposable income.',
    evidencedByMarkers: ['affluence_saturation', 'status_competition_signal'],
    correlationGroup: 'material_conditions',
  },
  {
    force: 'SACRIFICE',
    definition: 'The ordering in which conditions degrade when this environment comes under resource pressure.',
    question: 'What gets sacrificed when resources get tight here?',
    observableSignals: [
      'Which categories contract first in downturns',
      'Service and enrollment drop-off patterns',
      'Deferred maintenance and closures',
      'What people report giving up',
    ],
    allowedEvidence: [...STRUCTURED, ...PUBLIC_DISCOURSE, 'MARKETPLACE'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Single-window snapshots — sacrifice ordering requires observing an actual downturn.',
    ],
    disallowedInference: [
      'That a resident faced that tradeoff or made that choice.',
      'That the sacrifice ordering reflects preference rather than constraint.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Whether contraction persisted after the pressure period ended.',
      changeBasis: 'Relative TREND across categories during a measured downturn — requires a downturn in the window.',
      minimumWindowDays: 730,
    },
    scoringDimensions: ['TREND', 'SEV', 'PERSIST', 'CONC'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Each category\'s own pre-downturn level in this environment.',
      method: 'Within-environment relative contraction ranking; cross-place comparison only via rank order.',
    },
    output:
      'Sacrifice ordering — which conditions degrade first and fastest under measured pressure. Returns ' +
      'UNKNOWN when no downturn occurred in the window.',
    evidencedByMarkers: ['economic_deprivation', 'labor_instability', 'educational_attrition'],
    correlationGroup: 'material_conditions',
  },
  {
    force: 'TRUST',
    definition:
      'The reliability residents can extend to neighbors, institutions and strangers here, as evidenced ' +
      'by behavior and expressed stance.',
    question: 'What does this environment teach about trust?',
    observableSignals: [
      'Mutual-aid and reciprocity behavior',
      'Institutional reliability and follow-through',
      'Expressed stance toward neighbors, police, employers, officials',
      'Security-taking behavior (locks, guards, cameras)',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'REVIEWS', 'MARKETPLACE'],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      'That a resident learned the lesson, or learned it in this direction.',
      'That low institutional trust indicates low interpersonal trust — they are measured against separate targets and frequently diverge.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'CONC', 'FRAME', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group readings per trust target.',
      method: 'Per-target percentile; targets never collapsed into a single trust score.',
    },
    output: 'Trust conditions across targets (neighbors, institutions, authority) with FRAME stance per target.',
    evidencedByMarkers: ['violent_incident', 'collective_aid_signal', 'institutional_density'],
    correlationGroup: 'social_infrastructure',
  },
  {
    force: 'SAFETY',
    definition:
      'The likelihood that a resident encounters physical harm or hazard in the ordinary course of ' +
      'life here.',
    question: 'What does this environment teach about safety?',
    observableSignals: [
      'Violent and property incident rates',
      'Environmental hazards — air, water, heat, traffic',
      'Where and when people move freely',
      'Protective behaviors treated as routine',
    ],
    allowedEvidence: [...STRUCTURED, 'ACLED', 'LOCAL_NEWS', 'MOVEMENT_PLACE', 'SOCIAL_PUBLIC'],
    disallowedEvidence: [
      'Circulation of incident coverage treated as incident occurrence.',
      'Incidents geocoded only to state level or coarser.',
    ],
    disallowedInference: [
      'That a resident was harmed, or felt unsafe — FEAR is measured separately and diverges from SAFETY routinely.',
      'That a citywide rate describes any particular neighborhood. CONC must be reported alongside, always.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'SEV', 'PHYS', 'CONC', 'PERSIST', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'State and national rates for the same period; sub-unit distribution for CONC.',
      method: 'Rate per 10k per 30 days, percentile-ranked; PHYS via dose saturation.',
    },
    output:
      'Safety profile with PHYS (lived encounter likelihood) and CONC (citywide vs concentrated) reported ' +
      'together. A citywide rate is never returned without its CONC.',
    evidencedByMarkers: ['violent_incident', 'civil_unrest_event'],
    correlationGroup: 'threat_perception',
  },
  {
    force: 'INTIMACY',
    definition:
      'The prevailing structures of close relationship and household formation here. Declared ' +
      'non-evaluative: this force describes form, never quality or desirability.',
    question: 'What does this environment teach about intimacy and relationships?',
    observableSignals: [
      'Household and family structures',
      'Partnership and dissolution rates',
      'Social density and proximity to kin',
      'Publicly expressed relationship norms',
    ],
    allowedEvidence: [...STRUCTURED, ...PUBLIC_DISCOURSE],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      "That a resident's relationships took this form.",
      'That any household form is better, healthier, or more stable than another. The backing marker is declared NEUTRAL polarity for exactly this reason.',
      'That structure indicates relationship quality.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'BRD', 'FRAME', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'State and national household composition for the same period.',
      method: 'Share of households, percentile-ranked, with polarity NEUTRAL so no direction is implied.',
    },
    output: 'Prevailing relationship structures with FRAME stance, explicitly non-evaluative.',
    evidencedByMarkers: ['household_structure_strain'],
    correlationGroup: 'social_infrastructure',
  },
  {
    force: 'AUTHORITY',
    definition: 'The relationship between residents and institutional power here.',
    question: 'What does this environment teach about authority?',
    observableSignals: [
      'Institutional presence and responsiveness',
      'Enforcement patterns',
      'Protest and contestation',
      'Expressed stance toward officials and institutions',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'ACLED', 'GDELT'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'National political discourse read as local institutional relationship.',
    ],
    disallowedInference: [
      "That a resident holds the environment's prevailing stance toward authority.",
      'That contestation indicates institutional failure, or that its absence indicates trust — quiescence has many causes.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['FRAME', 'PREV', 'SEV', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group contestation rates and FRAME distributions.',
      method: 'Event rate percentile plus FRAME vector; the two reported separately.',
    },
    output: 'Authority relationship profile with FRAME distribution and TREND.',
    evidencedByMarkers: ['civil_unrest_event', 'institutional_density'],
    correlationGroup: 'institutional_relation',
  },
  {
    force: 'ACHIEVEMENT',
    definition: 'The accomplishments that recur and are recognized in this environment.',
    question: 'What accomplishments appear over and over here?',
    observableSignals: [
      'Recurring publicly celebrated accomplishments',
      'Educational and occupational attainment patterns',
      'Local recognition and awards',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      'That a resident achieved or failed to achieve these.',
      'That recognized achievements are the only ones occurring — recognition is FRAME, occurrence is PREV.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'BRD', 'FRAME', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'State and national attainment rates for the same cohorts and period.',
      method: 'Attainment rate percentile; BRD across sub-units to show distribution.',
    },
    output: 'Recurring achievement types with BRD showing how broadly attainable they are.',
    evidencedByMarkers: ['educational_attrition', 'affluence_saturation'],
    correlationGroup: 'attainment',
  },
  {
    force: 'FAILURE',
    definition: 'The breakdowns and attritions that recur in this environment.',
    question: 'What failures or breakdowns repeat here?',
    observableSignals: [
      'Recurring institutional or infrastructural breakdowns',
      'Attrition and dropout patterns',
      'Business and service closures',
      'Repeatedly voiced complaints',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'REVIEWS'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'District transfers recorded as exits counted as attrition.',
    ],
    disallowedInference: [
      'That a resident experienced these failures, or is responsible for them.',
      'That recurring failure indicates individual or community deficiency rather than structural condition.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Whether the failure mode recurs across multiple spells or persists unbroken — this is the PERSIST reading that matters most for this force.',
      changeBasis: 'Rate ratio against the prior window.',
      minimumWindowDays: 365,
    },
    scoringDimensions: ['PREV', 'PERSIST', 'FRAME', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'State and national rates for the same failure mode.',
      method: 'Rate percentile with PERSIST regime classification reported alongside.',
    },
    output:
      'Recurring failure modes with PERSIST regime — distinguishing a one-off breakdown from a chronic ' +
      'condition, the difference that matters most for adaptation.',
    evidencedByMarkers: ['educational_attrition', 'labor_instability'],
    correlationGroup: 'attainment',
  },
  {
    force: 'RISK',
    definition:
      'The volatility a resident is exposed to here, and the buffers available to absorb it.',
    question: 'What does this environment teach about risk?',
    observableSignals: [
      'Volatility of employment and income',
      'Exposure to hazard and violence',
      'Availability of buffers — insurance, savings, safety net',
      'Whether risk-taking visibly pays off',
    ],
    allowedEvidence: [...STRUCTURED, ...PUBLIC_DISCOURSE, 'MARKETPLACE'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Point-in-time rates used to establish volatility — volatility requires a series.',
    ],
    disallowedInference: [
      'That a resident is risk-tolerant or risk-averse as a result.',
      'That exposure without buffers is equivalent to exposure with them; the two are reported separately.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Sustained volatility across the window rather than a single shock.',
      changeBasis: 'Change in variance, not in level.',
      minimumWindowDays: 730,
    },
    scoringDimensions: ['PREV', 'SEV', 'PERSIST', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group volatility over a matched window.',
      method: 'Coefficient of variation over the series, percentile-ranked; buffers reported as a separate availability reading.',
    },
    output: 'Risk profile with volatility and buffer availability reported separately, never netted.',
    evidencedByMarkers: ['violent_incident', 'labor_instability', 'economic_deprivation'],
    correlationGroup: 'threat_perception',
  },
  {
    force: 'OUTSIDER_TREATMENT',
    definition: 'How this environment responds to newcomers, minorities, and visible difference.',
    question: 'What does this environment teach about outsiders and difference?',
    observableSignals: [
      'Demographic composition and change',
      'Expressed stance toward newcomers and minorities',
      'Access differences by group',
      'Presence of institutions serving specific groups',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'GDELT'],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Demographic composition alone used to assert treatment — composition is not stance.',
      'National discourse attributed to local residents.',
    ],
    disallowedInference: [
      'That a resident holds these attitudes, or was subject to them.',
      'That demographic homogeneity implies hostility, or diversity implies acceptance.',
      'Any group-level characterization of residents.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['FRAME', 'BRD', 'CONC', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group FRAME distributions on the same markers.',
      method: 'FRAME vector plus access-differential by sub-unit; no single composite score.',
    },
    output: 'Stance toward difference with FRAME distribution and whether treatment varies across sub-units.',
    evidencedByMarkers: [],
    correlationGroup: null,
  },
  {
    force: 'MOBILITY',
    definition: 'How freely and by what means residents can physically move within and out of this environment.',
    question: 'How do people move, and how freely, here?',
    observableSignals: [
      'Transit availability and coverage',
      'Commute patterns and distances',
      'Walkability and physical access',
      'Residential churn',
    ],
    allowedEvidence: ['OFFICIAL_DATA', 'OSM', 'MOVEMENT_PLACE', 'SOCIAL_PUBLIC', 'LOCAL_FORUM'],
    disallowedEvidence: [
      'Transit infrastructure presence read as usable service without frequency data.',
      'Complaints about transit read as coverage measurement.',
    ],
    disallowedInference: [
      'That a resident moved freely or was constrained.',
      'That infrastructure presence equals access — PHYS and CONC carry that, not raw density.',
    ],
    geographicScope: LOCAL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PHYS', 'BRD', 'CONC', 'PERSIST'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group coverage per resident at matched settlement type.',
      method: 'Coverage share and PHYS dose saturation; settlement-type matching is essential since rural and urban are not comparable.',
    },
    output: 'Physical mobility profile with PHYS and coverage distribution across sub-units.',
    evidencedByMarkers: [],
    correlationGroup: null,
  },
  {
    force: 'POSSIBILITY',
    definition:
      'The range of life paths this environment makes visible and imaginable to residents. Perceived, ' +
      'not measured attainment.',
    question: 'What does this environment make seem reachable, and what unimaginable?',
    observableSignals: [
      'Visible range of occupations and life paths',
      'Presence of people who took non-default paths',
      'Expressed sense of what is achievable',
      'Outmigration as a stated route to possibility',
    ],
    allowedEvidence: [...PUBLIC_DISCOURSE, ...STRUCTURED, 'SEARCH_INTEREST'],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      "That a resident's sense of possibility matches the environment's.",
      'That perceived possibility equals actual attainability — REACHABLE_FUTURES measures that, and the gap between the two is itself a finding.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PREV', 'BRD', 'CONC', 'FRAME', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group occupational and educational variety at matched settlement type.',
      method: 'Variety index percentile with BRD showing how evenly distributed possibility is.',
    },
    output: 'Perceived opportunity horizon with BRD showing distribution of possibility across sub-units.',
    evidencedByMarkers: ['educational_attrition', 'economic_deprivation', 'outmigration_intent', 'affluence_saturation'],
    correlationGroup: 'orientation',
  },
  {
    force: 'REACHABLE_FUTURES',
    definition:
      'The outcomes measurably attainable from this environment, given its actual pipelines and ' +
      'transition costs. Measured attainment, not perception.',
    question: 'What futures are actually reachable from here?',
    observableSignals: [
      'Measured mobility outcomes by origin',
      'Educational and occupational pipelines that exist locally',
      'Cost of the transitions those futures require',
      'Whether people who left achieved them',
    ],
    allowedEvidence: ['OFFICIAL_DATA', 'INSTITUTIONS', 'LOCAL_NEWS', 'SOCIAL_PUBLIC'],
    disallowedEvidence: [
      'Aspiration data used as attainment data.',
      'Survivorship-biased accounts from those who left, without the base rate.',
    ],
    disallowedInference: [
      'That a resident reached or failed to reach any of these.',
      'That low measured mobility reflects resident effort or capability.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Stability of the pipeline across the window.',
      changeBasis: 'Cohort-over-cohort change in measured attainment.',
      minimumWindowDays: 1825,
    },
    scoringDimensions: ['PREV', 'CONC', 'PERSIST', 'TREND'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'National mobility distribution conditioned on origin percentile.',
      method: 'Conditional attainment rate, percentile-ranked against origin-matched peers.',
    },
    output:
      'Reachable-future set with the structural preconditions each requires. Returns UNKNOWN where ' +
      'intergenerational mobility data is unavailable — which is currently everywhere, as that source is not wired in.',
    evidencedByMarkers: ['educational_attrition', 'economic_deprivation'],
    correlationGroup: 'attainment',
  },
  {
    force: 'REQUIRED_CAPACITIES',
    definition:
      'The competencies a person must deploy to obtain resources and function in the ordinary course ' +
      'of life here.',
    question: 'What capacities does a person need in order to function well here?',
    observableSignals: [
      'Skills that measurably determine access to resources locally',
      'Navigational demands — bureaucratic, linguistic, logistical',
      'Physical and temporal demands of ordinary life',
      'What people say is necessary to get by',
    ],
    allowedEvidence: [...STRUCTURED, ...PUBLIC_DISCOURSE, 'MOVEMENT_PLACE'],
    disallowedEvidence: [...DISCOURSE_DISALLOWED],
    disallowedInference: [
      'That a resident developed those capacities, lacked them, or was shaped by them.',
      'That capacity demands are met by residents — demand and supply of capacity are different questions.',
      'Any psychological characterization of residents.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: STANDARD_TEMPORAL,
    scoringDimensions: ['PHYS', 'PERSIST', 'SEV', 'CONC'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group demand profiles at matched settlement type.',
      method: 'Demand intensity via PHYS dose and PERSIST, percentile-ranked against peers.',
    },
    output:
      'Capacity demands the environment makes — direct input to ADAPTIVE_DEMAND. Stated as a requirement ' +
      'of the place, never as a description of anyone who lived there.',
    evidencedByMarkers: ['violent_incident', 'economic_deprivation', 'labor_instability', 'institutional_density'],
    correlationGroup: 'adaptive',
  },
  {
    force: 'ADAPTIVE_DEMAND',
    definition:
      'What prolonged exposure to this environment tends to reward, require, suppress and make adaptive — ' +
      'and which of those adaptations become liabilities elsewhere. The terminal output of Location.',
    question:
      'What does prolonged exposure to this environment tend to reward, require, suppress and make adaptive?',
    observableSignals: [
      'Convergence of the other forces into a coherent demand profile',
      'Adaptations residents describe as necessary here',
      'Adaptations described as problems after leaving',
    ],
    allowedEvidence: [...STRUCTURED, ...PUBLIC_DISCOURSE],
    disallowedEvidence: [
      ...DISCOURSE_DISALLOWED,
      'Any individual-level data. This force is computed from environmental readings only.',
    ],
    disallowedInference: [
      'Anything about a specific person. This is where Location stops and hands off.',
      'That exposure produces the adaptation deterministically — same pressure, different temperaments, different outcomes.',
      'That the adaptation is pathological, or that its cost outweighs its capacity.',
    ],
    geographicScope: ALL_LEVELS,
    temporalRule: {
      persistenceBasis: 'Tenure-weighted exposure across the resident\'s own lived interval, per exposure.ts.',
      changeBasis: 'Whether the demand profile itself shifted during the residence.',
      minimumWindowDays: 180,
    },
    scoringDimensions: ['PERSIST', 'PHYS', 'SEV', 'FRAME', 'CONC'],
    sourceCompetenceOverrides: [],
    normalization: {
      baseline: 'Peer-group demand profiles; the contrast is what makes a demand distinctive rather than universal.',
      method: 'Composite over decorrelated force readings — see decorrelatedWeights, which prevents correlated forces from stacking.',
    },
    output:
      'CANDIDATE ADAPTIVE DEMANDS, each with a candidate capacity AND its candidate cost, scoped to ' +
      'ENVIRONMENT. Whether any of it appears in a given person is decided by later SEEN systems.',
    evidencedByMarkers: ['violent_incident', 'economic_deprivation', 'status_competition_signal'],
    correlationGroup: 'adaptive',
  },
];

/**
 * Correlation groups — the defense against double-counting ACROSS forces.
 *
 * dimensions.ts prevents one event from inflating five dimensions of one
 * marker. It does nothing about several forces that are all really
 * measuring the same underlying environmental phenomenon. EXCLUSION,
 * SCARCITY, SPENDING_PRIORITY and SACRIFICE all lean heavily on material
 * hardship; if a downstream composite takes all four at full weight, that
 * hardship is counted four times.
 *
 * `redundancy` is the assumed shared variance within the group, used by
 * decorrelatedWeights to discount members after the first.
 */
export type CorrelationGroup = {
  id: string;
  label: string;
  members: EnvironmentalForce[];
  /** 0-1 assumed shared variance among members. */
  redundancy: number;
  rationale: string;
};

export const CORRELATION_GROUPS: CorrelationGroup[] = [
  {
    id: 'material_conditions',
    label: 'Material conditions',
    members: ['EXCLUSION', 'SCARCITY', 'SPENDING_PRIORITY', 'SACRIFICE'],
    redundancy: 0.7,
    rationale:
      'All four are driven substantially by the same income and provision data. Treating them as ' +
      'independent evidence of environmental pressure counts local material hardship up to four times.',
  },
  {
    id: 'social_valuation',
    label: 'Social valuation',
    members: ['REWARD', 'PUNISHMENT', 'STATUS'],
    redundancy: 0.6,
    rationale:
      'Reward, punishment and status are three faces of one valuation hierarchy and share most of ' +
      'their evidence base in public discourse.',
  },
  {
    id: 'threat_perception',
    label: 'Threat and safety',
    members: ['FEAR', 'SAFETY', 'RISK'],
    redundancy: 0.6,
    rationale:
      'All three read from overlapping incident and hazard evidence. They diverge meaningfully — ' +
      'fear is not danger — but they are far from independent.',
  },
  {
    id: 'social_infrastructure',
    label: 'Social infrastructure',
    members: ['BELONGING', 'TRUST', 'INTIMACY'],
    redundancy: 0.5,
    rationale: 'Shared dependence on institution density and community-behavior evidence.',
  },
  {
    id: 'attainment',
    label: 'Attainment and failure',
    members: ['ACHIEVEMENT', 'FAILURE', 'REACHABLE_FUTURES'],
    redundancy: 0.65,
    rationale:
      'Educational and occupational outcome data drives all three; achievement and failure are largely ' +
      'the same distribution read from opposite ends.',
  },
  {
    id: 'orientation',
    label: 'Orientation and possibility',
    members: ['ASPIRATION', 'POSSIBILITY'],
    redundancy: 0.55,
    rationale: 'Both read expressed forward-looking discourse; they differ in framing more than in source.',
  },
  {
    id: 'salience',
    label: 'Salience',
    members: ['ATTENTION', 'NORM'],
    redundancy: 0.5,
    rationale:
      'NORM is defined partly as an absence of the amplification ATTENTION measures. They are two ' +
      'readings of one salience structure and must not both count at full weight.',
  },
  {
    id: 'institutional_relation',
    label: 'Institutional relation',
    members: ['AUTHORITY'],
    redundancy: 0,
    rationale: 'Currently a single-member group; declared so the grouping is explicit rather than implied by omission.',
  },
  {
    id: 'adaptive',
    label: 'Adaptive demand',
    members: ['REQUIRED_CAPACITIES', 'ADAPTIVE_DEMAND'],
    redundancy: 0.8,
    rationale:
      'ADAPTIVE_DEMAND is computed largely FROM REQUIRED_CAPACITIES. Counting both at full weight ' +
      'double-counts by construction.',
  },
];

export function getCorrelationGroup(id: string): CorrelationGroup {
  const group = CORRELATION_GROUPS.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown correlation group "${id}".`);
  return group;
}

/**
 * Discounts correlated forces so a downstream composite cannot count one
 * underlying phenomenon several times.
 *
 * Within a group of n contributing members with redundancy ρ, the group's
 * total weight is 1 + (n-1)(1-ρ) rather than n — the standard effective-N
 * correction. At ρ=0 members are independent and nothing is discounted;
 * at ρ=1 the whole group counts once. Each member receives an equal share
 * of that corrected total, so ordering does not matter and no member is
 * arbitrarily privileged.
 *
 * Forces with no declared group are independent and keep weight 1.
 */
export function decorrelatedWeights(
  forces: EnvironmentalForce[],
): { force: EnvironmentalForce; weight: number; correlationGroup: string | null }[] {
  const byGroup = new Map<string, EnvironmentalForce[]>();
  const ungrouped: EnvironmentalForce[] = [];

  for (const force of forces) {
    const groupId = getForce(force).correlationGroup;
    if (!groupId) {
      ungrouped.push(force);
      continue;
    }
    const existing = byGroup.get(groupId);
    if (existing) existing.push(force);
    else byGroup.set(groupId, [force]);
  }

  const weights: { force: EnvironmentalForce; weight: number; correlationGroup: string | null }[] = [];

  for (const force of ungrouped) {
    weights.push({ force, weight: 1, correlationGroup: null });
  }

  for (const [groupId, members] of byGroup) {
    const { redundancy } = getCorrelationGroup(groupId);
    const effectiveTotal = 1 + (members.length - 1) * (1 - redundancy);
    const perMember = effectiveTotal / members.length;
    for (const force of members) {
      weights.push({ force, weight: perMember, correlationGroup: groupId });
    }
  }

  // Stable ordering so downstream output and tests are deterministic.
  return weights.sort((a, b) => a.force.localeCompare(b.force));
}

/**
 * Resolves source competence for a (family, dimension) pair in the context
 * of a specific force, applying that force's overrides over the global
 * table in competence.ts.
 */
export function forceSourceCompetence(
  force: EnvironmentalForce,
  family: SourceFamily,
  dimension: DimensionId,
): number {
  const override = getForce(force).sourceCompetenceOverrides.find(
    (o) => o.family === family && o.dimension === dimension,
  );
  return override ? override.competence : familyCompetence(family, dimension);
}

/**
 * A candidate adaptive demand: what this environment asks of anyone
 * living in it. Terminal output of Location.
 */
export type AdaptiveDemand = {
  demandId: string;
  demand: string;
  derivedFromForces: EnvironmentalForce[];
  candidateCapacity: string;
  candidateCost: string;
  /** Fixed. A type-level statement that this describes a place, not a person. */
  scope: 'ENVIRONMENT';
  /** The boundary, carried in the payload so it cannot be dropped downstream. */
  notAClaimAbout: string;
};

export const ADAPTIVE_DEMAND_BOUNDARY =
  'This is a candidate demand the environment appears to make of anyone living in it. It is not a ' +
  'finding about any individual. Whether a specific person developed this adaptation — or developed ' +
  'it at all, or paid this cost — is determined by later SEEN systems observing that person, never ' +
  'inferred from environmental evidence alone.';

export function makeAdaptiveDemand(
  input: Omit<AdaptiveDemand, 'scope' | 'notAClaimAbout'>,
): AdaptiveDemand {
  return { ...input, scope: 'ENVIRONMENT', notAClaimAbout: ADAPTIVE_DEMAND_BOUNDARY };
}

export const ALL_ENVIRONMENTAL_FORCES: EnvironmentalForce[] = FORCE_REGISTRY.map((f) => f.force);

export function getForce(force: EnvironmentalForce): ForceSpec {
  const spec = FORCE_REGISTRY.find((f) => f.force === force);
  if (!spec) {
    throw new Error(
      `Unknown environmental force "${force}". Every force SEEN interrogates must be declared here ` +
        `with its full canonical schema before use.`,
    );
  }
  return spec;
}

/**
 * Forces with no backing marker in registry.ts. Reported rather than
 * hidden: an un-evidenced force is a known gap in the instrument, and
 * silently omitting it would make the instrument look more complete than
 * it is.
 */
export function forcesWithoutMarkerCoverage(): EnvironmentalForce[] {
  return FORCE_REGISTRY.filter((f) => f.evidencedByMarkers.length === 0).map((f) => f.force);
}

export function markersReferencedByForces(): string[] {
  return [...new Set(FORCE_REGISTRY.flatMap((f) => f.evidencedByMarkers))].sort();
}

/**
 * Geographic nesting is the third piece of the contract. Each force
 * declares the levels it is meaningful at (`geographicScope`), but the
 * machinery to measure comparable signals ACROSS levels — and so separate
 * a local-specific effect from the surrounding regional field — is NOT
 * built. Declared here so the gap is visible in code, not only in discussion.
 */
export const GEOGRAPHIC_NESTING_TODO =
  'NOT IMPLEMENTED: comparable signals across locality → county/metro → state/region → country, so ' +
  'local-specific effects can be distinguished from the larger surrounding field. Forces declare ' +
  'their applicable levels via geographicScope, but readings are currently single-resolution ' +
  '(county, per HistoricalGeography in ../types).';
