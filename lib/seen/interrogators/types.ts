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

export type InterrogatorResult = {
  portalId: number;
  name: string;
  shadowName: string;
  giftName: string;
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
  /** Archetypes no section routes to (12, 25, 46, 49 today). Kept, not dropped. */
  unrouted: SectionEntry[];
};
