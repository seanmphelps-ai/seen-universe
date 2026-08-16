import { describe, it, expect } from 'vitest';
import {
  CONDITIONING_DISCLOSURE,
  MINIMUM_RESIDENCE_MONTHS,
  buildExposureProfile,
  computeSliceDose,
  monthsBetween,
  qualifiesAsSlice,
  tenureWeight,
  toConditioningInput,
  type ResidenceSlice,
} from '../exposure';
import type { EvidenceVector } from '../types';

function slice(overrides: Partial<ResidenceSlice> = {}): ResidenceSlice {
  return {
    locationId: 'loc-1',
    label: 'Los Angeles, CA',
    role: 'LIVED',
    start: '2010-01-01',
    end: '2014-01-01',
    months: 48,
    ...overrides,
  };
}

function vector(overrides: Partial<EvidenceVector> = {}): EvidenceVector {
  return {
    key: {
      markerId: 'violent_incident',
      locationId: 'loc-1',
      windowStart: '2010-01-01',
      windowEnd: '2014-01-01',
    },
    sourceFamily: 'OFFICIAL_DATA',
    prev: 0.8,
    sev: { median: 0.5, upperTail: 0.9, polarity: 'PRESSURE', n: 10 },
    phys: 0.4,
    dig: null,
    amp: null,
    brd: null,
    conc: null,
    frame: null,
    trend: null,
    raw: { uniqueEvents: 10, exposureObservations: 40, population: 100_000 },
    digIsProxy: false,
    notes: [],
    ...overrides,
  };
}

describe('tenureWeight', () => {
  it('is 0 at zero months and rises toward 1', () => {
    expect(tenureWeight(0)).toBe(0);
    expect(tenureWeight(12)).toBeCloseTo(1 - Math.exp(-1), 12);
    expect(tenureWeight(120)).toBeGreaterThan(0.99);
  });

  it('is monotonically increasing', () => {
    expect(tenureWeight(6)).toBeLessThan(tenureWeight(24));
  });

  it('rejects negative tenure', () => {
    expect(() => tenureWeight(-1)).toThrow();
  });
});

describe('monthsBetween', () => {
  it('measures a closed interval', () => {
    expect(monthsBetween('2010-01-01', '2011-01-01')).toBeCloseTo(12, 1);
  });

  it('measures an open interval against now', () => {
    const now = new Date('2020-01-01T00:00:00.000Z');
    expect(monthsBetween('2019-01-01', null, now)).toBeCloseTo(12, 1);
  });

  it('rejects an unparseable date rather than returning NaN', () => {
    expect(() => monthsBetween('not-a-date', '2011-01-01')).toThrow();
  });
});

describe('qualifiesAsSlice', () => {
  it('always keeps birth and current locations regardless of tenure', () => {
    expect(qualifiesAsSlice(slice({ role: 'BIRTH', months: 0 }))).toBe(true);
    expect(qualifiesAsSlice(slice({ role: 'CURRENT', months: 1 }))).toBe(true);
  });

  it('applies the tenure minimum to lived residences', () => {
    expect(qualifiesAsSlice(slice({ months: MINIMUM_RESIDENCE_MONTHS - 1 }))).toBe(false);
    expect(qualifiesAsSlice(slice({ months: MINIMUM_RESIDENCE_MONTHS }))).toBe(true);
  });
});

describe('computeSliceDose', () => {
  it('applies Dose = tenureWeight × component', () => {
    const result = computeSliceDose(slice(), vector());
    const weight = tenureWeight(48);

    expect(result.status).toBe('COMPUTED');
    expect(result.dose.prev).toBeCloseTo(weight * 0.8, 12);
    expect(result.dose.phys).toBeCloseTo(weight * 0.4, 12);
    expect(result.dose.sevMedian).toBeCloseTo(weight * 0.5, 12);
  });

  it('carries null components through as null rather than zero', () => {
    const result = computeSliceDose(slice(), vector({ dig: null }));
    expect(result.dose.dig).toBeNull();
  });

  it('reports UNAVAILABLE rather than substituting current data for missing history', () => {
    const result = computeSliceDose(slice(), null);
    expect(result.status).toBe('UNAVAILABLE');
    expect(result.dose).toEqual({});
    expect(result.unavailableReason).toMatch(/NOT substituted/);
  });

  it('refuses a vector whose window does not overlap the lived interval', () => {
    const outOfPeriod = vector({
      key: {
        markerId: 'violent_incident',
        locationId: 'loc-1',
        windowStart: '2023-01-01',
        windowEnd: '2024-01-01',
      },
    });
    const result = computeSliceDose(slice({ start: '1990-01-01', end: '1995-01-01' }), outOfPeriod);

    expect(result.status).toBe('UNAVAILABLE');
    expect(result.unavailableReason).toMatch(/does not overlap/);
  });

  it('accepts a vector that partially overlaps the lived interval', () => {
    const partial = vector({
      key: {
        markerId: 'violent_incident',
        locationId: 'loc-1',
        windowStart: '2012-01-01',
        windowEnd: '2016-01-01',
      },
    });
    expect(computeSliceDose(slice(), partial).status).toBe('COMPUTED');
  });

  it('still reports the tenure weight for an unavailable slice', () => {
    const result = computeSliceDose(slice({ months: 24 }), null);
    expect(result.tenureWeight).toBeCloseTo(tenureWeight(24), 12);
  });
});

describe('buildExposureProfile', () => {
  it('keeps birth, lived, and current as distinct slices', () => {
    const profile = buildExposureProfile([
      { slice: slice({ locationId: 'birth', role: 'BIRTH', months: 12 }), vector: vector() },
      { slice: slice({ locationId: 'lived', role: 'LIVED', months: 48 }), vector: vector() },
      {
        slice: slice({ locationId: 'current', role: 'CURRENT', months: 6, end: null }),
        vector: vector({
          key: {
            markerId: 'violent_incident',
            locationId: 'current',
            windowStart: '2010-01-01',
            windowEnd: '2030-01-01',
          },
        }),
      },
    ]);

    expect(profile.slices).toHaveLength(3);
    expect(profile.slices.map((s) => s.slice.locationId)).toEqual(['birth', 'lived', 'current']);
  });

  it('excludes short residences but reports them rather than hiding them', () => {
    const short = slice({ locationId: 'brief', months: 3 });
    const profile = buildExposureProfile([{ slice: short, vector: vector() }]);

    expect(profile.slices).toHaveLength(0);
    expect(profile.excludedShortResidences).toEqual([short]);
  });

  it('lists slices whose historical evidence was unavailable', () => {
    const profile = buildExposureProfile([
      { slice: slice({ locationId: 'has-data' }), vector: vector() },
      { slice: slice({ locationId: 'no-data' }), vector: null },
    ]);

    expect(profile.unavailableSlices).toEqual(['no-data']);
  });
});

describe('toConditioningInput', () => {
  it('attaches the independence disclosure to the payload itself', () => {
    const conditioning = toConditioningInput(buildExposureProfile([]));
    expect(conditioning.disclosure).toBe(CONDITIONING_DISCLOSURE);
    expect(conditioning.disclosure).toMatch(/makes no claim that any symbolic system is validated/);
  });
});
