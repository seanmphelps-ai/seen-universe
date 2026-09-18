import { describe, expect, it } from 'vitest';
import { BirthAnchorSchema, FoundationIntakeSchema, LivedExposureSchema } from '../intakeSchema';

const validIntake = {
  name: 'self',
  birthDate: '1979-08-01',
  birthLocation: 'Tarzana, California, United States',
  livedLocations: ['Los Angeles, California, United States'],
  livedPeriods: [{
    location: 'Los Angeles, California, United States',
    startYear: '1997',
    endYear: '2020',
  }],
  currentLocation: 'Kalispell, Montana, United States',
  currentPeriod: {
    startYear: '2020',
    endYear: 'present' as const,
  },
  minimumResidenceMonths: 6 as const,
};

describe('FoundationIntakeSchema', () => {
  it('accepts the Universe birth-date and location timeline', () => {
    expect(FoundationIntakeSchema.safeParse(validIntake).success).toBe(true);
  });

  it('accepts a timeline without an additional lived location', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedLocations: [],
      livedPeriods: [],
    }).success).toBe(true);
  });

  it('requires exposure years for every lived location', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedPeriods: [{
        location: 'Los Angeles, California, United States',
        startYear: '',
        endYear: '',
      }],
    }).success).toBe(false);
  });

  it('requires the current-location start year', () => {
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
        location: 'Los Angeles, California, United States',
        startYear: '2020',
        endYear: '1997',
      }],
    }).success).toBe(false);
  });

  it('rejects mismatched lived-location records', () => {
    expect(FoundationIntakeSchema.safeParse({
      ...validIntake,
      livedLocations: ['Oakland, California, United States'],
    }).success).toBe(false);
  });

  it('accepts a typed birth anchor with coordinates', () => {
    expect(BirthAnchorSchema.safeParse({
      name: 'self',
      birthDate: '1979-08-01',
      birthCity: {
        name: 'Tarzana',
        country: 'United States',
        latitude: 34.1733,
        longitude: -118.5539,
      },
    }).success).toBe(true);
  });

  it('rejects lived exposure under six months', () => {
    expect(LivedExposureSchema.safeParse({
      birthAnchor: {
        name: 'self',
        birthDate: '1979-08-01',
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
