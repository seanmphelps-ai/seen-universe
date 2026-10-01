import { calculateBazi } from '../baziCalc';
import { calculateDreamspell } from '../dreamspellCalc';
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
  | 'dreamspell';

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
    calcAuthority: 'swisseph-wasm via calculateNatalChart in lib/natalChart.ts (tropical positions)',
    interpretiveAuthority: 'Valens, Paulus, Dorotheus, Ptolemy kept as separate streams in docs/research/hellenistic/',
    unresolved: ['Eros formula', 'night policy', 'sect threshold', 'whole-sign houses', 'independent validator', 'production readings blocked by SOURCE_LOCK'],
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

  if (modality === 'western' || modality === 'hellenistic') {
    const positions = await calculateNatalChart(input);
    return calculated(base, [
      'lib/natalChart.ts',
      'calculateNatalChart',
      'swisseph-wasm',
      'SEFLG_SWIEPH',
      modality === 'hellenistic' ? 'Lots and whole-sign houses are not called' : (positions.hasBirthTime ? 'houses from given clock' : 'no guessed noon houses'),
    ], { positions });
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

  return calculated(base, ['lib/dreamspellCalc.ts', 'calculateDreamspell', '@oshimishi/dreamspell-math', 'dreamdate'], {
    calculation: calculateDreamspell({ birthDate: input.birthDate }),
  });
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
  const modalities: ModalityId[] = ['western', 'hellenistic', 'jyotisha', 'bazi', 'numerology', 'tzolkin', 'dreamspell'];
  const readings: NativeReading[] = [];
  for (const modality of modalities) {
    const reading = await readNative(modality, input);
    readings.push(await auditNative(reading));
  }
  return readings;
}
