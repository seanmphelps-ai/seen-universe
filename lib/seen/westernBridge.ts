// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { z } from 'zod';
import type { NatalChartResult } from '../natalChart';
import {
  ArchetypeIdSchema,
  IdentifyingArchetypePenetrationRunSchema,
  SourceLayerStateSchema,
  type IdentifyingArchetypePenetrationRun,
} from './identifyingArchetypePenetration';

export const WESTERN_SOURCE_SYSTEM_ID = 'western_astrology';

const LIFE_SECTION_COUNT = 45;
const IDENTIFYING_ARCHETYPE_COUNT = 64;
const COMPLETE_ARCHETYPE_IDS = Array.from({ length: IDENTIFYING_ARCHETYPE_COUNT }, (_, index) => index + 1);
const COMPLETE_LIFE_SECTION_IDS = Array.from(
  { length: LIFE_SECTION_COUNT },
  (_, index) => index + 1,
);

export const WesternIdentifyingArchetypePenetrationRunSchema = IdentifyingArchetypePenetrationRunSchema.superRefine(
  (run, context) => {
    if (!sameOrderedIds(run.layers.map((layer) => layer.archetypeId), COMPLETE_ARCHETYPE_IDS)) {
      context.addIssue({
        code: 'custom',
        path: ['layers'],
        message: 'Western penetration must contain each identifying archetype ID 1-64 exactly once in order.',
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
  archetypeIds: z.array(ArchetypeIdSchema).length(IDENTIFYING_ARCHETYPE_COUNT),
  layerRefs: z.array(z.string().min(1)).length(IDENTIFYING_ARCHETYPE_COUNT),
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
    sourceIdentifyingArchetypeCount: z.literal(IDENTIFYING_ARCHETYPE_COUNT),
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
        || !sameOrderedIds(route.archetypeIds, COMPLETE_ARCHETYPE_IDS)
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

export type WesternIdentifyingArchetypeBridge = {
  western: NatalChartResult;
  identifyingArchetypePenetration: IdentifyingArchetypePenetrationRun;
  lifeSectionRouting: WesternLifeSectionRoutingOutput;
};

type WesternIdentifyingArchetypeBridgeOptions = {
  sourceFieldId: string;
  layerSequence: number;
};

export function buildWesternIdentifyingArchetypeBridge(
  western: NatalChartResult,
  options: WesternIdentifyingArchetypeBridgeOptions,
): WesternIdentifyingArchetypeBridge {
  const sourceFieldId = options.sourceFieldId.trim();
  if (!sourceFieldId) throw new Error('Western sourceFieldId is required.');
  if (!Number.isInteger(options.layerSequence) || options.layerSequence < 0) {
    throw new Error('Western layerSequence must be a non-negative integer.');
  }

  const chartSummary = summarizeChart(western);
  const confidence = western.hasBirthTime ? 1 : 0.75;
  const mappingGap =
    'Identifying archetype activation awaits canonical identifying-archetype-specific Western interpretation criteria.';

  const identifyingArchetypePenetration = WesternIdentifyingArchetypePenetrationRunSchema.parse({
    schemaVersion: '1.0.0',
    sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
    sourceFieldId,
    sourceRunCompletedIndependently: true,
    penetrateCompleteIdentifyingArchetypeLattice: true,
    identifyingArchetypeCount: IDENTIFYING_ARCHETYPE_COUNT,
    layers: Array.from({ length: IDENTIFYING_ARCHETYPE_COUNT }, (_, index) => {
      const archetypeId = index + 1;
      return {
        sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
        sourceFieldId,
        archetypeId,
        layerSequence: options.layerSequence,
        state: 'insufficient_signal' as const,
        evidence: [
          {
            evidenceId: `${sourceFieldId}:portal:${archetypeId}:western-source-presence`,
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

  const archetypeIds = identifyingArchetypePenetration.layers.map((layer) => layer.archetypeId);
  const layerRefs = identifyingArchetypePenetration.layers.map(
    (layer) => `${layer.sourceFieldId}:portal:${layer.archetypeId}:layer:${layer.layerSequence}`,
  );
  const contradictionRefs = Array.from(
    new Set(identifyingArchetypePenetration.layers.flatMap((layer) => layer.contradictionRefs)),
  );
  const state = aggregateColumnState(identifyingArchetypePenetration);

  const lifeSectionRouting = WesternLifeSectionRoutingOutputSchema.parse({
    schemaVersion: '1.0.0',
    sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
    sourceFieldId,
    sourceIdentifyingArchetypeCount: IDENTIFYING_ARCHETYPE_COUNT,
    sectionCount: LIFE_SECTION_COUNT,
    sourceColumnValidated: true,
    routedImmediately: true,
    routes: Array.from({ length: LIFE_SECTION_COUNT }, (_, index) => ({
      sourceSystemId: WESTERN_SOURCE_SYSTEM_ID,
      sourceFieldId,
      lifeSectionId: index + 1,
      archetypeIds,
      layerRefs,
      state,
      contradictionRefs,
      sourceIdentityPreserved: true,
      persistent: true,
      replaceExistingLayers: false,
    })),
  });

  return { western, identifyingArchetypePenetration, lifeSectionRouting };
}

function summarizeChart(western: NatalChartResult): string {
  const timedStructures = western.hasBirthTime
    ? `${western.houses?.length ?? 0} houses plus Ascendant and Midheaven`
    : 'houses and angles await a known birth time';

  return [
    `Swiss Ephemeris Western natal result for ${western.planets.length} planets`,
    `${western.aspects.length} major aspects`,
    timedStructures,
  ].join('; ');
}

function aggregateColumnState(
  identifyingArchetypePenetration: IdentifyingArchetypePenetrationRun,
): z.infer<typeof SourceLayerStateSchema> {
  if (identifyingArchetypePenetration.layers.some((layer) => layer.state === 'contradictory')) {
    return 'contradictory';
  }
  if (identifyingArchetypePenetration.layers.some((layer) => layer.state === 'layered')) {
    return 'layered';
  }
  if (identifyingArchetypePenetration.layers.some((layer) => layer.state === 'insufficient_signal')) {
    return 'insufficient_signal';
  }
  return 'no_applicable_signal';
}

function sameOrderedIds(actual: number[], expected: number[]): boolean {
  return actual.length === expected.length && actual.every((id, index) => id === expected[index]);
}
