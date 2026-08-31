import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '../../../lib/supabase/server';

const SavePersonSchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.iso.date(),
  birthTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  birthLocation: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  westernChart: z.record(z.string(), z.unknown()),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to read saved people.' }, { status: 401 });

  const { data, error } = await supabase
    .from('people')
    .select('id,name,birth_date,birth_time,birth_location,western_charts(id)')
    .eq('owner_id', user.id)
    .order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ people: data ?? [] });
}

export async function POST(request: Request) {
  const parsed = SavePersonSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid saved-person payload.' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to save this person.' }, { status: 401 });

  const input = parsed.data;
  const { data: person, error: personError } = await supabase
    .from('people')
    .upsert({
      owner_id: user.id,
      name: input.name,
      birth_date: input.birthDate,
      birth_time: input.birthTime,
      birth_location: input.birthLocation,
      birth_latitude: input.latitude,
      birth_longitude: input.longitude,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'owner_id,name,birth_date' })
    .select('id')
    .single();
  if (personError) return NextResponse.json({ error: personError.message }, { status: 500 });

  const { data: chart, error: chartError } = await supabase
    .from('western_charts')
    .upsert({
      owner_id: user.id,
      person_id: person.id,
      chart: input.westernChart,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'person_id' })
    .select('id')
    .single();
  if (chartError) return NextResponse.json({ error: chartError.message }, { status: 500 });

  return NextResponse.json({ personId: person.id, chartId: chart.id, saved: true });
}
