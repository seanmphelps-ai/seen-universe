import { describe, it, expect } from 'vitest';
import {
  ENVIRONMENTAL_QUESTIONS,
  INFERENCE_CHAIN,
  InferenceLanguageError,
  InsufficientSupportError,
  MINIMUM_SUPPORTING_SOURCES,
  RULES_VERSION,
  assertPermittedLanguage,
  pressureDirectionLabel,
  renderInference,
  type InferenceDraft,
  type InferenceStage,
} from '../inference';
import type { ConfidenceReport } from '../types';

const confidence: ConfidenceReport = {
  components: {
    effectiveEvidence: 0.5,
    sourceFamilyCoverage: 0.5,
    geographicPrecision: 0.6,
    timeCoverage: 0.8,
    classifierCalibration: 0.7,
    authenticity: 0.9,
    provenanceCompleteness: 0.8,
  },
  familiesPresent: ['OFFICIAL_DATA', 'LOCAL_NEWS'],
  familiesMissing: ['SOCIAL_PUBLIC'],
  score: 61,
  capApplied: 65,
  band: 'MEDIUM',
  evidenceIndependence: null,
  notes: [],
};

function chain(overrides: Partial<Record<InferenceStage, string>> = {}): Record<InferenceStage, string> {
  return {
    ENVIRONMENT:
      'Measured: violent-incident rate 2.4 per 10k residents per 30 days, 61% above the state comparator.',
    PRESSURE_REWARD: 'Sustained exposure at this level may reward constant threat monitoring.',
    TRIGGER: 'Evidence suggests unpredictable public incidents act as the recurring trigger.',
    ADAPTATION: 'Persistent situational scanning appears normalized as an everyday adaptation.',
    BEHAVIOR_BELIEF: 'Evidence suggests this tends to train a belief that safety must be self-managed.',
    CAPACITY: 'This may train fast threat detection and decisive action under pressure.',
    COST: 'The same vigilance may make rest and unguarded trust harder to access.',
    CONSEQUENCE: 'Evidence suggests elevated baseline alertness tends to persist after leaving.',
    ...overrides,
  };
}

function draft(overrides: Partial<InferenceDraft> = {}): InferenceDraft {
  return {
    inferenceId: 'inf-1',
    markerId: 'violent_incident',
    locationId: 'loc-1',
    chain: chain(),
    capacity: 'This environment may train rapid threat detection and decisive action.',
    cost: 'That same adaptation may make it harder to rest or to trust without scanning first.',
    supporting: [
      { observationId: 'o1', sourceUrl: 'https://example.test/1', provider: 'p', excerpt: 'a' },
      { observationId: 'o2', sourceUrl: 'https://example.test/2', provider: 'p', excerpt: 'b' },
      { observationId: 'o3', sourceUrl: 'https://example.test/3', provider: 'p', excerpt: 'c' },
    ],
    counterevidence: {
      observations: [],
      statement: 'No counterevidence found in OFFICIAL_DATA or LOCAL_NEWS for this window.',
    },
    confidence,
    ...overrides,
  };
}

describe('assertPermittedLanguage', () => {
  it('accepts hedged environmental language', () => {
    expect(() =>
      assertPermittedLanguage('This environment may reward visible self-reliance.', 'test'),
    ).not.toThrow();
  });

  it.each([
    'Residents are hypervigilant.',
    'This place makes you distrustful.',
    'Their outcome is fated by this county.',
    'Growing up here guarantees scarcity thinking.',
    'People here are more aggressive.',
  ])('rejects deterministic phrasing: %s', (text) => {
    expect(() => assertPermittedLanguage(text, 'test')).toThrow(InferenceLanguageError);
  });

  it('rejects an unhedged claim even when no forbidden phrase appears', () => {
    expect(() => assertPermittedLanguage('This environment trains distrust.', 'test')).toThrow(
      /no permitted hedge/,
    );
  });

  it('is case-insensitive about forbidden phrasing', () => {
    expect(() => assertPermittedLanguage('RESIDENTS ARE tough, evidence suggests.', 'test')).toThrow(
      InferenceLanguageError,
    );
  });
});

describe('renderInference', () => {
  it('renders a well-formed draft and stamps the rules version', () => {
    const inference = renderInference(draft());
    expect(inference.rulesVersion).toBe(RULES_VERSION);
    expect(inference.capacity).toBeTruthy();
    expect(inference.cost).toBeTruthy();
  });

  it('withholds an inference cited by fewer than the minimum sources', () => {
    const thin = draft({
      supporting: [
        { observationId: 'o1', sourceUrl: null, provider: 'p', excerpt: 'a' },
        { observationId: 'o2', sourceUrl: null, provider: 'p', excerpt: 'b' },
      ],
    });
    expect(() => renderInference(thin)).toThrow(InsufficientSupportError);
    expect(MINIMUM_SUPPORTING_SOURCES).toBe(3);
  });

  it('counts DISTINCT observations, so one source repeated three times is not enough', () => {
    const repeated = draft({
      supporting: [
        { observationId: 'same', sourceUrl: null, provider: 'p', excerpt: 'a' },
        { observationId: 'same', sourceUrl: null, provider: 'p', excerpt: 'b' },
        { observationId: 'same', sourceUrl: null, provider: 'p', excerpt: 'c' },
      ],
    });
    expect(() => renderInference(repeated)).toThrow(InsufficientSupportError);
  });

  it('requires a counterevidence statement — silence is not acceptable', () => {
    const silent = draft({ counterevidence: { observations: [], statement: '   ' } });
    expect(() => renderInference(silent)).toThrow(/counterevidence/i);
  });

  it('accepts an explicit "none found" counterevidence statement', () => {
    expect(() => renderInference(draft())).not.toThrow();
  });

  it('rejects a deterministic claim anywhere in the chain', () => {
    const bad = draft({ chain: chain({ CAPACITY: 'Residents are simply tougher here.' }) });
    expect(() => renderInference(bad)).toThrow(InferenceLanguageError);
  });

  it('rejects a deterministic capacity or cost line', () => {
    expect(() => renderInference(draft({ cost: 'This place makes you unable to rest.' }))).toThrow(
      InferenceLanguageError,
    );
  });

  it('requires every stage of the canonical chain', () => {
    const partial = draft({ chain: chain({ CONSEQUENCE: '' }) });
    expect(() => renderInference(partial)).toThrow(/missing chain stage CONSEQUENCE/);
  });

  it('exempts the ENVIRONMENT stage from hedging — it reports measurement, not inference', () => {
    const measured = draft({
      chain: chain({ ENVIRONMENT: 'Measured: poverty rate 22.4%, ACS 5-year 2018-2022.' }),
    });
    expect(() => renderInference(measured)).not.toThrow();
  });

  it('emits capacity and cost together, never one alone', () => {
    const inference = renderInference(draft());
    expect(inference.capacity.length).toBeGreaterThan(0);
    expect(inference.cost.length).toBeGreaterThan(0);
  });
});

describe('INFERENCE_CHAIN', () => {
  it('is the canonical eight-stage chain in order', () => {
    expect(INFERENCE_CHAIN).toEqual([
      'ENVIRONMENT',
      'PRESSURE_REWARD',
      'TRIGGER',
      'ADAPTATION',
      'BEHAVIOR_BELIEF',
      'CAPACITY',
      'COST',
      'CONSEQUENCE',
    ]);
  });
});

describe('ENVIRONMENTAL_QUESTIONS', () => {
  it('has unique ids', () => {
    const ids = ENVIRONMENTAL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('maps every question to a real chain stage', () => {
    for (const question of ENVIRONMENTAL_QUESTIONS) {
      expect(INFERENCE_CHAIN).toContain(question.stage);
    }
  });

  it('covers both what is rewarded and what becomes a liability elsewhere', () => {
    const ids = ENVIRONMENTAL_QUESTIONS.map((q) => q.id);
    expect(ids).toContain('rewarded');
    expect(ids).toContain('portable_liabilities');
  });
});

describe('pressureDirectionLabel', () => {
  it('reads abundance as a condition in its own right, not as absence of pressure', () => {
    expect(pressureDirectionLabel('SUPPORT', 90)).toMatch(/abundant/);
    expect(pressureDirectionLabel('SUPPORT', 10)).toMatch(/scarce/);
  });

  it('reads both tails of a pressure marker', () => {
    expect(pressureDirectionLabel('PRESSURE', 90)).toMatch(/elevated pressure/);
    expect(pressureDirectionLabel('PRESSURE', 10)).toMatch(/low pressure/);
  });

  it('reports mid-range values as near baseline', () => {
    expect(pressureDirectionLabel('PRESSURE', 50)).toMatch(/near the comparison baseline/);
  });
});
