import { describe, expect, it } from 'vitest';
import { evaluateValuesUnderPressure } from '../valuesIntegrity';

describe('evaluateValuesUnderPressure', () => {
  it('surfaces the gap between a stated value and an exception under pressure', () => {
    const result = evaluateValuesUnderPressure({
      statedValue: 'being a good person',
      behavior: 'makes exceptions when the value becomes costly',
      inconvenience: 'the value conflicts with convenience or self-interest',
      exception: 'the rule becomes inconvenient',
    });

    expect(result.preservedUnderPressure).toBe(false);
    expect(result.contradiction).toContain('makes an exception');
    expect(result.reflection).toContain(
      'What happens to this value when keeping it becomes inconvenient?',
    );
  });

  it('does not invent a contradiction when no exception is supplied', () => {
    const result = evaluateValuesUnderPressure({
      statedValue: 'compassion',
      behavior: 'acts compassionately when it costs time',
      inconvenience: 'helping takes extra time',
    });

    expect(result.preservedUnderPressure).toBe(true);
    expect(result.contradiction).toBeNull();
  });
});
