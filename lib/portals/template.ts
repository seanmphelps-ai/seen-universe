export const PORTAL_ASKS = [
  'What is the pressure point?',
  'Where can I find myself here?',
  'How would I show up?',
  'In what location, with whom, does this come forward?',
] as const;

export type PortalActivation = {
  portalId: string;
  placeName: string;
  calendarMonth?: number;
  clock?: string;
  companions: string[];
  answers: Record<(typeof PORTAL_ASKS)[number], string>;
};
