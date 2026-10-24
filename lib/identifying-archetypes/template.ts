export const IDENTIFYING_ARCHETYPE_ASKS = [
  'What is the pressure point?',
  'Where can I find myself here?',
  'How would I show up?',
  'In what location, with whom, does this come forward?',
] as const;

export type IdentifyingArchetypeActivation = {
  archetypeId: string;
  placeName: string;
  calendarMonth?: number;
  clock?: string;
  companions: string[];
  answers: Record<(typeof IDENTIFYING_ARCHETYPE_ASKS)[number], string>;
};
