import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CALCULATED_MODALITY_NAMES,
  INTAKE_CARDS,
  INTAKE_DECK_HREF,
  birthCityCardError,
  birthDateCardError,
  buildDeckRecord,
  buildIntakeRecord,
  exposureCardError,
  exposureFromStored,
  nameCardError,
  placeFromSuggestion,
  revealInputsReady,
} from '../intakeDeck';
import { buildLivedPlace } from '../livedExposure';

describe('intake deck', () => {
  it('clicks through enter, environmental exposure, the mark, time, then reveal', () => {
    expect([...INTAKE_CARDS]).toEqual(['enter', 'exposure', 'mark', 'time', 'reveal']);
    expect(INTAKE_CARDS.map((card) => INTAKE_DECK_HREF[card])).toEqual([
      '/',
      '/foundation/location',
      '/chart',
      '/foundation/rectification',
      '/foundation/reveal',
    ]);
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

  it('stores a deck record from an empty place and an empty date once both are chosen', () => {
    expect(exposureCardError(null)).toMatch(/place/);
    expect(exposureFromStored(null)).toBeNull();
    expect(exposureFromStored({ city: { name: 'Tarzana' } })).toBeNull();

    const city = placeFromSuggestion({
      city: 'Tarzana',
      country: 'United States',
      latitude: 34.1722,
      longitude: -118.5358,
    });
    const stored = exposureFromStored({
      city,
      birthLocation: 'Tarzana, United States',
    });
    expect(stored?.city).toEqual(city);
    expect(exposureCardError(city)).toBeNull();

    const record = buildDeckRecord({
      birthDate: '2000-01-15',
      birthCity: city,
      birthLocation: 'Tarzana, United States',
    });
    expect(record.name).toBe('self');
    expect(record.birthDate).toBe('2000-01-15');
    expect(record.livedPlaces).toEqual([]);
    expect(record.birthLocation).toBe('Tarzana, United States');
    expect(record).not.toHaveProperty('birthTime');
    expect(record).not.toHaveProperty('clock');
    expect(JSON.stringify(record)).not.toMatch(/\d{2}:\d{2}/);

    expect(revealInputsReady(record, { locked: false })).toBe(false);
    expect(revealInputsReady(record, { locked: true })).toBe(true);
    expect(revealInputsReady({ city }, { locked: true })).toBe(false);
  });

  it('keeps sample cities, sample dates, and a typed clock off the deck screens', () => {
    const entry = readFileSync('components/SeenEntry.tsx', 'utf8');
    const location = readFileSync('app/foundation/location/page.tsx', 'utf8');
    const mark = readFileSync('app/chart/page.tsx', 'utf8');
    const reveal = readFileSync('app/foundation/reveal/page.tsx', 'utf8');

    expect(entry).toContain('href="/foundation/location"');
    expect(entry).toContain('Enter');
    expect(location).toContain('environmental exposure');
    expect(location).toContain('LocationAutocompleteInput');
    expect(location).toContain('useState(\'\')');
    expect(location).not.toMatch(/Forge/i);
    expect(mark).toContain('The Mark');
    expect(mark).toContain('type="date"');
    expect(mark).toContain('CALCULATED_MODALITY_NAMES');
    expect(mark).not.toContain('LocationAutocompleteInput');
    expect(mark).not.toMatch(/type="time"/);
    expect(reveal).toContain('Reveal');
    expect(reveal).not.toMatch(/type="time"/);

    for (const source of [entry, location, mark, reveal]) {
      expect(source).not.toMatch(/Kalispell|08\/01\/1979|1979-08-01|12:41/);
      expect(source).not.toMatch(/Core Identity|Life Path|YOUR BLUEPRINT|Oracle/);
    }

    expect([...CALCULATED_MODALITY_NAMES]).toEqual([
      'Western',
      'Hellenistic',
      'Jyotisha',
      'BaZi',
      'Numerology',
      "Tzolk'in",
      'Dreamspell',
    ]);
  });
});
