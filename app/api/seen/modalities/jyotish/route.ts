import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '../../../../../lib/supabase/server';

export const runtime = 'nodejs';

const FindingSchema = z.object({
  id: z.string().min(1),
  sourceRef: z.string().min(1),
  technique: z.string().min(1),
  calculatedState: z.string().min(1),
  traditionalInterpretation: z.string().min(1),
});

const RequestSchema = z.object({
  school: z.string().min(1),
  sourcePacketId: z.string().min(1),
  findings: z.array(FindingSchema).min(1).max(100),
});

const ResponseSchema = z.object({
  readings: z.array(z.object({ id: z.string(), reading: z.string().min(1) })),
});

const RESPONSE_FORMAT = {
  type: 'json_schema',
  json_schema: {
    name: 'seen_jyotish_reading',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        readings: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: { id: { type: 'string' }, reading: { type: 'string' } },
            required: ['id', 'reading'],
          },
        },
      },
      required: ['readings'],
    },
  },
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to run Jyotish.' }, { status: 401 });

  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || new Set(parsed.data.findings.map((finding) => finding.id)).size !== parsed.data.findings.length) {
    return NextResponse.json({ error: 'Invalid Jyotish evidence.' }, { status: 400 });
  }

  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!key) {
    return NextResponse.json({ error: 'Jyotish agent is not configured.' }, { status: 503 });
  }

  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.SEEN_JYOTISH_MODEL || 'openai/gpt-5.6-sol',
      stream: false,
      messages: [
        { role: 'system', content: 'You are the Jyotish modality reader. Work within the supplied school and source packet only. Return one reading for every supplied finding, using its exact ID. Express only its supplied calculated state and traditional interpretation in plain language. Preserve favorable and difficult findings independently. Do not calculate missing values, add a technique, combine schools, select a core wound, or infer personal facts.' },
        { role: 'user', content: JSON.stringify(parsed.data) },
      ],
      response_format: RESPONSE_FORMAT,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Jyotish agent failed.' }, { status: 502 });
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  let decoded: unknown;
  try {
    decoded = JSON.parse(content);
  } catch {
    return NextResponse.json({ error: 'Jyotish agent returned invalid JSON.' }, { status: 502 });
  }

  const result = ResponseSchema.safeParse(decoded);
  const inputIds = new Set(parsed.data.findings.map((finding) => finding.id));
  if (!result.success || result.data.readings.length !== inputIds.size ||
      new Set(result.data.readings.map((reading) => reading.id)).size !== inputIds.size ||
      result.data.readings.some((reading) => !inputIds.has(reading.id))) {
    return NextResponse.json({ error: 'Jyotish agent omitted or changed a finding.' }, { status: 502 });
  }

  const byId = new Map(result.data.readings.map((reading) => [reading.id, reading.reading]));
  return NextResponse.json({
    school: parsed.data.school,
    sourcePacketId: parsed.data.sourcePacketId,
    auditStatus: 'pending_independent_audit',
    readings: parsed.data.findings.map((finding) => ({
      ...finding,
      reading: byId.get(finding.id),
    })),
  });
}
