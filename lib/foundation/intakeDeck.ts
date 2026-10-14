// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { z } from 'zod';
import { BirthAnchorSchema, PlaceSchema, type LivedPlace, type Place } from './intakeSchema';
import { buildIncubator, livedStackFromPlaces, type Incubator } from './livedExposure';


export const INTAKE_CARDS = ['name', 'birthDate', 'birthTime', 'birthCity', 'livedPlaces'] as const;

export type IntakeCard = (typeof INTAKE_CARDS)[number];

const BirthDateSchema = z.iso.date();
const BirthTimeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);

export type IntakeBirthRecord = {
  name: string;
  birthDate: string;
  /** null when the birth time is not known. */
  birthTime: string | null;
  city: Place;
  livedPlaces: LivedPlace[];
  livedStack: string;
  incubator: Incubator;
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

/** Birth time is optional (collected if known); only a non-blank, malformed entry errors. */
export function birthTimeCardError(birthTime: string): string | null {
  if (!birthTime.trim()) return null;
  if (!BirthTimeSchema.safeParse(birthTime).success) return 'Enter birth time as HH:mm, or leave it blank if not known.';
  return null;
}

export function buildIntakeRecord(input: {
  name: string;
  birthDate: string;
  /** null when the birth time is not known. */
  birthTime: string | null;
  birthCity: Place;
  livedPlaces: LivedPlace[];
}): IntakeBirthRecord {
  const anchor = BirthAnchorSchema.parse({
    name: input.name.trim(),
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthCity: input.birthCity,
  });

  return {
    name: anchor.name,
    birthDate: anchor.birthDate,
    birthTime: anchor.birthTime,
    city: anchor.birthCity,
    livedPlaces: input.livedPlaces,
    livedStack: livedStackFromPlaces(input.livedPlaces),
    incubator: buildIncubator({ birthCity: anchor.birthCity, livedPlaces: input.livedPlaces }),
  };
}
