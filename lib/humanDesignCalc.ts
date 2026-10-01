// Wheel: free-human-design@1.0.1 (MIT) https://github.com/adamblvck/free-human-design
// Call: computeChart({ birthdate, birthtime, timezone, location }).
// Input: birthDate YYYY-MM-DD, birthTime HH:mm, latitude, longitude.
// Timezone is the IANA zone tz-lookup returns for those coordinates.
// Output: the package bodygraph (type, profile, centers, gates, channels, 13+13 activations).
// Gene Keys spheres and the package astrology section are not returned.

import { createRequire } from 'node:module';
import tzlookup from 'tz-lookup';

const require = createRequire(import.meta.url);

type HdActivation = {
  stream: string;
  body: string;
  gate: number;
  line: number;
  color: number;
  longitude: number;
  retrograde: boolean;
};

type HdChannel = {
  key: string;
  gates: number[];
  centers: string[];
  name: string;
};

type HdChart = {
  humanDesign: {
    type: string;
    authority: string;
    profile: string | null;
    definitionCount: number;
    activations: { personality: HdActivation[]; design: HdActivation[] };
    activatedGates: number[];
    definedChannels: HdChannel[];
    definedCenters: string[];
    openCenters: string[];
    centers: Record<string, boolean>;
  };
  _meta: { jd_personality: number; jd_design: number };
};

const { computeChart } = require('free-human-design') as {
  computeChart: (input: {
    birthdate: string;
    birthtime: string;
    timezone: string;
    location: { lat: number; lng: number };
  }) => HdChart;
};

export type HumanDesignCalcInput = {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
};

export type HumanDesignCalcResult = {
  package: 'free-human-design';
  version: '1.0.1';
  timezone: string;
  latitude: number;
  longitude: number;
  type: string;
  authority: string;
  profile: string | null;
  definitionCount: number;
  activatedGates: number[];
  definedCenters: string[];
  openCenters: string[];
  centers: Record<string, boolean>;
  definedChannels: HdChannel[];
  activations: { personality: HdActivation[]; design: HdActivation[] };
  julianDay: { personality: number; design: number };
};

export function calculateHumanDesign(input: HumanDesignCalcInput): HumanDesignCalcResult {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  const time = /^(\d{2}):(\d{2})$/.exec(input.birthTime);
  if (!date || !time || !Number.isFinite(input.latitude) || !Number.isFinite(input.longitude)) {
    throw new Error('Human Design requires birthDate YYYY-MM-DD, birthTime HH:mm, and coordinates.');
  }
  const timezone = tzlookup(input.latitude, input.longitude);
  const chart = computeChart({
    birthdate: input.birthDate,
    birthtime: input.birthTime,
    timezone,
    location: { lat: input.latitude, lng: input.longitude },
  });
  const body = chart.humanDesign;
  return {
    package: 'free-human-design',
    version: '1.0.1',
    timezone,
    latitude: input.latitude,
    longitude: input.longitude,
    type: body.type,
    authority: body.authority,
    profile: body.profile,
    definitionCount: body.definitionCount,
    activatedGates: body.activatedGates,
    definedCenters: body.definedCenters,
    openCenters: body.openCenters,
    centers: body.centers,
    definedChannels: body.definedChannels,
    activations: body.activations,
    julianDay: {
      personality: chart._meta.jd_personality,
      design: chart._meta.jd_design,
    },
  };
}
