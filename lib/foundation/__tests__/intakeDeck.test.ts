import { describe, expect, it } from 'vitest';
import {
  INTAKE_CARDS,
  birthCityCardError,
  birthDateCardError,
  birthTimeCardError,
  buildIntakeRecord,
  nameCardError,
  placeFromSuggestion,
} from '../intakeDeck';
import { buildLivedPlace } from '../livedExposure';

describe('intake deck', () => {
  it('clicks through name, date, time, birth city, then lived places', () => {
    expect([...INTAKE_CARDS]).toEqual(['name', 'birthDate', 'birthTime', 'birthCity', 'livedPlaces']);
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

  it('accepts a blank or well-formed birth time, rejects a malformed one', () => {
    expect(birthTimeCardError('')).toBeNull();
    expect(birthTimeCardError('14:32')).toBeNull();
    expect(birthTimeCardError('2:32pm')).toMatch(/birth time/);
  });

  it('stores the birth record without a clock and without an incubator lived place', () => {
    const city = placeFromSuggestion({
      city: 'Tarzana',
      country: 'United States',
      latitude: 34.1722,
      longitude: -118.5358,
    });
    const record = buildIntakeRecord({
      name: ' self ',
      birthDate: '1979-08-01',
      birthTime: null,
      birthCity: city,
      livedPlaces: [],
    });

    expect(record.name).toBe('self');
    expect(record.birthDate).toBe('1979-08-01');
    expect(record.birthTime).toBeNull();
    expect(record.city).toEqual(city);
    expect(record.livedPlaces).toEqual([]);
    expect(record.incubator).toEqual({ birthCity: city, livedPlaces: [], livedStack: '' });
    expect(Object.keys(record).sort()).toEqual([
      'birthDate',
      'birthTime',
      'city',
      'incubator',
      'livedPlaces',
      'livedStack',
      'name',
    ]);
  });

  it('stores the birth record with a known clock and pushes lived places into the incubator', () => {
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
      birthTime: '14:32',
      birthCity: city,
      livedPlaces: [lived],
    });

    expect(record.birthTime).toBe('14:32');
    expect(record.livedPlaces).toEqual([lived]);
    expect(record.livedStack).toContain('Tarzana');
    expect(record.incubator).toEqual({
      birthCity: city,
      livedPlaces: [lived],
      livedStack: record.livedStack,
    });
  });
});
