// PROVENANCE: bot=grok session=2026-10-13 task=assert 64 portals load with interrogation questions
import { describe, expect, it } from 'vitest';
import { PORTALS_64, expressPortals } from '../portals64';

describe('portals64', () => {
  it('loads all 64 portals, ids 1..64, each with a non-empty question set', () => {
    expect(PORTALS_64).toHaveLength(64);
    expect(PORTALS_64.map((p) => p.portalId)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
    for (const p of PORTALS_64) {
      const qs = p.interrogation.flatMap((s) => s.questions);
      expect(qs.length, `portal ${p.portalId}`).toBeGreaterThan(0);
      expect(qs.every((q) => q.trim().length > 0)).toBe(true);
    }
  });
  it('expressPortals returns all 64 unscored, questions attached', () => {
    const out = expressPortals();
    expect(out).toHaveLength(64);
    expect(out.every((p) => p.expression === 'available' && p.interrogation.length > 0)).toBe(true);
  });
});
