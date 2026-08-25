import { NextRequest, NextResponse } from 'next/server';
import {
  evaluateValuesUnderPressure,
  type ValuesIntegrityObservation,
} from '../../../../lib/seen/valuesIntegrity';

export async function POST(request: NextRequest) {
  let input: ValuesIntegrityObservation;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    return NextResponse.json(evaluateValuesUnderPressure(input));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Values integrity evaluation failed.' },
      { status: 400 },
    );
  }
}
