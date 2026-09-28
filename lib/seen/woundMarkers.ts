/**
 * Wound-marker qualification: the rule governs, not the example list.
 * This module records verified potential. Pressure, activation and expression
 * require separate evidence; neither a natal position nor a place proves them.
 */
import type { NatalChartResult } from '../natalChart';
import type { BaselinePressureEffect } from './geoPresence';

export type WoundMarkerId = 'chiron' | 'trueLilith' | 'neptune' | 'mars' | 'venus' | 'saturn' | 'pluto' | 'uranus';

export type WoundSource = {
  system: string;
  sourceId: string;
  calculationRef: string;
  evidenceRefs?: string[];
};

export type WoundCandidate = {
  id: string;
  label: string;
  qualities: string[];
  source: WoundSource;
  sign?: string;
  degree?: number;
  house?: number | null;
  category?: string;
  shadowExpression?: string;
  triggerMechanic?: string;
  collapsePattern?: string;
  relationalDistortion?: string;
  domainImpact?: string[];
  linkedShadowCategories?: string[];
  portalRoutes?: number[];
  ageArcs?: unknown[];
  jungCapacity?: unknown;
  confidence?: number;
  unresolved?: string[];
};

/** Canonical qualifying mechanics. A verified independent candidate is not
 * disqualified for being absent from CORE or for failing to overlap. */
const QUALIFYING = /destabiliz|sever|compuls|shadow.intensif|wound|fractur|shame|rage|bind|dissolv|self.undo|sabotage|contraction|fear|power.distort|collaps|chaot/i;

export type WoundMarkerHit = WoundCandidate & {
  sign: string;
  degree: number;
  house: number | null;
  /** Legacy field; only present when a caller explicitly supplies a baseline.
   * It is context, not proof of wound activation. */
  pressure?: BaselinePressureEffect;
  potential: true;
  activation: 'UNRESOLVED';
  expression: 'UNRESOLVED';
  recursionEligible: true;
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

export function qualifiesAsWoundMarker(candidate: WoundCandidate): boolean {
  return candidate.qualities.some(quality => QUALIFYING.test(quality));
}

/**
 * Preserve independently calculated qualifying signals with provenance.
 * Additional modalities supply verified candidates; unavailable native
 * calculations are not synthesized here.
 */
export function extractWoundMarkers(
  chart: NatalChartResult,
  _baseline?: BaselinePressureEffect,
  independentCandidates: WoundCandidate[] = [],
): WoundMarkerHit[] {
  const byKey = new Map(chart.planets.map(planet => [planet.key, planet]));
  const candidates: WoundCandidate[] = [...independentCandidates];
  for (const core of CORE) {
    const planet = byKey.get(core.key);
    if (!planet) continue;
    candidates.push({
      id: core.id,
      label: core.label,
      sign: planet.sign,
      degree: planet.degreeInSign,
      house: planet.house,
      qualities: core.qualities,
      source: {
        system: 'WESTERN_NATAL',
        sourceId: core.key,
        calculationRef: 'natalChart.planets:' + core.key,
      },
    });
  }

  return candidates
    .filter(qualifiesAsWoundMarker)
    .filter((candidate): candidate is WoundCandidate & { sign: string; degree: number } =>
      typeof candidate.sign === 'string' && typeof candidate.degree === 'number' && Number.isFinite(candidate.degree))
    .map(candidate => ({
      ...candidate,
      house: candidate.house ?? null,
      potential: true as const,
      activation: 'UNRESOLVED' as const,
      expression: 'UNRESOLVED' as const,
      recursionEligible: true as const,
    }));
}
