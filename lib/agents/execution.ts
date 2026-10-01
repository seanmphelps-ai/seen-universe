import { calculateBazi } from '../baziCalc';
import { calculateDreamspell } from '../dreamspellCalc';
import { calculateHellenistic } from '../hellenisticCalc';
import { calculateHumanDesign } from '../humanDesignCalc';
import { calculateIChing, IChingCalcBlocked } from '../ichingCalc';
import { calculateNatalChart, type NatalChartInput, type NatalChartResult } from '../natalChart';
import { calculateNumerology } from '../numerologyCalc';
import { calculateJyotishaAstronomy, type SiderealMode } from '../seen/jyotishaAstronomy';
import { calculateTzolkin } from '../tzolkinCalc';

export type NativeSystem =
  | 'western'
  | 'hellenistic'
  | 'jyotisha'
  | 'bazi'
  | 'numerology'
  | 'tzolkin'
  | 'dreamspell'
  | 'humandesign'
  | 'iching';

export type ModalityId = NativeSystem;

export type JobContext = {
  name: string;
  birthDate: string;
  birthTime: string | null;
  latitude: number;
  longitude: number;
};

export type Reading = {
  system: NativeSystem;
  output: unknown;
  sources: string[];
};

export type PortalResult = {
  portal: number;
  output: unknown;
  sources: string[];
};

export type Audit = {
  passed: boolean;
  findings: string[];
};

export type NativeWorker = {
  system: NativeSystem;
  read: (context: JobContext) => Promise<Reading>;
  audit: (context: JobContext, reading: Reading) => Promise<Audit>;
};

export type PortalWorker = {
  portal: number;
  run: (context: JobContext, acceptedReadings: Reading[]) => Promise<PortalResult>;
  audit: (context: JobContext, result: PortalResult) => Promise<Audit>;
};

export type CocoonStatus = 'positions_only' | 'pending_source_lock' | 'pending_auditor';

export type NativeCalcInput = NatalChartInput & {
  siderealMode?: SiderealMode;
};

export type NativeReading = {
  modality: ModalityId;
  status: CocoonStatus;
  calcAuthority: string;
  interpretiveAuthority: string;
  trace: string[];
  positions?: NatalChartResult;
  calculation?: unknown;
  findings: never[];
  wounds: never[];
  unresolved: string[];
};

const COCOONS: Record<ModalityId, { calcAuthority: string; interpretiveAuthority: string; unresolved: string[] }> = {
  western: {
    calcAuthority: 'Astrodienst Swiss Ephemeris programmer manual https://www.astro.com/swisseph/swephprg.htm via swisseph-wasm SEFLG_SWIEPH',
    interpretiveAuthority: 'Not locked. Positions only. Named school packet required before any shadow reading.',
    unresolved: ['Western interpretive school and edition not locked', 'Swiss license choice for public service not recorded'],
  },
  hellenistic: {
    calcAuthority: 'swisseph-wasm calculateNatalChart + houses W + azalt SE_ECL2HOR; kriya-ephemeris-timelords@0.1.2 partOfFortuneDeg, partOfSpiritDeg, partOfErosDeg (lib/hellenisticCalc.ts)',
    interpretiveAuthority: 'Valens, Paulus, Dorotheus, Ptolemy kept as separate streams in docs/research/hellenistic/',
    unresolved: [
      'kriya partOfErosDeg is one library stream and is not a SEEN Eros default',
      'Valens Eros and Schmidt no-reverse are not exported by kriya-ephemeris-timelords',
      'sect threshold remains geometric trueAltitude > 0; twilight is not applied',
      'independent validator',
      'production readings blocked by SOURCE_LOCK',
    ],
  },
  jyotisha: {
    calcAuthority: 'swisseph-wasm sidereal via calculateJyotishaAstronomy in lib/seen/jyotishaAstronomy.ts; siderealMode is required on the call',
    interpretiveAuthority: 'Parashari, Varahamihira, Jaimini remain distinct packets. No universal Vedic reading.',
    unresolved: ['ayanamsha mode for a production run not selected', 'external Vedic shelf not imported', 'Ashlesha native calc pending'],
  },
  bazi: {
    calcAuthority: 'lunar-javascript@1.7.7 Solar.fromYmdHms → getEightChar (lib/baziCalc.ts)',
    interpretiveAuthority: 'San Ming Tong Hui edition/passages not locked',
    unresolved: ['true solar time is not applied', 'San Ming Tong Hui edition not locked'],
  },
  numerology: {
    calcAuthority: '@csessh/sochumenh@0.3.0 parseDob and numeric calculators (lib/numerologyCalc.ts)',
    interpretiveAuthority: 'Goodwin/Decoz edition pages not checked',
    unresolved: ['Goodwin/Decoz edition not checked against this package'],
  },
  tzolkin: {
    calcAuthority: '@drewsonne/maya-dates@1.3.14 LongCount.fromGregorian with package correlation 584283 GMT (lib/tzolkinCalc.ts)',
    interpretiveAuthority: 'Smithsonian Living Maya Time + community/primary authority for day meaning',
    unresolved: ['Smithsonian converter not run against this package', 'do not copy Dreamspell kin meanings'],
  },
  dreamspell: {
    calcAuthority: '@oshimishi/dreamspell-math@0.3.2 dreamdate (lib/dreamspellCalc.ts)',
    interpretiveAuthority: '13 Moon / Dreamspell originator materials only',
    unresolved: ['keep separate from traditional Tzolk\u2019in'],
  },
  humandesign: {
    calcAuthority: 'free-human-design@1.0.1 computeChart (lib/humanDesignCalc.ts)',
    interpretiveAuthority: 'Candidate calculation only. Jovian Archive text is not copied here.',
    unresolved: [
      'not an active interpretive modality',
      'gate order and design solar arc are not checked against a Jovian worked chart',
      'Gene Keys output from the package is not returned',
    ],
  },
  iching: {
    calcAuthority: 'none — lib/ichingCalc.ts calculateIChing fails closed',
    interpretiveAuthority: 'A Zhou Yi cast is not an intake field. Portals stay a separate layer.',
    unresolved: [
      'no cast (question, method, six lines) on intake',
      'no birth-date-to-hexagram mapping is specified',
      'i-ching.ask is non-deterministic and is not called',
      '@iching/core is not published',
    ],
  },
};

function calculated(
  base: Omit<NativeReading, 'status' | 'trace' | 'positions' | 'calculation'>,
  trace: string[],
  extra: Partial<Pick<NativeReading, 'positions' | 'calculation'>>,
): NativeReading {
  return { ...base, status: 'positions_only', trace, ...extra };
}

export async function readNative(modality: ModalityId, input: NativeCalcInput): Promise<NativeReading> {
  const cocoon = COCOONS[modality];
  const base = {
    modality,
    calcAuthority: cocoon.calcAuthority,
    interpretiveAuthority: cocoon.interpretiveAuthority,
    findings: [] as never[],
    wounds: [] as never[],
    unresolved: [...cocoon.unresolved],
  };

  if (modality === 'western') {
    const positions = await calculateNatalChart(input);
    return calculated(base, [
      'lib/natalChart.ts',
      'calculateNatalChart',
      'swisseph-wasm',
      'SEFLG_SWIEPH',
      positions.hasBirthTime ? 'houses from given clock' : 'no guessed noon houses',
    ], { positions });
  }

  if (modality === 'hellenistic') {
    const calculation = await calculateHellenistic(input);
    return calculated(base, [
      'lib/hellenisticCalc.ts',
      'calculateHellenistic',
      'swisseph-wasm',
      'houses W',
      'azalt SE_ECL2HOR',
      'kriya-ephemeris-timelords',
      'partOfFortuneDeg',
      'partOfSpiritDeg',
      'partOfErosDeg',
      calculation.blocked ?? 'lots from Swiss longitudes',
    ], { positions: calculation.positions, calculation });
  }

  if (modality === 'jyotisha') {
    if (!input.birthTime || !input.siderealMode) {
      return {
        ...base,
        status: 'pending_source_lock',
        trace: ['lib/seen/jyotishaAstronomy.ts', 'calculateJyotishaAstronomy', 'siderealMode and exact birth time are required'],
      };
    }
    const calculation = await calculateJyotishaAstronomy({
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      latitude: input.latitude,
      longitude: input.longitude,
      siderealMode: input.siderealMode,
    });
    return calculated({
      ...base,
      unresolved: base.unresolved.filter((item) => item !== 'ayanamsha mode for a production run not selected'),
    }, ['lib/seen/jyotishaAstronomy.ts', 'calculateJyotishaAstronomy', 'swisseph-wasm', `siderealMode:${input.siderealMode}`], { calculation });
  }

  if (modality === 'bazi') {
    if (!input.birthTime) {
      return {
        ...base,
        status: 'pending_source_lock',
        trace: ['lib/baziCalc.ts', 'calculateBazi', 'birthTime required for EightChar'],
      };
    }
    return calculated(base, ['lib/baziCalc.ts', 'calculateBazi', 'lunar-javascript', 'Solar.fromYmdHms', 'getEightChar'], {
      calculation: calculateBazi({ birthDate: input.birthDate, birthTime: input.birthTime }),
    });
  }

  if (modality === 'numerology') {
    const calculation = calculateNumerology({ name: input.name, birthDate: input.birthDate });
    return calculated({
      ...base,
      unresolved: calculation.nameAccepted
        ? base.unresolved
        : [...base.unresolved, '@csessh/sochumenh validateName rejected the intake name'],
    }, ['lib/numerologyCalc.ts', 'calculateNumerology', '@csessh/sochumenh'], { calculation });
  }

  if (modality === 'tzolkin') {
    return calculated(base, ['lib/tzolkinCalc.ts', 'calculateTzolkin', '@drewsonne/maya-dates', 'LongCount.fromGregorian', '584283'], {
      calculation: calculateTzolkin({ birthDate: input.birthDate }),
    });
  }

  if (modality === 'dreamspell') {
    return calculated(base, ['lib/dreamspellCalc.ts', 'calculateDreamspell', '@oshimishi/dreamspell-math', 'dreamdate'], {
      calculation: calculateDreamspell({ birthDate: input.birthDate }),
    });
  }

  if (modality === 'humandesign') {
    if (!input.birthTime) {
      return {
        ...base,
        status: 'pending_source_lock',
        trace: ['lib/humanDesignCalc.ts', 'calculateHumanDesign', 'birthTime required for computeChart'],
      };
    }
    return calculated(base, ['lib/humanDesignCalc.ts', 'calculateHumanDesign', 'free-human-design', 'computeChart'], {
      calculation: calculateHumanDesign({
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        latitude: input.latitude,
        longitude: input.longitude,
      }),
    });
  }

  if (modality === 'iching') {
    let blocked: IChingCalcBlocked | null = null;
    try {
      calculateIChing();
    } catch (error) {
      if (!(error instanceof IChingCalcBlocked)) throw error;
      blocked = error;
    }
    return {
      ...base,
      status: 'pending_source_lock',
      trace: ['lib/ichingCalc.ts', 'calculateIChing', blocked?.message ?? 'I Ching calc did not fail closed'],
      unresolved: [...base.unresolved, blocked?.message ?? 'I Ching calc did not fail closed'],
    };
  }

  const unreachable: never = modality;
  throw new Error(`No calculation axle for ${unreachable}`);
}

export async function auditNative(reading: NativeReading): Promise<NativeReading> {
  if (reading.status === 'positions_only') {
    return {
      ...reading,
      status: 'pending_auditor',
      unresolved: [...reading.unresolved, reading.positions
        ? 'positions exist; interpretive auditor has no locked school packet'
        : 'library calculation exists; interpretive auditor has no locked school packet'],
    };
  }
  return reading;
}

export async function runIsolatedModalities(input: NativeCalcInput) {
  const modalities: ModalityId[] = ['western', 'hellenistic', 'jyotisha', 'bazi', 'numerology', 'tzolkin', 'dreamspell', 'humandesign', 'iching'];
  const readings: NativeReading[] = [];
  for (const modality of modalities) {
    const reading = await readNative(modality, input);
    readings.push(await auditNative(reading));
  }
  return readings;
}
