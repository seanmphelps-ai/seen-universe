// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { PORTALS_64, type PortalRecord } from '../portals64';
import { UNIVERSAL_QUESTION_SET } from '../lifeSections';
import type { ChartSignal, Interrogator, PortalExtraction } from './types';

/** Every active portal's output contract (Sean, 2026-10-14). Null content: no interpretation layer exists yet, never invented. */
function emptyExtraction(archetype: PortalRecord): PortalExtraction {
  return {
    portalId: archetype.portalId,
    hexagramName: archetype.name,
    wound: null,
    injury: null,
    darknessUnderneath: null,
    triggerPressurePoint: null,
    geoBiomeAmplified: null,
    reactionPattern: null,
    relationalImpact: null,
    attachmentStyleDistortion: null,
    loveLanguageDistortion: null,
    sabotagePattern: null,
    villainUnderPressure: null,
    realLifeCost: null,
    ageArcs: null,
    untreatedConsequences: null,
  };
}

/** Every archetype asks the SAME universal question set (t612). Builds an interrogator from an archetype record (used by agent/subagents/archetypes/subagents/interrogator-NN-*). */
export function makeInterrogatorFromRecord(archetype: PortalRecord): Interrogator {
  const portalId = archetype.portalId;
  const affinity = new Set(archetype.woundMarkerAffinity.map((a) => a.toUpperCase()));
  const run = (chartSignals: ChartSignal[]) => {
    const signals = chartSignals.map((s) => ({
      ...s,
      affinityMatch: affinity.has(String(s.id).toUpperCase()),
    }));
    const active = signals.some((s) => s.affinityMatch);
    return {
      portalId,
      name: archetype.name,
      shadowName: archetype.shadowName,
      giftName: archetype.giftName,
      active,
      extraction: active ? emptyExtraction(archetype) : null,
      answers: UNIVERSAL_QUESTION_SET.flatMap((sec) =>
        sec.questions.map((question) => ({ section: sec.section, question, answer: null, signals })),
      ),
    };
  };
  return { portalId, archetype, questions: UNIVERSAL_QUESTION_SET, run };
}

export function makeInterrogator(portalId: number): Interrogator {
  const archetype = PORTALS_64.find((p) => p.portalId === portalId);
  if (!archetype) throw new Error(`Unknown portal ${portalId}`);
  return makeInterrogatorFromRecord(archetype);
}
