/**
 * 64-portal I Ching spine. Modalities never declare a Portal off.
 */

export type PortalExpression = {
  portalId: number;
  name: string;
  expression: 'visible' | 'pressurized' | 'sensitized' | 'distorted' | 'recurrent';
  note: string;
};

export const PORTAL_64_NAMES: string[] = [
  "The Creative",  // 1
  "The Receptive",  // 2
  "Difficulty at the Beginning",  // 3
  "Youthful Folly",  // 4
  "Waiting",  // 5
  "Conflict",  // 6
  "The Army",  // 7
  "Holding Together",  // 8
  "Small Taming",  // 9
  "Treading",  // 10
  "Peace",  // 11
  "Standstill",  // 12
  "Fellowship",  // 13
  "Great Possession",  // 14
  "Modesty",  // 15
  "Enthusiasm",  // 16
  "Following",  // 17
  "Work on the Decayed",  // 18
  "Approach",  // 19
  "Contemplation",  // 20
  "Biting Through",  // 21
  "Grace",  // 22
  "Splitting Apart",  // 23
  "Return",  // 24
  "Innocence",  // 25
  "Great Taming",  // 26
  "Nourishment",  // 27
  "Great Excess",  // 28
  "The Abysmal",  // 29
  "The Clinging",  // 30
  "Influence",  // 31
  "Duration",  // 32
  "Retreat",  // 33
  "Great Power",  // 34
  "Progress",  // 35
  "Darkening of the Light",  // 36
  "The Family",  // 37
  "Opposition",  // 38
  "Obstruction",  // 39
  "Deliverance",  // 40
  "Decrease",  // 41
  "Increase",  // 42
  "Breakthrough",  // 43
  "Coming to Meet",  // 44
  "Gathering",  // 45
  "Pushing Upward",  // 46
  "Oppression",  // 47
  "The Well",  // 48
  "Revolution",  // 49
  "The Cauldron",  // 50
  "The Arousing",  // 51
  "Keeping Still",  // 52
  "Development",  // 53
  "The Marrying Maiden",  // 54
  "Abundance",  // 55
  "The Wanderer",  // 56
  "The Gentle",  // 57
  "The Joyous",  // 58
  "Dispersion",  // 59
  "Limitation",  // 60
  "Inner Truth",  // 61
  "Small Excess",  // 62
  "After Completion",  // 63
  "Before Completion",  // 64
];

export function expressPortals(woundCount: number, amplification: number): PortalExpression[] {
  const out: PortalExpression[] = [];
  for (let i = 0; i < 64; i++) {
    const portalId = i + 1;
    // Early imprinting portals (1–14) carry birth-struggle weight when pressure is high
    const early = portalId <= 14;
    const score = amplification + (early ? 0.15 : 0) + Math.min(0.2, woundCount * 0.02);
    const expression =
      score >= 0.75 ? 'recurrent' :
      score >= 0.55 ? 'pressurized' :
      score >= 0.35 ? 'sensitized' :
      score >= 0.2 ? 'distorted' : 'visible';
    out.push({
      portalId,
      name: PORTAL_64_NAMES[i],
      expression,
      note: 'Portal remains available; expression changes with pressure. Never inactive.',
    });
  }
  return out;
}
