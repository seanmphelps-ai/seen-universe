import { describe, expect, it } from 'vitest';
import type { NatalChartResult } from '../../natalChart';
import { compareClosureCharts } from '../closureCompare';

function planet(
  key: string,
  label: string,
  longitude: number,
): NatalChartResult['planets'][number] {
  return {
    key,
    label,
    sign: 'Aries',
    degreeInSign: longitude % 30,
    longitude,
    house: 1,
    retrograde: false,
  };
}

function chart(name: string, planets: NatalChartResult['planets']): NatalChartResult {
  return {
    name,
    hasBirthTime: true,
    timezone: 'America/Los_Angeles',
    planets,
    ascendant: { label: 'Ascendant', sign: 'Aries', degreeInSign: 0, longitude: 0 },
    midheaven: { label: 'Midheaven', sign: 'Capricorn', degreeInSign: 0, longitude: 270 },
    houses: null,
    aspects: [],
  };
}

describe('compareClosureCharts', () => {
  it('returns three evidence-bound cards from independent Western charts', () => {
    const personA = chart('Person A', [
      planet('sun', 'Sun', 128),
      planet('moon', 'Moon', 10),
      planet('venus', 'Venus', 40),
      planet('saturn', 'Saturn', 200),
      planet('chiron', 'Chiron', 80),
    ]);
    const personB = chart('Person B', [
      planet('sun', 'Sun', 128.4),
      planet('moon', 'Moon', 11),
      planet('mars', 'Mars', 41),
      planet('saturn', 'Saturn', 10.5),
      planet('north-node', 'North Node', 128),
    ]);

    const result = compareClosureCharts(personA, personB);

    expect(result.cards).toHaveLength(3);
    expect(result.westernIndependent).toBe(true);
    expect(result.cards.map((card) => card.id)).toEqual([
      'the-hold',
      'the-heat',
      'the-care-collapse',
    ]);
    expect(result.cards[0].evidence[0]).toMatch(/Saturn/);
    expect(result.unresolved.some((item) => item.includes('Helix'))).toBe(true);
  });

  it('refuses to collapse two people into one record', () => {
    const person = chart('Same', [planet('sun', 'Sun', 0)]);
    expect(() => compareClosureCharts(person, person)).toThrow(/independent/);
  });
});
