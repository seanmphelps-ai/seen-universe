/**
 * Authored wound ranking table.
 *
 * This is authored content, not computed. The ephemeris engine computes
 * positions and aspects; this table decides which wound markers surface
 * and how loud they are when they do.
 *
 * Provenance: authored by the system author. Not sourced from Ptolemy,
 * Lilly, Reinhart, or any external text. The trigger layer
 * (woundMarkers.ts) is computational; this layer is interpretive.
 *
 * Ranking inputs:
 *   - orb tightness (tighter = louder)
 *   - body weight (Sun/Moon > personal planets > outers)
 *   - house placement (angular > succedent > cadent)
 *   - aspect type (hard > soft)
 *   - marker combination (cluster = louder)
 *
 * Output: a ranked list of wound markers with a rank (1-5) and a
 * plain-language signature for each.
 */

export type WoundRank = 1 | 2 | 3 | 4 | 5;

export type StrengthFactor = {
  orbTightness: number;   // 0-1, 1 = exact
  bodyWeight: number;    // 0-1, Sun/Moon = 1
  houseWeight: number;   // 0-1, angular = 1
  aspectHardness: number; // 0-1, hard = 1
  clusterBonus: number;  // 0-1, multiple markers firing together
}

export type RankedWound = {
  markerId: string;
  label: string;
  rank: WoundRank;
  signature: string;      // plain language, no jargon
  cost: string;           // what it costs the person
  repeatPattern: string;  // what repeats if unaddressed
  strength: StrengthFactor;
  totalScore: number;
}

/**
 * Body weight: Sun and Moon carry the most weight.
 * Personal planets (Mercury, Venus, Mars) next.
 * Social planets (Jupiter, Saturn) after.
 * Outers (Uranus, Neptune, Pluto) least, but their effects are slow and deep.
 */
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

/**
 * House weight: angular houses (1, 4, 7, 10) are loudest.
 * Succedent (2, 5, 8, 11) medium.
 * Cadent (3, 6, 9, 12) quietest.
 */
const HOUSE_WEIGHT: Record<number, number> = {
  1: 1.0, 4: 1.0, 7: 1.0, 10: 1.0,
  2: 0.6, 5: 0.6, 8: 0.6, 11: 0.6,
  3: 0.3, 6: 0.3, 9: 0.3, 12: 0.3,
}

/**
 * Aspect hardness: conjunction, square, opposition are hard.
 * Trine and sextile are soft.
 */
const ASPECT_HARDNESS: Record<string, number> = {
  conjunction: 1.0,
  square: 1.0,
  opposition: 1.0,
  trine: 0.4,
  sextile: 0.4,
}

/**
 * Marker combination clusters.
 * When multiple markers fire together, the cluster bonus applies.
 * Each cluster has an authored signature.
 */
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

/**
 * Plain-language signatures for each marker.
 * No jargon. What it looks like, what it costs, what repeats.
 */
const SIGNATURES: Record<string, { signature: string; cost: string; repeatPattern: string; baseRank: WoundRank; baseScore: number; baseStrength: StrengthFactor; totalScore: number; rank: WoundRank; strength: StrengthFactor; markerId: string; label: string; } > = {
  chiron: {
    markerId: 'chiron', label: 'Chiron', baseRank: 2, baseScore: 0.6,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.8, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.6, rank: 2,
    signature: 'The wound that does not close. Shame, inadequacy, feeling broken in a way that cannot be fixed. It reopens under pressure, and the person tries to heal it by performing the wound publicly.',
    cost: 'Chronic self-attack. The person becomes their own worst critic and cannot stop.',
    repeatPattern: 'Repeats the story of being broken to anyone who will listen, then feels drained and unseen.',
  },
  trueLilith: {
    markerId: 'trueLilith', label: 'True Lilith', baseRank: 2, baseScore: 0.55,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.6, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.55, rank: 2,
    signature: 'The exiled instinct. Rage that was never allowed to exist, so it leaks sideways: passive aggression, sudden explosions, or total shutdown. It fires when the person feels controlled or unseen.',
    cost: 'The person cannot express anger directly, so it comes out distorted or not at all.',
    repeatPattern: 'Builds resentment silently, then erupts or withdraws completely.',
  },
  neptune: {
    markerId: 'neptune', label: 'Neptune', baseRank: 3, baseScore: 0.45,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.3, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.45, rank: 3,
    signature: 'The fog. Self-undoing, dissolution, losing the thread of who you are. It fires when the person escapes into fantasy, substances, or another person instead of facing reality.',
    cost: 'The person cannot hold a clear sense of self under pressure.',
    repeatPattern: 'Escapes, then returns to find everything worse.',
  },
  mars: {
    markerId: 'mars', label: 'Mars', baseRank: 2, baseScore: 0.6,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.7, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.6, rank: 2,
    signature: 'The severing force. Compulsive action, rage, cutting things off. It fires when the person feels blocked or threatened and responds with force instead of patience.',
    cost: 'The person burns bridges and relationships with impulsive action.',
    repeatPattern: 'Explodes, regrets, withdraws, then repeats.',
  },
  venus: {
    markerId: 'venus', label: 'Venus', baseRank: 2, baseScore: 0.55,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.7, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.55, rank: 2,
    signature: 'The relational wound. Attachment, sabotage, love as battlefield. It fires when the person needs proof of love and punishes the missing proof.',
    cost: 'Every bond carries the original hurt. The person cannot trust closeness without control.',
    repeatPattern: 'Moves close, needs proof, punishes absence, withdraws, calls it honesty.',
  },
  saturn: {
    markerId: 'saturn', label: 'Saturn', baseRank: 2, baseScore: 0.55,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.5, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.55, rank: 2,
    signature: 'The fear structure. Contraction, delay, the rule that says you are not enough. It fires when the person faces responsibility and freezes or overworks.',
    cost: 'The person lives under a self-imposed sentence of inadequacy.',
    repeatPattern: 'Proves worth through exhaustion, then collapses.',
  },
  pluto: {
    markerId: 'pluto', label: 'Pluto', baseRank: 2, baseScore: 0.6,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.3, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.6, rank: 2,
    signature: 'The power distortion. Compulsion, control, collapse. It fires when the person feels powerless and grabs for control or surrenders completely.',
    cost: 'The person cannot tolerate vulnerability, so they either dominate or disappear.',
    repeatPattern: 'Controls, loses, rebuilds the same structure, loses again.',
  },
  uranus: {
    markerId: 'uranus', label: 'Uranus', baseRank: 3, baseScore: 0.45,
    baseStrength: { orbTightness: 0.5, bodyWeight: 0.3, houseWeight: 0.5, aspectHardness: 0.5, clusterBonus: 0 },
    totalScore: 0.45, rank: 3,
    signature: 'The shock. Sudden upheaval, rebellion, breaking free without warning. It fires when the person feels trapped and explodes outward.',
    cost: 'The person cannot tolerate stagnation, so they destroy what is stable.',
    repeatPattern: 'Breaks free, feels lost, rebuilds, breaks again.',
  },
}

/**
 * Rank a list of wound marker hits.
 * Applies strength factors and cluster bonuses.
 * Returns ranked wounds, loudest first.
 */
export function rankWounds(
  hits: { id: string; sign: string; degree: number; house: number | null; qualities: string[] }[],
  aspects: { planet1: string; planet2: string; aspect: string; orb: number }[] = [],
): RankedWound[] {
  const ranked: RankedWound[] = []

  for (const hit of hits) {
    const sig = SIGNATURES[hit.id]
    if (!sig) continue

    // Find aspects involving this marker
    const relevantAspects = aspects.filter(
      a => a.planet1 === hit.id || a.planet2 === hit.id
    )
    const tightestOrb = relevantAspects.length > 0
      ? Math.min(...relevantAspects.map(a => a.orb))
      : 8
    const orbTightness = Math.max(0, 1 - tightestOrb / 8)

    const aspectType = relevantAspects.length > 0 ? relevantAspects[0].aspect : 'none'
    const aspectHardness = ASPECT_HARDNESS[aspectType] ?? 0.5

    const bodyWeight = BODY_WEIGHT[hit.id] ?? 0.5
    const houseWeight = hit.house !== null ? (HOUSE_WEIGHT[hit.house] ?? 0.5) : 0.5

    // Cluster bonus
    let clusterBonus = 0
    let clusterSignature = ''
    for (const cluster of CLUSTERS) {
      if (cluster.markers.includes(hit.id)) {
        const otherMarkers = cluster.markers.filter(m => m !== hit.id)
        if (otherMarkers.some(m => hits.some(h => h.id === m))) {
          clusterBonus = Math.max(clusterBonus, cluster.bonus)
          clusterSignature = cluster.signature
        }
      }
    }

    const strength: StrengthFactor = {
      orbTightness,
      bodyWeight,
      houseWeight,
      aspectHardness,
      clusterBonus,
    }

    const totalScore = Math.min(1,
      orbTightness * 0.25 +
      bodyWeight * 0.25 +
      houseWeight * 0.15 +
      aspectHardness * 0.15 +
      clusterBonus * 0.2
    )

    const rank: WoundRank = totalScore >= 0.75 ? 1 : totalScore >= 0.6 ? 2 : totalScore >= 0.45 ? 3 : totalScore >= 0.3 ? 4 : 5

    ranked.push({
      markerId: hit.id,
      label: hit.id,
      rank,
      signature: clusterSignature || sig.signature,
      cost: sig.cost,
      repeatPattern: sig.repeatPattern,
      strength,
      totalScore,
    })
  }

  return ranked.sort((a, b) => b.totalScore - a.totalScore)
}
