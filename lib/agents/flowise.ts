// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
/** Flowise Agentflow V2 prediction adapter for SEEN's existing worker contracts.
 * Flowise runs as a separate service; this module executes its configured flows.
 * Configure server-only FLOWISE_URL, FLOWISE_API_KEY and per-worker flow IDs.
 */
import type { Audit, JobContext, NativeSystem, NativeWorker, IdentifyingArchetypeWorker, Reading, IdentifyingArchetypeResult } from './execution';

export type FlowiseConfig = {
  url: string;
  apiKey: string;
  flowIds: Record<string, string>;
  fetcher?: typeof fetch;
};

export function flowiseFromEnvironment(): FlowiseConfig {
  const url = process.env.FLOWISE_URL;
  const apiKey = process.env.FLOWISE_API_KEY;
  if (!url || !apiKey) throw new Error('FLOWISE_URL and FLOWISE_API_KEY are required');
  const flowIds: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('FLOWISE_FLOW_') && value) flowIds[key.slice(13).toLowerCase().replaceAll('_', '-')] = value;
  }
  return { url, apiKey, flowIds };
}

export async function invokeFlowise<T>(
  config: FlowiseConfig,
  flow: string,
  payload: unknown,
  validate: (value: unknown) => value is T,
): Promise<T> {
  const flowId = config.flowIds[flow];
  if (!flowId) throw new Error(`Flowise flow requires configuration: ${flow}`);
  const base = new URL(config.url);
  if (base.protocol !== 'https:' && base.hostname !== 'localhost' && base.hostname !== '127.0.0.1')
    throw new Error('Flowise requires HTTPS except for local development');
  const url = new URL(`/api/v1/prediction/${encodeURIComponent(flowId)}`, base);
  const response = await (config.fetcher ?? fetch)(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ question: JSON.stringify(payload), streaming: false }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`Flowise ${flow} returned HTTP ${response.status}`);
  const raw: unknown = await response.json();
  // A Flowise flow may return an object or JSON text in its 'text' field.
  const parsed = typeof raw === 'object' && raw !== null && 'text' in raw && typeof raw.text === 'string'
    ? JSON.parse(raw.text) as unknown : raw;
  if (!validate(parsed)) throw new Error(`Invalid Flowise result for ${flow}`);
  return parsed;
}
const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const isAudit = (x: unknown): x is Audit =>
  isRecord(x) && typeof x.passed === 'boolean' && Array.isArray(x.findings) && x.findings.every(s => typeof s === 'string');
const isReading = (x: unknown): x is Reading =>
  isRecord(x) && typeof x.system === 'string' && 'output' in x &&
  Array.isArray(x.sources) && x.sources.every(s => typeof s === 'string');
const isIdentifyingArchetype = (x: unknown): x is IdentifyingArchetypeResult =>
  isRecord(x) && typeof x.identifyingArchetype === 'number' && 'output' in x &&
  Array.isArray(x.sources) && x.sources.every(s => typeof s === 'string');

export function flowiseNativeWorker(config: FlowiseConfig, system: NativeSystem): NativeWorker {
  return {
    system,
    read: (context: JobContext) => invokeFlowise(config, `native-${system}`, context, isReading),
    audit: (context: JobContext, reading: Reading) =>
      invokeFlowise(config, `audit-${system}`, { context, reading }, isAudit),
  };
}
export function flowiseIdentifyingArchetypeWorker(config: FlowiseConfig, identifyingArchetype: number): IdentifyingArchetypeWorker {
  if (!Number.isInteger(identifyingArchetype) || identifyingArchetype < 1 || identifyingArchetype > 64) throw new Error('Invalid Identifying archetype number');
  return {
    identifyingArchetype,
    run: (context: JobContext, acceptedReadings: Reading[]) =>
      invokeFlowise(config, `portal-${identifyingArchetype}`, { context, acceptedReadings }, isIdentifyingArchetype),
    audit: (context: JobContext, result: IdentifyingArchetypeResult) =>
      invokeFlowise(config, `audit-portal-${identifyingArchetype}`, { context, result }, isAudit),
  };
}
