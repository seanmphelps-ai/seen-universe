// PROVENANCE: bot=grok session=2026-10-24 task=rename environmental exposure engine to incubator
import { NextRequest, NextResponse } from 'next/server';
import {
  buildIncubatorPressure,
  lockIncubatorSketch,
  type SketchId,
} from '../../../../lib/incubator/pressure';

export const runtime = 'nodejs';

const SKETCHES: SketchId[] = ['A', 'B', 'C'];

export async function GET(request: NextRequest) {
  const label = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!label) {
    return NextResponse.json({ error: 'Missing q (incubator label).' }, { status: 400 });
  }

  const selected = request.nextUrl.searchParams.get('sketch')?.trim().toUpperCase() as SketchId | null;
  const base = buildIncubatorPressure(label);
  const record =
    selected && SKETCHES.includes(selected) ? lockIncubatorSketch(base, selected) : base;

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
