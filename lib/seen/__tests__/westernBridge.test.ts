import { describe, expect, it } from 'vitest';
import type { NatalChartResult } from '../../natalChart';
import { PortalPenetrationRunSchema } from '../portalPenetration';
import {
  WESTERN_SOURCE_SYSTEM_ID,
  WesternLifeSectionRoutingOutputSchema,
  WesternPortalPenetrationRunSchema,
  buildWesternPortalBridge,
} from '../westernBridge';

const timedChart: NatalChartResult = {
  name: 'Test Person',
  hasBirthTime: true,
  timezone: 'America/Denver',
  planets: [
    {
      key: 'sun',
      label: 'Sun',
      sign: 'Leo',
      degreeInSign: 8.5,
      longitude: 128.5,
      house: 10,
      retrograde: false,
    },
  ],
  ascendant: { label: 'Ascendant', sign: 'Libra', degreeInSign: 2, longitude: 182 },
  midheaven: { label: 'Midheaven', sign: 'Cancer', degreeInSign: 4, longitude: 94 },
  houses: Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    sign: 'Aries',
    degreeInSign: index,
    longitude: index * 30,
  })),
  aspects: [{ point1: 'Sun', point2: 'Moon', aspect: 'Trine', orb: 1.25 }],
};

describe('buildWesternPortalBridge', () => {
  it('validates exactly one persistent Western layer in every portal', () => {
    const result = buildWesternPortalBridge(timedChart, {
      sourceFieldId: 'western-field-1',
      layerSequence: 1,
    });

    expect(() => PortalPenetrationRunSchema.parse(result.portalPenetration)).not.toThrow();
    expect(result.portalPenetration.layers).toHaveLength(64);
    expect(result.portalPenetration.layers.map((layer) => layer.portalId)).toEqual(
      Array.from({ length: 64 }, (_, index) => index + 1),
    );
    expect(result.portalPenetration.layers.every((layer) => (
      layer.sourceSystemId === WESTERN_SOURCE_SYSTEM_ID
      && layer.sourceIdentityPreserved
      && layer.persistent
      && !layer.replaceExistingLayers
    ))).toBe(true);
  });

  it('routes the validated complete column into all 45 Life Section IDs', () => {
    const result = buildWesternPortalBridge(timedChart, {
      sourceFieldId: 'western-field-2',
      layerSequence: 1,
    });

    expect(() => WesternLifeSectionRoutingOutputSchema.parse(result.lifeSectionRouting)).not.toThrow();
    expect(result.lifeSectionRouting.routes).toHaveLength(45);
    expect(result.lifeSectionRouting.routes.map((route) => route.lifeSectionId)).toEqual(
      Array.from({ length: 45 }, (_, index) => index + 1),
    );
    expect(result.lifeSectionRouting.routes.every((route) => (
      route.portalIds.length === 64 && route.layerRefs.length === 64
    ))).toBe(true);
  });

  it('preserves unknown-time limits instead of inventing houses or angles', () => {
    const result = buildWesternPortalBridge(
      {
        ...timedChart,
        hasBirthTime: false,
        ascendant: null,
        midheaven: null,
        houses: null,
      },
      { sourceFieldId: 'western-field-3', layerSequence: 1 },
    );

    expect(result.portalPenetration.layers[0].evidence[0].confidence).toBe(0.75);
    expect(result.portalPenetration.layers[0].evidence[0].summary).toContain(
      'no houses or angles because birth time is unknown',
    );
  });

  it('rejects an incomplete canonical portal column', () => {
    const result = buildWesternPortalBridge(timedChart, {
      sourceFieldId: 'western-field-4',
      layerSequence: 1,
    });
    const incomplete = {
      ...result.portalPenetration,
      layers: result.portalPenetration.layers.slice(0, 63),
    };

    expect(() => PortalPenetrationRunSchema.parse(incomplete)).toThrow();
  });

  it('rejects a 64-record column that duplicates a portal ID', () => {
    const result = buildWesternPortalBridge(timedChart, {
      sourceFieldId: 'western-field-5',
      layerSequence: 1,
    });
    const duplicated = {
      ...result.portalPenetration,
      layers: result.portalPenetration.layers.map((layer, index) => (
        index === 63 ? { ...layer, portalId: 63 } : layer
      )),
    };

    expect(() => WesternPortalPenetrationRunSchema.parse(duplicated)).toThrow();
  });
});
