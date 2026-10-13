// PROVENANCE: bot=grok-bot session=2026-10-12 task=forge-intake-mark-removed-executeSeenWorkers-tests-missing
import { describe, expect, it } from 'vitest';
import { auditNative, readNative, runIsolatedModalities } from '../execution';

/**
 * MISSING: executeSeenWorkers and parallelLimit were removed from execution.ts.
 * Prior orchestration tests cannot run until a deposit-backed worker runner lands.
 */
describe('SEEN agent execution (current exports)', () => {
  it('exports native read/audit entry points', () => {
    expect(typeof readNative).toBe('function');
    expect(typeof auditNative).toBe('function');
    expect(typeof runIsolatedModalities).toBe('function');
  });
});
