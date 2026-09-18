import { NextRequest, NextResponse } from 'next/server';
import {
  RectificationScenarioRequestSchema,
  RectificationScenarioResponseSchema,
} from '../../../../lib/rectification/schema';

export const runtime = 'nodejs';

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scenarios: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          scenario: { type: 'string' },
          reactions: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                candidateIndex: { type: 'integer', minimum: 0, maximum: 2 },
                reaction: { type: 'string' },
              },
              required: ['candidateIndex', 'reaction'],
            },
          },
        },
        required: ['scenario', 'reactions'],
      },
    },
  },
  required: ['scenarios'],
};

function compactChart(chart: unknown) {
  if (!chart || typeof chart !== 'object') return chart;
  const value = chart as Record<string, unknown>;
  return {
    planets: value.planets,
    ascendant: value.ascendant,
    midheaven: value.midheaven,
    houses: value.houses,
    aspects: value.aspects,
  };
}

export async function POST(request: NextRequest) {
  const parsed = RectificationScenarioRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid rectification request.' }, { status: 400 });
  }

  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!key) {
    return NextResponse.json(
      { error: 'LLM access is not configured for this deployment.' },
      { status: 503 },
    );
  }

  const candidates = parsed.data.candidates.map((candidate) => ({
    index: candidate.index,
    chart: compactChart(candidate.chart),
  }));

  const system = `You are the SEEN dark-chart writer. Compare three candidate Western charts for the SAME person. Write how they collapse under pressure.

Rules:
- Use the chart mechanics supplied AND the lived-stack years/places if present. Lived stack writes the sentence. It does not invent new planets.
- 1993 in a city is not 2026 in that city. Use the years.
- The user must NEVER see clocks, signs, houses, planet names, or astrology terms.
- Third person: "this person".
- Exactly 3 everyday pressure situations.
- For each situation, one reaction per candidate. Observable blow-up, freeze, lash, shutdown. Not compliments.
- No Jung. No diagnosis. No gift clause.
- candidateIndex 0, 1, or 2 only.
`;

  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.SEEN_RECTIFICATION_MODEL || 'openai/gpt-5.6-sol',
      stream: false,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: JSON.stringify({
            round: parsed.data.round + 1,
            livedStack: parsed.data.livedStack || '',
            candidates,
          }),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'seen_rectification_scenarios',
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    return NextResponse.json(
      { error: `Could not generate scenarios.${text ? ` ${text.slice(0, 240)}` : ''}` },
      { status: 502 },
    );
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'The LLM returned no scenario content.' }, { status: 502 });
  }

  let decoded: unknown;
  try {
    decoded = JSON.parse(content);
  } catch {
    return NextResponse.json({ error: 'The LLM returned invalid scenario JSON.' }, { status: 502 });
  }

  const validated = RectificationScenarioResponseSchema.safeParse(decoded);
  if (!validated.success) {
    return NextResponse.json({ error: 'The LLM response did not match the rectification schema.' }, { status: 502 });
  }

  return NextResponse.json(validated.data);
}
