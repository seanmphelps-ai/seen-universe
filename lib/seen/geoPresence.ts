/**
 * GeoPresence — location as dirt pressure, not lat/long labels.
 * Locked phrase: "Take the stars and shove them in the dirt."
 * Heuristic baseline from lived text + coordinates. Does NOT invent planetary positions.
 */

export type GeoPresenceInput = {
  birthPlaceLabel: string;
  latitude: number;
  longitude: number;
  livedStack?: string;
};

export type BaselinePressureEffect = {
  amplification: number;
  suppression: number;
  sensitization: number;
  delay: number;
  distortion: number;
  rerouteWeight: number;
};

export type GeoPresenceResult = {
  summary: string;
  factors: {
    lightHeat: string;
    povertySignal: string;
    violenceSignal: string;
    landSignal: string;
  };
  livedYearsNoted: string[];
  baselinePressure: BaselinePressureEffect;
  doctrine: string;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function parseLivedYears(livedStack: string | undefined): string[] {
  if (!livedStack?.trim()) return [];
  return livedStack
    .split(/[.\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 24);
}

export function computeGeoPresence(input: GeoPresenceInput): GeoPresenceResult {
  const lived = parseLivedYears(input.livedStack);
  const text = `${input.birthPlaceLabel}\n${input.livedStack ?? ''}`.toLowerCase();

  const urban =
    /los angeles|la\b|new york|chicago|detroit|oakland|baltimore|philadelphia|houston|miami|urban|projects|ghetto|freeway|concrete/.test(
      text,
    );
  const coastal = /beach|coast|ocean|marina|hermosa|santa monica|malibu|pacific/.test(text);
  const mountain = /montana|denver|whitefish|aspen|elevation|mountain|foothill/.test(text);
  const povertyHint = /poor|poverty|section 8|welfare|trailer|motel|homeless|evict/.test(text);
  const violenceHint = /riot|shoot|gang|crime|overdose|war|abuse|violence/.test(text);

  const amplification = clamp01(
    (urban ? 0.35 : 0.15) + (violenceHint ? 0.25 : 0) + (povertyHint ? 0.2 : 0) + (lived.length > 3 ? 0.1 : 0),
  );
  const suppression = clamp01(coastal ? 0.2 : mountain ? 0.1 : 0.05);
  const sensitization = clamp01(urban ? 0.3 : 0.15);
  const delay = clamp01(mountain ? 0.2 : 0.1);
  const distortion = clamp01(violenceHint || povertyHint ? 0.35 : urban ? 0.2 : 0.1);
  const rerouteWeight = clamp01(lived.length >= 2 ? 0.25 : 0.1);

  return {
    summary:
      'Location is shoveled under the sky: light, heat, poverty, violence, and land shape the card sentences. Coordinates only locate the dirt.',
    factors: {
      lightHeat: coastal
        ? 'Marine-moderated light; heat spikes less extreme than inland basin.'
        : urban
          ? 'Basin/urban heat and light pollution; seasonal swing still bites.'
          : mountain
            ? 'High-contrast seasons; cold/heat extremes train vigilance.'
            : 'Ambient light/heat profile inferred from place labels — refine with lived years.',
      povertySignal: povertyHint
        ? 'Lived text flags scarcity pressure — amplify survival loops.'
        : 'No explicit poverty language; keep scarcity as UNKNOWN unless lived years say otherwise.',
      violenceSignal: violenceHint
        ? 'Lived text flags threat/violence exposure — raise collapse/reactivity thresholds.'
        : 'No explicit violence language; do not invent body-count narratives.',
      landSignal: urban
        ? 'Concrete/containment land — low wild-animal imprint, high institutional density.'
        : mountain
          ? 'Open/altitude land — solitude and threat-detection rewarded.'
          : coastal
            ? 'Ocean-edge land — rhythmic wind/water pressure.'
            : 'Land character from labels only; expand with GeoPresence research later.',
    },
    livedYearsNoted: lived,
    baselinePressure: {
      amplification,
      suppression,
      sensitization,
      delay,
      distortion,
      rerouteWeight,
    },
    doctrine: 'Take the stars and shove them in the dirt.',
  };
}
