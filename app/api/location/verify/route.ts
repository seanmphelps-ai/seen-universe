// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { NextResponse } from 'next/server';
import { buildLocationField } from '../../../../lib/location/buildLocationField';
import type { LocationInput } from '../../../../lib/location/types';


export const runtime = 'nodejs';

const TEST_INPUT: LocationInput = {
  label: 'Los Angeles, CA (fixed live-verification location)',
  latitude: 34.0522,
  longitude: -118.2437,
  exposureStart: '2018-01-01',
  exposureEnd: '2022-12-31',
  role: 'LIVED',
};

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
