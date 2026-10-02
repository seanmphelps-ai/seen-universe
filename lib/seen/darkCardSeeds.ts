/**
 * Time-window seeds from the chart engine.
 * HARD LAW: the recognition face is structured extraction slots for that window.
 * Slots stay empty until one native reading supplies behavioral pressure.
 * Do not fold wound tags, portal metaphor lines, and location into one narrative.
 * Location does not rewrite the native seed on the card face.
 * Clock-driven archetype blends are not a face.
 */

import type { NatalChartResult } from '../natalChart';
import { emptyPortalExtraction, type PortalExtraction } from '../portals/template';

export type EngineSeedCard = {
  runId: string;
  chart: NatalChartResult;
  /** Metadata only — never render on card faces. */
  clock?: string;
  extraction: PortalExtraction;
};

type DarkWindowResultPayload = {
  chart: NatalChartResult;
  darkCardSeed: {
    clock: string;
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

function runIdForClock(clock: string, index: number): string {
  const normalized = /^\d{2}:\d{2}$/.test(clock) ? clock : `r1-${index}`;
  return `dark-${normalized.replace(':', '')}-${index}`;
}

function mapResultsToCards(results: DarkWindowResultPayload[]): EngineSeedCard[] {
  return results.map((result, index) => {
    const clock = result.darkCardSeed.clock;
    return {
      runId: runIdForClock(clock, index),
      chart: result.chart,
      clock,
      extraction: emptyPortalExtraction(),
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
