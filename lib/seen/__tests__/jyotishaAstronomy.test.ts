import { describe, expect, it } from 'vitest';
import { calculateJyotishaAstronomy } from '../jyotishaAstronomy';

describe('Jyotisha sidereal astronomy', () => {
  it('reproduces the native Swiss Lahiri ayanamsha at J2000 from local birth input', async () => {
    const result = await calculateJyotishaAstronomy({
      birthDate: '2000-01-01', birthTime: '12:00', latitude: 51.48,
      longitude: 0, siderealMode: 'lahiri',
    });
    // Swiss Ephemeris C verification/reference.json, JD UT 2451545.0.
    expect(result.provenance.julianDayUt).toBe(2451545);
    expect(result.provenance.ayanamshaDegrees).toBeCloseTo(23.853222486029065, 4);
    expect(result.longitudes.moon).toBeGreaterThan(199);
    expect(result.longitudes.moon).toBeLessThan(200);
    expect(result.provenance.utcBirthTime).toContain('2000-01-01T12:00:00');
  });

  it('keeps different named modes isolated across calls', async () => {
    const birth = { birthDate: '2000-01-01', birthTime: '12:00', latitude: 51.48, longitude: 0 };
    const lahiri = await calculateJyotishaAstronomy({ ...birth, siderealMode: 'lahiri' });
    const raman = await calculateJyotishaAstronomy({ ...birth, siderealMode: 'raman' });
    const repeated = await calculateJyotishaAstronomy({ ...birth, siderealMode: 'lahiri' });
    expect(raman.longitudes.moon).not.toBeCloseTo(lahiri.longitudes.moon, 3);
    expect(repeated.longitudes.moon).toBeCloseTo(lahiri.longitudes.moon, 8);
  });

  it('rejects missing mode and a nonexistent DST local time', async () => {
    const birth = { birthDate: '2024-03-10', birthTime: '02:30', latitude: 40.7128, longitude: -74.006 };
    await expect(calculateJyotishaAstronomy({ ...birth, siderealMode: 'lahiri' })).rejects.toThrow('invalid or ambiguous');
    await expect(calculateJyotishaAstronomy({ ...birth, birthTime: '01:30', siderealMode: undefined as never }))
      .rejects.toThrow('Explicit supported sidereal mode');
  });
});
