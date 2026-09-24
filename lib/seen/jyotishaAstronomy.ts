import SwissEph from 'swisseph-wasm';
import tzlookup from 'tz-lookup';
import { DateTime } from 'luxon';

export type SiderealMode = 'lahiri' | 'raman' | 'fagan-bradley';

export type JyotishaAstronomyInput = {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  siderealMode: SiderealMode;
};

export async function calculateJyotishaAstronomy(input: JyotishaAstronomyInput) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  const time = /^(\d{2}):(\d{2})$/.exec(input.birthTime);
  if (!date || !time || !Number.isFinite(input.latitude) || Math.abs(input.latitude) > 90 ||
      !Number.isFinite(input.longitude) || Math.abs(input.longitude) > 180) {
    throw new Error('A valid birth date, exact time, and birth coordinates are required.');
  }
  const zone = tzlookup(input.latitude, input.longitude);
  const local = DateTime.fromObject({
    year: Number(date[1]), month: Number(date[2]), day: Number(date[3]),
    hour: Number(time[1]), minute: Number(time[2]),
  }, { zone });
  if (!local.isValid || local.toFormat('yyyy-MM-dd HH:mm') !== `${input.birthDate} ${input.birthTime}` ||
      local.getPossibleOffsets().length !== 1) {
    throw new Error('Birth time is invalid or ambiguous in its local timezone.');
  }

  const swe = new SwissEph();
  await swe.initSwissEph();
  try {
    const modeCodes: Record<SiderealMode, number> = {
      lahiri: swe.SE_SIDM_LAHIRI,
      raman: swe.SE_SIDM_RAMAN,
      'fagan-bradley': swe.SE_SIDM_FAGAN_BRADLEY,
    };
    if (!(input.siderealMode in modeCodes)) throw new Error('Explicit supported sidereal mode required.');
    const modeCode = modeCodes[input.siderealMode];
    swe.set_sid_mode(modeCode, 0, 0);
    const utc = local.toUTC();
    const julianDayUt = swe.julday(utc.year, utc.month, utc.day,
      utc.hour + utc.minute / 60);
    const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;
    const ayanamshaDegrees = swe.get_ayanamsa_ex_ut(julianDayUt, swe.SEFLG_SWIEPH);
    if (ayanamshaDegrees === null) throw new Error('Swiss ayanamsha calculation failed.');
    const bodies = {
      sun: swe.SE_SUN, moon: swe.SE_MOON, mercury: swe.SE_MERCURY,
      venus: swe.SE_VENUS, mars: swe.SE_MARS, jupiter: swe.SE_JUPITER,
      saturn: swe.SE_SATURN, northNode: swe.SE_TRUE_NODE,
    };
    const longitudes = Object.fromEntries(Object.entries(bodies).map(([body, code]) => {
      const raw = swe.calc_ut(julianDayUt, code, flags);
      return [body, ((raw[0] % 360) + 360) % 360];
    })) as Record<keyof typeof bodies, number>;
    return {
      longitudes,
      provenance: {
        localBirthTime: local.toISO(), utcBirthTime: utc.toISO(), timezone: zone,
        birthCoordinates: { latitude: input.latitude, longitude: input.longitude },
        julianDayUt, siderealMode: input.siderealMode, siderealModeCode: modeCode,
        ayanamshaDegrees, swissEphemerisVersion: swe.version(),
        requestedFlags: flags, reference: 'geocentric ecliptic of date',
      },
    };
  } finally {
    swe.close();
  }
}
