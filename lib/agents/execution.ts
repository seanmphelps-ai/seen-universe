/**
 * SEEN execution core: independent native readings, independent audits,
 * and separately dispatched Portal work. No fabricated modality output.
 * Adapters must be supplied by actual, source-backed implementations.
 */
export type NativeSystem =
  | 'western' | 'vedic' | 'hellenistic' | 'bazi' | 'numerology'
  | 'tzolkin' | 'galactic-signature' | 'human-design' | 'i-ching';

export type JobContext = { runId: string; input: unknown };
export type Reading = { system: NativeSystem; output: unknown; sources: string[] };
export type Audit = { passed: boolean; findings: string[] };
export type NativeWorker = {
  system: NativeSystem;
  read(context: JobContext): Promise<Reading>;
  audit(context: JobContext, reading: Reading): Promise<Audit>;
};
export type PortalResult = { portal: number; output: unknown; sources: string[] };
export type PortalWorker = {
  portal: number;
  run(context: JobContext, acceptedReadings: Reading[]): Promise<PortalResult>;
  audit(context: JobContext, result: PortalResult): Promise<Audit>;
};
export type JobOutcome<T> =
  | { status: 'passed'; value: T; audit: Audit }
  | { status: 'failed'; error: string; audit?: Audit };
export type ExecutionResult = {
  runId: string;
  native: Partial<Record<NativeSystem, JobOutcome<Reading>>>;
  portals: Record<number, JobOutcome<PortalResult>>;
  portalStatus: 'completed' | 'blocked';
};

export async function parallelLimit<T, R>(
  items: readonly T[],
  concurrency: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error('Invalid concurrency');
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  }));
  return results;
}

export async function executeSeenWorkers(
  context: JobContext,
  nativeWorkers: readonly NativeWorker[],
  portalWorkers: readonly PortalWorker[],
  concurrency = 4,
): Promise<ExecutionResult> {
  const systems = nativeWorkers.map(worker => worker.system);
  if (new Set(systems).size !== systems.length) throw new Error('Duplicate native worker');
  const ids = portalWorkers.map(worker => worker.portal);
  if (new Set(ids).size !== ids.length || ids.some(id => !Number.isInteger(id) || id < 1 || id > 64))
    throw new Error('Invalid or duplicate Portal worker');
  const nativePairs = await parallelLimit(nativeWorkers, concurrency, async worker => {
    let reading: Reading;
    try {
      reading = await worker.read(context);
      if (reading.system !== worker.system || !reading.sources.length)
        throw new Error('Missing or mismatched native evidence');
    } catch (error) {
      return [worker.system, { status: 'failed', error: String(error) }] as const;
    }
    try {
      const audit = await worker.audit(context, reading);
      if (!audit.passed) return [worker.system, { status: 'failed', error: 'Native audit failed', audit }] as const;
      return [worker.system, { status: 'passed', value: reading, audit }] as const;
    } catch (error) {
      return [worker.system, { status: 'failed', error: String(error) }] as const;
    }
  });
  const native = Object.fromEntries(nativePairs) as ExecutionResult['native'];
  const allPassed = nativeWorkers.length > 0 && nativePairs.every(([, outcome]) => outcome.status === 'passed');
  // Portals cannot receive unverified native output.
  if (!allPassed) return { runId: context.runId, native, portals: {}, portalStatus: 'blocked' };
  const accepted = nativePairs.flatMap(([, outcome]) => outcome.status === 'passed' ? [outcome.value] : []);
  const portalPairs = await parallelLimit(portalWorkers, concurrency, async worker => {
    let result: PortalResult;
    try {
      result = await worker.run(context, accepted);
      if (result.portal !== worker.portal || !result.sources.length)
        throw new Error('Missing or mismatched Portal evidence');
    } catch (error) {
      return [worker.portal, { status: 'failed', error: String(error) }] as const;
    }
    try {
      const audit = await worker.audit(context, result);
      if (!audit.passed) return [worker.portal, { status: 'failed', error: 'Portal audit failed', audit }] as const;
      return [worker.portal, { status: 'passed', value: result, audit }] as const;
    } catch (error) {
      return [worker.portal, { status: 'failed', error: String(error) }] as const;
    }
  });
  return {
    runId: context.runId, native,
    portals: Object.fromEntries(portalPairs),
    portalStatus: 'completed',
  };
}
