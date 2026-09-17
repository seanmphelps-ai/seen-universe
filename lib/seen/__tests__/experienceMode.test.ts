import { describe, expect, it } from 'vitest';
import { resolveExperienceMode } from '../experienceMode';

describe('resolveExperienceMode', () => {
  it('routes one person into foundation', () => {
    expect(resolveExperienceMode({ mode: 'single_person' })).toEqual({
      mode: 'single_person',
      requiredPersonCount: 1,
      activePersonIndex: 0,
      next: 'person_a_foundation',
    });
  });

  it('routes two people into Closure', () => {
    expect(resolveExperienceMode({ mode: 'multi_person' })).toEqual({
      mode: 'multi_person',
      requiredPersonCount: 2,
      activePersonIndex: 0,
      next: 'closure_people',
    });
  });
});
