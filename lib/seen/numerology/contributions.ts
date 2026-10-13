// PROVENANCE: bot=numerology-executor date=2026-10-12 layer=B (values) + D (signalType label; seenDerived:true)
// SOURCES: values via ./calc (A1 Goodwin Vol.1, A2 Decoz — exact titles per SOURCE_LOCK/01). Wound/shadow labels are
//          SEEN Layer D per SOURCE_LOCK/07_SEEN_LAYER_D.md — never numerology tradition. Shape locked by CoS 2026-10-12.
// NOTE: repo lib/portals/template.ts PortalActivation ({portalId, placeName, answers}) does not match t514 activation
//       types; portalId stays null here and Portals (64) maps later.
import * as N from './calc';

export type NumerologyContribution = {
  portalId: null;
  system: 'numerology';
  signalType: 'wound' | 'shadow';
  factor: string;
  factorType: 'coreNumber' | 'karmicDebt' | 'masterNumber' | 'pinnacle' | 'challenge' | 'personalCycle';
  timeWindow: { startAge?: number; endAge?: number | null; year?: number; month?: number } | null;
  provenance: { valueLayer: 'B'; labelLayer: 'D'; mechanic: string; value: number; reducedFrom: string; location?: string };
  sourceRefs: string[];
  schoolTags: string[];
  seenDerived: true;
  missing: string[];
};

export const GOODWIN = 'Goodwin, Numerology: The Complete Guide, Vol. 1 — The Personality Reading';
export const DECOZ = 'Decoz with Monte, Numerology: Key to Your Inner Self';
export const LAYER_D = 'SEEN SOURCE_LOCK/07_SEEN_LAYER_D.md (wound/shadow label)';
const SHADOW_MISSING = 'MISSING: sourced shadow text';
const UNVERIFIED = (m: string) => `MISSING: ${m} source chapter citation (book not on box; mechanic not established in lock)`;

export type NumerologyInput = { fullName: string; birth: N.BirthDate; now?: N.CalendarDate };

/** Karmic debt positions per 02 M8 (Personality excluded; Maturity excluded). */
const DEBT_POSITIONS = new Set(['lifePath', 'expression', 'soulUrge', 'birthday']);
const NAME_FACTORS = new Set(['expression', 'soulUrge', 'personality', 'maturity']);

export function numerologyContributions(input: NumerologyInput): NumerologyContribution[] {
  const { fullName, birth, now } = input;
  const out: NumerologyContribution[] = [];
  type Row = Omit<NumerologyContribution, 'portalId' | 'system' | 'seenDerived' | 'missing' | 'sourceRefs' | 'schoolTags'> & { sourceRefs: string[]; schoolTags?: string[]; missing?: string[] };
  const add = (c: Row) => out.push({
    portalId: null, system: 'numerology', signalType: c.signalType, factor: c.factor, factorType: c.factorType,
    timeWindow: c.timeWindow, provenance: c.provenance, sourceRefs: [...c.sourceRefs, LAYER_D],
    schoolTags: ['pythagorean', ...(c.schoolTags ?? [])], seenDerived: true, missing: [SHADOW_MISSING, ...(c.missing ?? [])],
  });
  const prov = (mechanic: string, r: { value: number; reducedFrom: string }, location?: string) =>
    ({ valueLayer: 'B' as const, labelLayer: 'D' as const, mechanic, value: r.value, reducedFrom: r.reducedFrom, ...(location ? { location } : {}) });

  const lp = N.lifePath(birth);
  const expr = N.nameNumber(fullName, 'expression');
  const nameBlocked = expr.unsupported.length > 0 || expr.parts.length === 0;
  const U6 = expr.ywUncertain && !nameBlocked ? ['MISSING: Y/W heuristic (U6)'] : [];
  const core: [string, string, N.Reduced & { parts?: { part: string; reduced: N.Reduced }[] }, string[], string[], string[]][] = [
    ['lifePath', 'M3', lp, [GOODWIN], [], []],
    ['birthday', 'M4', N.birthday(birth), [GOODWIN], [], []],
  ];
  if (!nameBlocked) {
    core.push(
      ['expression', 'M5', expr, [GOODWIN, DECOZ], [], []],
      ['soulUrge', 'M6', N.nameNumber(fullName, 'soulUrge'), [GOODWIN, DECOZ], [], U6],
      ['personality', 'M7', N.nameNumber(fullName, 'personality'), [DECOZ, GOODWIN], ['personalityAlsoKnownAs:Secret Self (Goodwin)'], U6],
      ['maturity', 'M10', N.maturity(lp.value, expr.value), [DECOZ], ['mechanic-unverified'], [UNVERIFIED('M10 Maturity')]],
    );
  }

  for (const [name, mech, r, refs, tags, miss] of core) {
    const inner: N.Reduced[] = [r, ...(r.parts?.map((p) => p.reduced) ?? []), ...(name === 'lifePath' ? Object.values(lp.components) : [])];
    const m33 = inner.some(N.has33) ? ['MISSING: 33 master policy unresolved (reduced, not kept)'] : [];
    add({ signalType: 'shadow', factor: name, factorType: 'coreNumber', timeWindow: null, provenance: prov(mech, r),
      sourceRefs: refs, schoolTags: [...tags, ...(m33.length ? ['33-unresolved'] : [])], missing: [...miss, ...m33] });
    // M8 + CoS rule 6: debts on the core total AND on each name part (multi-part names; single part = total).
    const debtSites: [N.Reduced, string][] = [[r, name]];
    const nameParts = (r as { parts?: { part: string; reduced: N.Reduced }[] }).parts;
    if (nameParts && nameParts.length > 1) for (const p of nameParts) debtSites.push([p.reduced, `${name}.part:${p.part}`]);
    if (DEBT_POSITIONS.has(name)) for (const [site, loc] of debtSites) for (const d of N.debtsIn(site)) add({ signalType: 'wound', factor: `karmicDebt${d}`, factorType: 'karmicDebt',
      timeWindow: null, provenance: prov('M8', { value: N.single(d), reducedFrom: `${d}/${N.single(d)}` }, loc), sourceRefs: [GOODWIN, DECOZ],
      missing: name === 'soulUrge' ? U6 : [] });
    if (N.MASTERS.has(r.value)) add({ signalType: 'shadow', factor: `master${r.value}`, factorType: 'masterNumber', timeWindow: null,
      provenance: prov('M2', r, name), sourceRefs: [GOODWIN, DECOZ], missing: name === 'soulUrge' || name === 'personality' ? U6 : [] });
  }
  for (const [k, c] of Object.entries(lp.components)) if (N.MASTERS.has(c.value))
    add({ signalType: 'shadow', factor: `master${c.value}`, factorType: 'masterNumber', timeWindow: null,
      provenance: prov('M2', c, `lifePath.${k}`), sourceRefs: [GOODWIN, DECOZ] });
  if (nameBlocked) {
    const reason = expr.unsupported.length ? `MISSING: non-ASCII orthography (U4): ${expr.unsupported.join('')}` : 'MISSING: name';
    out.forEach((c) => c.missing.push(`${reason}; name numbers withheld`));
  }

  if (expr.stripped.length) {
    const note = `MISSING: stripped non-letter characters from name: ${expr.stripped.map((c) => JSON.stringify(c)).join(' ')}`;
    const root = (c: NumerologyContribution) => (c.provenance.location ?? c.factor).split('.')[0];
    const targets = out.filter((c) => NAME_FACTORS.has(root(c)));
    (targets.length ? targets : out).forEach((c) => c.missing.push(note));
  }

  const { pinnacles, challenges } = N.pinnaclesAndChallenges(birth, lp.value);
  for (const p of pinnacles) add({ signalType: 'shadow', factor: `pinnacle${p.index}`, factorType: 'pinnacle',
    timeWindow: { startAge: p.startAge, endAge: p.endAge }, provenance: prov('M11', { value: p.number, reducedFrom: p.reducedFrom }),
    sourceRefs: [DECOZ], schoolTags: ['mechanic-unverified'], missing: [UNVERIFIED('M11 Pinnacles')] });
  for (const c of challenges) add({ signalType: 'wound', factor: `challenge${c.index}`, factorType: 'challenge',
    timeWindow: { startAge: c.startAge, endAge: c.endAge }, provenance: prov('M12', { value: c.number, reducedFrom: c.reducedFrom }),
    sourceRefs: [DECOZ], schoolTags: ['mechanic-unverified'], missing: [UNVERIFIED('M12 Challenges')] });

  if (now) {
    const rows = [
      ['personalYear', 'M13', N.personalYear(birth, now), { year: now.year }],
      ['personalMonth', 'M13', N.personalMonth(birth, now), { year: now.year, month: now.month }],
      ['universalYear', 'M14', N.universalYear(now), { year: now.year }],
    ] as const;
    for (const [f, mech, r, tw] of rows) add({ signalType: 'shadow', factor: f, factorType: 'personalCycle', timeWindow: { ...tw },
      provenance: prov(mech, r), sourceRefs: [DECOZ], schoolTags: ['mechanic-unverified'], missing: [UNVERIFIED(`${mech} ${f}`)] });
  }
  return out;
}
