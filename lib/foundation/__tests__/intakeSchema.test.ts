import { describe, expect, it } from 'vitest';
import { FoundationIntakeSchema } from '../intakeSchema';

const validIntake = {
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
  minimumResidenceMonths: 12 as const,
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
});
