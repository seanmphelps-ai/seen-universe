// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { NextResponse } from 'next/server';
import { suggestCities } from '../../../../lib/location/citySuggest';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  const suggestions = suggestCities(query);

  return NextResponse.json({ suggestions });
}
