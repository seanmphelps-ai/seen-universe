import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
const RequestSchema = z.object({ messages: z.array(z.object({
  role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(4000),
})).min(1).max(20) });

export async function POST(request: NextRequest) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!key) return NextResponse.json({ error: 'SEEN chat is not configured.' }, { status: 503 });
  const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.SEEN_INTRODUCTION_MODEL || 'openai/gpt-5.6-sol', stream: false, max_tokens: 180,
      messages: [
        { role: 'system', content: 'You are the opening listener for SEEN. Help a person begin telling their own story. Ask one brief, humane, concrete follow-up at a time. Reflect their language without diagnosing, interpreting, flattering, moralizing, or claiming to know them. Never mention astrology. Keep every response under 45 words.' },
        ...parsed.data.messages,
      ],
    }),
  });
  if (!response.ok) return NextResponse.json({ error: 'SEEN could not respond.' }, { status: 502 });
  const body = await response.json();
  const message = body?.choices?.[0]?.message?.content;
  if (typeof message !== 'string' || !message.trim()) return NextResponse.json({ error: 'Empty response.' }, { status: 502 });
  return NextResponse.json({ message: message.trim() });
}
