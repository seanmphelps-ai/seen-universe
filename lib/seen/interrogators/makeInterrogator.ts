// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { PORTALS_64 } from '../portals64';
import type { ChartSignal, Interrogator } from './types';

export function makeInterrogator(portalId: number): Interrogator {
  const archetype = PORTALS_64.find((p) => p.portalId === portalId);
  if (!archetype) throw new Error(`Unknown portal ${portalId}`);
  const affinity = new Set(archetype.woundMarkerAffinity.map((a) => a.toUpperCase()));
  const run = (chartSignals: ChartSignal[]) => {
    const signals = chartSignals.map((s) => ({
      ...s,
      affinityMatch: affinity.has(String(s.id).toUpperCase()),
    }));
    return {
      portalId,
      name: archetype.name,
      shadowName: archetype.shadowName,
      giftName: archetype.giftName,
      answers: archetype.interrogation.flatMap((sec) =>
        sec.questions.map((question) => ({ section: sec.section, question, signals })),
      ),
    };
  };
  return { portalId, archetype, questions: archetype.interrogation, run };
}
