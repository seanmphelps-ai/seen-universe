// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
/**
 * Smallest SEEN chart engine: Swiss sky + GeoPresence + wound markers + 64 portals.
 */

import { calculateNatalChart, type NatalChartInput, type NatalChartResult } from '../natalChart';
import { computeGeoPresence, type GeoPresenceResult } from './geoPresence';
import { extractWoundMarkers, type WoundMarkerHit } from './woundMarkers';
import { expressPortals, type PortalExpression } from './portals64';
import { runAllInterrogators, fileIntoSections, type InterrogatorResult, type SectionFiling } from './interrogators';

export const DARK_WINDOWS = ['04:00', '12:00', '20:00'] as const;
export type DarkWindow = (typeof DARK_WINDOWS)[number];

export type ChartEngineInput = {
  name: string;
  birthDate: string;
  latitude: number;
  longitude: number;
  birthPlaceLabel: string;
  livedStack?: string;

  clock: string;
};

export type DarkCardSeed = {
  clock: string;
  woundMarkers: WoundMarkerHit[];
  geoSummary: string;
  topPortals: PortalExpression[];
};

export type ChartEngineResult = {
  chart: NatalChartResult;
  geo: GeoPresenceResult;
  woundMarkers: WoundMarkerHit[];
  portals: PortalExpression[];
  interrogations: InterrogatorResult[];
  lifeSections: SectionFiling;
  darkCardSeed: DarkCardSeed;
  doctrine: {
    portals: '64';
    neverDeclarePortalOff: true;
    locationPhrase: string;
  };
};

export async function runChartEngine(input: ChartEngineInput): Promise<ChartEngineResult> {
  const natalInput: NatalChartInput = {
    name: input.name,
    birthDate: input.birthDate,
    birthTime: input.clock,
    latitude: input.latitude,
    longitude: input.longitude,
  };

  // STAGE 1 — modality subagents (agent/subagents) produce their output first.
  const chart = await calculateNatalChart(natalInput);
  const geo = computeGeoPresence({
    birthPlaceLabel: input.birthPlaceLabel,
    latitude: input.latitude,
    longitude: input.longitude,
    livedStack: input.livedStack,
  });
  const woundMarkers = extractWoundMarkers(chart, geo.baselinePressure);
  const portals = expressPortals();
  // STAGE 2 — the 64 archetype agents (agent/subagents/archetypes) run after, on the modality output. No scoring.
  const interrogations = runAllInterrogators(
    woundMarkers.map((w) => ({ modality: 'wound-marker', id: w.id, label: w.label, source: w.source })),
  );

  return {
    chart,
    geo,
    woundMarkers,
    portals,
    interrogations,
    lifeSections: fileIntoSections(interrogations),
    darkCardSeed: {
      clock: input.clock,
      woundMarkers,
      geoSummary: geo.summary,
      topPortals: portals,
    },
    doctrine: {
      portals: '64',
      neverDeclarePortalOff: true,
      locationPhrase: geo.doctrine,
    },
  };
}

export async function runDarkWindowSet(
  base: Omit<ChartEngineInput, 'clock'>,
  clocks: string[] = [...DARK_WINDOWS],
): Promise<ChartEngineResult[]> {
  const results: ChartEngineResult[] = [];
  for (const clock of clocks) {
    results.push(await runChartEngine({ ...base, clock }));
  }
  return results;
}
