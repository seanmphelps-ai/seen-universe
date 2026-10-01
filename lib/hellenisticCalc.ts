// Wheel: swisseph-wasm positions from calculateNatalChart, plus the same
// library's houses(..., "W") and azalt(SE_ECL2HOR). Lots are
// kriya-ephemeris-timelords@0.1.2 (MIT) partOfFortuneDeg / partOfSpiritDeg /
// partOfErosDeg, fed those Swiss longitudes. Peer: kriya-ephemeris@0.3.0.
// Input: NatalChartInput. Birth time is required for sect, whole-sign places, and Lots.
// Output: NatalChartResult plus labeled library Lots. partOfErosDeg is that
// package's one Eros function, not a SEEN default. Valens and Schmidt are not exported.

import SwissEph from 'swisseph-wasm';
import tzlookup from 'tz-lookup';
import { DateTime } from 'luxon';
import {
  partOfErosDeg,
  partOfFortuneDeg,
  partOfSpiritDeg,
  type LotInput,
} from 'kriya-ephemeris-timelords';
import { calculateNatalChart, type NatalChartInput, type NatalChartResult } from './natalChart';

export type LibraryLot = {
  longitude: number;
  witness: string;
};

export type HellenisticSect = {
  source: 'swisseph-wasm azalt SE_ECL2HOR';
  trueAltitude: number;
  apparentAltitude: number;
  dayBirth: boolean;
  rule: 'trueAltitude > 0';
  observerHeightMeters: 0;
};

export type WholeSignPlace = {
  key: string;
  place: number;
};

export type HellenisticCalcResult = {
  package: 'swisseph-wasm+kriya-ephemeris-timelords';
  positions: NatalChartResult;
  sect: HellenisticSect | null;
  wholeSign: {
    source: 'swisseph-wasm houses hsys W';
    cusps: { house: number; longitude: number }[];
    planetPlaces: WholeSignPlace[];
    midheavenPlace: number;
    lotPlaces: { fortune: number; spirit: number; eros: number };
  } | null;
  lots: {
    package: 'kriya-ephemeris-timelords';
    version: '0.1.2';
    dayBirth: boolean;
    fortune: LibraryLot;
    spirit: LibraryLot;
    eros: LibraryLot & {
      formulaTraditionId: 'partOfErosDeg';
      sourcePassage: string;
    };
  } | null;
  blocked: string | null;
};

const EROS_PASSAGE = 'kriya-ephemeris-timelords partOfErosDeg only. The package reverses Venus and Spirit when dayBirth is false. Valens Eros and Schmidt no-reverse are not exported. This is not a SEEN default.';

function angularDelta(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function placeForLongitude(cusps: Float64Array, longitude: number): number {
  const norm = ((longitude % 360) + 360) % 360;
  for (let house = 1; house <= 12; house += 1) {
    const start = cusps[house];
    const end = cusps[house === 12 ? 1 : house + 1];
    const span = ((end - start + 360) % 360) || 360;
    const offset = (norm - start + 360) % 360;
    if (offset < span) return house;
  }
  throw new Error('swisseph-wasm houses W did not contain this longitude.');
}

function longitudeOf(chart: NatalChartResult, key: string): number {
  const planet = chart.planets.find((item) => item.key === key);
  if (!planet) throw new Error(`calculateNatalChart did not return ${key}.`);
  return planet.longitude;
}

export async function calculateHellenistic(input: NatalChartInput): Promise<HellenisticCalcResult> {
  const positions = await calculateNatalChart(input);
  if (!positions.hasBirthTime || !positions.ascendant || !positions.midheaven || !input.birthTime) {
    return {
      package: 'swisseph-wasm+kriya-ephemeris-timelords',
      positions,
      sect: null,
      wholeSign: null,
      lots: null,
      blocked: 'Birth time is required for sect, whole-sign houses, and Lots.',
    };
  }

  const swe = new SwissEph();
  await swe.initSwissEph();
  try {
    const [hour, minute] = input.birthTime.split(':').map(Number);
    const timezone = tzlookup(input.latitude, input.longitude);
    const [year, month, day] = input.birthDate.split('-').map(Number);
    const utc = DateTime.fromObject(
      { year, month, day, hour, minute, second: 0 },
      { zone: timezone },
    ).toUTC();
    const jd = swe.julday(utc.year, utc.month, utc.day, utc.hour + utc.minute / 60);
    const sun = swe.calc_ut(jd, swe.SE_SUN, swe.SEFLG_SWIEPH | swe.SEFLG_SPEED);
    if (angularDelta(sun[0], longitudeOf(positions, 'sun')) > 1e-4) {
      throw new Error('Hellenistic Swiss session does not match calculateNatalChart sun longitude.');
    }

    const ecl2hor = (swe as unknown as { SE_ECL2HOR?: number }).SE_ECL2HOR;
    if (typeof ecl2hor !== 'number') throw new Error('swisseph-wasm SE_ECL2HOR is not available.');
    const horizontal = swe.azalt(
      jd,
      ecl2hor,
      [input.longitude, input.latitude, 0],
      0,
      0,
      [sun[0], sun[1], sun[2]],
    );
    const sect: HellenisticSect = {
      source: 'swisseph-wasm azalt SE_ECL2HOR',
      trueAltitude: horizontal.trueAltitude,
      apparentAltitude: horizontal.apparentAltitude,
      dayBirth: horizontal.trueAltitude > 0,
      rule: 'trueAltitude > 0',
      observerHeightMeters: 0,
    };

    const houses = swe.houses(jd, input.latitude, input.longitude, 'W');
    const cusps = Array.from({ length: 12 }, (_, index) => ({
      house: index + 1,
      longitude: houses.cusps[index + 1],
    }));
    const lotInput: LotInput = {
      ascendantDeg: positions.ascendant.longitude,
      sunDeg: longitudeOf(positions, 'sun'),
      moonDeg: longitudeOf(positions, 'moon'),
      venusDeg: longitudeOf(positions, 'venus'),
      dayBirth: sect.dayBirth,
    };
    const fortune = partOfFortuneDeg(lotInput);
    const spirit = partOfSpiritDeg(lotInput);
    const eros = partOfErosDeg(lotInput);

    return {
      package: 'swisseph-wasm+kriya-ephemeris-timelords',
      positions,
      sect,
      wholeSign: {
        source: 'swisseph-wasm houses hsys W',
        cusps,
        planetPlaces: positions.planets.map((planet) => ({
          key: planet.key,
          place: placeForLongitude(houses.cusps, planet.longitude),
        })),
        midheavenPlace: placeForLongitude(houses.cusps, positions.midheaven.longitude),
        lotPlaces: {
          fortune: placeForLongitude(houses.cusps, fortune),
          spirit: placeForLongitude(houses.cusps, spirit),
          eros: placeForLongitude(houses.cusps, eros),
        },
      },
      lots: {
        package: 'kriya-ephemeris-timelords',
        version: '0.1.2',
        dayBirth: sect.dayBirth,
        fortune: { longitude: fortune, witness: 'kriya-ephemeris-timelords@0.1.2#partOfFortuneDeg' },
        spirit: { longitude: spirit, witness: 'kriya-ephemeris-timelords@0.1.2#partOfSpiritDeg' },
        eros: {
          longitude: eros,
          witness: 'kriya-ephemeris-timelords@0.1.2#partOfErosDeg',
          formulaTraditionId: 'partOfErosDeg',
          sourcePassage: EROS_PASSAGE,
        },
      },
      blocked: null,
    };
  } finally {
    swe.close();
  }
}
