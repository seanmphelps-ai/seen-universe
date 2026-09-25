export type TimeClass = '04:00' | '12:00' | '20:00' | string;

export type PortalAsk = {
  id: 'trigger' | 'pressure' | 'show' | 'defend' | 'react' | 'cost_self' | 'cost_other' | 'lost';
  ask: string;
};

const ASKS: PortalAsk[] = [
  { id: 'trigger', ask: 'What hits first and makes this person move before they think?' },
  { id: 'pressure', ask: 'Where does the room get tight for them?' },
  { id: 'show', ask: 'How does it show on the body and in the room?' },
  { id: 'defend', ask: 'How do they defend when that hit lands?' },
  { id: 'react', ask: 'What is the next move — blow, freeze, coil, erase?' },
  { id: 'cost_self', ask: 'What does that move cost them by morning?' },
  { id: 'cost_other', ask: 'What does the other person pay?' },
  { id: 'lost', ask: 'What is gone if this runs one more cycle in this place?' },
];

export function questionsForClock(_clock: TimeClass): PortalAsk[] {
  return ASKS;
}

export const DARK_CARD_ASK_SYSTEM = `You are the SEEN portal examiner.
Do not write a universal paragraph.
Do not reuse stock copy across people.
Answer ONLY these asks, in this person's lived places and years.
1993 Los Angeles is not 2026 Whitefish. Bali December is not Bali February.
Third person. No planet names, houses, clocks, signs on the face.
Each answer is one to two spoken sentences. If two people would get the same sentence, rewrite.
`;
