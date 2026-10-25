import { describe, it, expect } from 'vitest';
import { MARKER_REGISTRY, allSeenMappings, getMarker } from '../registry';

describe('MARKER_REGISTRY', () => {
  it('declares every required field on every marker — the registry rule', () => {
    for (const marker of MARKER_REGISTRY) {
      expect(marker.markerId, 'markerId').toBeTruthy();
      expect(marker.label, `${marker.markerId}.label`).toBeTruthy();
      expect(['event', 'ambient']).toContain(marker.unit);
      expect(['population', 'local_content', 'active_accounts', 'places', 'none']).toContain(
        marker.denominator,
      );
      expect(['PRESSURE', 'SUPPORT', 'NEUTRAL']).toContain(marker.polarity);
      expect(marker.exclusions.length, `${marker.markerId}.exclusions`).toBeGreaterThan(0);
      expect(marker.severityRubric.length, `${marker.markerId}.severityRubric`).toBeGreaterThan(0);
      expect(marker.seenMappings.length, `${marker.markerId}.seenMappings`).toBeGreaterThan(0);
    }
  });

  it('has unique marker ids', () => {
    const ids = MARKER_REGISTRY.map((m) => m.markerId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps every severity rubric value inside [0,1] and strictly ascending', () => {
    for (const marker of MARKER_REGISTRY) {
      const values = marker.severityRubric.map((level) => level.value);
      for (const value of values) {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
      const ascending = [...values].sort((a, b) => a - b);
      expect(values).toEqual(ascending);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('gives every rubric level a definition, not just a label', () => {
    for (const marker of MARKER_REGISTRY) {
      for (const level of marker.severityRubric) {
        expect(level.label, `${marker.markerId} rubric label`).toBeTruthy();
        expect(level.definition.length, `${marker.markerId} rubric definition`).toBeGreaterThan(10);
      }
    }
  });

  it('tracks abundance as well as deprivation, so both tails are examinable', () => {
    const polarities = new Set(MARKER_REGISTRY.map((m) => m.polarity));
    expect(polarities.has('PRESSURE')).toBe(true);
    expect(polarities.has('SUPPORT')).toBe(true);
  });

  it('uses a content denominator for markers measured from local content', () => {
    const contentMarkers = MARKER_REGISTRY.filter((m) => m.denominator === 'local_content');
    expect(contentMarkers.length).toBeGreaterThan(0);
    for (const marker of contentMarkers) {
      expect(marker.unit).toBe('ambient');
    }
  });
});

describe('getMarker', () => {
  it('returns a declared marker', () => {
    expect(getMarker('violent_incident').unit).toBe('event');
  });

  it('throws on an undeclared marker rather than inventing a default', () => {
    expect(() => getMarker('not_a_marker')).toThrow(/must be declared in the registry/);
  });
});

describe('allSeenMappings', () => {
  it('returns the sorted distinct set of downstream surfaces', () => {
    const mappings = allSeenMappings();
    expect(mappings.length).toBeGreaterThan(0);
    expect([...mappings].sort()).toEqual(mappings);
    expect(new Set(mappings).size).toBe(mappings.length);
  });
});
