// Marker registry — the contract's registry rule.
//
// "Each marker declares unit (event or ambient), denominator (population,
// local content, active accounts, places, or none), polarity, exclusions,
// severity rubric, and downstream SEEN mappings."
//
// Every marker here is declared against a source family that can actually
// supply it. A marker with no reachable provider still belongs in the
// registry — its absence is then visible as a missing family and charged
// to confidence, which is far better than the marker quietly not existing.
//
// Polarity note: SUPPORT markers are not "good" markers. Abundance is a
// pressure of its own, and the inference layer reads both tails (see
// pressureDirectionLabel). A registry that only tracked deprivation would
// miss half of what the environment trains.

import type { MarkerRegistryEntry } from './types';

/** Shared 4-level rubric for markers measured as rates against population. */
const RATE_SEVERITY_RUBRIC = [
  { value: 0.25, label: 'Near baseline', definition: 'Within ±15% of the comparison geography.' },
  { value: 0.5, label: 'Elevated', definition: '15–50% above the comparison geography.' },
  { value: 0.75, label: 'High', definition: '50–100% above the comparison geography.' },
  { value: 1.0, label: 'Extreme', definition: 'More than double the comparison geography.' },
];

/** Shared rubric for discrete incidents carrying direct physical harm. */
const HARM_SEVERITY_RUBRIC = [
  { value: 0.25, label: 'Property or threat', definition: 'No physical injury reported.' },
  { value: 0.5, label: 'Injury', definition: 'Non-fatal physical injury reported.' },
  { value: 0.75, label: 'Serious injury', definition: 'Hospitalization or life-altering injury reported.' },
  { value: 1.0, label: 'Fatality', definition: 'One or more deaths reported.' },
];

export const MARKER_REGISTRY: MarkerRegistryEntry[] = [
  {
    markerId: 'violent_incident',
    label: 'Violent incident',
    unit: 'event',
    denominator: 'population',
    polarity: 'PRESSURE',
    exclusions: [
      'Fictional, historical, or commemorative references to past violence.',
      'Incidents whose geocode resolves only to state level or coarser.',
      'Reposts and commentary — these are exposure, not incidents (see dedupe.ts).',
      'Law-enforcement training exercises and drills.',
    ],
    severityRubric: HARM_SEVERITY_RUBRIC,
    seenMappings: ['safety', 'vigilance', 'trust'],
  },
  {
    markerId: 'economic_deprivation',
    label: 'Economic deprivation',
    unit: 'ambient',
    denominator: 'population',
    polarity: 'PRESSURE',
    exclusions: [
      'Group-quarters populations, which ACS reports on a different universe.',
      'Estimates whose margin of error exceeds the estimate itself.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['money', 'scarcity_abundance', 'possibility'],
  },
  {
    markerId: 'labor_instability',
    label: 'Labor-market instability',
    unit: 'ambient',
    denominator: 'population',
    polarity: 'PRESSURE',
    exclusions: [
      'Seasonal agricultural fluctuation where the series is unadjusted and the marker is read as a trend.',
      'Persons not in the civilian labor force — the denominator is labor force, not population.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['money', 'achievement_failure', 'risk'],
  },
  {
    markerId: 'educational_attrition',
    label: 'Educational attrition',
    unit: 'ambient',
    denominator: 'population',
    polarity: 'PRESSURE',
    exclusions: [
      'Transfers between districts recorded as exits by one district.',
      'Adult-education and GED completions counted as non-completion.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['achievement_failure', 'possibility', 'status'],
  },
  {
    markerId: 'household_structure_strain',
    label: 'Single-caregiver household prevalence',
    unit: 'ambient',
    denominator: 'population',
    polarity: 'NEUTRAL',
    exclusions: [
      'Households with a non-related adult present, which ACS classifies separately.',
      'Any reading of this marker as a judgement of family form — it is declared NEUTRAL for that reason.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['intimacy_relationships', 'capacity_load'],
  },
  {
    markerId: 'civil_unrest_event',
    label: 'Protest, riot, or civil-unrest event',
    unit: 'event',
    denominator: 'population',
    polarity: 'PRESSURE',
    exclusions: [
      'Permitted parades, sporting celebrations, and festivals with no reported disorder.',
      'Events recorded only at country resolution.',
    ],
    severityRubric: HARM_SEVERITY_RUBRIC,
    seenMappings: ['authority', 'safety', 'mobilization'],
  },
  {
    markerId: 'institutional_density',
    label: 'Civic and care institution density',
    unit: 'ambient',
    denominator: 'places',
    polarity: 'SUPPORT',
    exclusions: [
      'Closed or demolished features still present in the map extract.',
      'Duplicate OSM features describing one physical site.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['trust', 'belonging', 'authority'],
  },
  {
    markerId: 'green_and_recreation_access',
    label: 'Green space and recreation access',
    unit: 'ambient',
    denominator: 'places',
    polarity: 'SUPPORT',
    exclusions: [
      'Private grounds with no public right of access.',
      'Golf courses and members-only facilities counted as public open space.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['safety', 'capacity_load', 'belonging'],
  },
  {
    markerId: 'affluence_saturation',
    label: 'Affluence saturation',
    unit: 'ambient',
    denominator: 'population',
    polarity: 'SUPPORT',
    exclusions: [
      'Any reading of high affluence as an absence of pressure — the inference layer reads both tails.',
      'Second-home and seasonal populations counted as resident income.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['money', 'status', 'scarcity_abundance', 'achievement_failure'],
  },
  {
    markerId: 'status_competition_signal',
    label: 'Visible status competition',
    unit: 'ambient',
    denominator: 'local_content',
    polarity: 'PRESSURE',
    exclusions: [
      'Advertising placed by non-local advertisers targeting the area.',
      'Content from accounts whose local-account estimate is below 0.5.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['status', 'achievement_failure', 'money'],
  },
  {
    markerId: 'collective_aid_signal',
    label: 'Collective aid and mutual support',
    unit: 'ambient',
    denominator: 'local_content',
    polarity: 'SUPPORT',
    exclusions: [
      'National fundraising campaigns with no local organizing component.',
      'Commercial promotions framed as charitable.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['trust', 'belonging', 'intimacy_relationships'],
  },
  {
    markerId: 'outmigration_intent',
    label: 'Expressed intent to leave',
    unit: 'ambient',
    denominator: 'local_content',
    polarity: 'PRESSURE',
    exclusions: [
      'Vacation and travel content.',
      'Relocation content posted by accounts already resident elsewhere.',
    ],
    severityRubric: RATE_SEVERITY_RUBRIC,
    seenMappings: ['possibility', 'belonging'],
  },
];

export function getMarker(markerId: string): MarkerRegistryEntry {
  const marker = MARKER_REGISTRY.find((m) => m.markerId === markerId);
  if (!marker) {
    throw new Error(
      `Unknown marker "${markerId}". Every marker must be declared in the registry with its ` +
        `unit, denominator, polarity, exclusions, severity rubric, and SEEN mappings before use.`,
    );
  }
  return marker;
}

/** Every SEEN surface any marker maps to. Used to check UI coverage. */
export function allSeenMappings(): string[] {
  return [...new Set(MARKER_REGISTRY.flatMap((m) => m.seenMappings))].sort();
}
