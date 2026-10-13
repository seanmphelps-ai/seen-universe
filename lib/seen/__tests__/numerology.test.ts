// PROVENANCE: bot=numerology-executor date=2026-10-12 layer=B/D tests; smoke subject ANN LEE 1979-08-01 per RUNTIME_PACK.md;
// fixtures hand-checked against SOURCE_LOCK/02 M1–M8 and audit B_01 (MF-NUM-004..007).
import { describe, it, expect } from 'vitest';
import * as N from '../numerology/calc';
import { numerologyContributions } from '../numerology/contributions';
import { calculateNumerology, valueOf } from '../numerology';

const ann = { fullName: 'ANN LEE', birth: { year: 1979, month: 8, day: 1 }, now: { year: 2026, month: 10 } };
type Cs = ReturnType<typeof numerologyContributions>;
const val = (cs: Cs, f: string) => cs.find((c) => c.factor === f)?.provenance.value;
const debts = (cs: Cs) => cs.filter((c) => c.factorType === 'karmicDebt').map((c) => `${c.factor}@${c.provenance.location}`);

describe('numerology', () => {
  it('ANN LEE smoke', () => {
    const cs = numerologyContributions(ann);
    expect([val(cs, 'lifePath'), val(cs, 'birthday'), val(cs, 'expression'), val(cs, 'soulUrge'), val(cs, 'personality')]).toEqual([8, 1, 6, 2, 4]);
    // 04 V1 lists karmicDebts [] on core totals; CoS clearance rule 6 adds per-part checks → LEE = 13/4.
    expect(debts(cs)).toEqual(['karmicDebt13@expression.part:LEE']);
  });
  it('1992-11-11 keeps 11s in components', () => {
    const lp = N.lifePath({ year: 1992, month: 11, day: 11 });
    expect([lp.components.month.value, lp.components.day.value, lp.reducedFrom]).toEqual([11, 11, '25/7']);
    const cs = numerologyContributions({ fullName: 'X', birth: { year: 1992, month: 11, day: 11 } });
    expect(cs.filter((c) => c.factor === 'master11').map((c) => c.provenance.location)).toEqual(expect.arrayContaining(['birthday', 'lifePath.month', 'lifePath.day']));
  });
  it('29 -> 29/11 and day 16 birthday debt', () => {
    expect(N.reduce(29).reducedFrom).toBe('29/11');
    const d = numerologyContributions({ ...ann, birth: { year: 1979, month: 8, day: 16 } }).find((c) => c.factor === 'karmicDebt16');
    expect([d?.provenance.location, d?.provenance.reducedFrom]).toEqual(['birthday', '16/7']);
  });
  it('MF-004: no karmic debt on Personality (LYNN consonants 13/4)', () => {
    const cs = numerologyContributions({ ...ann, fullName: 'LYNN' });
    expect(cs.find((c) => c.factor === 'personality')?.provenance.reducedFrom).toBe('13/4');
    expect(debts(cs).some((d) => d.endsWith('@personality'))).toBe(false);
  });
  it('MF-005: JOSÉ == JOSE and keeps expression 13/4', () => {
    const a = numerologyContributions({ ...ann, fullName: 'JOSÉ' }), b = numerologyContributions({ ...ann, fullName: 'JOSE' });
    expect(a.map((c) => [c.factor, c.provenance.value])).toEqual(b.map((c) => [c.factor, c.provenance.value]));
    expect(val(a, 'expression')).toBe(4);
    expect(debts(a)).toContain('karmicDebt13@expression');
  });
  it('MF-005: unsupported orthography withholds name numbers', () => {
    const cs = numerologyContributions({ ...ann, fullName: 'ØRSTED' });
    expect(val(cs, 'expression')).toBeUndefined();
    expect(cs[0].missing.join()).toMatch(/U4/);
  });
  it('MF-006: Goodwin Y/W conditional, certain cases carry no U6 flag', () => {
    expect(N.nameNumber('LYNN', 'soulUrge').value).toBe(7); // Y sole vowel
    expect(N.nameNumber('MARY', 'soulUrge').value).toBe(8); // A1 + Y7
    expect(N.nameNumber('YOLANDA', 'soulUrge').value).toBe(8); // initial Y before O = consonant: O6+A1+A1
    expect(N.nameNumber('YOLANDA', 'personality').value).toBe(N.reduce(7 + 3 + 5 + 4).value);
    expect(N.nameNumber('LOWRY', 'soulUrge').reducedFrom).toBe('18/9'); // O6 + W5 (after O) + Y7
    for (const nm of ['LYNN', 'MARY', 'YOLANDA', 'LOWRY', 'ANN LEE'])
      for (const c of numerologyContributions({ ...ann, fullName: nm })) expect(c.missing).not.toContain('MISSING: Y/W heuristic (U6)');
  });
  it('MF-006: RYAN / BRYAN / HOWARD follow M6 and carry U6', () => {
    // RY-AN: Y sole vowel of syllable RY → vowel: Y7 + A1 = 8
    expect(N.nameNumber('RYAN', 'soulUrge').value).toBe(8);
    expect(N.nameNumber('BRYAN', 'soulUrge').value).toBe(8);
    expect(N.nameNumber('BRYAN', 'personality').value).toBe(N.reduce(2 + 9 + 5).value); // B R N = 16/7
    // HO-WARD: W preceded by O as one sound → vowel: O6 + W5 + A1 = 12/3
    expect(N.nameNumber('HOWARD', 'soulUrge').reducedFrom).toBe('12/3');
    for (const nm of ['RYAN', 'BRYAN', 'HOWARD']) {
      const cs = numerologyContributions({ ...ann, fullName: nm });
      for (const f of ['soulUrge', 'personality']) expect(cs.find((c) => c.factor === f)?.missing).toContain('MISSING: Y/W heuristic (U6)');
      expect(cs.find((c) => c.factor === 'expression')?.missing).not.toContain('MISSING: Y/W heuristic (U6)');
    }
  });
  it('MF-005: ß detected before uppercasing → name numbers withheld (U4), no fabricated debt', () => {
    const cs = numerologyContributions({ ...ann, fullName: 'GRAß' });
    expect(val(cs, 'expression')).toBeUndefined();
    expect(debts(cs).some((d) => !d.includes('birthday') && !d.includes('lifePath'))).toBe(false);
    expect(cs[0].missing.join()).toMatch(/U4.*ß/);
    expect(calculateNumerology({ name: 'GRAß', birthDate: '1979-08-01' }).nameAccepted).toBe(false);
  });
  it('MF-005: stripped digits/non-letters listed in missing[]', () => {
    const cs = numerologyContributions({ ...ann, fullName: 'ANN2 LEE!' });
    expect(val(cs, 'expression')).toBe(6);
    expect(cs.find((c) => c.factor === 'expression')?.missing.join()).toMatch(/stripped.*"2".*"!"/);
    expect(cs.find((c) => c.factor === 'lifePath')?.missing.join()).not.toMatch(/stripped/);
  });
  it('CoS rule 6: per-part karmic debt — JOSÉ LEE flags 13 on JOSE part', () => {
    const cs = numerologyContributions({ ...ann, fullName: 'JOSÉ LEE' });
    expect(debts(cs)).toContain('karmicDebt13@expression.part:JOSE');
    expect(debts(cs)).not.toContain('karmicDebt13@personality.part:LEE');
  });
  it('pinnacles/challenges hand-checked (m8 d1 y8, LP8)', () => {
    const { pinnacles, challenges } = N.pinnaclesAndChallenges({ year: 1979, month: 8, day: 1 }, 8);
    expect(pinnacles.map((p) => p.number)).toEqual([9, 9, 9, 7]);
    expect(pinnacles[3].reducedFrom).toBe('16/7');
    expect(pinnacles.map((p) => [p.startAge, p.endAge])).toEqual([[0, 28], [29, 37], [38, 46], [47, null]]);
    expect(challenges.map((c) => c.number)).toEqual([7, 7, 0, 0]);
  });
  it('MF-007: personal year/month are 1–9', () => {
    expect(N.personalYear(ann.birth, ann.now).value).toBe(1);
    expect(N.personalMonth(ann.birth, ann.now).value).toBe(2); // 1+10=11 -> 2
    expect(N.personalYear({ year: 1990, month: 11, day: 29 }, { year: 2028, month: 1 }).value).toBeLessThanOrEqual(9);
  });
  it('33 not kept; invalid date rejected', () => {
    expect(N.reduce(33).value).toBe(6);
    expect(() => N.lifePath({ year: 2000, month: 2, day: 31 })).toThrow();
    expect(N.lifePath({ year: 2000, month: 2, day: 29 }).value).toBe(6);
  });
  it('MF-003 shape: seenDerived true, no gift/score keys, portalId null', () => {
    for (const c of numerologyContributions(ann)) {
      expect(c.portalId).toBeNull();
      expect(c.seenDerived).toBe(true);
      expect(c.provenance.labelLayer).toBe('D');
      expect(Object.keys(c).sort()).toEqual(['factor', 'factorType', 'missing', 'portalId', 'provenance', 'schoolTags', 'seenDerived', 'signalType', 'sourceRefs', 'system', 'timeWindow']);
      expect(JSON.stringify(c)).not.toMatch(/gift|score|weight|amplif/i);
      expect(c.missing).toContain('MISSING: sourced shadow text');
    }
  });
  it('MF-002: unverified mechanics flagged', () => {
    for (const c of numerologyContributions(ann).filter((c) => ['pinnacle', 'challenge', 'personalCycle'].includes(c.factorType) || c.factor === 'maturity'))
      expect(c.schoolTags).toContain('mechanic-unverified');
  });
  it('calculateNumerology entry (live engine)', () => {
    const r = calculateNumerology({ name: 'ANN LEE', birthDate: '1979-08-01' });
    expect(r.engine).toBe('seen-numerology');
    expect(valueOf(r, 'lifePath')).toBe(8);
  });
});
