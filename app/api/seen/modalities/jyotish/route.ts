import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';

export const runtime = 'nodejs';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to run Jyotish.' }, { status: 401 });

  return NextResponse.json({
    auditStatus: 'blocked',
    error: 'Jyotish delivery requires a server-verified source packet, calculated birth evidence, and an independent audit.',
  }, { status: 503 });
}
