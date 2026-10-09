// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
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
    interpretiveAuthority: 'Positions only. Shadow reading requires a locked, named school packet.',
    unresolved: ['Western interpretive school and edition await source lock', 'Swiss license choice for public service awaits recording'],
  },
  hellenistic: {
    calcAuthority: 'swisseph-wasm calculateNatalChart + houses W + azalt SE_ECL2HOR; kriya-ephemeris-timelords@0.1.2 partOfFortuneDeg, partOfSpiritDeg, partOfErosDeg (lib/hellenisticCalc.ts)',
    interpretiveAuthority: 'Valens, Paulus, Dorotheus, Ptolemy kept as separate streams in docs/research/hellenistic/',
    unresolved: [
      'kriya partOfErosDeg is a library-specific Eros stream; the SEEN Eros default awaits source selection',
      'Valens Eros and Schmidt fixed-direction formulas require separate calculation support',
      'sect uses the geometric trueAltitude > 0 threshold',
      'independent validator',
      'production readings blocked by SOURCE_LOCK',
    ],
  },
  jyotisha: {
    calcAuthority: 'swisseph-wasm sidereal via calculateJyotishaAstronomy in lib/seen/jyotishaAstronomy.ts; siderealMode is required on the call',
    interpretiveAuthority: 'Parashari, Varahamihira, Jaimini remain distinct packets. Use each school’s own interpretation.',
    unresolved: ['ayanamsha mode for a production run awaits selection', 'external Vedic shelf awaits import', 'Ashlesha native calc pending'],
  },
  bazi: {
    calcAuthority: 'lunar-javascript@1.7.7 Solar.fromYmdHms → getEightChar (lib/baziCalc.ts)',
    interpretiveAuthority: 'San Ming Tong Hui edition/passages await source lock',
    unresolved: ['calculation uses civil time', 'San Ming Tong Hui edition awaits source lock'],
  },
  numerology: {
    calcAuthority: '@csessh/sochumenh@0.3.0 parseDob and numeric calculators (lib/numerologyCalc.ts)',
    interpretiveAuthority: 'Goodwin/Decoz edition pages await verification',
    unresolved: ['Goodwin/Decoz edition awaits comparison with this package'],
  },
  tzolkin: {
    calcAuthority: '@drewsonne/maya-dates@1.3.14 LongCount.fromGregorian with package correlation 584283 GMT (lib/tzolkinCalc.ts)',
    interpretiveAuthority: 'Smithsonian Living Maya Time + community/primary authority for day meaning',
    unresolved: ['Smithsonian converter awaits comparison with this package', 'Use source-verified traditional Tzolk’in meanings'],
  },
  dreamspell: {
    calcAuthority: '@oshimishi/dreamspell-math@0.3.2 dreamdate (lib/dreamspellCalc.ts)',
    interpretiveAuthority: '13 Moon / Dreamspell originator materials only',
    unresolved: ['keep separate from traditional Tzolk\u2019in'],
  },
  humandesign: {
    calcAuthority: 'free-human-design@1.0.1 computeChart (lib/humanDesignCalc.ts)',
    interpretiveAuthority: 'Candidate calculation only. Interpretive text awaits a licensed Jovian Archive source packet.',
    unresolved: [
      'candidate modality awaiting interpretive activation',
      'gate order and design solar arc await comparison with a Jovian worked chart',
      'output is scoped to Human Design calculation fields',
    ],
  },
  iching: {
    calcAuthority: 'none — lib/ichingCalc.ts calculateIChing fails closed',
    interpretiveAuthority: 'Zhou Yi requires a separate cast record. Portals occupy their own layer.',
    unresolved: [
      'cast record (question, method, six lines) awaits collection',
      'birth-date-to-hexagram mapping remains unspecified',
      'i-ching.ask produces random casts; deterministic cast support remains pending',
      '@iching/core package availability remains unresolved',
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
      positions.hasBirthTime ? 'houses from given clock' : 'houses require a supplied clock',
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
      unresolved: base.unresolved.filter((item) => item !== 'ayanamsha mode for a production run awaits selection'),
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
      trace: ['lib/ichingCalc.ts', 'calculateIChing', blocked?.message ?? 'I Ching calculation requires fail-closed behavior'],
      unresolved: [...base.unresolved, blocked?.message ?? 'I Ching calculation requires fail-closed behavior'],
    };
  }

  const unreachable: never = modality;
  throw new Error(`Calculation axle required for ${unreachable}`);
}

export async function auditNative(reading: NativeReading): Promise<NativeReading> {
  if (reading.status === 'positions_only') {
    return {
      ...reading,
      status: 'pending_auditor',
      unresolved: [...reading.unresolved, reading.positions
        ? 'positions exist; interpretive auditor awaits a locked school packet'
        : 'library calculation exists; interpretive auditor awaits a locked school packet'],
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
