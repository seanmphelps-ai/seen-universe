import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { calculateNatalChart, type NatalChartInput } from '../../../../lib/natalChart';
import { buildLocationField } from '../../../../lib/location/buildLocationField';
import type { LocationInput } from '../../../../lib/location/types';
import { redditForumProvider } from '../../../../lib/location/collectors/redditForum';
import { buildWesternPortalBridge } from '../../../../lib/seen/westernBridge';
import { runEnvironmentalWitness } from '../../../../lib/location/v2/environmentalWitness';
import {
  computeRuntimeEvidenceVector,
  fuseRuntimeVectors,
} from '../../../../lib/location/v2/runtime';
import {
  officialFieldToV2Inputs,
  missingProductFamilies,
  PRODUCT_SOURCE_FAMILIES,
} from '../../../../lib/location/v2/fromOfficialField';
import { observationsToRuntimeInputs } from '../../../../lib/location/v2/observationsToRuntime';
import type { SourceFamily } from '../../../../lib/location/v2/types';

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

    const locationV2 = await Promise.all(
      officialFields.map(async (field) => {
        const locationId = `${field.input.role}:${field.input.latitude},${field.input.longitude}`;
        const windowStart = field.input.exposureStart;
        const windowEnd = field.input.exposureEnd ?? new Date().toISOString().slice(0, 10);

        const witness = await runEnvironmentalWitness(
          {
            locationId,
            location: field.input.label,
            windowStart,
            windowEnd,
          },
          [redditForumProvider],
        );

        const officialInputs = officialFieldToV2Inputs(field);
        const collectedInputs = observationsToRuntimeInputs(
          witness.observations,
          locationId,
          windowStart,
          windowEnd,
        );
        const vectors = [...officialInputs, ...collectedInputs].map(computeRuntimeEvidenceVector);
        const collectedFamilies: SourceFamily[] = ['OFFICIAL_DATA', ...witness.familiesPresent];
        const uniqueFamilies: SourceFamily[] = [...new Set<SourceFamily>(collectedFamilies)];

        return {
          input: field.input,
          officialField: field,
          witness: {
            observationCount: witness.observations.length,
            discoveries: witness.discoveries,
            familiesPresent: witness.familiesPresent,
            providerFailures: witness.providerFailures,
            sample: witness.observations.slice(0, 20).map((item) => ({
              observationId: item.observationId,
              sourceUrl: item.sourceUrl,
              publishedAt: item.publishedAt,
              markerIds: item.markerIds,
              provider: item.provider,
              matchedGeography: item.matchedGeography,
            })),
          },
          collectedFamilies: uniqueFamilies,
          missingFamilies: missingProductFamilies(uniqueFamilies),
          vectors,
          fusion: fuseRuntimeVectors(vectors, PRODUCT_SOURCE_FAMILIES),
        };
      }),
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
