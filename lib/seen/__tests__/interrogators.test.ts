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
