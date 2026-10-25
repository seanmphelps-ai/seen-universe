// PROVENANCE: bot=grok session=2026-10-24 task=rename environmental exposure engine to incubator
import { describe, expect, it } from 'vitest';
import { BirthAnchorSchema, FoundationIntakeSchema, LivedExposureSchema } from '../intakeSchema';

const validIntake = {
  name: 'self',
  birthDate: '1979-08-01',
  birthTime: null,
  birthLocation: 'Tarzana, California, United States',
  livedIncubators: ['Los Angeles, California, United States'],
  livedPeriods: [{
    incubator: 'Los Angeles, California, United States',
    startYear: '1997',
    endYear: '2020',
  }],
  currentIncubator: 'Kalispell, Montana, United States',
  currentPeriod: {
    startYear: '2020',
    endYear: 'present' as const,
  },
  minimumResidenceMonths: 6 as const,
};

describe('FoundationIntakeSchema', () => {
  it('accepts the Universe birth-date and incubator timeline', () => {
    expect(FoundationIntakeSchema.safeParse(validIntake).success).toBe(true);
  });

  it('accepts a timeline without an additional lived incubator', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedIncubators: [],
      livedPeriods: [],
    }).success).toBe(true);
  });

  it('requires exposure years for every lived incubator', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedPeriods: [{
        incubator: 'Los Angeles, California, United States',
        startYear: '',
        endYear: '',
      }],
    }).success).toBe(false);
  });

  it('requires the current-incubator start year', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      currentPeriod: {
        startYear: '',
        endYear: 'present',
      },
    }).success).toBe(false);
  });

  it('rejects an inverted residence period', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedPeriods: [{
        incubator: 'Los Angeles, California, United States',
        startYear: '2020',
        endYear: '1997',
      }],
    }).success).toBe(false);
  });

  it('rejects mismatched lived-incubator records', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedIncubators: ['Oakland, California, United States'],
    }).success).toBe(false);
  });

  it('accepts a typed birth anchor with coordinates and no known birth time', () => {
    expect(BirthAnchorSchema.safeParse({
      name: 'self',
      birthDate: '1979-08-01',
      birthTime: null,
      birthCity: {
        name: 'Tarzana',
        country: 'United States',
        latitude: 34.1733,
        longitude: -118.5539,
      },
    }).success).toBe(true);
  });

  it('accepts a typed birth anchor with a known birth time', () => {
    expect(BirthAnchorSchema.safeParse({
      name: 'self',
      birthDate: '1979-08-01',
      birthTime: '14:32',
      birthCity: {
        name: 'Tarzana',
        country: 'United States',
        latitude: 34.1733,
        longitude: -118.5539,
      },
    }).success).toBe(true);
  });

  it('rejects a malformed birth time', () => {
    expect(BirthAnchorSchema.safeParse({
      name: 'self',
      birthDate: '1979-08-01',
      birthTime: '2:32pm',
      birthCity: {
        name: 'Tarzana',
        country: 'United States',
        latitude: 34.1733,
        longitude: -118.5539,
      },
    }).success).toBe(false);
  });

  it('rejects lived exposure under six months', () => {
    expect(LivedExposureSchema.safeParse({
      birthAnchor: {
        name: 'self',
        birthDate: '1979-08-01',
        birthTime: null,
        birthCity: {
          name: 'Tarzana',
          country: 'United States',
          latitude: 34.1733,
          longitude: -118.5539,
        },
      },
      livedPlaces: [{
        place: {
          name: 'San Diego',
          country: 'United States',
          latitude: 32.7157,
          longitude: -117.1611,
        },
        startYear: 1998,
        endYear: 1998,
        yearsLived: 0.2,
      }],
    }).success).toBe(false);
  });
});
