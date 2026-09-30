import { NextRequest, NextResponse } from 'next/server';
import {
  buildLocationPressure,
  lockLocationSketch,
  type SketchId,
} from '../../../../lib/location/pressure';

export const runtime = 'nodejs';

const SKETCHES: SketchId[] = ['A', 'B', 'C'];

export async function GET(request: NextRequest) {
  const label = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!label) {
    return NextResponse.json({ error: 'Missing q (location label).' }, { status: 400 });
  }

  const selected = request.nextUrl.searchParams.get('sketch')?.trim().toUpperCase() as SketchId | null;
  const base = buildLocationPressure(label);
  const record =
    selected && SKETCHES.includes(selected) ? lockLocationSketch(base, selected) : base;

  const probable =
    record.selectedSketchId === null
      ? []
      : record.probableIfChosen[record.selectedSketchId];

  return NextResponse.json({
    pressure: record,
    weights: {
      definite: record.definite,
      probable,
      potential: record.potential,
    },
  });
}
