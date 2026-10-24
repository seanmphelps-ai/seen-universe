// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import type { IdentifyingArchetypeRecord } from '../identifyingArchetypes64';

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
 * Every active identifying archetype's output contract (Sean, 2026-10-14). Identifying archetypes are hubs,
 * not decorative labels. Content fields are null until the interpretation
 * layer exists -- never invented to fill the shape.
 */
export type IdentifyingArchetypeExtraction = {
  archetypeId: number;
  /** Identifying archetype ID + hexagram / frequency name. */
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
  archetypeId: number;
  name: string;
  shadowName: string;
  giftName: string;
  /** True when an incoming signal matches this identifying archetype's woundMarkerAffinity. */
  active: boolean;
  /** Present only for an active identifying archetype; null otherwise. Identifying archetypes are hubs, not decorative labels. */
  extraction: IdentifyingArchetypeExtraction | null;
  answers: InterrogatorAnswer[];
};

export type Interrogator = {
  archetypeId: number;
  archetype: IdentifyingArchetypeRecord;
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
