// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL
    && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KE,
  );
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KE;

  if (!url || !key) {
    throw new Error('Supabase project credentials require configuration.');
  }

  return { url, key };
}
