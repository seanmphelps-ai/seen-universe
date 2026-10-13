// PROVENANCE: bot=grok-bot session=2026-10-12 task=forge-intake-drop-removed-executeSeenWorkers-from-flowise-tests
import { describe, expect, it } from 'vitest';
import { invokeFlowise } from '../flowise';

/**
 * MISSING: executeSeenWorkers was removed from execution.ts, so the Flowise
 * orchestration contract test cannot run until a replacement runner lands.
 */
describe('Flowise integration', () => {
  it('rejects missing flow IDs rather than pretending to execute', async () => {
    await expect(
      invokeFlowise(
        { url: 'https://flowise.example.org', apiKey: 'key', flowIds: {} },
        'missing',
        {},
        (_): _ is object => true,
      ),
    ).rejects.toThrow('requires configuration');
  });
});
