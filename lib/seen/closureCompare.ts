import { z } from 'zod';
import type { NatalChartResult } from '../natalChart';

const MAJOR_ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Sextile', angle: 60, orb: 6 },
  { name: 'Square', angle: 90, orb: 7 },
  { name: 'Trine', angle: 120, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 },
] as const;

const PERSONAL = new Set(['sun', 'moon', 'mercury', 'venus', 'mars', 'ascendant']);

export const SynastryHitSchema = z.object({
  aKey: z.string(),
  bKey: z.string(),
  aLabel: z.string(),
  bLabel: z.string(),
  aPerson: z.string(),
  bPerson: z.string(),
  aspect: z.string(),
  orb: z.number(),
});

export const ComparativeShadowCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  happened: z.string(),
  adaptation: z.string(),
  cost: z.string(),
  firstAction: z.string(),
  evidence: z.array(z.string()).min(1),
  confidence: z.number().min(0).max(1),
});

export const ClosureCompareOutputSchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  personA: z.string(),
  personB: z.string(),
  westernIndependent: z.literal(true),
  unresolved: z.array(z.string()),
  hits: z.array(SynastryHitSchema),
  cards: z.array(ComparativeShadowCardSchema).length(3),
});

export type SynastryHit = z.infer<typeof SynastryHitSchema>;
export type ComparativeShadowCard = z.infer<typeof ComparativeShadowCardSchema>;
export type ClosureCompareOutput = z.infer<typeof ClosureCompareOutputSchema>;

type ChartPoint = { key: string; label: string; longitude: number };

function pointsOf(chart: NatalChartResult): ChartPoint[] {
  const points: ChartPoint[] = chart.planets.map((planet) => ({
    key: planet.key,
    label: planet.label,
    longitude: planet.longitude,
  }));
  if (chart.ascendant) {
    points.push({ key: 'ascendant', label: 'Ascendant', longitude: chart.ascendant.longitude });
  }
  if (chart.midheaven) {
    points.push({ key: 'midheaven', label: 'Midheaven', longitude: chart.midheaven.longitude });
  }
  return points;
}

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function synastryHits(a: NatalChartResult, b: NatalChartResult): SynastryHit[] {
  const aPoints = pointsOf(a);
  const bPoints = pointsOf(b);
  const hits: SynastryHit[] = [];
  for (const left of aPoints) {
    for (const right of bPoints) {
      const separation = angularSeparation(left.longitude, right.longitude);
      for (const candidate of MAJOR_ASPECTS) {
        const orb = Math.abs(separation - candidate.angle);
        if (orb <= candidate.orb) {
          hits.push({
            aKey: left.key,
            bKey: right.key,
            aLabel: left.label,
            bLabel: right.label,
            aPerson: a.name,
            bPerson: b.name,
            aspect: candidate.name,
            orb: Math.round(orb * 100) / 100,
          });
          break;
        }
      }
    }
  }
  return hits.sort((left, right) => left.orb - right.orb);
}

function involves(hit: SynastryHit, key: string): boolean {
  return hit.aKey === key || hit.bKey === key;
}

function personalContact(hit: SynastryHit): boolean {
  return PERSONAL.has(hit.aKey) || PERSONAL.has(hit.bKey);
}

function best(
  hits: SynastryHit[],
  predicate: (hit: SynastryHit) => boolean,
): SynastryHit | null {
  return hits.find((hit) => predicate(hit)) ?? null;
}

function evidenceLine(hit: SynastryHit): string {
  return `${hit.aPerson}'s ${hit.aLabel} ${hit.aspect.toLowerCase()} ${hit.bPerson}'s ${hit.bLabel} (orb ${hit.orb}°)`;
}

function confidenceFromOrb(orb: number): number {
  return Math.max(0.35, Math.min(1, 1 - orb / 10));
}

type Pattern = {
  id: string;
  title: string;
  match: (hits: SynastryHit[]) => SynastryHit | null;
  card: (hit: SynastryHit, a: string, b: string) => Omit<ComparativeShadowCard, 'id' | 'evidence' | 'confidence'>;
};

const PATTERNS: Pattern[] = [
  {
    id: 'the-hold',
    title: 'The Hold',
    match: (hits) =>
      best(hits, (hit) => involves(hit, 'saturn') && personalContact(hit)),
    card: (hit, a, b) => ({
      title: 'The Hold',
      happened: `${a} and ${b} meet where care or identity runs into a limiting structure. ${evidenceLine(hit)}.`,
      adaptation: 'One person contains. The other becomes careful. The field tightens instead of naming the limit.',
      cost: 'Warmth goes quiet. Need is managed. The relationship starts living inside the hold.',
      firstAction: 'When the hold arrives, name it once. Do not explain it. Write one sentence about what the body does.',
    }),
  },
  {
    id: 'the-heat',
    title: 'The Heat',
    match: (hits) =>
      best(
        hits,
        (hit) =>
          involves(hit, 'mars') &&
          (involves(hit, 'venus') || involves(hit, 'moon') || involves(hit, 'sun')),
      ),
    card: (hit, a, b) => ({
      title: 'The Heat',
      happened: `${a} and ${b} share a charge that moves faster than language. ${evidenceLine(hit)}.`,
      adaptation: 'Pursuit, spark, or conflict is used to feel the bond. Stillness is treated as loss.',
      cost: 'The nervous system stays on. Repair is delayed because the heat is mistaken for truth.',
      firstAction: 'Pause one heat cycle today. Do not send the second message. Note what you wanted the heat to prove.',
    }),
  },
  {
    id: 'the-care-collapse',
    title: 'The Care Collapse',
    match: (hits) =>
      best(
        hits,
        (hit) =>
          involves(hit, 'moon') &&
          (involves(hit, 'chiron') || involves(hit, 'saturn') || involves(hit, 'moon') || involves(hit, 'neptune')),
      ),
    card: (hit, a, b) => ({
      title: 'The Care Collapse',
      happened: `The care field between ${a} and ${b} is load-bearing. ${evidenceLine(hit)}.`,
      adaptation: 'One attunes. One disappears or floods. Care becomes the job instead of the contact.',
      cost: 'Resentment grows in the person who holds. Abandonment grows in the person who is held.',
      firstAction: 'Ask one need out loud without fixing the other person. Stop at the ask.',
    }),
  },
  {
    id: 'the-merge',
    title: 'The Merge',
    match: (hits) =>
      best(
        hits,
        (hit) =>
          (involves(hit, 'sun') && (involves(hit, 'moon') || involves(hit, 'sun') || involves(hit, 'ascendant'))) ||
          (involves(hit, 'ascendant') && personalContact(hit)),
      ),
    card: (hit, a, b) => ({
      title: 'The Merge',
      happened: `${a} and ${b} recognize each other as a single field too quickly. ${evidenceLine(hit)}.`,
      adaptation: 'Difference is treated as betrayal. Agreement is treated as love.',
      cost: 'Neither person stays distinct long enough for a real yes. Conflict is postponed, then amplified.',
      firstAction: 'Keep one preference that the other person does not share. Do not convert it into a fight or a gift.',
    }),
  },
  {
    id: 'the-repeat',
    title: 'The Repeat',
    match: (hits) =>
      best(
        hits,
        (hit) =>
          (involves(hit, 'north-node') || involves(hit, 'south-node')) && personalContact(hit),
      ),
    card: (hit, a, b) => ({
      title: 'The Repeat',
      happened: `The contact between ${a} and ${b} feels older than the current story. ${evidenceLine(hit)}.`,
      adaptation: 'An old contract is replayed as if it were this person, this year, this house.',
      cost: 'The present relationship is asked to finish a prior one. Neither person can win that assignment.',
      firstAction: 'Write the sentence “this is now, not then.” Keep the current name in it.',
    }),
  },
  {
    id: 'the-wound-hook',
    title: 'The Wound Hook',
    match: (hits) =>
      best(
        hits,
        (hit) =>
          (involves(hit, 'chiron') || involves(hit, 'lilith')) && personalContact(hit),
      ),
    card: (hit, a, b) => ({
      title: 'The Wound Hook',
      happened: `A sensitive point in one chart is touched by the other. ${evidenceLine(hit)}.`,
      adaptation: 'The hook is read as fate. The injury is protected by either silence or a blade.',
      cost: 'Intimacy and injury travel together. The relationship organizes around the wound instead of the bond.',
      firstAction: 'When the hook fires, name the sensation before the story. One word is enough.',
    }),
  },
];

function fallbackCard(hit: SynastryHit, index: number): ComparativeShadowCard {
  return {
    id: `contact-${index}-${hit.aKey}-${hit.bKey}`,
    title: `${hit.aLabel} / ${hit.bLabel}`,
    happened: evidenceLine(hit),
    adaptation: 'The field organizes around this contact before either person has language for it.',
    cost: 'Unnamed contact becomes a repeating move.',
    firstAction: 'Say the contact in plain language once. Do not interpret it yet.',
    evidence: [evidenceLine(hit)],
    confidence: confidenceFromOrb(hit.orb),
  };
}

export function compareClosureCharts(
  personA: NatalChartResult,
  personB: NatalChartResult,
): ClosureCompareOutput {
  if (personA.name.trim() === personB.name.trim()) {
    throw new Error('Person A and Person B must remain independent records.');
  }

  const hits = synastryHits(personA, personB);
  const used = new Set<string>();
  const cards: ComparativeShadowCard[] = [];

  for (const pattern of PATTERNS) {
    if (cards.length === 3) break;
    const remaining = hits.filter(
      (hit) => !used.has(`${hit.aKey}:${hit.bKey}:${hit.aspect}`),
    );
    const hit = pattern.match(remaining);
    if (!hit) continue;
    const signature = `${hit.aKey}:${hit.bKey}:${hit.aspect}`;
    if (used.has(pattern.id)) continue;
    used.add(signature);
    used.add(pattern.id);
    const body = pattern.card(hit, personA.name, personB.name);
    cards.push({
      id: pattern.id,
      ...body,
      evidence: [evidenceLine(hit)],
      confidence: confidenceFromOrb(hit.orb),
    });
  }

  for (const hit of hits) {
    if (cards.length === 3) break;
    const signature = `${hit.aKey}:${hit.bKey}:${hit.aspect}`;
    if (used.has(signature)) continue;
    used.add(signature);
    cards.push(fallbackCard(hit, cards.length));
  }

  while (cards.length < 3) {
    cards.push({
      id: `insufficient-${cards.length}`,
      title: 'Insufficient Western contact',
      happened: 'These two independent Western fields did not produce a third major synastry contact inside standard orbs.',
      adaptation: 'Do not invent a shadow to fill the slot.',
      cost: 'Forced meaning would overwrite the evidence.',
      firstAction: 'Keep both charts. Add location, time certainty, or a second source system before claiming a third pattern.',
      evidence: ['No remaining major synastry aspect inside orb.'],
      confidence: 0.2,
    });
  }

  return ClosureCompareOutputSchema.parse({
    schemaVersion: '1.0.0',
    personA: personA.name,
    personB: personB.name,
    westernIndependent: true,
    unresolved: [
      'Location pressure was not run for this comparison.',
      'Wound, attachment, and Helix layers are not claimed.',
      'This is a Western synastry field only.',
    ],
    hits,
    cards: cards.slice(0, 3),
  });
}
