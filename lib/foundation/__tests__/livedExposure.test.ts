import { describe, expect, it } from 'vitest';
import {
  buildLivedPlace,
  collectLivedPlaces,
  emptyLivedPlaceDraft,
  exposureYears,
  livedStackFromPlaces,
} from '../livedExposure';

const tarzana = {
  name: 'Los Angeles',
  country: 'United States',
  latitude: 34.0522,
  longitude: -118.2437,
};

describe('lived exposure', () => {
  it('counts six months and rejects a shorter stay', () => {
    expect(exposureYears({ year: 2020, month: 1 }, { year: 2020, month: 7 })).toBe(0.5);
    expect(buildLivedPlace({
      place: tarzana,
      startMonth: '2020-01',
      endMonth: '2020-07',
    }).yearsLived).toBe(0.5);

    expect(() => buildLivedPlace({
      place: tarzana,
      startMonth: '2020-01',
      endMonth: '2020-06',
    })).toThrow(/six months/);
  });

  it('keeps an open stay when the person still lives there', () => {
    const place = buildLivedPlace({
      place: tarzana,
      startMonth: '2020-01',
      endMonth: null,
      now: new Date('2026-10-02T00:00:00Z'),
    });
    expect(place.endYear).toBeNull();
    expect(place.yearsLived).toBeGreaterThanOrEqual(0.5);
    expect(livedStackFromPlaces([place])).toBe('Los Angeles 2020–now');
  });

  it('writes a same-year six-month stay as months, not a repeated year', () => {
    const place = buildLivedPlace({
      place: tarzana,
      startMonth: '2020-01',
      endMonth: '2020-07',
    });
    expect(livedStackFromPlaces([place])).toBe('Los Angeles 2020 (6 months)');
  });

  it('skips a blank row and requires a selected city', () => {
    const blank = emptyLivedPlaceDraft('a');
    expect(collectLivedPlaces([blank])).toEqual([]);
    expect(() => collectLivedPlaces([{
      ...blank,
      query: 'Paris',
    }])).toThrow(/coordinates/);
  });
});
