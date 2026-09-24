/**
 * Deterministic anonymous pressure paragraphs from chart-engine darkCardSeed.
 * Uses geoSummary + wound qualities + portal names/expressions as INTERNAL cues only.
 * Never prints planet/sign/house/clock/portal numbers, TOD labels, or astrology jargon on the face.
 */

export type PressureSeedInput = {
  clock?: string;
  geoSummary?: string;
  wounds?: Array<{
    label?: string;
    sign?: string;
    degree?: number;
    house?: number | null;
    qualities?: string[];
  }>;
  topPortals?: Array<{
    portalId?: number;
    name?: string;
    expression?: string;
  }>;
};

export type PressureArchetype = 'private-test' | 'public-worth' | 'distance-break';

const ARCHETYPE_BY_CLOCK: Record<string, PressureArchetype> = {
  '04:00': 'private-test',
  '12:00': 'public-worth',
  '20:00': 'distance-break',
};

function collectQualities(wounds: PressureSeedInput['wounds']): string[] {
  const out: string[] = [];
  for (const wound of wounds ?? []) {
    for (const q of wound.qualities ?? []) {
      const cleaned = q.trim().toLowerCase();
      if (cleaned && !out.includes(cleaned)) out.push(cleaned);
    }
  }
  return out;
}

function hasAny(qualities: string[], needles: string[]) {
  return needles.some((n) => qualities.some((q) => q.includes(n)));
}

function dominantHouses(wounds: PressureSeedInput['wounds']): number[] {
  return (wounds ?? [])
    .map((w) => w.house)
    .filter((h): h is number => typeof h === 'number' && h >= 1 && h <= 12);
}

function inferArchetype(seed: PressureSeedInput): PressureArchetype {
  if (seed.clock && ARCHETYPE_BY_CLOCK[seed.clock]) {
    return ARCHETYPE_BY_CLOCK[seed.clock];
  }

  const houses = dominantHouses(seed.wounds);
  const angularPublic = houses.filter((h) => h === 1 || h === 10).length;
  const relational = houses.filter((h) => h === 7 || h === 8 || h === 5).length;
  const hidden = houses.filter((h) => h === 12 || h === 4 || h === 3).length;

  if (angularPublic >= relational && angularPublic >= hidden) return 'public-worth';
  if (hidden >= relational) return 'private-test';
  return 'distance-break';
}

function livedDirtCue(geoSummary?: string): string {
  const raw = (geoSummary ?? '').trim();
  if (!raw) {
    return 'The ground they grew on still shapes how pressure lands, even when they pretend the past is closed.';
  }
  // Soften engine doctrine lines into human dirt without inventing poverty/violence.
  if (/poverty|violence|scarcity/i.test(raw) && /UNKNOWN|no explicit/i.test(raw)) {
    return 'Place left a baseline of caution in the body: heat, distance, and the sense that the room can turn.';
  }
  if (/shove|dirt|coordinates/i.test(raw)) {
    return 'Where they lived still sits under the story: the body remembers the room before the mind names it.';
  }
  // Never paste raw engine jargon onto the card face.
  return 'Lived ground still colors how closeness and threat get read.';
}

function behaviorFromQualities(qualities: string[], archetype: PressureArchetype): string {
  const shame = hasAny(qualities, ['shame', 'identity-fracturing', 'wound-bearing']);
  const rage = hasAny(qualities, ['rageful', 'severing', 'compulsive']);
  const fog = hasAny(qualities, ['dissolving', 'fog', 'self-undoing', 'distortion']);
  const bind = hasAny(qualities, ['binding', 'entanglement', 'secrecy', 'shadow']);
  const attach = hasAny(qualities, ['relational', 'attachment', 'sabotage']);
  const delay = hasAny(qualities, ['delay', 'contraction', 'fear-structure']);

  if (archetype === 'private-test') {
    if (bind || shame) {
      return 'They coil first, then strike sideways: a sharp question, a remembered detail, a test disguised as concern. If that fails, they go quiet and make the other person guess what they did wrong.';
    }
    if (fog) {
      return 'They rewrite the moment in private until the story proves they were unsafe, then ask for reassurance in a voice that already sounds like a verdict.';
    }
    return 'They watch for the hidden motive before they trust the visible one, and they gather evidence before they speak.';
  }

  if (archetype === 'public-worth') {
    if (attach || shame) {
      return 'They perform competence, argue the wording, and keep talking until the other person either agrees or gives up. When the argument touches shame, the warmth flips into contempt or a polished disappearance.';
    }
    if (rage) {
      return 'They raise the temperature of the room, force a decision, and punish hesitation as if it were disrespect.';
    }
    return 'They turn disagreement into a referendum on respect and will not rest until they feel unmistakably chosen.';
  }

  // distance-break
  if (delay || fog) {
    return 'They intellectualize, detach, or make a joke while pressure builds. Then they cut the wire, send the long message, or disappear and call the rupture clarity.';
  }
  if (rage || bind) {
    return 'They intellectualize the bond until it feels optional, then sever it in one move and call the rupture honesty.';
  }
  return 'They wait until the bond feels like a trap, then use finality to get their breath back.';
}

function pressureFromArchetype(archetype: PressureArchetype, qualities: string[]): string {
  if (archetype === 'private-test') {
    if (hasAny(qualities, ['shame', 'sensit'])) {
      return 'Feeling ignored, exposed, or emotionally cornered. A small change in tone becomes evidence that the bond is unsafe.';
    }
    return 'Unanswered messages, mixed signals, public embarrassment, or a partner asking for proof of love press on an old fear of being unseen.';
  }
  if (archetype === 'public-worth') {
    return 'Criticism, being overlooked, or being asked to shrink while someone else takes the room presses the need to be unmistakably chosen.';
  }
  return 'Dependence, emotional demands, or the sense that a relationship is taking over their freedom makes the body look for an exit before it looks for repair.';
}

function costCrack(archetype: PressureArchetype): { cost: string; crack: string } {
  if (archetype === 'private-test') {
    return {
      cost: 'The partner is pulled into defending themselves against a case that was built in private. This person gets temporary control, but loses the simple contact they wanted.',
      crack: 'If it runs one more cycle, they rewrite the whole relationship around accumulated pressure and call withdrawal self-protection—winning the argument alone.',
    };
  }
  if (archetype === 'public-worth') {
    return {
      cost: 'The original problem gets buried under the fight to be recognized. The partner feels managed rather than met, cast as audience, critic, or rival.',
      crack: 'If it runs one more cycle, they confuse being loved with being affirmed, then punish the relationship for failing to provide constant proof—losing tenderness that does not need applause.',
    };
  }
  return {
    cost: 'The partner experiences the ending as both sudden and prewritten. This person gets relief from pressure but carries the unfinished attachment forward.',
    crack: 'If it runs one more cycle, they mistake numbness for independence and make distance prove that nobody can hold them—losing trust that boundaries can exist without abandonment.',
  };
}

function portalCueSentence(
  portals: PressureSeedInput['topPortals'],
  archetype: PressureArchetype,
): string | null {
  const names = (portals ?? [])
    .map((p) => (p.name ?? '').trim())
    .filter(Boolean)
    .slice(0, 4);
  const expressions = (portals ?? [])
    .map((p) => (p.expression ?? '').trim().toLowerCase())
    .filter(Boolean);

  const pressurized = expressions.some((e) => e === 'pressurized' || e === 'recurrent' || e === 'distorted');
  const sensitized = expressions.some((e) => e === 'sensitized');

  // Translate portal *names* into behavioral metaphors — never print the names.
  const joined = names.join(' ').toLowerCase();
  if (/conflict|opposition|obstruction|splitting|oppression/.test(joined)) {
    return 'Under strain, conflict becomes the shortest path to feeling real again.';
  }
  if (/retreat|standstill|limitation|keeping still|dispersion/.test(joined)) {
    return 'When the room tightens, retreat starts to look like wisdom.';
  }
  if (/holding|family|fellowship|influence|following/.test(joined)) {
    return 'Closeness is both the hunger and the hazard; they reach, then brace.';
  }
  if (/creative|great power|breakthrough|revolution|arousing/.test(joined)) {
    return 'Force rises fast when recognition or freedom feels threatened.';
  }

  if (pressurized) {
    return archetype === 'distance-break'
      ? 'The pressurized pattern favors a clean cut over a slow repair.'
      : 'The pressurized pattern favors control over soft contact.';
  }
  if (sensitized) {
    return 'Small cues register as large threats before language catches up.';
  }
  return null;
}

/**
 * Build a multi-sentence anonymous pressure paragraph (min ~3 sentences).
 * Voice: third person "this person".
 */
export function pressureProseFromSeed(seed: PressureSeedInput): string {
  const archetype = inferArchetype(seed);
  const qualities = collectQualities(seed.wounds);
  const dirt = livedDirtCue(seed.geoSummary);
  const pressure = pressureFromArchetype(archetype, qualities);
  const behavior = behaviorFromQualities(qualities, archetype);
  const { cost, crack } = costCrack(archetype);
  const portalLine = portalCueSentence(seed.topPortals, archetype);

  const reveal =
    archetype === 'private-test'
      ? 'This person looks for the hidden motive before they trust the visible one. They can be warm, proud, and intensely loyal, but closeness also feels like a place where they can be watched, judged, or left.'
      : archetype === 'public-worth'
        ? 'This person wants to be unmistakably valued. They can bring heat, charm, and a strong public presence, but rejection lands as an attack on their worth—not merely a disagreement.'
        : 'This person keeps a cool distance until someone reaches the protected core. Then the response can be sudden: intense pursuit, an abrupt exit, or a clean break that leaves little room for negotiation.';

  const parts = [reveal, pressure, behavior];
  if (portalLine) parts.push(portalLine);
  parts.push(dirt, cost, crack);

  // Ensure we never leak clock/TOD/astro tokens on the face.
  const paragraph = parts.join(' ').replace(/\s+/g, ' ').trim();
  return stripForbiddenFaceTokens(paragraph);
}

const FORBIDDEN_FACE =
  /\b(night|day|evening|morning|afternoon|sunrise|sunset|ascendant|rising|midheaven|house\s*\d+|portal\s*#?\d+|\d{1,2}:\d{2}|chiron|lilith|neptune|mars|venus|saturn|pluto|uranus|mercury|jupiter|ashlesha|aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)\b/gi;

function stripForbiddenFaceTokens(text: string): string {
  // Soft scrub — qualities already avoid most jargon; this is a safety net.
  return text
    .replace(FORBIDDEN_FACE, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

export function runIdForClock(clock: string, index: number): string {
  const normalized = /^\d{2}:\d{2}$/.test(clock) ? clock : `r1-${index}`;
  return `dark-${normalized.replace(':', '')}-${index}`;
}
