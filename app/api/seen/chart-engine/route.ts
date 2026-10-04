import { NextRequest, NextResponse } from 'next/server';
import { resolveDarkClocks } from '../../../../lib/rectification/timeNarrowing';
import { DARK_WINDOWS, runChartEngine, runDarkWindowSet } from '../../../../lib/seen/chartEngine';

export const runtime = 'nodejs';

function isClock(value: unknown): value is string {
  return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);
}

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    birthDate?: string;
    latitude?: number;
    longitude?: number;
    birthPlaceLabel?: string;
    livedStack?: string;
    clock?: string;
    clocks?: string[];
    mode?: 'single' | 'dark-windows';
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, birthDate, latitude, longitude, birthPlaceLabel, livedStack, clock, clocks, mode } =
    body;

  if (
    !name ||
    !birthDate ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !birthPlaceLabel
  ) {
    return NextResponse.json(
      { error: 'Required: name, birthDate, latitude, longitude, birthPlaceLabel.' },
      { status: 400 },
    );
  }

  try {
    if (mode === 'dark-windows') {
      const resolved = resolveDarkClocks(clocks, DARK_WINDOWS);
      if (!resolved.ok) {
        return NextResponse.json({ error: resolved.error }, { status: 400 });
      }
      const resolvedClocks = resolved.clocks;

      const results = await runDarkWindowSet(
        {
          name,
          birthDate,
          latitude,
          longitude,
          birthPlaceLabel,
          livedStack,
        },
        resolvedClocks,
      );
      return NextResponse.json({
        windows: resolvedClocks,
        results,
      });
    }

    if (!clock || !isClock(clock)) {
      return NextResponse.json(
        { error: 'A hidden clock is required. Do not guess noon.' },
        { status: 400 },
      );
    }
    const result = await runChartEngine({
      name,
      birthDate,
      latitude,
      longitude,
      birthPlaceLabel,
      livedStack,
      clock,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chart engine failed.' },
      { status: 500 },
    );
  }
}
