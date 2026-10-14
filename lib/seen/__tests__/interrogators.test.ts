// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { describe, expect, it } from 'vitest';
import { INTERROGATORS, runAllInterrogators } from '../interrogators';

describe('interrogators', () => {
  it('registers 64 interrogators with ids 1..64', () => {
    expect(INTERROGATORS).toHaveLength(64);
    expect(INTERROGATORS.map((i) => i.portalId)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
  });
  it('each one runs and carries every signal on every answer', () => {
    const sig = [{ modality: 'western', id: 'PLUTO', label: 'Pluto', source: { ref: 'test' } }];
    const results = runAllInterrogators(sig);
    expect(results).toHaveLength(64);
    for (const r of results) {
      expect(r.answers.length).toBeGreaterThan(0);
      expect(r.answers.every((a) => a.signals.length === 1 && a.signals[0].source)).toBe(true);
    }
  });
});

describe('archetype agents (agent/subagents/archetypes)', () => {
  it('runs after subagents and holds 64 agents with 52 questions each', async () => {
    const mod = await import('../../../agent/subagents/archetypes/pipeline');
    expect(mod.PIPELINE_ORDER).toEqual(['chief', 'subagents', 'archetypes']);
    expect(mod.ARCHETYPE_AGENTS).toHaveLength(64);
    for (const a of mod.ARCHETYPE_AGENTS) {
      expect(a.questions.reduce((n: number, s: { questions: string[] }) => n + s.questions.length, 0)).toBe(52);
    }
  });
});

describe('t612 universal questions filed into 45 life sections', () => {
  it('all 64 ask the same set and every answer is filed, none dropped', async () => {
    const { fileIntoSections } = await import('../interrogators');
    const { LIFE_SECTIONS } = await import('../lifeSections');
    const sig = [{ modality: 'western', id: 'PLUTO', label: 'Pluto', source: { ref: 'test' } }];
    const results = runAllInterrogators(sig);
    const first = results[0].answers.map((a) => a.question);
    expect(first).toHaveLength(52);
    for (const r of results) expect(r.answers.map((a) => a.question)).toEqual(first);
    const f = fileIntoSections(results);
    expect(Object.keys(f.sections)).toHaveLength(45);
    const filed = new Set([...Object.values(f.sections).flatMap((s) => s.entries), ...f.unrouted].map((e) => e.archetypeId));
    expect(filed.size).toBe(64);
    for (const s of LIFE_SECTIONS) expect(f.sections[s.id].entries.length).toBe(s.archetypeSources.length * 52);
    expect(f.sections[1].entries[0]).toMatchObject({ archetypeId: 14, answer: null });
    expect(f.sections[1].entries[0].signals[0].source).toEqual({ ref: 'test' });
  });
});
