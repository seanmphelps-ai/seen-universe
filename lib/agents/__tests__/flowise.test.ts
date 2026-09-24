import { describe, expect, it, vi } from 'vitest';
import { executeSeenWorkers } from '../execution';
import { flowiseNativeWorker, flowisePortalWorker, invokeFlowise, type FlowiseConfig } from '../flowise';

const context = { runId: 'flowise-test', input: { birthDate: '2000-01-01' } };
const flowIds = Object.fromEntries(['native-western', 'audit-western', 'portal-1', 'audit-portal-1'].map(x => [x, x]));
describe('Flowise integration', () => {
  it('invokes real prediction API contract for native, audit and separate Portal', async () => {
    const calls: string[] = [];
    const fetcher = vi.fn(async (url: URL | RequestInfo) => {
      const path = String(url).split('/').pop()!;
      calls.push(path);
      const data: Record<string, unknown> = {
        'native-western': { system: 'western', output: { chart: true }, sources: ['primary-source'] },
        'audit-western': { passed: true, findings: [] },
        'portal-1': { portal: 1, output: { pressure: 'test' }, sources: ['portal-source'] },
        'audit-portal-1': { passed: true, findings: [] },
      };
      return new Response(JSON.stringify({ text: JSON.stringify(data[path]) }), { status: 200 });
    });
    const config: FlowiseConfig = { url: 'https://flowise.example.org', apiKey: 'test-key', flowIds, fetcher: fetcher as typeof fetch };
    const result = await executeSeenWorkers(context, [flowiseNativeWorker(config, 'western')], [flowisePortalWorker(config, 1)]);
    expect(result.native.western?.status).toBe('passed');
    expect(result.portals[1].status).toBe('passed');
    expect(calls).toEqual(['native-western', 'audit-western', 'portal-1', 'audit-portal-1']);
    expect(fetcher.mock.calls.length).toBe(4);
  });
  it('rejects missing flow IDs rather than pretending to execute', async () => {
    await expect(invokeFlowise({ url: 'https://flowise.example.org', apiKey: 'key', flowIds: {} }, 'missing', {}, (_): _ is object => true))
      .rejects.toThrow('not configured');
  });
});
