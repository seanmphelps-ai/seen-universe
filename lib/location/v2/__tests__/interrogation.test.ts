import { describe, it, expect } from 'vitest';
import {
  ADAPTIVE_DEMAND_BOUNDARY,
  ALL_ENVIRONMENTAL_FORCES,
  CORRELATION_GROUPS,
  FORCE_REGISTRY,
  decorrelatedWeights,
  forceSourceCompetence,
  forcesWithoutMarkerCoverage,
  getCorrelationGroup,
  getForce,
  makeAdaptiveDemand,
  markersReferencedByForces,
  type EnvironmentalForce,
} from '../interrogation';
import { DIMENSIONS } from '../dimensions';
import { MARKER_REGISTRY } from '../registry';
import { familyCompetence } from '../competence';

describe('FORCE_REGISTRY canonical schema', () => {
  it('declares every required field on every force', () => {
    for (const spec of FORCE_REGISTRY) {
      expect(spec.definition.length, `${spec.force}.definition`).toBeGreaterThan(20);
      expect(spec.question.length, `${spec.force}.question`).toBeGreaterThan(10);
      expect(spec.observableSignals.length, `${spec.force}.observableSignals`).toBeGreaterThan(0);
      expect(spec.allowedEvidence.length, `${spec.force}.allowedEvidence`).toBeGreaterThan(0);
      expect(spec.disallowedEvidence.length, `${spec.force}.disallowedEvidence`).toBeGreaterThan(0);
      expect(spec.disallowedInference.length, `${spec.force}.disallowedInference`).toBeGreaterThan(0);
      expect(spec.geographicScope.length, `${spec.force}.geographicScope`).toBeGreaterThan(0);
      expect(spec.scoringDimensions.length, `${spec.force}.scoringDimensions`).toBeGreaterThan(0);
      expect(spec.normalization.baseline.length, `${spec.force}.normalization.baseline`).toBeGreaterThan(10);
      expect(spec.normalization.method.length, `${spec.force}.normalization.method`).toBeGreaterThan(10);
      expect(spec.output.length, `${spec.force}.output`).toBeGreaterThan(20);
      expect(spec.temporalRule.minimumWindowDays, `${spec.force}.minimumWindowDays`).toBeGreaterThan(0);
    }
  });

  it('has unique forces and a complete ALL_ENVIRONMENTAL_FORCES list', () => {
    const forces = FORCE_REGISTRY.map((f) => f.force);
    expect(new Set(forces).size).toBe(forces.length);
    expect(ALL_ENVIRONMENTAL_FORCES).toEqual(forces);
  });

  it('covers the full behavioral-environment ontology', () => {
    const required: EnvironmentalForce[] = [
      'REWARD', 'PUNISHMENT', 'STATUS', 'BELONGING', 'EXCLUSION', 'ASPIRATION', 'FEAR',
      'ATTENTION', 'NORM', 'SCARCITY', 'SPENDING_PRIORITY', 'SACRIFICE', 'TRUST', 'SAFETY',
      'INTIMACY', 'AUTHORITY', 'ACHIEVEMENT', 'FAILURE', 'RISK', 'OUTSIDER_TREATMENT',
      'MOBILITY', 'POSSIBILITY', 'REACHABLE_FUTURES', 'REQUIRED_CAPACITIES', 'ADAPTIVE_DEMAND',
    ];
    for (const force of required) {
      expect(ALL_ENVIRONMENTAL_FORCES, `missing force ${force}`).toContain(force);
    }
  });

  it('only cites dimensions that actually exist in the ten-dimension spec', () => {
    const validDimensions = new Set(DIMENSIONS.map((d) => d.id));
    for (const spec of FORCE_REGISTRY) {
      for (const dimension of spec.scoringDimensions) {
        expect(validDimensions.has(dimension), `${spec.force} cites unknown dimension ${dimension}`).toBe(true);
      }
    }
  });

  it('only cites markers that actually exist in the marker registry', () => {
    const validMarkers = new Set(MARKER_REGISTRY.map((m) => m.markerId));
    for (const markerId of markersReferencedByForces()) {
      expect(validMarkers.has(markerId), `unknown marker referenced: ${markerId}`).toBe(true);
    }
  });

  it('binds ATTENTION to DIG/AMP rather than PREV — asking the ruler for the right reading', () => {
    const attention = getForce('ATTENTION');
    expect(attention.scoringDimensions).toContain('DIG');
    expect(attention.scoringDimensions).toContain('AMP');
    expect(attention.scoringDimensions).not.toContain('PREV');
  });

  it('binds SAFETY to CONC so a citywide rate is never returned bare', () => {
    expect(getForce('SAFETY').scoringDimensions).toContain('CONC');
    expect(getForce('SAFETY').output).toMatch(/never returned without its CONC/i);
  });

  it('declares an explicit non-evaluative stance on INTIMACY', () => {
    const intimacy = getForce('INTIMACY');
    expect(intimacy.definition).toMatch(/non-evaluative/i);
    expect(intimacy.disallowedInference.some((d) => /better, healthier/.test(d))).toBe(true);
  });

  it('throws on an undeclared force rather than inventing semantics', () => {
    expect(() => getForce('NOT_A_FORCE' as EnvironmentalForce)).toThrow(/must be declared here/);
  });
});

describe('disallowed inference', () => {
  it('every force forbids concluding something about an individual resident', () => {
    for (const spec of FORCE_REGISTRY) {
      const forbidsIndividualClaim = spec.disallowedInference.some((rule) =>
        /\b(a resident|any resident|a specific person|individual)\b/i.test(rule),
      );
      expect(forbidsIndividualClaim, `${spec.force} does not forbid an individual-level conclusion`).toBe(true);
    }
  });

  it('keeps perceived possibility distinct from measured attainability', () => {
    expect(getForce('POSSIBILITY').disallowedInference.some((d) => /REACHABLE_FUTURES/.test(d))).toBe(true);
    expect(getForce('ASPIRATION').disallowedInference.some((d) => /REACHABLE_FUTURES/.test(d))).toBe(true);
  });

  it('keeps fear distinct from measured risk', () => {
    expect(getForce('FEAR').disallowedInference.some((d) => /proportionate to measured risk/i.test(d))).toBe(true);
  });

  it('forbids reading attention as prevalence', () => {
    expect(getForce('ATTENTION').disallowedInference.some((d) => /Attention and prevalence are separate/i.test(d))).toBe(true);
  });
});

describe('correlation groups', () => {
  it('every declared correlationGroup resolves to a real group', () => {
    for (const spec of FORCE_REGISTRY) {
      if (spec.correlationGroup === null) continue;
      expect(() => getCorrelationGroup(spec.correlationGroup!)).not.toThrow();
    }
  });

  it('group membership agrees with each force\'s own declaration', () => {
    for (const group of CORRELATION_GROUPS) {
      for (const member of group.members) {
        expect(getForce(member).correlationGroup, `${member} disagrees with group ${group.id}`).toBe(group.id);
      }
    }
  });

  it('has redundancy in [0,1] with a stated rationale', () => {
    for (const group of CORRELATION_GROUPS) {
      expect(group.redundancy).toBeGreaterThanOrEqual(0);
      expect(group.redundancy).toBeLessThanOrEqual(1);
      expect(group.rationale.length).toBeGreaterThan(30);
    }
  });
});

describe('decorrelatedWeights — the cross-force double-counting defense', () => {
  it('leaves independent forces at full weight', () => {
    // Both have correlationGroup null.
    const weights = decorrelatedWeights(['OUTSIDER_TREATMENT', 'MOBILITY']);
    expect(weights.every((w) => w.weight === 1)).toBe(true);
  });

  it('does not discount a single member of a group', () => {
    const weights = decorrelatedWeights(['SCARCITY']);
    expect(weights[0].weight).toBe(1);
  });

  it('discounts correlated forces so one phenomenon is not counted four times', () => {
    // All four are material_conditions, redundancy 0.7.
    const forces: EnvironmentalForce[] = ['EXCLUSION', 'SCARCITY', 'SPENDING_PRIORITY', 'SACRIFICE'];
    const weights = decorrelatedWeights(forces);
    const total = weights.reduce((acc, w) => acc + w.weight, 0);

    // Effective total = 1 + 3*(1-0.7) = 1.9, NOT 4.
    expect(total).toBeCloseTo(1.9, 12);
    expect(total).toBeLessThan(forces.length);
    // Equal share, so ordering cannot privilege any member.
    expect(new Set(weights.map((w) => w.weight)).size).toBe(1);
  });

  it('collapses a near-fully-redundant group toward a single count', () => {
    // adaptive group, redundancy 0.8 — ADAPTIVE_DEMAND is computed FROM REQUIRED_CAPACITIES.
    const weights = decorrelatedWeights(['REQUIRED_CAPACITIES', 'ADAPTIVE_DEMAND']);
    const total = weights.reduce((acc, w) => acc + w.weight, 0);
    expect(total).toBeCloseTo(1.2, 12); // 1 + 1*(1-0.8)
  });

  it('discounts each group independently rather than globally', () => {
    const weights = decorrelatedWeights(['SCARCITY', 'EXCLUSION', 'ATTENTION', 'NORM']);
    const material = weights.filter((w) => w.correlationGroup === 'material_conditions');
    const salience = weights.filter((w) => w.correlationGroup === 'salience');

    // material: 1 + 1*(1-0.7) = 1.3 ; salience: 1 + 1*(1-0.5) = 1.5
    expect(material.reduce((a, w) => a + w.weight, 0)).toBeCloseTo(1.3, 12);
    expect(salience.reduce((a, w) => a + w.weight, 0)).toBeCloseTo(1.5, 12);
  });

  it('never returns a total exceeding the naive count', () => {
    const weights = decorrelatedWeights(ALL_ENVIRONMENTAL_FORCES);
    const total = weights.reduce((acc, w) => acc + w.weight, 0);
    expect(total).toBeLessThan(ALL_ENVIRONMENTAL_FORCES.length);
    expect(weights).toHaveLength(ALL_ENVIRONMENTAL_FORCES.length);
  });

  it('is order-independent', () => {
    const a = decorrelatedWeights(['SCARCITY', 'EXCLUSION', 'SACRIFICE']);
    const b = decorrelatedWeights(['SACRIFICE', 'SCARCITY', 'EXCLUSION']);
    expect(a).toEqual(b);
  });
});

describe('forceSourceCompetence', () => {
  it('falls through to the global table when no override is declared', () => {
    expect(forceSourceCompetence('SAFETY', 'OFFICIAL_DATA', 'PREV')).toBe(
      familyCompetence('OFFICIAL_DATA', 'PREV'),
    );
  });

  it('applies a force-specific override where the force demands it', () => {
    // MARKETPLACE is weak for PREV globally but is a primary instrument for spending.
    const global = familyCompetence('MARKETPLACE', 'PREV');
    const forSpending = forceSourceCompetence('SPENDING_PRIORITY', 'MARKETPLACE', 'PREV');

    expect(forSpending).toBeGreaterThan(global);
    expect(forSpending).toBe(0.8);
  });

  it('does not leak an override into other forces', () => {
    expect(forceSourceCompetence('SAFETY', 'MARKETPLACE', 'PREV')).toBe(
      familyCompetence('MARKETPLACE', 'PREV'),
    );
  });
});

describe('the handoff boundary', () => {
  it('stamps every adaptive demand as environment-scoped with the boundary attached', () => {
    const demand = makeAdaptiveDemand({
      demandId: 'd1',
      demand: 'This environment may require sustained situational monitoring in public space.',
      derivedFromForces: ['SAFETY', 'REQUIRED_CAPACITIES'],
      candidateCapacity: 'May train rapid threat detection.',
      candidateCost: 'May make unguarded rest harder to access.',
    });

    expect(demand.scope).toBe('ENVIRONMENT');
    expect(demand.notAClaimAbout).toBe(ADAPTIVE_DEMAND_BOUNDARY);
    expect(demand.notAClaimAbout).toMatch(/not a finding about any individual/i);
  });

  it('always carries capacity and cost together', () => {
    const demand = makeAdaptiveDemand({
      demandId: 'd2',
      demand: 'This environment may reward visible self-reliance.',
      derivedFromForces: ['REWARD'],
      candidateCapacity: 'May train independent problem-solving.',
      candidateCost: 'May make asking for help costlier.',
    });
    expect(demand.candidateCapacity.length).toBeGreaterThan(0);
    expect(demand.candidateCost.length).toBeGreaterThan(0);
  });

  it('declares ADAPTIVE_DEMAND as the terminal force that concludes nothing about a person', () => {
    const terminal = getForce('ADAPTIVE_DEMAND');
    expect(terminal.disallowedInference[0]).toMatch(/where Location stops and hands off/i);
    expect(terminal.output).toMatch(/later SEEN systems/i);
  });
});

describe('declared coverage gaps', () => {
  it('reports forces with no backing marker rather than hiding them', () => {
    const gaps = forcesWithoutMarkerCoverage();
    // These are real, known gaps in the instrument as it stands.
    expect(gaps).toContain('OUTSIDER_TREATMENT');
    expect(gaps).toContain('MOBILITY');
  });

  it('keeps the gap list honest — every listed force really has no markers', () => {
    for (const force of forcesWithoutMarkerCoverage()) {
      expect(getForce(force).evidencedByMarkers).toHaveLength(0);
    }
  });
});
