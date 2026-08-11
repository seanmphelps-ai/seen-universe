import { describe, it, expect } from 'vitest';
import { selectAcsVintageYear, KNOWN_ACS5_VINTAGES } from '../historicalYear';

describe('selectAcsVintageYear', () => {
  it('picks a vintage whose 5-year window overlaps a residence period well within known coverage', () => {
    const selection = selectAcsVintageYear('2015-01-01', '2018-12-31');
    expect(selection.overlapsResidence).toBe(true);
    expect(selection.substitution).toBeNull();
    expect(KNOWN_ACS5_VINTAGES).toContain(selection.dataYear);
  });

  it('handles an ongoing (null end date) residence by treating it as extending to today', () => {
    const selection = selectAcsVintageYear('2020-01-01', null, new Date('2023-06-01'));
    expect(selection.overlapsResidence).toBe(true);
  });

  it('flags a substitution when the residence period predates all known ACS5 coverage', () => {
    const selection = selectAcsVintageYear('1975-01-01', '1978-12-31');
    expect(selection.overlapsResidence).toBe(false);
    expect(selection.substitution).toMatch(/No ACS5 vintage window overlaps/);
    expect(selection.dataYear).toBe(KNOWN_ACS5_VINTAGES[0]);
  });

  it('never selects a vintage outside the known list', () => {
    const selection = selectAcsVintageYear('1900-01-01', '1901-01-01');
    expect(KNOWN_ACS5_VINTAGES).toContain(selection.dataYear);
  });
});
