/**
 * Soft dark-card seeds when LLM scenarios are unavailable.
 * Uses the real chart engine (Swiss + GeoPresence + wounds + 64 portals).
 * Face output is anonymous pressure prose — clocks stay metadata only.
 */

import type { NatalChartResult } from '../natalChart';
import {
  pressureProseFromSeed,
  runIdForClock,
} from '../rectification/pressureProseFromSeed';

export type EngineSeedCard = {
  runId: string;
  chart: NatalChartResult;
  /** Metadata only — never render on card faces. */
  clock?: string;
  /** Anonymous pressure paragraph for the card face. */
  paragraph: string;
  /** Raw cues retained for session/debug; not for face UI. */
  geoSummary?: string;
  wounds?: Array<{ label: string; sign: string; degree: number; qualities: string[] }>;
  topPortals?: Array<{ portalId: number; name: string; expression: string }>;
};

type DarkWindowResultPayload = {
  chart: NatalChartResult;
  darkCardSeed: {
    clock: string;
    geoSummary: string;
    woundMarkers: Array<{
      label: string;
      sign: string;
      degree: number;
      house?: number | null;
      qualities: string[];
    }>;
    topPortals: Array<{ portalId: number; name: string; expression: string }>;
  };
};

type SeedFetchInput = {
  name: string;
  birthDate: string;
  latitude: number;
  longitude: number;
  birthPlaceLabel: string;
  livedStack?: string;
};

function mapResultsToCards(results: DarkWindowResultPayload[]): EngineSeedCard[] {
  return results.map((result, index) => {
    const seed = result.darkCardSeed;
    const clock = seed.clock;
    const wounds = seed.woundMarkers.map((w) => ({
      label: w.label,
      sign: w.sign,
      degree: w.degree,
      house: w.house ?? null,
      qualities: w.qualities,
    }));
    const topPortals = seed.topPortals;
    const paragraph = pressureProseFromSeed({
      clock,
      geoSummary: seed.geoSummary,
      wounds,
      topPortals,
    });

    return {
      runId: runIdForClock(clock, index),
      chart: result.chart,
      clock,
      paragraph,
      geoSummary: seed.geoSummary,
      wounds: wounds.map(({ label, sign, degree, qualities }) => ({
        label,
        sign,
        degree,
        qualities,
      })),
      topPortals,
    };
  });
}

async function postDarkWindows(
  input: SeedFetchInput,
  clocks?: string[],
): Promise<EngineSeedCard[]> {
  const response = await fetch('/api/seen/chart-engine/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      mode: 'dark-windows',
      ...(clocks && clocks.length > 0 ? { clocks } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || 'Chart engine failed.');
  }

  const payload = (await response.json()) as {
    results: DarkWindowResultPayload[];
  };

  return mapResultsToCards(payload.results);
}

export async function fetchDarkWindowSeeds(
  input: SeedFetchInput,
): Promise<EngineSeedCard[]> {
  return postDarkWindows(input);
}

/** Fetch EngineSeedCards for explicit civil clocks (Round-2 neighbor set, etc.). */
export async function fetchSeedsForClocks(
  input: SeedFetchInput,
  clocks: string[],
): Promise<EngineSeedCard[]> {
  if (clocks.length === 0) {
    throw new Error('fetchSeedsForClocks requires at least one clock.');
  }
  return postDarkWindows(input, clocks);
}
