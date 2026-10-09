// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { NextRequest, NextResponse } from 'next/server';
import { calculateNatalChart, type NatalChartInput } from '../../../lib/natalChart';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let input: NatalChartInput;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!input?.name || !input?.birthDate || typeof input.latitude !== 'number' || typeof input.longitude !== 'number') {
    return NextResponse.json({ error: 'Missing required chart fields.' }, { status: 400 });
  }

  try {
    const result = await calculateNatalChart(input);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chart calculation failed.' },
      { status: 500 },
    );
  }
}
