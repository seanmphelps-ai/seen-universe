import { calculateNatalChart, type NatalChartInput, type NatalChartResult } from '../natalChart';

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

export type NativeReading = {
  modality: ModalityId;
  status: CocoonStatus;
  calcAuthority: string;
  interpretiveAuthority: string;
  trace: string[];
  positions?: NatalChartResult;
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
    calcAuthority: 'Swiss positions plus named sect / whole-sign / Lots only after SOURCE_LOCK',
    interpretiveAuthority: 'Valens, Paulus, Dorotheus, Ptolemy kept as separate streams in docs/research/hellenistic/',
    unresolved: ['Eros formula', 'night policy', 'sect threshold', 'independent validator', 'production readings blocked by SOURCE_LOCK'],
  },
  jyotisha: {
    calcAuthority: 'Swiss sidereal with explicit ayanamsha mode — not defaulted',
    interpretiveAuthority: 'Parashari, Varahamihira, Jaimini remain distinct packets. No universal Vedic reading.',
    unresolved: ['ayanamsha mode for a production run not selected', 'external Vedic shelf not imported', 'Ashlesha native calc pending'],
  },
  bazi: {
    calcAuthority: 'Candidate: lunar-javascript Eight Characters + solar terms — unverified',
    interpretiveAuthority: 'San Ming Tong Hui edition/passages not locked',
    unresolved: ['Li Chun / jie boundaries', 'true solar time policy', 'second independent calculator'],
  },
  numerology: {
    calcAuthority: 'Named school reduction rules — not locked',
    interpretiveAuthority: 'Goodwin/Decoz edition pages not checked',
    unresolved: ['school name', 'master-number rules', 'name normalization'],
  },
  tzolkin: {
    calcAuthority: 'Gregorian/JDN + declared Maya correlation; Smithsonian converter as check',
    interpretiveAuthority: 'Smithsonian Living Maya Time + community/primary authority for day meaning',
    unresolved: ['correlation constant', 'day boundary', 'do not copy Dreamspell kin meanings'],
  },
  dreamspell: {
    calcAuthority: 'Foundation for the Law of Time decoder',
    interpretiveAuthority: '13 Moon / Dreamspell originator materials only',
    unresolved: ['edition/version', 'Feb 29 handling', 'keep separate from traditional Tzolk\u2019in'],
  },
};

export async function readNative(modality: ModalityId, input: NatalChartInput): Promise<NativeReading> {
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
    return {
      ...base,
      status: 'positions_only',
      trace: ['lib/natalChart.ts', 'SEFLG_SWIEPH', positions.hasBirthTime ? 'houses from given clock' : 'no guessed noon houses'],
      positions,
    };
  }

  return {
    ...base,
    status: 'pending_source_lock',
    trace: [`${modality} cocoon isolated`, 'no shared memory', 'no reading until source lock + auditor pass'],
  };
}

export async function auditNative(reading: NativeReading): Promise<NativeReading> {
  if (reading.status === 'positions_only') {
    return {
      ...reading,
      status: 'pending_auditor',
      unresolved: [...reading.unresolved, 'positions exist; interpretive auditor has no locked school packet'],
    };
  }
  return reading;
}

export async function runIsolatedModalities(input: NatalChartInput) {
  const modalities: ModalityId[] = ['western', 'hellenistic', 'jyotisha', 'bazi', 'numerology', 'tzolkin', 'dreamspell'];
  const readings: NativeReading[] = [];
  for (const modality of modalities) {
    const reading = await readNative(modality, input);
    readings.push(await auditNative(reading));
  }
  return readings;
}
