import { z } from 'zod';
import { BirthAnchorSchema, PlaceSchema, type LivedPlace, type Place } from './intakeSchema';
import { livedStackFromPlaces } from './livedExposure';

/**
 * Click path: enter, environmental exposure, birth date, anonymous time cards, reveal.
 * Location search stays on the exposure card. Time stays on the rectification page.
 */
export const INTAKE_CARDS = ['enter', 'exposure', 'mark', 'time', 'reveal'] as const;

export type IntakeCard = (typeof INTAKE_CARDS)[number];

export const INTAKE_DECK_HREF: Record<IntakeCard, string> = {
  enter: '/',
  exposure: '/foundation/location',
  mark: '/chart',
  time: '/foundation/rectification',
  reveal: '/foundation/reveal',
};

export const BIRTH_RECORD_KEY = 'seen.foundation.birth';
export const RECTIFICATION_RECORD_KEY = 'seen.foundation.rectification';

/**
 * Names of modalities this app already calculates.
 * Display only. This deck does not run those calculations.
 * Human Design is not an active interpretive modality. I Ching has no calculation.
 */
export const CALCULATED_MODALITY_NAMES = [
  'Western',
  'Hellenistic',
  'Jyotisha',
  'BaZi',
  'Numerology',
  "Tzolk'in",
  'Dreamspell',
] as const;

/** Subject token when the deck does not ask for a name. */
export const DECK_SUBJECT = 'self';

const BirthDateSchema = z.iso.date();

export type IntakeBirthRecord = {
  name: string;
  birthDate: string;
  city: Place;
  livedPlaces: LivedPlace[];
  livedStack: string;
};

export type DeckBirthRecord = IntakeBirthRecord & {
  birthLocation: string;
};

export function placeFromSuggestion(suggestion: {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}): Place {
  return PlaceSchema.parse({
    name: suggestion.city,
    country: suggestion.country,
    latitude: suggestion.latitude,
    longitude: suggestion.longitude,
  });
}

export function nameCardError(name: string): string | null {
  if (!name.trim()) return 'Enter the name of the system being read.';
  return null;
}

export function birthDateCardError(birthDate: string): string | null {
  if (!BirthDateSchema.safeParse(birthDate).success) return 'Choose a birth date.';
  return null;
}

export function birthCityCardError(city: Place | null): string | null {
  if (!city || !PlaceSchema.safeParse(city).success) return 'Select a birth city from the list.';
  return null;
}

export function exposureCardError(city: Place | null): string | null {
  if (!city || !PlaceSchema.safeParse(city).success) return 'Select a place from the list.';
  return null;
}

export function exposureFromStored(value: unknown): { city: Place; birthLocation: string } | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as { city?: unknown; birthLocation?: unknown };
  const parsed = PlaceSchema.safeParse(record.city);
  if (!parsed.success) return null;
  const birthLocation = typeof record.birthLocation === 'string' && record.birthLocation.trim()
    ? record.birthLocation.trim()
    : `${parsed.data.name}, ${parsed.data.country}`;
  return { city: parsed.data, birthLocation };
}

export function buildIntakeRecord(input: {
  name: string;
  birthDate: string;
  birthCity: Place;
  livedPlaces: LivedPlace[];
}): IntakeBirthRecord {
  const anchor = BirthAnchorSchema.parse({
    name: input.name.trim(),
    birthDate: input.birthDate,
    birthCity: input.birthCity,
  });

  return {
    name: anchor.name,
    birthDate: anchor.birthDate,
    city: anchor.birthCity,
    livedPlaces: input.livedPlaces,
    livedStack: livedStackFromPlaces(input.livedPlaces),
  };
}

export function buildDeckRecord(input: {
  birthDate: string;
  birthCity: Place;
  birthLocation?: string;
}): DeckBirthRecord {
  const record = buildIntakeRecord({
    name: DECK_SUBJECT,
    birthDate: input.birthDate,
    birthCity: input.birthCity,
    livedPlaces: [],
  });
  const birthLocation = input.birthLocation?.trim() || `${record.city.name}, ${record.city.country}`;
  return { ...record, birthLocation };
}

export function revealInputsReady(birth: unknown, rectification: unknown): boolean {
  const exposure = exposureFromStored(birth);
  if (!exposure || !birth || typeof birth !== 'object') return false;
  const birthDate = (birth as { birthDate?: unknown }).birthDate;
  if (typeof birthDate !== 'string' || birthDateCardError(birthDate)) return false;
  if (!rectification || typeof rectification !== 'object') return false;
  return (rectification as { locked?: unknown }).locked === true;
}
