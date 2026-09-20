/**
 * Wound markers — rule governs the list.
 * Any destabilizing / severing / compulsive / shadow-intensifying factor qualifies.
 * Strong non-overlapping markers still extract.
 */

import type { NatalChartResult, PlanetPlacement } from '../natalChart';
import type { BaselinePressureEffect } from './geoPresence';

export type WoundMarkerId =
  | 'chiron'
  | 'trueLilith'
  | 'ashlesha'
  | 'neptune'
  | 'mars'
  | 'venus'
  | 'saturn'
  | 'pluto'
  | 'uranus';

export type WoundMarkerHit = {
  id: WoundMarkerId | string;
  label: string;
  sign: string;
  degree: number;
  house: number | null;
  qualities: string[];
  pressure: BaselinePressureEffect;
};

const CORE: { key: string; id: WoundMarkerId; label: string; qualities: string[] }[] = [
  { key: 'chiron', id: 'chiron', label: 'Chiron', qualities: ['wound-bearing', 'identity-fracturing', 'shame-carrying'] },
  { key: 'lilith', id: 'trueLilith', label: 'True Lilith', qualities: ['rageful', 'binding', 'shadow-intensifying'] },
  { key: 'neptune', id: 'neptune', label: 'Neptune', qualities: ['dissolving', 'fog', 'self-undoing'] },
  { key: 'mars', id: 'mars', label: 'Mars', qualities: ['severing', 'compulsive', 'rageful'] },
  { key: 'venus', id: 'venus', label: 'Venus', qualities: ['relational', 'attachment', 'sabotage-prone'] },
  { key: 'saturn', id: 'saturn', label: 'Saturn', qualities: ['contraction', 'delay', 'fear-structure'] },
  { key: 'pluto', id: 'pluto', label: 'Pluto', qualities: ['compulsive', 'power-distorting', 'collapsing'] },
  { key: 'uranus', id: 'uranus', label: 'Uranus', qualities: ['severing', 'chaotic', 'shock'] },
];

function applyPressure(
  base: BaselinePressureEffect,
  qualities: string[],
): BaselinePressureEffect {
  const hard = qualities.some((q) =>
    /rage|collapse|sever|compulsive|chaotic|power|shame|wound/.test(q),
  );
  return {
    amplification: Math.min(1, base.amplification + (hard ? 0.1 : 0)),
    suppression: base.suppression,
    sensitization: Math.min(1, base.sensitization + (hard ? 0.08 : 0)),
    delay: base.delay,
    distortion: Math.min(1, base.distortion + (hard ? 0.08 : 0)),
    rerouteWeight: base.rerouteWeight,
  };
}

export function extractWoundMarkers(
  chart: NatalChartResult,
  baseline: BaselinePressureEffect,
): WoundMarkerHit[] {
  const byKey = new Map(chart.planets.map((p) => [p.key, p]));
  const hits: WoundMarkerHit[] = [];

  for (const core of CORE) {
    const planet = byKey.get(core.key) as PlanetPlacement | undefined;
    if (!planet) continue;
    hits.push({
      id: core.id,
      label: core.label,
      sign: planet.sign,
      degree: planet.degreeInSign,
      house: planet.house,
      qualities: core.qualities,
      pressure: applyPressure(baseline, core.qualities),
    });
  }

  // Ashlesha is Vedic — flag as pending native calc, still eligible by rule
  hits.push({
    id: 'ashlesha',
    label: 'Ashlesha (pending Vedic native)',
    sign: 'UNKNOWN',
    degree: 0,
    house: null,
    qualities: ['binding', 'entanglement', 'secrecy'],
    pressure: applyPressure(baseline, ['binding', 'entanglement']),
  });

  return hits;
}
