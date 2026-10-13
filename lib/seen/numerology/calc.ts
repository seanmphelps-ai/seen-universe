// PROVENANCE: bot=numerology-executor date=2026-10-12 layer=B (calculation only; no Layer C/D content)
// SOURCES (exact titles per SOURCE_LOCK/01_MODULE_SOURCE_MANIFEST.md):
//   A1 Goodwin, "Numerology: The Complete Guide, Vol. 1 — The Personality Reading" (M1–M8)
//   A2 Decoz with Monte, "Numerology: Key to Your Inner Self" (M5–M8; M10–M14 attributed, chapter UNVERIFIED on box)
// MECHANICS: SOURCE_LOCK/02_MECHANICS_MANIFEST.md M1–M8, M10–M14. 33/44 UNRESOLVED (05 D1, 06 U1).

/** M1 */
export const PYTHAGOREAN: Record<string, number> = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, i) => [c, (i % 9) + 1]),
);
export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
export const MASTERS = new Set([11, 22]);
/** M8 */
export const KARMIC_DEBTS = new Set([13, 14, 16, 19]);

export type Reduced = { value: number; reducedFrom: string; compounds: number[] };

const digitSum = (n: number) => String(n).split('').reduce((a, d) => a + Number(d), 0);

/** M2: reduce, keeping 11/22 unless keepMasters=false. Records every compound passed through. */
export function reduce(n: number, keepMasters = true): Reduced {
  const compounds: number[] = [];
  let v = n;
  while (v > 9 && !(keepMasters && MASTERS.has(v))) { compounds.push(v); v = digitSum(v); }
  const reducedFrom = compounds.length ? `${compounds[compounds.length - 1]}/${v}` : String(v);
  return { value: v, reducedFrom, compounds };
}
export const single = (n: number) => reduce(n, false).value;

export type BirthDate = { year: number; month: number; day: number };

/** ADV-NUM-004: reject impossible calendar dates. */
export function assertValidBirthDate(b: BirthDate): void {
  const d = new Date(Date.UTC(b.year, b.month - 1, b.day));
  if (!Number.isInteger(b.year) || b.year < 1 || d.getUTCFullYear() !== b.year || d.getUTCMonth() !== b.month - 1 || d.getUTCDate() !== b.day) {
    throw new Error(`Numerology: invalid birth date ${b.year}-${b.month}-${b.day}`);
  }
}

/** M3 */
export function lifePath(b: BirthDate) {
  assertValidBirthDate(b);
  const m = reduce(b.month), d = reduce(b.day), y = reduce(b.year);
  const total = reduce(m.value + d.value + y.value);
  return { ...total, components: { month: m, day: d, year: y } };
}
/** M4 */
export const birthday = (b: BirthDate) => reduce(b.day);

/**
 * MF-NUM-005 / CoS rule 4: NFD + strip combining marks (JOSÉ ≡ JOSE). Letters whose uppercase changes length
 * (ß → SS, ŉ, ﬁ …) are detected BEFORE toUpperCase and reported as unsupported (U4). Letters outside A–Z after
 * stripping are unsupported (U4). Stripped digits / non-letters (other than whitespace) are reported in `stripped`.
 */
export function normalizeName(s: string): { parts: string[]; unsupported: string[]; stripped: string[] } {
  const base = s.normalize('NFD').replace(/\p{M}/gu, '');
  const chars = [...base];
  const expanding = chars.filter((c) => /\p{L}/u.test(c) && c.toUpperCase().length !== c.length);
  const upper = chars.map((c) => (expanding.includes(c) ? c : c.toUpperCase())).join('');
  const nonLatin = [...upper].filter((c) => /\p{L}/u.test(c) && !/[A-Z]/.test(c));
  const unsupported = [...new Set([...expanding, ...nonLatin])];
  const stripped = [...new Set([...upper].filter((c) => !/\p{L}/u.test(c) && !/\s/u.test(c)))];
  const parts = upper.split(/\s+/).map((p) => p.replace(/[^A-Z]/g, '')).filter(Boolean);
  return { parts, unsupported, stripped };
}

/**
 * M6 Goodwin conditional Y/W (02 M6; CoS clearance rule 5 replaces the 02:112 simplification):
 *  Y = vowel when the sole vowel of its syllable, or preceded by A/E/I/O/U as one sound.
 *  W = vowel when preceded by A/E/I/O/U as one sound.
 * Without a syllabifier:
 *  - word-initial Y/W before a vowel → consonant (YOLANDA, WANDA) [certain]
 *  - Y between vowels → consonant (MAYA) [uncertain]
 *  - other Y → vowel (LYNN, MARY, RAY certain; RYAN, BRYAN uncertain: Y before vowel)
 *  - W after a vowel → vowel (LOWRY certain; HOWARD, BOWEN uncertain: W before vowel); other W → consonant
 * "Uncertain" = a non-initial Y/W directly followed by a vowel; such names get `Y/W heuristic (U6)`.
 */
export function isVowelAt(letters: string[], i: number): boolean {
  const c = letters[i], prev = letters[i - 1], next = letters[i + 1];
  if (VOWELS.has(c)) return true;
  const prevV = prev !== undefined && VOWELS.has(prev), nextV = next !== undefined && VOWELS.has(next);
  if (c === 'Y') { if (i === 0 && nextV) return false; if (prevV && nextV) return false; return true; }
  if (c === 'W') return prevV;
  return false;
}
export function ywUncertainAt(letters: string[], i: number): boolean {
  const c = letters[i], next = letters[i + 1];
  return (c === 'Y' || c === 'W') && i > 0 && next !== undefined && VOWELS.has(next);
}
export const ywUncertain = (parts: string[]) => parts.some((p) => p.split('').some((_, i, ls) => ywUncertainAt(ls, i)));

export type NameKind = 'expression' | 'soulUrge' | 'personality';

/** M5/M6/M7: per name part reduction, then sum of reduced parts reduced. */
export function nameNumber(fullName: string, kind: NameKind) {
  const { parts: words, unsupported, stripped } = normalizeName(fullName);
  const parts = words.map((p) => {
    const ls = p.split('');
    const raw = ls.reduce((a, c, i) => {
      const v = isVowelAt(ls, i);
      const take = kind === 'expression' || (kind === 'soulUrge' ? v : !v);
      return take ? a + PYTHAGOREAN[c] : a;
    }, 0);
    return { part: p, raw, reduced: reduce(raw) };
  });
  // Single-part name: the part sum IS the core total's pre-reduction compound (M8).
  const total = parts.length === 1 ? parts[0].reduced : reduce(parts.reduce((a, p) => a + p.reduced.value, 0));
  return { ...total, parts, unsupported, stripped, ywUncertain: ywUncertain(words) };
}

/** M10 (attributed Decoz; chapter UNVERIFIED) */
export const maturity = (lp: number, expr: number) => reduce(lp + expr);

export const debtsIn = (r: Reduced) => r.compounds.filter((c) => KARMIC_DEBTS.has(c));
export const has33 = (r: Reduced) => r.compounds.includes(33);

export type Span = { index: 1 | 2 | 3 | 4; number: number; reducedFrom: string; startAge: number; endAge: number | null };

/** M11 pinnacles / M12 challenges (attributed Decoz; chapter UNVERIFIED). Inputs reduced to single digits. */
export function pinnaclesAndChallenges(b: BirthDate, lpValue: number) {
  assertValidBirthDate(b);
  const m = single(b.month), d = single(b.day), y = single(b.year);
  const end1 = 36 - single(lpValue);
  const ages: [number, number | null][] = [[0, end1], [end1 + 1, end1 + 9], [end1 + 10, end1 + 18], [end1 + 19, null]];
  const p1 = reduce(m + d), p2 = reduce(d + y);
  const pin = [p1, p2, reduce(p1.value + p2.value), reduce(m + y)];
  const c1 = Math.abs(m - d), c2 = Math.abs(d - y);
  const ch = [c1, c2, Math.abs(c1 - c2), Math.abs(m - y)].map((n) => reduce(n));
  const mk = (arr: Reduced[]): Span[] => arr.map((r, i) => ({ index: (i + 1) as Span['index'], number: r.value, reducedFrom: r.reducedFrom, startAge: ages[i][0], endAge: ages[i][1] }));
  return { pinnacles: mk(pin), challenges: mk(ch) };
}

/** M13/M14: personal cycles are 1–9 (t514 numerology_schema "1-9 cycle"); no master keep. */
export type CalendarDate = { year: number; month: number };
export const universalYear = (now: CalendarDate) => reduce(now.year, false);
export const personalYear = (b: BirthDate, now: CalendarDate) => reduce(b.month + b.day + universalYear(now).value, false);
export const personalMonth = (b: BirthDate, now: CalendarDate) => reduce(personalYear(b, now).value + now.month, false);
