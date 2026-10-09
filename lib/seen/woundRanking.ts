// PROVENANCE: bot=grok session=2026-10-08 task=fix aspect field mismatch that failed the Vercel build
/**
 * Authored wound ranking table.
 *
 * Trigger layer is computational. This layer is interpretive.
 * Ranking inputs: orb tightness, body weight, house, aspect hardness, cluster.
 */

export type WoundRank = 1 | 2 | 3 | 4 | 5;

export type StrengthFactor = {
  orbTightness: number;
  bodyWeight: number;
  houseWeight: number;
  aspectHardness: number;
  clusterBonus: number;
}

export type RankedWound = {
  markerId: string;
  label: string;
  rank: WoundRank;
  signature: string;
  cost: string;
  repeatPattern: string;
  strength: StrengthFactor;
  totalScore: number;
}

export type RankingAspect = {
  point1: string;
  point2: string;
  aspect: string;
  orb: number;
}

const BODY_WEIGHT: Record<string, number> = {
  sun: 1.0,
  moon: 1.0,
  mercury: 0.7,
  venus: 0.7,
  mars: 0.7,
  jupiter: 0.5,
  saturn: 0.5,
  uranus: 0.3,
  neptune: 0.3,
  pluto: 0.3,
  chiron: 0.8,
  trueLilith: 0.6,
}

const HOUSE_WEIGHT: Record<number, number> = {
  1: 1.0, 4: 1.0, 7: 1.0, 10: 1.0,
  2: 0.6, 5: 0.6, 8: 0.6, 11: 0.6,
  3: 0.3, 6: 0.3, 9: 0.3, 12: 0.3,
}

const ASPECT_HARDNESS: Record<string, number> = {
  conjunction: 1.0,
  square: 1.0,
  opposition: 1.0,
  trine: 0.4,
  sextile: 0.4,
}

const POINT_TO_ID: Record<string, string> = {
  sun: 'sun',
  moon: 'moon',
  mercury: 'mercury',
  venus: 'venus',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
  pluto: 'pluto',
  chiron: 'chiron',
  lilith: 'trueLilith',
  'black moon lilith': 'trueLilith',
}

const CLUSTERS: { markers: string[]; bonus: number; signature: string }[] = [
  {
    markers: ['chiron', 'trueLilith'],
    bonus: 0.3,
    signature: 'The wound and the exile rage fire together. Shame and suppressed anger feed each other.',
  },
  {
    markers: ['chiron', 'saturn'],
    bonus: 0.25,
    signature: 'The wound meets the fear structure. Shame becomes a rule the person lives by.',
  },
  {
    markers: ['mars', 'pluto'],
    bonus: 0.3,
    signature: 'Rage meets power distortion. Explosive control or explosive surrender.',
  },
  {
    markers: ['venus', 'neptune'],
    bonus: 0.25,
    signature: 'Attachment meets dissolution. Idealizing then losing the person or the bond.',
  },
  {
    markers: ['uranus', 'mars'],
    bonus: 0.25,
    signature: 'Shock meets rage. Sudden break, sudden explosion, no warning.',
  },
  {
    markers: ['chiron', 'venus'],
    bonus: 0.25,
    signature: 'The wound lives in love. Every bond reopens the original hurt.',
  },
  {
    markers: ['saturn', 'pluto'],
    bonus: 0.3,
    signature: 'Fear structure meets power distortion. Control as survival, collapse as the price.',
  },
]

const SIGNATURES: Record<string, { signature: string; cost: string; repeatPattern: string; label: string }> = {
  chiron: {
    label: 'Chiron',
    signature: 'The wound that does not close. Shame, inadequacy, feeling broken in a way that cannot be fixed. It reopens under pressure, and the person tries to heal it by performing the wound publicly.',
    cost: 'Chronic self-attack. The person becomes their own worst critic and cannot stop.',
    repeatPattern: 'Repeats the story of being broken to anyone who will listen, then feels drained and unseen.',
  },
  trueLilith: {
    label: 'True Lilith',
    signature: 'The exiled instinct. Rage that was never allowed to exist, so it leaks sideways: passive aggression, sudden explosions, or total shutdown. It fires when the person feels controlled or unseen.',
    cost: 'The person cannot express anger directly, so it comes out distorted or not at all.',
    repeatPattern: 'Builds resentment silently, then erupts or withdraws completely.',
  },
  neptune: {
    label: 'Neptune',
    signature: 'The fog. Self-undoing, dissolution, losing the thread of who you are. It fires when the person escapes into fantasy, substances, or another person instead of facing reality.',
    cost: 'The person cannot hold a clear sense of self under pressure.',
    repeatPattern: 'Escapes, then returns to find everything worse.',
  },
  mars: {
    label: 'Mars',
    signature: 'The severing force. Compulsive action, rage, cutting things off. It fires when the person feels blocked or threatened and responds with force instead of patience.',
    cost: 'The person burns bridges and relationships with impulsive action.',
    repeatPattern: 'Explodes, regrets, withdraws, then repeats.',
  },
  venus: {
    label: 'Venus',
    signature: 'The relational wound. Attachment, sabotage, love as battlefield. It fires when the person needs proof of love and punishes the missing proof.',
    cost: 'Every bond carries the original hurt. The person cannot trust closeness without control.',
    repeatPattern: 'Moves close, needs proof, punishes absence, withdraws, calls it honesty.',
  },
  saturn: {
    label: 'Saturn',
    signature: 'The fear structure. Contraction, delay, the rule that says you are not enough. It fires when the person faces responsibility and freezes or overworks.',
    cost: 'The person lives under a self-imposed sentence of inadequacy.',
    repeatPattern: 'Proves worth through exhaustion, then collapses.',
  },
  pluto: {
    label: 'Pluto',
    signature: 'The power distortion. Compulsion, control, collapse. It fires when the person feels powerless and grabs for control or surrenders completely.',
    cost: 'The person cannot tolerate vulnerability, so they either dominate or disappear.',
    repeatPattern: 'Controls, loses, rebuilds the same structure, loses again.',
  },
  uranus: {
    label: 'Uranus',
    signature: 'The shock. Sudden upheaval, rebellion, breaking free without warning. It fires when the person feels trapped and explodes outward.',
    cost: 'The person cannot tolerate stagnation, so they destroy what is stable.',
    repeatPattern: 'Breaks free, feels lost, rebuilds, breaks again.',
  },
}

function pointId(label: string): string {
  return POINT_TO_ID[label.toLowerCase()] ?? label.toLowerCase();
}

export function rankWounds(
  hits: { id: string; sign: string; degree: number; house: number | null; qualities: string[] }[],
  aspects: RankingAspect[] = [],
): RankedWound[] {
  const ranked: RankedWound[] = [];

  for (const hit of hits) {
    const sig = SIGNATURES[hit.id];
    if (!sig) continue;

    const relevantAspects = aspects.filter(
      (aspect) => pointId(aspect.point1) === hit.id || pointId(aspect.point2) === hit.id,
    );
    const tightestOrb = relevantAspects.length > 0
      ? Math.min(...relevantAspects.map((aspect) => aspect.orb))
      : 8;
    const orbTightness = Math.max(0, 1 - tightestOrb / 8);
    const aspectType = relevantAspects.length > 0 ? relevantAspects[0].aspect.toLowerCase() : 'none';
    const aspectHardness = ASPECT_HARDNESS[aspectType] ?? 0.5;
    const bodyWeight = BODY_WEIGHT[hit.id] ?? 0.5;
    const houseWeight = hit.house !== null ? (HOUSE_WEIGHT[hit.house] ?? 0.5) : 0.5;

    let clusterBonus = 0;
    let clusterSignature = '';
    for (const cluster of CLUSTERS) {
      if (!cluster.markers.includes(hit.id)) continue;
      const otherMarkers = cluster.markers.filter((marker) => marker !== hit.id);
      if (otherMarkers.some((marker) => hits.some((candidate) => candidate.id === marker))) {
        clusterBonus = Math.max(clusterBonus, cluster.bonus);
        clusterSignature = cluster.signature;
      }
    }

    const strength: StrengthFactor = {
      orbTightness,
      bodyWeight,
      houseWeight,
      aspectHardness,
      clusterBonus,
    };
    const totalScore = Math.min(
      1,
      orbTightness * 0.25 +
        bodyWeight * 0.25 +
        houseWeight * 0.15 +
        aspectHardness * 0.15 +
        clusterBonus * 0.2,
    );
    const rank: WoundRank = totalScore >= 0.75 ? 1 : totalScore >= 0.6 ? 2 : totalScore >= 0.45 ? 3 : totalScore >= 0.3 ? 4 : 5;

    ranked.push({
      markerId: hit.id,
      label: sig.label,
      rank,
      signature: clusterSignature || sig.signature,
      cost: sig.cost,
      repeatPattern: sig.repeatPattern,
      strength,
      totalScore,
    });
  }

  return ranked.sort((a, b) => b.totalScore - a.totalScore);
}
