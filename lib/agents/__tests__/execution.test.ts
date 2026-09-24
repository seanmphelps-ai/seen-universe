import { describe, expect, it } from 'vitest';
import { executeSeenWorkers, parallelLimit, type NativeWorker, type PortalWorker } from '../execution';

const context = { runId: 'test-run', input: {} };
const native = (passed = true): NativeWorker => ({
  system: 'western',
  read: async () => ({ system: 'western', output: { chart: true }, sources: ['test-source'] }),
  audit: async () => ({ passed, findings: passed ? [] : ['invalid'] }),
});
const portal = (id: number): PortalWorker => ({
  portal: id,
  run: async (_, readings) => ({ portal: id, output: readings.length, sources: ['test-source'] }),
  audit: async () => ({ passed: true, findings: [] }),
});
describe('SEEN agent execution', () => {
  it('runs native reading and audit before separate Portal workers', async () => {
    const result = await executeSeenWorkers(context, [native()], [portal(1), portal(64)]);
    expect(result.native.western?.status).toBe('passed');
    expect(result.portalStatus).toBe('completed');
    expect(result.portals[1].status).toBe('passed');
    expect(result.portals[64].status).toBe('passed');
  });
  it('blocks Portal work after failed native audit', async () => {
    const result = await executeSeenWorkers(context, [native(false)], [portal(1)]);
    expect(result.portalStatus).toBe('blocked');
    expect(result.portals).toEqual({});
  });
  it('rejects duplicate worker identities', async () => {
    await expect(executeSeenWorkers(context, [native(), native()], [])).rejects.toThrow('Duplicate');
    await expect(executeSeenWorkers(context, [native()], [portal(1), portal(1)])).rejects.toThrow('duplicate');
  });
  it('preserves order with bounded parallelism', async () => {
    const result = await parallelLimit([1, 2, 3], 2, async x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });
});
