import { describe, expect, it } from 'vitest';

import { computePersistence } from '../persistence';

describe('computePersistence', () => {
  it('returns null when temporal extent was not measured', () => {
    expect(
      computePersistence({
        windowStart: '2024-01-01T00:00:00.000Z',
        windowEnd: '2024-01-11T00:00:00.000Z',
        extents: [],
      }),
    ).toBeNull();
  });

  it('clips to the lived window and merges overlapping spells', () => {
    const result = computePersistence({
      windowStart: '2024-01-01T00:00:00.000Z',
      windowEnd: '2024-01-11T00:00:00.000Z',
      extents: [
        { start: '2023-12-29T00:00:00.000Z', end: '2024-01-04T00:00:00.000Z' },
        { start: '2024-01-03T00:00:00.000Z', end: '2024-01-06T00:00:00.000Z' },
        { start: '2024-01-08T00:00:00.000Z', end: '2024-01-14T00:00:00.000Z' },
      ],
      regime: 'EPISODIC',
    });

    expect(result).not.toBeNull();
    expect(result?.activeFraction).toBeCloseTo(0.8, 12);
    expect(result?.longestUnbrokenDays).toBeCloseTo(5, 12);
    expect(result?.spellCount).toBe(2);
    expect(result?.spansEntireWindow).toBe(false);
    expect(result?.regime).toBe('EPISODIC');
  });

  it('reports an entire-window condition without inventing a regime', () => {
    const result = computePersistence({
      windowStart: '2024-01-01T00:00:00.000Z',
      windowEnd: '2024-04-01T00:00:00.000Z',
      extents: [
        { start: '2023-01-01T00:00:00.000Z', end: '2025-01-01T00:00:00.000Z' },
      ],
    });

    expect(result).not.toBeNull();
    expect(result?.activeFraction).toBe(1);
    expect(result?.spellCount).toBe(1);
    expect(result?.spansEntireWindow).toBe(true);
    expect(result?.regime).toBe('UNKNOWN');
  });

  it('ignores malformed and out-of-window intervals rather than fabricating zero exposure', () => {
    const result = computePersistence({
      windowStart: '2024-01-01T00:00:00.000Z',
      windowEnd: '2024-01-11T00:00:00.000Z',
      extents: [
        { start: 'not-a-date', end: '2024-01-03T00:00:00.000Z' },
        { start: '2023-01-01T00:00:00.000Z', end: '2023-01-03T00:00:00.000Z' },
      ],
    });

    expect(result).toBeNull();
  });
});
