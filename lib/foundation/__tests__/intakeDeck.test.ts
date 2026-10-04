import { describe, expect, it } from 'vitest';
import {
  INTAKE_CARDS,
  birthCityCardError,
  birthDateCardError,
  buildIntakeRecord,
  nameCardError,
  placeFromSuggestion,
} from '../intakeDeck';
import { buildLivedPlace } from '../livedExposure';

describe('intake deck', () => {
  it('clicks through name, date, birth city, then lived places', () => {
    expect([...INTAKE_CARDS]).toEqual(['name', 'birthDate', 'birthCity', 'livedPlaces']);
  });

  it('requires a calendar date and a selected city with coordinates', () => {
    expect(nameCardError('  ')).toMatch(/name/);
    expect(nameCardError('self')).toBeNull();
    expect(birthDateCardError('')).toMatch(/birth date/);
    expect(birthDateCardError('August 1, 1979')).toMatch(/birth date/);
    expect(birthDateCardError('1979-08-01')).toBeNull();
    expect(birthCityCardError(null)).toMatch(/birth city/);

    const city = placeFromSuggestion({
      city: 'Tarzana',
      country: 'United States',
      latitude: 34.1722,
      longitude: -118.5358,
    });
    expect(city).toEqual({
      name: 'Tarzana',
      country: 'United States',
      latitude: 34.1722,
      longitude: -118.5358,
    });
    expect(birthCityCardError(city)).toBeNull();
  });

  it('stores the birth record without a clock', () => {
    const city = placeFromSuggestion({
      city: 'Tarzana',
      country: 'United States',
      latitude: 34.1722,
      longitude: -118.5358,
    });
    const lived = buildLivedPlace({
      place: city,
      startMonth: '1979-08',
      endMonth: '1985-08',
    });
    const record = buildIntakeRecord({
      name: ' self ',
      birthDate: '1979-08-01',
      birthCity: city,
      livedPlaces: [lived],
    });

    expect(record.name).toBe('self');
    expect(record.birthDate).toBe('1979-08-01');
    expect(record.city).toEqual(city);
    expect(record.livedPlaces).toEqual([lived]);
    expect(record.livedStack).toContain('Tarzana');
    expect(Object.keys(record).sort()).toEqual([
      'birthDate',
      'city',
      'livedPlaces',
      'livedStack',
      'name',
    ]);
  });
});
