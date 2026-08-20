import { NextRequest, NextResponse } from 'next/server';
import {
  computeRuntimeEvidenceVector,
  fuseRuntimeVectors,
  type RuntimeVectorInput,
} from '../../../../../lib/location/v2/runtime';
import type { SourceFamily } from '../../../../../lib/location/v2/types';

export const runtime = 'nodejs';

type ScoreRequest = {
  inputs: RuntimeVectorInput[];
  expectedFamilies: SourceFamily[];
};

export async function POST(request: NextRequest) {
  let body: ScoreRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!Array.isArray(body?.inputs) || body.inputs.length === 0) {
    return NextResponse.json({ error: 'inputs must contain at least one source-family vector input.' }, { status: 400 });
  }

  if (!Array.isArray(body.expectedFamilies) || body.expectedFamilies.length === 0) {
    return NextResponse.json({ error: 'expectedFamilies must contain at least one source family.' }, { status: 400 });
  }

  try {
    const vectors = body.inputs.map(computeRuntimeEvidenceVector);
    const fusion = fuseRuntimeVectors(vectors, body.expectedFamilies);

    return NextResponse.json({ vectors, fusion });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Location V2 scoring failed.' },
      { status: 500 },
    );
  }
}
