import { z } from 'zod';
import type { NatalChartResult } from '../natalChart';
import {
  PortalIdSchema,
  PortalPenetrationRunSchema,
  SourceLayerStateSchema,
  type PortalPenetrationRun,
} from './portalPenetration';

export const WESTERN_SOURCE_SYSTEM_ID = 'western_astrology';

const LIFE_SECTION_COUNT = 45;
const PORTAL_COUNT = 64;
const COMPLETE_PORTAL_IDS = Array.from({ length: PORTAL_COUNT }, (_, index) => index + 1);
const COMPLETE_LIFE_SECTION_IDS = Array.from(
  { length: LIFE_SECTION_COUNT },
  (_, index) => index + 1,
);

export const WesternPortalPenetrationRunSchema = PortalPenetrationRunSchema.superRefine(
  (run, context) => {
    if (!sameOrderedIds(run.layers.map((layer) => layer.portalId), COMPLETE_PORTAL_IDS)) {
      context.addIssue({
        code: 'custom',
        path: ['layers'],
        message: 'Western penetration must contain each portal ID 1-64 exactly once in order.',
      });
    }

    if (run.sourceSystemId !== WESTERN_SOURCE_SYSTEM_ID) {
      context.addIssue({
        code: 'custom',
        path: ['sourceSystemId'],
        message: `Western sourceSystemId must be ${WESTERN_SOURCE_SYSTEM_ID}.`,
      });
    }

    run.layers.forEach((layer, index) => {
      if (
        layer.sourceSystemId !== run.sourceSystemId
        || layer.sourceFieldId !== run.sourceFieldId
      ) {
        context.addIssue({
          code: 'custom',
          path: ['layers', index],
          message: 'Layer source identity must match its penetration run.',
        });
      }
    });
  },
);

export const WesternLifeSectionRouteSchema = z.object({
  sourceSystemId: z.literal(WESTERN_SOURCE_SYSTEM_ID),
  sourceFieldId: z.string().min(1),
  lifeSectionId: z.number().int().min(1).max(LIFE_SECTION_COUNT),
  portalIds: z.array(PortalIdSchema).length(PORTAL_COUNT),
  layerRefs: z.array(z.string().min(1)).length(PORTAL_COUNT),
  state: SourceLayerStateSchema,
  contradictionRefs: z.array(z.string().min(1)),
  sourceIdentityPreserved: z.literal(true),
  persistent: z.literal(true),
  replaceExistingLayers: z.literal(false),
});

export const WesternLifeSectionRoutingOutputSchema = z
  .object({
    schemaVersion: z.literal('1.0.0'),
    sourceSystemId: z.literal(WESTERN_SOURCE_SYSTEM_ID),
    sourceFieldId: z.string().min(1),
    sourcePortalCount: z.literal(PORTAL_COUNT),
    sectionCount: z.literal(LIFE_SECTION_COUNT),
    sourceColumnValidated: z.literal(true),
    routedImmediately: z.literal(true),
    routes: z.array(WesternLifeSectionRouteSchema).length(LIFE_SECTION_COUNT),
  })
  .superRefine((routing, context) => {
    if (!sameOrderedIds(routing.routes.map((route) => route.lifeSectionId), COMPLETE_LIFE_SECTION_IDS)) {
      context.addIssue({
        code: 'custom',
        path: ['routes'],
        message: 'Western routing must contain each Life Section ID 1-45 exactly once in order.',
      });
    }

    routing.routes.forEach((route, index) => {
      if (
        route.sourceFieldId !== routing.sourceFieldId
        || !sameOrderedIds(route.portalIds, COMPLETE_PORTAL_IDS)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['routes', index],
          message: 'Each Life Section route must preserve the complete validated source column.',
        });
      }
    });
  });

export type WesternLifeSectionRoutingOutput = z.infer<
  typeof WesternLifeSectionRoutingOutputSchema
>;

export type WesternPortalBridge = {
  western: NatalChartResult;
  portalPenetration: PortalPenetrationRun;
  lifeSectionRouting: WesternLifeSectionRoutingOutput;
};

type WesternPortalBridgeOptions = {
  sourceFieldId: string;
  layerSequence: number;
};

export function buildWesternPortalBridge(
  western: NatalChartResult,
  options: WesternPortalBridgeOptions,
): WesternPortalBridge {
  const sourceFieldId = options.sourceFieldId.trim();
  if (!sourceFieldId) throw new Error('Western sourceFieldId is required.');
  if (!Number.isInteger(options.layerSequence) || options.layerSequence < 0) {
    throw new Error('Western layerSequence must be a non-negative integer.');
  }

  const chartSummary = summarizeChart(western);
  const confidence = western.hasBirthTime ? 1 : 0.75;
  const mappingGap =
    'Canonical portal-specific Western interpretation criteria are not present; no portal activation claim emitted.';

  const portalPenetration = WesternPortalPenetrationRunSchema.parse({
    schemaVersion: '1.0.0',
    sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
    sourceFieldId,
    sourceRunCompletedIndependently: true,
    penetrateCompletePortalLattice: true,
    portalCount: PORTAL_COUNT,
    layers: Array.from({ length: PORTAL_COUNT }, (_, index) => {
      const portalId = index + 1;
      return {
        sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
        sourceFieldId,
        portalId,
        layerSequence: options.layerSequence,
        state: 'insufficient_signal' as const,
        evidence: [
          {
            evidenceId: `${sourceFieldId}:portal:${portalId}:western-source-presence`,
            sourceReference: 'NatalChartResult',
            summary: chartSummary,
            confidence,
            provenance: [
              'seen-universe/lib/natalChart.ts',
              'swisseph-wasm:SEFLG_SWIEPH',
              `timezone:${western.timezone}`,
            ],
          },
        ],
        contradictionRefs: [],
        convergenceNotes: [mappingGap],
        sourceIdentityPreserved: true,
        persistent: true,
        replaceExistingLayers: false,
      };
    }),
    laterSourcesMayReadExistingLayers: true,
    laterSourcesMayOverwriteExistingLayers: false,
    preserveSourceIdentityUntilConvergence: true,
    earlySynthesisForbidden: true,
    earlyNarrationForbidden: true,
  });

  const portalIds = portalPenetration.layers.map((layer) => layer.portalId);
  const layerRefs = portalPenetration.layers.map(
    (layer) => `${layer.sourceFieldId}:portal:${layer.portalId}:layer:${layer.layerSequence}`,
  );
  const contradictionRefs = Array.from(
    new Set(portalPenetration.layers.flatMap((layer) => layer.contradictionRefs)),
  );
  const state = aggregateColumnState(portalPenetration);

  const lifeSectionRouting = WesternLifeSectionRoutingOutputSchema.parse({
    schemaVersion: '1.0.0',
    sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
    sourceFieldId,
    sourcePortalCount: PORTAL_COUNT,
    sectionCount: LIFE_SECTION_COUNT,
    sourceColumnValidated: true,
    routedImmediately: true,
    routes: Array.from({ length: LIFE_SECTION_COUNT }, (_, index) => ({
      sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
      sourceFieldId,
      lifeSectionId: index + 1,
      portalIds,
      layerRefs,
      state,
      contradictionRefs,
      sourceIdentityPreserved: true,
      persistent: true,
      replaceExistingLayers: false,
    })),
  });

  return { western, portalPenetration, lifeSectionRouting };
}

function summarizeChart(western: NatalChartResult): string {
  const timedStructures = western.hasBirthTime
    ? `${western.houses?.length ?? 0} houses plus Ascendant and Midheaven`
    : 'no houses or angles because birth time is unknown';

  return [
    `Swiss Ephemeris Western natal result for ${western.planets.length} planets`,
    `${western.aspects.length} major aspects`,
    timedStructures,
  ].join('; ');
}

function aggregateColumnState(
  portalPenetration: PortalPenetrationRun,
): z.infer<typeof SourceLayerStateSchema> {
  if (portalPenetration.layers.some((layer) => layer.state === 'contradictory')) {
    return 'contradictory';
  }
  if (portalPenetration.layers.some((layer) => layer.state === 'layered')) {
    return 'layered';
  }
  if (portalPenetration.layers.some((layer) => layer.state === 'insufficient_signal')) {
    return 'insufficient_signal';
  }
  return 'no_applicable_signal';
}

function sameOrderedIds(actual: number[], expected: number[]): boolean {
  return actual.length === expected.length && actual.every((id, index) => id === expected[index]);
}
