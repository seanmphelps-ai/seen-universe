// PROVENANCE: bot=grok session=2026-10-13 task=t612 answers file directly into the 45 life sections (no scoring, nothing dropped)
import { LIFE_SECTIONS } from '../lifeSections';
import type { InterrogatorResult, SectionEntry, SectionFiling } from './types';

/** Every life section is habitable for any of the 64 archetypes: files every archetype's answers into every section. Nothing excluded, nothing dropped. */
export function fileIntoSections(results: InterrogatorResult[]): SectionFiling {
  const sections: Record<number, { id: number; name: string; entries: SectionEntry[] }> = {};
  for (const s of LIFE_SECTIONS) sections[s.id] = { id: s.id, name: s.name, entries: [] };
  for (const r of results) {
    const entries: SectionEntry[] = r.answers.map((a) => ({
      archetypeId: r.archetypeId,
      questionSection: a.section,
      question: a.question,
      answer: a.answer,
      signals: a.signals,
    }));
    for (const s of LIFE_SECTIONS) sections[s.id].entries.push(...entries);
  }
  return { sections, unrouted: [] };
}
