// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import type { PortalRecord } from '../portals64';

/** One incoming signal from any modality, with its provenance. */
export type ChartSignal = {
  modality: string;
  id: string;
  label: string;
  source: unknown;
};

export type InterrogatorAnswer = {
  section: string;
  question: string;
  /** Not generated yet: no interpretation layer exists. Null, never invented. */
  answer: string | null;
  /** Every incoming signal is carried; none dropped, none scored. */
  signals: Array<ChartSignal & { affinityMatch: boolean }>;
};

/**
 * Every active portal's output contract (Sean, 2026-10-14). Portals are hubs,
 * not decorative labels. Content fields are null until the interpretation
 * layer exists -- never invented to fill the shape.
 */
export type PortalExtraction = {
  portalId: number;
  /** Portal ID + hexagram / frequency name. */
  hexagramName: string;
  wound: string | null;
  injury: string | null;
  darknessUnderneath: string | null;
  /** Trigger & pressure point, geo/biome amplified. */
  triggerPressurePoint: string | null;
  geoBiomeAmplified: string | null;
  reactionPattern: string | null;
  relationalImpact: string | null;
  attachmentStyleDistortion: string | null;
  loveLanguageDistortion: string | null;
  /** How they sabotage love. */
  sabotagePattern: string | null;
  /** How they can become the villain / monster under pressure. */
  villainUnderPressure: string | null;
  realLifeCost: string | null;
  ageArcs: string | null;
  untreatedConsequences: string | null;
};

export type InterrogatorResult = {
  portalId: number;
  name: string;
  shadowName: string;
  giftName: string;
  /** True when an incoming signal matches this portal's woundMarkerAffinity. */
  active: boolean;
  /** Present only for an active portal; null otherwise. Portals are hubs, not decorative labels. */
  extraction: PortalExtraction | null;
  answers: InterrogatorAnswer[];
};

export type Interrogator = {
  portalId: number;
  archetype: PortalRecord;
  questions: ReadonlyArray<{ section: string; questions: string[] }>;
  run: (chartSignals: ChartSignal[]) => InterrogatorResult;
};

export type SectionEntry = {
  archetypeId: number;
  questionSection: string;
  question: string;
  answer: string | null;
  signals: InterrogatorAnswer['signals'];
};

export type SectionFiling = {
  sections: Record<number, { id: number; name: string; entries: SectionEntry[] }>;
  /** Always empty: every life section is habitable for any of the 64 archetypes, so nothing goes unrouted. Field kept for the contract. */
  unrouted: SectionEntry[];
};
