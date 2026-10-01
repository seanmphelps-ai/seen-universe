import { partOfErosDeg, partOfFortuneDeg, partOfSpiritDeg } from 'kriya-ephemeris-timelords';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { readBazi } from '../../agent/subagents/bazi/agent';
import { readDreamspell } from '../../agent/subagents/dreamspell/agent';
import { readHellenisticPositions } from '../../agent/subagents/hellenistic/agent';
import { readHumanDesign } from '../../agent/subagents/humandesign/agent';
import { readIChing } from '../../agent/subagents/iching/agent';
import { readJyotishaAstronomy } from '../../agent/subagents/jyotish/agent';
import { readNumerology } from '../../agent/subagents/numerology/agent';
import { readTzolkin } from '../../agent/subagents/tzolkin/agent';
import { readWesternChart } from '../../agent/subagents/western/agent';
import { readNative } from '../agents/execution';
import { IChingCalcBlocked } from '../ichingCalc';

const require = createRequire(import.meta.url);
const { computeChart } = require('free-human-design') as {
  computeChart: (input: {
    birthdate: string;
    birthtime: string;
    timezone: string;
    location: { lat: number; lng: number };
  }) => {
    humanDesign: {
      type: string;
      profile: string | null;
      activatedGates: number[];
      definedCenters: string[];
    };
  };
};

const birth = {
  name: 'Nguyen Van A',
  birthDate: '1990-03-15',
  birthTime: '08:37',
  latitude: 10.82,
  longitude: 106.63,
};

describe('modality calculation axles', () => {
  it('returns lunar-javascript EightChar pillars for the package fixture', () => {
    const chart = readBazi({ birthDate: '2005-12-23', birthTime: '08:37' });
    expect(chart.package).toBe('lunar-javascript');
    expect(chart.sect).toBe(2);
    expect(chart.year.ganZhi).toBe('乙酉');
    expect(chart.month.ganZhi).toBe('戊子');
    expect(chart.day.ganZhi).toBe('辛巳');
    expect(chart.time.ganZhi).toBe('壬辰');
    expect(chart.text).toBe('乙酉 戊子 辛巳 壬辰');
  });

  it('returns dreamspell-math kin fields for 2018-06-26', () => {
    const dream = readDreamspell({ birthDate: '2018-06-26' });
    expect(dream.package).toBe('@oshimishi/dreamspell-math');
    expect(dream.kin.number).toBe(139);
    expect(dream.kin.toneName).toBe('Solar');
    expect(dream.kin.signName).toBe('BlueStorm');
    expect(dream.oracle.analog.number).toBeGreaterThan(0);
  });

  it('returns maya-dates 13.0.0.0.0 for 2012-12-21 under GMT 584283', () => {
    const maya = readTzolkin({ birthDate: '2012-12-21' });
    expect(maya.package).toBe('@drewsonne/maya-dates');
    expect(maya.correlation).toEqual({ value: 584283, name: 'GMT' });
    expect(maya.longCount).toBe('13. 0. 0. 0. 0');
    expect(maya.tzolkin).toBe('4 Ajaw');
    expect(maya.haab).toBe('3 K\'ank\'in');
  });

  it('returns sochumenh life path 1 for the package example', () => {
    const numbers = readNumerology({ name: 'Nguyen Van A', birthDate: '1990-03-15' });
    expect(numbers.package).toBe('@csessh/sochumenh');
    expect(numbers.nameAccepted).toBe(true);
    expect(numbers.lifePath).toEqual({ value: 1, karmicDebtHits: [19] });
    expect(numbers.dob).toEqual({ day: 15, month: 3, year: 1990 });
  });

  it('wires readNative to each wheel without a default sidereal mode or BaZi hour', async () => {
    const bazi = await readNative('bazi', { ...birth, birthTime: null });
    expect(bazi.status).toBe('pending_source_lock');
    expect(bazi.calculation).toBeUndefined();

    const openMode = await readNative('jyotisha', birth);
    expect(openMode.status).toBe('pending_source_lock');

    const pillars = await readNative('bazi', { ...birth, birthDate: '2005-12-23', birthTime: '08:37' });
    expect(pillars.calcAuthority).toContain('lunar-javascript@1.7.7');
    expect(pillars.calculation).toMatchObject({ text: '乙酉 戊子 辛巳 壬辰' });

    const dream = await readNative('dreamspell', birth);
    expect(dream.calculation).toMatchObject({ package: '@oshimishi/dreamspell-math' });

    const tzolkin = await readNative('tzolkin', { ...birth, birthDate: '2012-12-21' });
    expect(tzolkin.calculation).toMatchObject({ longCount: '13. 0. 0. 0. 0' });

    const numbers = await readNative('numerology', birth);
    expect(numbers.calculation).toMatchObject({ lifePath: { value: 1 } });

    const greenwich = {
      name: birth.name,
      birthDate: '2000-01-01',
      birthTime: '12:00',
      latitude: 51.48,
      longitude: 0,
    };
    const western = await readWesternChart(greenwich);
    const westernViaExecution = await readNative('western', greenwich);
    expect(westernViaExecution.positions?.planets.map((planet) => planet.longitude)).toEqual(
      western.planets.map((planet) => planet.longitude),
    );
    const jyotish = await readJyotishaAstronomy({ ...greenwich, birthTime: '12:00', siderealMode: 'lahiri' });
    const jyotishViaExecution = await readNative('jyotisha', { ...greenwich, siderealMode: 'lahiri' });
    expect(jyotishViaExecution.calculation).toMatchObject({
      longitudes: jyotish.longitudes,
      provenance: { siderealMode: 'lahiri' },
    });

    const hellenistic = await readHellenisticPositions(greenwich);
    expect(hellenistic.positions.planets.length).toBeGreaterThan(0);
    expect(hellenistic.sect?.dayBirth).toBe(true);
    expect(hellenistic.sect?.trueAltitude).toBeGreaterThan(0);
    const signStart = Math.floor(hellenistic.positions.ascendant!.longitude / 30) * 30;
    expect(hellenistic.wholeSign?.cusps[0]).toMatchObject({ house: 1, longitude: signStart });
    expect(hellenistic.wholeSign?.cusps).toHaveLength(12);
    const lotInput = {
      ascendantDeg: hellenistic.positions.ascendant!.longitude,
      sunDeg: hellenistic.positions.planets.find((planet) => planet.key === 'sun')!.longitude,
      moonDeg: hellenistic.positions.planets.find((planet) => planet.key === 'moon')!.longitude,
      venusDeg: hellenistic.positions.planets.find((planet) => planet.key === 'venus')!.longitude,
      dayBirth: hellenistic.sect!.dayBirth,
    };
    expect(hellenistic.lots?.fortune.longitude).toBe(partOfFortuneDeg(lotInput));
    expect(hellenistic.lots?.spirit.longitude).toBe(partOfSpiritDeg(lotInput));
    expect(hellenistic.lots?.eros.longitude).toBe(partOfErosDeg(lotInput));
    expect(hellenistic.lots?.eros.formulaTraditionId).toBe('partOfErosDeg');
    const night = await readHellenisticPositions({ ...greenwich, birthTime: '00:00' });
    expect(night.sect?.dayBirth).toBe(false);
    expect(night.sect?.trueAltitude).toBeLessThan(0);
    expect(night.lots?.fortune.longitude).toBe(partOfFortuneDeg({
      ascendantDeg: night.positions.ascendant!.longitude,
      sunDeg: night.positions.planets.find((planet) => planet.key === 'sun')!.longitude,
      moonDeg: night.positions.planets.find((planet) => planet.key === 'moon')!.longitude,
      venusDeg: night.positions.planets.find((planet) => planet.key === 'venus')!.longitude,
      dayBirth: false,
    }));
    const viaExecution = await readNative('hellenistic', greenwich);
    expect(viaExecution.positions?.planets.map((planet) => planet.longitude)).toEqual(
      hellenistic.positions.planets.map((planet) => planet.longitude),
    );
    expect(viaExecution.calculation).toMatchObject({
      lots: { fortune: { longitude: hellenistic.lots?.fortune.longitude } },
    });

    const noTime = await readNative('hellenistic', { ...greenwich, birthTime: null });
    expect(noTime.positions?.ascendant).toBeNull();
    expect(noTime.calculation).toMatchObject({ lots: null, sect: null, wholeSign: null });

    const direct = computeChart({
      birthdate: '2000-01-01',
      birthtime: '12:00',
      timezone: 'Europe/London',
      location: { lat: 51.48, lng: 0 },
    });
    const hd = readHumanDesign({
      birthDate: '2000-01-01',
      birthTime: '12:00',
      latitude: 51.48,
      longitude: 0,
    });
    expect(hd.package).toBe('free-human-design');
    expect(hd.type).toBe(direct.humanDesign.type);
    expect(hd.profile).toBe(direct.humanDesign.profile);
    expect(hd.activatedGates).toEqual(direct.humanDesign.activatedGates);
    expect(hd.definedCenters).toEqual(direct.humanDesign.definedCenters);
    expect(hd.activations.personality).toHaveLength(13);
    expect(hd.activations.design).toHaveLength(13);
    const hdViaExecution = await readNative('humandesign', greenwich);
    expect(hdViaExecution.calculation).toMatchObject({ type: hd.type, profile: hd.profile });
    const hdNoTime = await readNative('humandesign', { ...greenwich, birthTime: null });
    expect(hdNoTime.status).toBe('pending_source_lock');
    expect(hdNoTime.calculation).toBeUndefined();

    expect(() => readIChing()).toThrow(IChingCalcBlocked);
    const iching = await readNative('iching', greenwich);
    expect(iching.status).toBe('pending_source_lock');
    expect(iching.calculation).toBeUndefined();
    expect(iching).not.toHaveProperty('hexagram');
  });
});
