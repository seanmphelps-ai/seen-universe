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
  questions: PortalRecord['interrogation'];
  run: (chartSignals: ChartSignal[]) => InterrogatorResult;
};
