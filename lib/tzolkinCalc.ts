// Wheel: @drewsonne/maya-dates@1.3.14 (GPL-3.0-only) https://github.com/drewsonne/maya-dates
// Call: LongCount.fromGregorian(localDate, getCorrelationConstant(584283))
// Input: birthDate "YYYY-MM-DD". 584283 is the package's named GMT constant, not a second correlation.
// Output: library long count, Tzolk'in, and Haab strings. Dreamspell kin names are not used.

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { LongCount, getCorrelationConstant } = require('@drewsonne/maya-dates') as typeof import('@drewsonne/maya-dates');

export type TzolkinCalcInput = {
  birthDate: string;
};

export type TzolkinCalcResult = {
  package: '@drewsonne/maya-dates';
  version: '1.3.14';
  correlation: { value: number; name: string };
  longCount: string;
  calendarRound: string;
  tzolkin: string;
  haab: string;
};

export function calculateTzolkin(input: TzolkinCalcInput): TzolkinCalcResult {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  if (!date) throw new Error('Tzolk\'in requires birthDate YYYY-MM-DD.');
  const correlation = getCorrelationConstant(584283);
  const localDate = new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]));
  const longCount = LongCount.fromGregorian(localDate, correlation);
  const full = longCount.buildFullDate();
  return {
    package: '@drewsonne/maya-dates',
    version: '1.3.14',
    correlation: { value: correlation.value, name: correlation.name },
    longCount: longCount.toString(),
    calendarRound: full.cr.toString(),
    tzolkin: full.cr.tzolkin.toString(),
    haab: full.cr.haab.toString(),
  };
}
