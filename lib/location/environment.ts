export type EnvironmentalState =
  | 'present'
  | 'absent'
  | 'inaccessible'
  | 'forbidden'
  | 'displaced';

export type EnvironmentalDomain = {
  id: string;
  label: string;
  examples: string[];
};

export const ENVIRONMENTAL_DOMAINS: EnvironmentalDomain[] = [
  {
    id: 'physical',
    label: 'Physical place',
    examples: ['ocean', 'mountains', 'forest', 'climate', 'sunlight', 'noise', 'open space', 'crowding'],
  },
  {
    id: 'social',
    label: 'People & social field',
    examples: ['friends', 'community', 'crowds', 'privacy', 'dating pool', 'creative peers', 'professional network'],
  },
  {
    id: 'work',
    label: 'Work & daily obligations',
    examples: ['teaching', 'clients', 'manual labor', 'cleaning', 'property work', 'travel', 'repetition', 'autonomy'],
  },
  {
    id: 'opportunity',
    label: 'Opportunity & access',
    examples: ['education', 'career paths', 'workers', 'services', 'transportation', 'travel', 'mentorship', 'mobility'],
  },
  {
    id: 'culture',
    label: 'Culture & stimulation',
    examples: ['arts', 'music', 'nightlife', 'events', 'diversity', 'food', 'novelty', 'creative expression'],
  },
  {
    id: 'health',
    label: 'Health & regulation resources',
    examples: ['exercise', 'yoga', 'nature access', 'healthcare', 'mental healthcare', 'recovery resources', 'rest'],
  },
  {
    id: 'safety',
    label: 'Safety & pressure',
    examples: ['crime', 'violence', 'traffic', 'financial pressure', 'housing instability', 'surveillance', 'conflict'],
  },
  {
    id: 'household',
    label: 'Household & relationship environment',
    examples: ['cohabitation', 'privacy', 'support', 'conflict', 'caretaking', 'shared responsibility', 'isolation'],
  },
];

export type EnvironmentalEntry = {
  domainId: string;
  state: EnvironmentalState;
  text: string;
};

export type LocationEnvironmentRecord = {
  version: 1;
  entries: EnvironmentalEntry[];
  createdAt: string;
};

export function buildEnvironmentRecord(
  entries: EnvironmentalEntry[],
): LocationEnvironmentRecord {
  return {
    version: 1,
    entries: entries.filter((entry) => entry.text.trim().length > 0),
    createdAt: new Date().toISOString(),
  };
}
