import { describe, expect, it } from 'vitest';
import { anonymousCardFace, pressureProseFromSeed } from '../../rectification/pressureProseFromSeed';
import { DARK_WINDOWS, runDarkWindowSet } from '../chartEngine';

describe('dark window engine', () => {
  it('runs the three locked clocks and keeps their faces anonymous', async () => {
    const results = await runDarkWindowSet({
      name: 'self',
      birthDate: '1979-08-01',
      latitude: 34.1733,
      longitude: -118.5539,
      birthPlaceLabel: 'Tarzana, United States',
      livedStack: 'Los Angeles 1997–2020. Kalispell 2020–now',
    });

    expect(results.map((result) => result.darkCardSeed.clock)).toEqual([...DARK_WINDOWS]);
    const faces = results.map((result) => anonymousCardFace(pressureProseFromSeed({
      clock: result.darkCardSeed.clock,
      geoSummary: result.darkCardSeed.geoSummary,
      wounds: result.darkCardSeed.woundMarkers,
      topPortals: result.darkCardSeed.topPortals,
    })));
    expect(new Set(faces).size).toBe(3);
    for (const face of faces) {
      expect(face).not.toMatch(/\b\d{1,2}:\d{2}\b/);
    }
  }, 30000);
});
