import { describe, expect, it } from 'vitest';
import { DarkCardSchema } from '../schema';

const card = {
  runId: 'dark-example',
  paragraph: 'A'.repeat(80),
  reveal: 'Reveal',
  pressure: 'Pressure',
  consequence: 'Consequence',
  release: 'Release',
  trigger: 'Trigger',
  pressurePoint: 'Pressure point',
  behavior: 'Behavior',
  collapse: 'Collapse',
  thrive: 'Thrive',
  costToThem: 'Cost to them',
  costToOthers: 'Cost to others',
  whatIsLost: 'What is lost',
  attachment: {
    howTheyAttach: 'How they attach',
    howTheySabotageLove: 'How they sabotage love',
    whatLoveFallsVictimTo: 'What love falls victim to',
    costToTheOtherPerson: 'Cost to the other person',
  },
};

describe('dark card wound coverage', () => {
  it('retains multiple separately sourced wounds', () => {
    const wounds = [
      { sourceSystemId: 'western', sourceFindingId: 'w1', wound: 'First', injury: 'First injury', darknessUnderneath: 'First root' },
      { sourceSystemId: 'vedic', sourceFindingId: 'v2', wound: 'Second', injury: 'Second injury', darknessUnderneath: 'Second root' },
    ];
    expect(DarkCardSchema.parse({ ...card, wounds }).wounds).toEqual(wounds);
  });

  it('rejects the old single-wound shape', () => {
    expect(DarkCardSchema.safeParse({ ...card, wound: 'One wound', injury: 'One injury', darknessUnderneath: 'One root' }).success).toBe(false);
  });
});
