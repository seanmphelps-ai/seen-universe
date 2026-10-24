// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { IDENTIFYING_ARCHETYPES_64, type IdentifyingArchetypeRecord } from '../identifyingArchetypes64';
import { UNIVERSAL_QUESTION_SET } from '../lifeSections';
import type { ChartSignal, Interrogator, IdentifyingArchetypeExtraction } from './types';

/** Every active identifying archetype's output contract (Sean, 2026-10-14). Null content: no interpretation layer exists yet, never invented. */
function emptyExtraction(archetype: IdentifyingArchetypeRecord): IdentifyingArchetypeExtraction {
  return {
    archetypeId: archetype.archetypeId,
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
export function makeInterrogatorFromRecord(archetype: IdentifyingArchetypeRecord): Interrogator {
  const archetypeId = archetype.archetypeId;
  const affinity = new Set(archetype.woundMarkerAffinity.map((a) => a.toUpperCase()));
  const run = (chartSignals: ChartSignal[]) => {
    const signals = chartSignals.map((s) => ({
      ...s,
      affinityMatch: affinity.has(String(s.id).toUpperCase()),
    }));
    const active = signals.some((s) => s.affinityMatch);
    return {
      archetypeId,
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
  return { archetypeId, archetype, questions: UNIVERSAL_QUESTION_SET, run };
}

export function makeInterrogator(archetypeId: number): Interrogator {
  const archetype = IDENTIFYING_ARCHETYPES_64.find((p) => p.archetypeId === archetypeId);
  if (!archetype) throw new Error(`Unknown identifying archetype ${archetypeId}`);
  return makeInterrogatorFromRecord(archetype);
}
