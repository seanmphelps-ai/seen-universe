import { NextRequest, NextResponse } from 'next/server';
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
      const resolvedClocks =
        Array.isArray(clocks) && clocks.length > 0 && clocks.every(isClock)
          ? clocks
          : [...DARK_WINDOWS];

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

    const resolvedClock = clock && isClock(clock) ? clock : '12:00';
    const result = await runChartEngine({
      name,
      birthDate,
      latitude,
      longitude,
      birthPlaceLabel,
      livedStack,
      clock: resolvedClock,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chart engine failed.' },
      { status: 500 },
    );
  }
}
