import { NextRequest, NextResponse } from 'next/server';
import { calculateNatalChart, type NatalChartInput } from '../../../../lib/natalChart';
import { buildLocationField } from '../../../../lib/location/buildLocationField';
import type { LocationInput } from '../../../../lib/location/types';
import { createHash } from 'node:crypto';
import { buildWesternPortalBridge } from '../../../../lib/seen/westernBridge';

export const runtime = 'nodejs';

type SeenRunRequest = {
  chart: NatalChartInput;
  locations: LocationInput[];
};

export async function POST(request: NextRequest) {
  let input: SeenRunRequest;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (
    !input?.chart?.name ||
    !input.chart.birthDate ||
    typeof input.chart.latitude !== 'number' ||
    typeof input.chart.longitude !== 'number'
  ) {
    return NextResponse.json({ error: 'Missing required Western chart fields.' }, { status: 400 });
  }

  if (!Array.isArray(input.locations) || input.locations.length === 0) {
    return NextResponse.json({ error: 'At least one Location input is required.' }, { status: 400 });
  }

  try {
    // Canonical runtime remains environment-first. Western is first only in
    // adapter development order, and occupies the next persistent layer.
    const locations = await Promise.all(
      input.locations.map((location) => buildLocationField(location)),
    );
    const western = await calculateNatalChart(input.chart);
    const sourceFieldId = `western-natal:${createHash('sha256')
      .update(JSON.stringify(input.chart))
      .digest('hex')
      .slice(0, 16)}`;
    const westernBridge = buildWesternPortalBridge(western, {
      sourceFieldId,
      layerSequence: 1,
    });

    return NextResponse.json({
      locations,
      western: westernBridge.western,
      westernPortalPenetration: westernBridge.portalPenetration,
      westernLifeSectionRouting: westernBridge.lifeSectionRouting,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'SEEN runtime failed.' },
      { status: 500 },
    );
  }
}
