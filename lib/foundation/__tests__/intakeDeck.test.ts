import { describe, expect, it } from 'vitest';
import {
  INTAKE_CARDS,
  VISITOR_DECK,
  birthCityCardError,
  birthDateCardError,
  buildDeckBirthRecord,
  buildIntakeRecord,
  nameCardError,
  placeFromSuggestion,
} from '../intakeDeck';
import { buildLivedPlace } from '../livedExposure';

describe('intake deck', () => {
  it('walks enter, environmental exposure, date, anonymous time, then reveal', () => {
    expect([...VISITOR_DECK]).toEqual(['enter', 'place', 'date', 'time', 'reveal']);
  });

  it('keeps the older intake fields available to the birth record', () => {
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

  it('builds the visitor record from a selected place and an empty-until-chosen date', () => {
    expect(birthDateCardError('')).toMatch(/birth date/);
    const city = placeFromSuggestion({
      city: 'Tarzana',
      country: 'United States',
      latitude: 34.1722,
      longitude: -118.5358,
    });
    const record = buildDeckBirthRecord({
      birthDate: '1979-08-01',
      birthCity: city,
      birthLocation: 'Tarzana, United States',
    });
    expect(record.city).toEqual(city);
    expect(record.birthLocation).toBe('Tarzana, United States');
    expect(record.livedPlaces).toEqual([]);
    expect(record).not.toHaveProperty('birthTime');
    expect(record).not.toHaveProperty('clock');
    expect(() =>
      buildDeckBirthRecord({
        birthDate: '',
        birthCity: city,
        birthLocation: 'Tarzana, United States',
      }),
    ).toThrow(/birth date|date/i);
  });
});
