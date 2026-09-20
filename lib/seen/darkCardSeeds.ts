/**
 * Soft dark-card seeds when LLM scenarios are unavailable.
 * Uses the real chart engine (Swiss + GeoPresence + wounds + 64 portals).
 */

export type EngineSeedCard = {
  clock: string;
  geoSummary: string;
  wounds: Array<{ label: string; sign: string; degree: number; qualities: string[] }>;
  topPortals: Array<{ portalId: number; name: string; expression: string }>;
};

export async function fetchDarkWindowSeeds(input: {
  name: string;
  birthDate: string;
  latitude: number;
  longitude: number;
  birthPlaceLabel: string;
  livedStack?: string;
}): Promise<EngineSeedCard[]> {
  const response = await fetch('/api/seen/chart-engine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, mode: 'dark-windows' }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || 'Chart engine failed.');
  }

  const payload = (await response.json()) as {
    results: Array<{
      darkCardSeed: {
        clock: string;
        geoSummary: string;
        woundMarkers: Array<{
          label: string;
          sign: string;
          degree: number;
          qualities: string[];
        }>;
        topPortals: Array<{ portalId: number; name: string; expression: string }>;
      };
    }>;
  };

  return payload.results.map((result) => ({
    clock: result.darkCardSeed.clock,
    geoSummary: result.darkCardSeed.geoSummary,
    wounds: result.darkCardSeed.woundMarkers.map((w) => ({
      label: w.label,
      sign: w.sign,
      degree: w.degree,
      qualities: w.qualities,
    })),
    topPortals: result.darkCardSeed.topPortals,
  }));
}
