// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Solar } = require('lunar-javascript') as typeof import('lunar-javascript');

export type BaziCalcInput = {
  birthDate: string;
  birthTime: string;
};

export type BaziPillar = {
  ganZhi: string;
  gan: string;
  zhi: string;
  hideGan: string[];
};

export type BaziCalcResult = {
  package: 'lunar-javascript';
  version: '1.7.7';
  sect: number;
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  time: BaziPillar;
  text: string;
};

function civilParts(input: BaziCalcInput) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  const time = /^(\d{2}):(\d{2})$/.exec(input.birthTime);
  if (!date || !time) throw new Error('BaZi requires birthDate YYYY-MM-DD and birthTime HH:mm.');
  const hour = Number(time[1]);
  const minute = Number(time[2]);
  if (hour > 23 || minute > 59) throw new Error('BaZi birthTime is outside 00:00–23:59.');
  return {
    year: Number(date[1]),
    month: Number(date[2]),
    day: Number(date[3]),
    hour,
    minute,
  };
}

export function calculateBazi(input: BaziCalcInput): BaziCalcResult {
  const parts = civilParts(input);
  const eight = Solar.fromYmdHms(parts.year, parts.month, parts.day, parts.hour, parts.minute, 0)
    .getLunar()
    .getEightChar();
  const pillar = (
    ganZhi: string,
    gan: string,
    zhi: string,
    hideGan: string[],
  ): BaziPillar => ({ ganZhi, gan, zhi, hideGan: [...hideGan] });
  return {
    package: 'lunar-javascript',
    version: '1.7.7',
    sect: eight.getSect(),
    year: pillar(eight.getYear(), eight.getYearGan(), eight.getYearZhi(), eight.getYearHideGan()),
    month: pillar(eight.getMonth(), eight.getMonthGan(), eight.getMonthZhi(), eight.getMonthHideGan()),
    day: pillar(eight.getDay(), eight.getDayGan(), eight.getDayZhi(), eight.getDayHideGan()),
    time: pillar(eight.getTime(), eight.getTimeGan(), eight.getTimeZhi(), eight.getTimeHideGan()),
    text: eight.toString(),
  };
}
