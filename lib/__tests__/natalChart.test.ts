import { describe, expect, it } from 'vitest';
import { calculateNatalChart } from '../natalChart';

describe('calculateNatalChart', () => {
  it('returns the complete standalone Western chart field', async () => {
    const chart = await calculateNatalChart({
      name: 'June 13, 1993',
      birthDate: '1993-06-13',
      birthTime: '08:22',
      latitude: 34.0522,
      longitude: -118.2437,
    });

    expect(chart.planets.map((planet) => planet.key)).toEqual([
      'sun',
      'moon',
      'mercury',
      'venus',
      'mars',
      'jupiter',
      'saturn',
      'uranus',
      'neptune',
      'pluto',
      'chiron',
      'lilith',
      'north-node',
      'south-node',
    ]);
    expect(chart.houses).toHaveLength(12);
    expect(chart.ascendant).not.toBeNull();
    expect(chart.midheaven).not.toBeNull();
    expect(chart.planets.every((planet) => planet.house !== null)).toBe(true);
    expect(chart.aspects.some((aspect) => aspect.point1 === 'Chiron' || aspect.point2 === 'Chiron')).toBe(true);
  });
});
