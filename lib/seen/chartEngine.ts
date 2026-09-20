/**
 * Smallest SEEN chart engine: Swiss sky + GeoPresence + wound markers + 64 portals.
 */

import { calculateNatalChart, type NatalChartInput, type NatalChartResult } from '../natalChart';
import { computeGeoPresence, type GeoPresenceResult } from './geoPresence';
import { extractWoundMarkers, type WoundMarkerHit } from './woundMarkers';
import { expressPortals, type PortalExpression } from './portals64';

export const DARK_WINDOWS = ['04:00', '12:00', '20:00'] as const;
export type DarkWindow = (typeof DARK_WINDOWS)[number];

export type ChartEngineInput = {
  name: string;
  birthDate: string;
  latitude: number;
  longitude: number;
  birthPlaceLabel: string;
  livedStack?: string;
  /** Hidden clock from dark-card window or narrowed pick — never a typed UX clock */
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

  const chart = await calculateNatalChart(natalInput);
  const geo = computeGeoPresence({
    birthPlaceLabel: input.birthPlaceLabel,
    latitude: input.latitude,
    longitude: input.longitude,
    livedStack: input.livedStack,
  });
  const woundMarkers = extractWoundMarkers(chart, geo.baselinePressure);
  const portals = expressPortals(woundMarkers.length, geo.baselinePressure.amplification);
  const topPortals = [...portals]
    .filter((p) => p.expression === 'recurrent' || p.expression === 'pressurized')
    .slice(0, 12);

  return {
    chart,
    geo,
    woundMarkers,
    portals,
    darkCardSeed: {
      clock: input.clock,
      woundMarkers,
      geoSummary: geo.summary,
      topPortals: topPortals.length ? topPortals : portals.slice(0, 8),
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
