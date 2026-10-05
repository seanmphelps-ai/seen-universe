import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DARK_WINDOWS } from '../../seen/chartEngine';
import { anonymousCardFace, pressureProseFromSeed } from '../pressureProseFromSeed';
import {
  ROUND_1_CLOCKS,
  clocksForRound,
  neighborClocks,
  resolveDarkClocks,
} from '../timeNarrowing';

describe('time narrowing ladder', () => {
  it('locks round 1 to the engine dark windows', () => {
    expect([...ROUND_1_CLOCKS]).toEqual([...DARK_WINDOWS]);
    expect(clocksForRound(1)).toEqual(['04:00', '12:00', '20:00']);
    expect(clocksForRound(1)).not.toContain('06:00');
    expect(clocksForRound(1)).not.toContain('18:00');
  });

  it('opens ±3h neighbors around the round-1 pick', () => {
    expect(neighborClocks('04:00', 3)).toEqual(['01:00', '04:00', '07:00']);
    expect(neighborClocks('12:00', 3)).toEqual(['09:00', '12:00', '15:00']);
    expect(neighborClocks('20:00', 3)).toEqual(['17:00', '20:00', '23:00']);
    expect(clocksForRound(2, '04:00')).toEqual(['01:00', '04:00', '07:00']);
    expect(clocksForRound(2, '12:00')).toEqual(['09:00', '12:00', '15:00']);
    expect(clocksForRound(2, '20:00')).toEqual(['17:00', '20:00', '23:00']);
  });

  it('narrows the latest pick by ±2h and then ±1h', () => {
    expect(clocksForRound(3, '07:00')).toEqual(['05:00', '07:00', '09:00']);
    expect(clocksForRound(4, '05:00')).toEqual(['04:00', '05:00', '06:00']);
    expect(clocksForRound(3, '15:00')).toEqual(['13:00', '15:00', '17:00']);
    expect(clocksForRound(4, '13:00')).toEqual(['12:00', '13:00', '14:00']);
    expect(clocksForRound(3, '17:00')).toEqual(['15:00', '17:00', '19:00']);
    expect(clocksForRound(4, '23:00')).toEqual(['22:00', '23:00', '00:00']);
  });

  it('wraps a neighbor that crosses midnight', () => {
    expect(clocksForRound(3, '01:00')).toEqual(['23:00', '01:00', '03:00']);
  });

  it('refuses to invent a clock when the pick has none', () => {
    expect(() => clocksForRound(2)).toThrow(/hidden clock/);
    expect(() => clocksForRound(3, 'noon')).toThrow(/hidden clock/);
  });

  it('uses the dark windows when clocks are omitted and rejects a bad list', () => {
    expect(resolveDarkClocks(undefined, DARK_WINDOWS)).toEqual({
      ok: true,
      clocks: ['04:00', '12:00', '20:00'],
    });
    const neighbors = resolveDarkClocks(['01:00', '04:00', '07:00']);
    expect(neighbors.ok).toBe(true);
    if (neighbors.ok) {
      expect(neighbors.clocks).toEqual(['01:00', '04:00', '07:00']);
    }
    expect(resolveDarkClocks(['06:00', '18:00']).ok).toBe(true);
    expect(resolveDarkClocks([]).ok).toBe(false);
    expect(resolveDarkClocks(['noon']).ok).toBe(false);
    expect(resolveDarkClocks(['12:00', 'bad']).ok).toBe(false);
  });

  it('keeps every ladder face anonymous and at least three sentences', () => {
    const clocks = ['04:00', '12:00', '20:00', '01:00', '07:00', '09:00', '15:00', '17:00', '23:00'];
    for (const clock of clocks) {
      const face = anonymousCardFace(pressureProseFromSeed({
        clock,
        geoSummary: 'Castro Valley 1979–1999. Santa Monica 1999–2018.',
        wounds: [{ qualities: ['shame', 'binding'], house: clock === '12:00' ? 10 : 12 }],
      }));
      expect(face).not.toMatch(/\b\d{1,2}:\d{2}\b/);
      expect(face.split(/(?<=[.!?])\s+/).length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('first-slice screens', () => {
  it('opens enter, then environmental exposure, then an empty date picker', () => {
    const home = readFileSync('app/page.tsx', 'utf8');
    const entry = readFileSync('components/SeenEntry.tsx', 'utf8');
    expect(home).toContain('SeenEntry');
    expect(entry).toContain('href="/foundation/location"');
    expect(entry).toContain('/foundation/seen-poster.jpg');
    expect(entry).not.toMatch(/Kalispell|08\/01\/1979|1979-08-01|12:41/);

    const location = readFileSync('app/foundation/location/page.tsx', 'utf8');
    expect(location).toContain('environmental exposure');
    expect(location).toContain('LocationAutocompleteInput');
    expect(location).toContain("useState('')");
    expect(location).toContain('/foundation/date');
    expect(location).not.toMatch(/The Forge|THE FORGE/);
    expect(location).not.toMatch(/Kalispell|08\/01\/1979|1979-08-01|12:41/);
    expect(location).not.toMatch(/type="time"/);

    const date = readFileSync('app/foundation/date/page.tsx', 'utf8');
    expect(date).toContain('type="date"');
    expect(date).toContain("useState('')");
    expect(date).not.toMatch(/type="text"|type="time"/);
    expect(date).toContain('/foundation/rectification');
    expect(date).not.toMatch(/Kalispell|08\/01\/1979|1979-08-01|12:41/);

    const chart = readFileSync('app/chart/page.tsx', 'utf8');
    expect(chart).toContain("redirect('/foundation/location')");
    expect(chart).not.toMatch(/type="time"/);
    const birth = readFileSync('app/foundation/birth/page.tsx', 'utf8');
    expect(birth).toContain("redirect('/foundation/date')");
  });

  it('does not render a clock on the recognition cards', () => {
    const page = readFileSync('app/foundation/rectification/page.tsx', 'utf8');
    expect(page).not.toMatch(/\{card\.clock\}/);
    expect(page).not.toMatch(/type="time"/);
    expect(page).not.toMatch(/exact time/i);
    expect(page).not.toMatch(/06:00|18:00|noon/);
    expect(page).toContain('clocksForRound');
    expect(page).toContain('Pick the one');
    expect(page).toContain('/foundation/reveal');

    const reveal = readFileSync('app/foundation/reveal/page.tsx', 'utf8');
    expect(reveal).not.toMatch(/type="time"|exact time|oracle|chatbot|manuscript/i);
    expect(reveal).not.toMatch(/\b\d{1,2}:\d{2}\b/);
    expect(reveal).not.toMatch(/Kalispell|08\/01\/1979|1979-08-01|12:41/);
  });
});
