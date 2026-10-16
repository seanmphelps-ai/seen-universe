import { NextRequest, NextResponse } from 'next/server';
import { runChiefPipeline } from '../../../../agent/agent';
import type { NativeCalcInput } from '../../../../lib/agents/execution';
import { INTERROGATORS } from '../../../../lib/seen/interrogators';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let input: NativeCalcInput;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (
    !input?.name ||
    !input.birthDate ||
    typeof input.latitude !== 'number' ||
    typeof input.longitude !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Required: name, birthDate, latitude, longitude.' },
      { status: 400 },
    );
  }

  try {
    const result = await runChiefPipeline(input);
    const cards = result.archetypes
      .filter((portal) => portal.active)
      .map((portal) => {
        const archetype = INTERROGATORS.find((i) => i.portalId === portal.portalId)?.archetype;
        const questions = archetype?.interrogation.flatMap((section) => section.questions) ?? [];
        return { title: portal.name, deepText: questions.join(' ') };
      });
    return NextResponse.json({ ...result, cards });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chief pipeline failed.' },
      { status: 500 },
    );
  }
}
