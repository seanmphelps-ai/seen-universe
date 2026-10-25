import type { PersistenceEstimate, PersistenceRegime } from './dimensions';
import { fuseComponent, fuseVectors, type FusedComponent } from './fuse';
import {
  computePersistence,
  type TemporalExtentInput,
} from './persistence';
import type {
  EvidenceVector,
  ResponseFrame,
  SourceFamily,
} from './types';
import {
  computeEvidenceVector,
  type VectorInputs,
} from './vector';

export type RuntimeVectorInput = {
  vector: VectorInputs;
  frames?: (ResponseFrame | null)[];
  temporalExtents?: TemporalExtentInput[];
  persistenceRegime?: PersistenceRegime | null;
};

export type RuntimeEvidenceVector = EvidenceVector & {
  persist: PersistenceEstimate | null;
};

export type RuntimeFusion = {
  components: Record<string, FusedComponent>;
  persistence: {
    activeFraction: FusedComponent;
    perFamily: {
      sourceFamily: SourceFamily;
      estimate: PersistenceEstimate | null;
    }[];
  };
};

export function computeRuntimeEvidenceVector(
  input: RuntimeVectorInput,
): RuntimeEvidenceVector {
  const vector = computeEvidenceVector(input.vector, input.frames ?? []);
  const persist = computePersistence({
    windowStart: input.vector.key.windowStart,
    windowEnd: input.vector.key.windowEnd,
    extents: input.temporalExtents ?? [],
    regime: input.persistenceRegime,
  });

  return {
    ...vector,
    persist,
  };
}

export function fuseRuntimeVectors(
  vectors: RuntimeEvidenceVector[],
  expectedFamilies: SourceFamily[],
): RuntimeFusion {
  const components = fuseVectors(vectors, expectedFamilies);

  const activeFraction = fuseComponent(
    'persistActiveFraction',
    'PERSIST',
    vectors.map((vector) => ({
      sourceFamily: vector.sourceFamily,
      value: vector.persist?.activeFraction ?? null,
    })),
    expectedFamilies,
  );

  return {
    components,
    persistence: {
      activeFraction,
      perFamily: vectors.map((vector) => ({
        sourceFamily: vector.sourceFamily,
        estimate: vector.persist,
      })),
    },
  };
}
