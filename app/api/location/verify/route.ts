import { NextResponse } from 'next/server';
import { buildLocationField } from '../../../../lib/location/buildLocationField';
import type { LocationInput } from '../../../../lib/location/types';

// Deployment-verification endpoint only — exercises the unmodified
// lib/location/buildLocationField against a fixed test location, run from
// inside whatever runtime this route is deployed to (Cloudflare Workers,
// via nodejs_compat + fetch). Same fixed input as
// scripts/verify-location-live.ts, which cannot run inside a Worker at all
// (it needs tsx/Node). No mock data; a failed adapter reports UNKNOWN with
// its real reason, same as the standalone script.

export const runtime = 'nodejs';

const TEST_INPUT: LocationInput = {
  label: 'Los Angeles, CA (fixed live-verification location)',
  latitude: 34.0522,
  longitude: -118.2437,
  exposureStart: '2018-01-01',
  exposureEnd: '2022-12-31',
  role: 'LIVED',
};

// Reports whether an env var is actually reaching this running deployment,
// without exposing the real value — added specifically to distinguish "the
// Vercel env var isn't wired to Production" from "it's wired correctly but
// the key itself is rejected by the upstream API". Never logs or returns
// the full value.
function maskKey(value: string | undefined): { present: boolean; length: number; masked: string | null } {
  if (!value) return { present: false, length: 0, masked: null };
  const trimmed = value.trim();
  const masked =
    trimmed.length > 8 ? `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}` : '*'.repeat(trimmed.length);
  return { present: true, length: trimmed.length, masked };
}

export async function GET() {
  const field = await buildLocationField(TEST_INPUT);
  const success = field.adapterFailures.length === 0 && field.unknownConditions.length === 0;

  return NextResponse.json(
    {
      verificationStatus: success ? 'PASSED' : 'FAILED',
      keyDiagnostics: {
        CENSUS_API_KEY: maskKey(process.env.CENSUS_API_KEY),
        BLS_API_KEY: maskKey(process.env.BLS_API_KEY),
      },
      field,
    },
    { status: success ? 200 : 500 },
  );
}
