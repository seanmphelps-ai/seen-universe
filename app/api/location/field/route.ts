// PROVENANCE: bot=grok session=2026-10-24 task=rename environmental exposure engine to incubator
import { NextRequest, NextResponse } from 'next/server';
import { buildIncubatorField } from '../../../../lib/incubator/buildIncubatorField';
import { suggestCities } from '../../../../lib/incubator/citySuggest';
import type { IncubatorInput, IncubatorRole } from '../../../../lib/incubator/types';

export const runtime = 'nodejs';

const ROLES: IncubatorRole[] = ['BIRTH', 'LIVED', 'CURRENT'];

function parseCoordinate(value: string | null): number | null {
  if (value === null || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveCity(query: string) {
  const cityName = query.split(',')[0]?.trim();
  if (!cityName) return null;

  const candidates = suggestCities(cityName, 50);
  const normalizedQuery = query.trim().toLowerCase();

  return (
    candidates.find((candidate) => candidate.label.toLowerCase() === normalizedQuery) ??
    candidates.find((candidate) => candidate.city.toLowerCase() === cityName.toLowerCase()) ??
    null
  );
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const label = params.get('q')?.trim() ?? '';
  const exposureStart = params.get('start')?.trim() ?? '';
  const exposureEnd = params.get('end')?.trim() || null;
  const requestedRole = (params.get('role')?.trim().toUpperCase() || 'LIVED') as IncubatorRole;

  if (!label) {
    return NextResponse.json({ error: 'Missing q (incubator label).' }, { status: 400 });
  }
  if (!exposureStart) {
    return NextResponse.json({ error: 'Missing start (YYYY-MM-DD).' }, { status: 400 });
  }
  if (!ROLES.includes(requestedRole)) {
    return NextResponse.json({ error: 'role must be BIRTH, LIVED, or CURRENT.' }, { status: 400 });
  }

  let latitude = parseCoordinate(params.get('lat'));
  let longitude = parseCoordinate(params.get('lon'));
  let resolvedCity = null;

  if (latitude === null || longitude === null) {
    resolvedCity = resolveCity(label);
    if (!resolvedCity) {
      return NextResponse.json(
        { error: `Could not resolve "${label}" from the bundled city index.` },
        { status: 400 },
      );
    }
    latitude = resolvedCity.latitude;
    longitude = resolvedCity.longitude;
  }

  const input: IncubatorInput = {
    label,
    latitude,
    longitude,
    exposureStart,
    exposureEnd,
    role: requestedRole,
  };

  const field = await buildIncubatorField(input);

  return NextResponse.json({
    resolvedCity,
    field,
  });
}
