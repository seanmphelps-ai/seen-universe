import { describe, it, expect } from 'vitest';
import { classifyAgainstComparator, selectComparator } from '../comparator';

describe('classifyAgainstComparator', () => {
  it('returns UNKNOWN when the raw value is null', () => {
    expect(classifyAgainstComparator(null, { label: 'state', value: 100 }, 'HIGHER_IS_MORE')).toBe(
      'UNKNOWN',
    );
  });

  it('returns UNKNOWN when there is no comparator', () => {
    expect(classifyAgainstComparator(100, null, 'HIGHER_IS_MORE')).toBe('UNKNOWN');
  });

  it('returns UNKNOWN when the comparator value is zero (would divide by zero)', () => {
    expect(classifyAgainstComparator(100, { label: 'state', value: 0 }, 'HIGHER_IS_MORE')).toBe(
      'UNKNOWN',
    );
  });

  it('classifies HIGHER_IS_MORE: value well above baseline as ABUNDANT', () => {
    expect(
      classifyAgainstComparator(120, { label: 'state', value: 100 }, 'HIGHER_IS_MORE'),
    ).toBe('ABUNDANT');
  });

  it('classifies HIGHER_IS_MORE: value well below baseline as SCARCE', () => {
    expect(
      classifyAgainstComparator(80, { label: 'state', value: 100 }, 'HIGHER_IS_MORE'),
    ).toBe('SCARCE');
  });

  it('classifies HIGHER_IS_MORE: value near baseline as PRESENT', () => {
    expect(
      classifyAgainstComparator(105, { label: 'state', value: 100 }, 'HIGHER_IS_MORE'),
    ).toBe('PRESENT');
  });

  it('classifies LOWER_IS_MORE (e.g. poverty rate): a low value relative to baseline as ABUNDANT', () => {
    // poverty rate of 5% vs a baseline of 15% = meaningfully lower = more opportunity
    expect(classifyAgainstComparator(5, { label: 'state', value: 15 }, 'LOWER_IS_MORE')).toBe(
      'ABUNDANT',
    );
  });

  it('classifies LOWER_IS_MORE: a high value relative to baseline as SCARCE', () => {
    expect(classifyAgainstComparator(25, { label: 'state', value: 15 }, 'LOWER_IS_MORE')).toBe(
      'SCARCE',
    );
  });

  it('is symmetric at exactly the threshold boundary', () => {
    // 15% above baseline of 100 = 115, right at the ABUNDANT boundary
    expect(
      classifyAgainstComparator(115, { label: 'state', value: 100 }, 'HIGHER_IS_MORE'),
    ).toBe('ABUNDANT');
  });
});

describe('selectComparator', () => {
  const comparators = [
    { label: 'United States (national)', value: 1 },
    { label: 'California (state)', value: 2 },
  ];

  it('prefers the requested label when present', () => {
    expect(selectComparator(comparators, 'California (state)')?.value).toBe(2);
  });

  it('falls back to the first comparator when the preferred label is absent', () => {
    expect(selectComparator(comparators, 'Texas (state)')?.value).toBe(1);
  });

  it('returns null when there are no comparators at all', () => {
    expect(selectComparator([], 'anything')).toBeNull();
  });
});
