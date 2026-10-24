// PROVENANCE: bot=grok session=2026-10-13 task=assert 64 identifying archetypes load with interrogation questions
import { describe, expect, it } from 'vitest';
import { IDENTIFYING_ARCHETYPES_64, expressIdentifyingArchetypes } from '../identifyingArchetypes64';

describe('identifyingArchetypes64', () => {
  it('loads all 64 identifying archetypes, ids 1..64, each with a non-empty question set', () => {
    expect(IDENTIFYING_ARCHETYPES_64).toHaveLength(64);
    expect(IDENTIFYING_ARCHETYPES_64.map((p) => p.archetypeId)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
    for (const p of IDENTIFYING_ARCHETYPES_64) {
      const qs = p.interrogation.flatMap((s) => s.questions);
      expect(qs.length, `identifying archetype ${p.archetypeId}`).toBeGreaterThan(0);
      expect(qs.every((q) => q.trim().length > 0)).toBe(true);
    }
  });
  it('expressIdentifyingArchetypes returns all 64 unscored, questions attached', () => {
    const out = expressIdentifyingArchetypes();
    expect(out).toHaveLength(64);
    expect(out.every((p) => p.expression === 'available' && p.interrogation.length > 0)).toBe(true);
  });
});
