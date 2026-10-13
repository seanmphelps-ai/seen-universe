// PROVENANCE: bot=numerology-executor date=2026-10-12 layer=B/D entry point; sole live numerology engine (replaces sochumenh wrapper)
// SOURCES: SOURCE_LOCK/01 A1 Goodwin Vol.1, A2 Decoz; mechanics 02 M1–M8, M10–M14.
import * as N from './calc';
import { numerologyContributions, type NumerologyContribution } from './contributions';

export * from './calc';
export * from './contributions';

export type NumerologyCalcInput = { name: string; birthDate: string; now?: N.CalendarDate };

export type NumerologyCalcResult = {
  engine: 'seen-numerology';
  system: 'pythagorean';
  birth: N.BirthDate;
  nameAccepted: boolean;
  contributions: NumerologyContribution[];
};

export function calculateNumerology(input: NumerologyCalcInput): NumerologyCalcResult {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  if (!m) throw new Error('Numerology requires birthDate YYYY-MM-DD.');
  const birth = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  const norm = N.normalizeName(input.name ?? '');
  return {
    engine: 'seen-numerology',
    system: 'pythagorean',
    birth,
    nameAccepted: norm.parts.length > 0 && norm.unsupported.length === 0, // ß etc. rejected (U4)
    contributions: numerologyContributions({ fullName: input.name ?? '', birth, now: input.now }),
  };
}

export const valueOf = (r: NumerologyCalcResult, factor: string) =>
  r.contributions.find((c) => c.factor === factor)?.provenance.value;
