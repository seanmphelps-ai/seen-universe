'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

export async function createPerson(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const name = String(formData.get('name') ?? '').trim();
  const birthDate = String(formData.get('birthDate') ?? '');
  const birthTime = String(formData.get('birthTime') ?? '') || null;
  const birthLocation = String(formData.get('birthLocation') ?? '').trim();
  if (!name || !birthDate || !birthLocation) return;

  const { error } = await supabase.from('people').insert({
    owner_id: user.id,
    name,
    birth_date: birthDate,
    birth_time: birthTime,
    birth_location: birthLocation,
  });
  if (error) throw error;
  revalidatePath('/account');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth');
}
