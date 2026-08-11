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

export async function GET() {
  const field = await buildLocationField(TEST_INPUT);
  const success = field.adapterFailures.length === 0 && field.unknownConditions.length === 0;

  return NextResponse.json(
    {
      verificationStatus: success ? 'PASSED' : 'FAILED',
      field,
    },
    { status: success ? 200 : 500 },
  );
}
