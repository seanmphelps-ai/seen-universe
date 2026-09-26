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

export type PortalActivation = {
  portalId: string;
  placeName: string;
  calendarMonth?: number;
  clock?: string;
  companions: string[];
  extraction: PortalExtraction;
};
