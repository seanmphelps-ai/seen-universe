/**
 * HARD LAW
 * Modalities stay whole and untouched in separate cocoons.
 * Traditional native translations from verified, validated sources only.
 * No mixing modalities. No folding into shared prose. No new-age interpretation. No inventing.
 * Location is the incubator after the intact seed. It does not rewrite the native reading.
 * These fields are not a license to blend modalities.
 */
export const PORTAL_EXTRACTION_FIELDS = [
  'triggers',
  'pressurePoints',
  'failureModes',
  'costsConsequences',
  'pressureBuild',
  'release',
  'typicallyDestroyed',
  'howLongTheyLetItGo',
  'show',
  'defend',
  'react',
  'lostIfOneMoreCycle',
] as const;

export type PortalExtractionField = (typeof PORTAL_EXTRACTION_FIELDS)[number];

export type PortalExtraction = Record<PortalExtractionField, string>;

export const PORTAL_EXTRACTION_LABELS: Record<PortalExtractionField, string> = {
  triggers: 'Triggers',
  pressurePoints: 'Pressure points',
  failureModes: 'Failure modes',
  costsConsequences: 'Costs / consequences',
  pressureBuild: 'How pressure builds',
  release: 'How it releases',
  typicallyDestroyed: 'What typically gets destroyed',
  howLongTheyLetItGo: 'How long they let it go',
  show: 'Show',
  defend: 'Defend',
  react: 'React',
  lostIfOneMoreCycle: 'What is lost if it runs one more cycle',
};

/** Unfilled slots. Do not write syncretic prose, location dirt, or clock-archetype blends into these fields. */
export function emptyPortalExtraction(): PortalExtraction {
  return {
    triggers: '',
    pressurePoints: '',
    failureModes: '',
    costsConsequences: '',
    pressureBuild: '',
    release: '',
    typicallyDestroyed: '',
    howLongTheyLetItGo: '',
    show: '',
    defend: '',
    react: '',
    lostIfOneMoreCycle: '',
  };
}

export type PortalActivation = {
  portalId: string;
  placeName: string;
  calendarMonth?: number;
  clock?: string;
  companions: string[];
  extraction: PortalExtraction;
};
