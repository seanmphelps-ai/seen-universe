// PROVENANCE: bot=grok session=2026-10-13 task=t612 answers file directly into the 45 life sections (no scoring, nothing dropped)
import { LIFE_SECTIONS } from '../lifeSections';
import type { InterrogatorResult, SectionEntry, SectionFiling } from './types';

/** Files every archetype answer directly into sections[sectionId]. Archetypes no section lists go to `unrouted`, never dropped. */
export function fileIntoSections(results: InterrogatorResult[]): SectionFiling {
  const sections: Record<number, { id: number; name: string; entries: SectionEntry[] }> = {};
  for (const s of LIFE_SECTIONS) sections[s.id] = { id: s.id, name: s.name, entries: [] };
  const unrouted: SectionEntry[] = [];
  for (const r of results) {
    const entries: SectionEntry[] = r.answers.map((a) => ({
      archetypeId: r.portalId,
      questionSection: a.section,
      question: a.question,
      answer: a.answer,
      signals: a.signals,
    }));
    const targets = LIFE_SECTIONS.filter((s) => s.archetypeSources.includes(r.portalId));
    if (targets.length === 0) unrouted.push(...entries);
    for (const t of targets) sections[t.id].entries.push(...entries);
  }
  return { sections, unrouted };
}
