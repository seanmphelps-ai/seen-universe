import { NextRequest, NextResponse } from 'next/server';
import { calculateNatalChart, type NatalChartInput } from '../../../../lib/natalChart';
import { buildLocationField } from '../../../../lib/location/buildLocationField';
import type { LocationInput } from '../../../../lib/location/types';
import { createHash } from 'node:crypto';
import { buildWesternPortalBridge } from '../../../../lib/seen/westernBridge';
import {
  computeRuntimeEvidenceVector,
  fuseRuntimeVectors,
} from '../../../../lib/location/v2/runtime';
import {
  officialFieldToV2Inputs,
  missingProductFamilies,
  PRODUCT_SOURCE_FAMILIES,
} from '../../../../lib/location/v2/fromOfficialField';
import { ALL_FORGED_INTERROGATIONS } from '../../../../lib/location/v2/forged';

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
    const officialFields = await Promise.all(
      input.locations.map((location) => buildLocationField(location)),
    );

    const locationV2 = officialFields.map((field) => {
      const officialInputs = officialFieldToV2Inputs(field);
      const vectors = officialInputs.map(computeRuntimeEvidenceVector);
      const fusion = fuseRuntimeVectors(vectors, PRODUCT_SOURCE_FAMILIES);
      const collectedFamilies = ['OFFICIAL_DATA'] as const;

      return {
        input: field.input,
        officialField: field,
        collectedFamilies,
        missingFamilies: missingProductFamilies([...collectedFamilies]),
        socialCollection: 'NOT_COLLECTED',
        vectors,
        fusion,
        forgedInterrogations: ALL_FORGED_INTERROGATIONS,
      };
    });

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
      locations: officialFields,
      locationV2,
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
