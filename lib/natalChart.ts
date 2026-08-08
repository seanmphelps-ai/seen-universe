// lib/natalChart.ts
//
// Real natal chart calculation via swisseph-wasm — a WebAssembly build of the
// actual Swiss Ephemeris C library (Astrodienst), run with the SEFLG_SWIEPH
// flag (not SEFLG_MOSEPH/Moshier). Runs in-browser, no native bindings, so it
// stays compatible with static export.
//
// Local birth time is converted to UTC via tz-lookup (coordinates -> IANA
// timezone) + luxon (correct historical DST handling for that zone), then
// swe_julday/swe_calc_ut/swe_houses do the actual astronomy.
//
// If birth time is unknown, house placements, Ascendant, and Midheaven are
// left out entirely rather than computed from a guessed noon time — those
// values are only valid with a real birth time.

import SwissEph from "swisseph-wasm";
import tzlookup from "tz-lookup";
import { DateTime } from "luxon";

export type NatalChartInput = {
  name: string;
  birthDate: string; // "1979-08-01"
  birthTime: string | null; // "12:41" or null
  latitude: number;
  longitude: number;
};

export type PlanetPlacement = {
  key: string;
  label: string;
  sign: string;
  degreeInSign: number;
  longitude: number;
  house: number | null;
  retrograde: boolean;
};

export type AnglePlacement = {
  label: string;
  sign: string;
  degreeInSign: number;
  longitude: number;
};

export type HouseCusp = {
  house: number;
  sign: string;
  degreeInSign: number;
  longitude: number;
};

export type AspectResult = {
  point1: string;
  point2: string;
  aspect: string;
  orb: number;
};

export type NatalChartResult = {
  name: string;
  hasBirthTime: boolean;
  timezone: string;
  planets: PlanetPlacement[];
  ascendant: AnglePlacement | null;
  midheaven: AnglePlacement | null;
  houses: HouseCusp[] | null;
  aspects: AspectResult[];
};

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const PLANET_LABELS: { key: string; label: string }[] = [
  { key: "sun", label: "Sun" },
  { key: "moon", label: "Moon" },
  { key: "mercury", label: "Mercury" },
  { key: "venus", label: "Venus" },
  { key: "mars", label: "Mars" },
  { key: "jupiter", label: "Jupiter" },
  { key: "saturn", label: "Saturn" },
  { key: "uranus", label: "Uranus" },
  { key: "neptune", label: "Neptune" },
  { key: "pluto", label: "Pluto" },
];

// Major-aspect angles and orbs. Orb size is a matter of astrological
// convention, not an empirical fact — these are standard, commonly used
// values (tighter for sextile, wider for conjunction/opposition), not
// invented for this app.
const MAJOR_ASPECTS: { name: string; angle: number; orb: number }[] = [
  { name: "Conjunction", angle: 0, orb: 8 },
  { name: "Sextile", angle: 60, orb: 6 },
  { name: "Square", angle: 90, orb: 7 },
  { name: "Trine", angle: 120, orb: 8 },
  { name: "Opposition", angle: 180, orb: 8 },
];

function signPlacement(longitude: number) {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign: Math.round((normalized - signIndex * 30) * 100) / 100,
    longitude: normalized,
  };
}

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function findAspect(
  point1: string,
  longitude1: number,
  point2: string,
  longitude2: number,
): AspectResult | null {
  const separation = angularSeparation(longitude1, longitude2);
  for (const candidate of MAJOR_ASPECTS) {
    const orb = Math.abs(separation - candidate.angle);
    if (orb <= candidate.orb) {
      return {
        point1,
        point2,
        aspect: candidate.name,
        orb: Math.round(orb * 100) / 100,
      };
    }
  }
  return null;
}

export async function calculateNatalChart(
  input: NatalChartInput,
): Promise<NatalChartResult> {
  const hasBirthTime = Boolean(input.birthTime && input.birthTime.trim() !== "");
  const [hour, minute] = hasBirthTime ? input.birthTime!.split(":").map(Number) : [12, 0];

  const timezone = tzlookup(input.latitude, input.longitude);
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const local = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone: timezone },
  );
  const utc = local.toUTC();

  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    const jd = swe.julday(utc.year, utc.month, utc.day, utc.hour + utc.minute / 60);
    const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;

    const planetCodes: Record<string, number> = {
      sun: swe.SE_SUN,
      moon: swe.SE_MOON,
      mercury: swe.SE_MERCURY,
      venus: swe.SE_VENUS,
      mars: swe.SE_MARS,
      jupiter: swe.SE_JUPITER,
      saturn: swe.SE_SATURN,
      uranus: swe.SE_URANUS,
      neptune: swe.SE_NEPTUNE,
      pluto: swe.SE_PLUTO,
    };

    const rawPositions: Record<string, Float64Array> = {};
    for (const { key } of PLANET_LABELS) {
      rawPositions[key] = swe.calc_ut(jd, planetCodes[key], flags);
    }

    let houseCusps: Float64Array | null = null;
    let ascmc: Float64Array | null = null;
    if (hasBirthTime) {
      const h = swe.houses(jd, input.latitude, input.longitude, "P");
      houseCusps = h.cusps;
      ascmc = h.ascmc;
    }

    function houseForLongitude(longitude: number): number | null {
      if (!houseCusps) return null;
      const norm = ((longitude % 360) + 360) % 360;
      for (let i = 1; i <= 12; i++) {
        const start = houseCusps[i];
        const end = houseCusps[i === 12 ? 1 : i + 1];
        const span = ((end - start + 360) % 360) || 360;
        const offset = ((norm - start + 360) % 360);
        if (offset < span) return i;
      }
      return null;
    }

    const planets: PlanetPlacement[] = PLANET_LABELS.map(({ key, label }) => {
      const raw = rawPositions[key];
      const placement = signPlacement(raw[0]);
      return {
        key,
        label,
        sign: placement.sign,
        degreeInSign: placement.degreeInSign,
        longitude: placement.longitude,
        house: houseForLongitude(raw[0]),
        retrograde: raw[3] < 0,
      };
    });

    const ascendant: AnglePlacement | null = ascmc
      ? { label: "Ascendant", ...signPlacement(ascmc[0]) }
      : null;
    const midheaven: AnglePlacement | null = ascmc
      ? { label: "Midheaven", ...signPlacement(ascmc[1]) }
      : null;

    const houses: HouseCusp[] | null = houseCusps
      ? Array.from({ length: 12 }, (_, i) => {
          const houseNum = i + 1;
          const placement = signPlacement(houseCusps![houseNum]);
          return { house: houseNum, ...placement };
        })
      : null;

    const aspectPoints: { label: string; longitude: number }[] = planets.map((p) => ({
      label: p.label,
      longitude: p.longitude,
    }));
    if (ascendant) aspectPoints.push({ label: "Ascendant", longitude: ascendant.longitude });
    if (midheaven) aspectPoints.push({ label: "Midheaven", longitude: midheaven.longitude });

    const aspects: AspectResult[] = [];
    for (let i = 0; i < aspectPoints.length; i++) {
      for (let j = i + 1; j < aspectPoints.length; j++) {
        const found = findAspect(
          aspectPoints[i].label,
          aspectPoints[i].longitude,
          aspectPoints[j].label,
          aspectPoints[j].longitude,
        );
        if (found) aspects.push(found);
      }
    }

    return {
      name: input.name,
      hasBirthTime,
      timezone,
      planets,
      ascendant,
      midheaven,
      houses,
      aspects,
    };
  } finally {
    swe.close();
  }
}
