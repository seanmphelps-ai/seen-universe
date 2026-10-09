// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import { createRequire } from 'node:module';
import type { DreamDate } from '@oshimishi/dreamspell-math';

const require = createRequire(import.meta.url);
const { dreamdate } = require('@oshimishi/dreamspell-math') as {
  dreamdate: (date: unknown) => DreamDate;
};

export type DreamspellCalcInput = {
  birthDate: string;
};

export type DreamspellKin = {
  number: number;
  name: string;
  signNumber: number;
  signName: string;
  toneIndex: number;
  toneNumber: number;
  toneName: string;
};

export type DreamspellCalcResult = {
  package: '@oshimishi/dreamspell-math';
  version: '0.3.2';
  kin: DreamspellKin;
  yearKin: DreamspellKin;
  color: DreamDate['kin']['color'];
  isGalacticPortal: boolean;
  isMysticColumn: boolean;
  moon: number;
  day: number;
  dayOfYear: number;
  dayOfWeek: number;
  plasma: number;
  week: DreamDate['week'];
  oracle: {
    analog: DreamspellKin;
    driver: DreamspellKin;
    antipod: DreamspellKin;
    occult: DreamspellKin;
  };
};

function kinFields(kin: DreamDate['kin']): DreamspellKin {
  return {
    number: kin.number,
    name: kin.name,
    signNumber: kin.sign.number,
    signName: kin.sign.name,
    toneIndex: kin.tone.number,
    toneNumber: kin.tone.normilize(),
    toneName: kin.tone.name,
  };
}

export function calculateDreamspell(input: DreamspellCalcInput): DreamspellCalcResult {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  if (!date) throw new Error('Dreamspell requires birthDate YYYY-MM-DD.');
  const dream = dreamdate([Number(date[1]), Number(date[2]) - 1, Number(date[3])]);
  const oracle = dream.kin.getOracle();
  return {
    package: '@oshimishi/dreamspell-math',
    version: '0.3.2',
    kin: kinFields(dream.kin),
    yearKin: kinFields(dream.yearKin),
    color: dream.kin.color,
    isGalacticPortal: dream.kin.isGalacticPortal,
    isMysticColumn: dream.kin.isMysticColumn,
    moon: dream.moon,
    day: dream.day,
    dayOfYear: dream.dayOfYear,
    dayOfWeek: dream.dayOfWeek,
    plasma: dream.plasma,
    week: dream.week,
    oracle: {
      analog: kinFields(oracle.analog),
      driver: kinFields(oracle.driver),
      antipod: kinFields(oracle.antipod),
      occult: kinFields(oracle.occult),
    },
  };
}
