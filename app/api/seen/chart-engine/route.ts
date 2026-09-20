import { NextRequest, NextResponse } from 'next/server';
import { DARK_WINDOWS, runChartEngine, runDarkWindowSet } from '../../../../lib/seen/chartEngine';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    birthDate?: string;
    latitude?: number;
    longitude?: number;
    birthPlaceLabel?: string;
    livedStack?: string;
    clock?: string;
    mode?: 'single' | 'dark-windows';
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, birthDate, latitude, longitude, birthPlaceLabel, livedStack, clock, mode } = body;

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
      const results = await runDarkWindowSet({
        name,
        birthDate,
        latitude,
        longitude,
        birthPlaceLabel,
        livedStack,
      });
      return NextResponse.json({
        windows: DARK_WINDOWS,
        results,
      });
    }

    const resolvedClock = clock && /^\d{2}:\d{2}$/.test(clock) ? clock : '12:00';
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
