import { z } from 'zod';
import { BirthAnchorSchema, PlaceSchema, type LivedPlace, type Place } from './intakeSchema';
import { livedStackFromPlaces } from './livedExposure';

/** Click path after the location card. No clock card. */
export const INTAKE_CARDS = ['name', 'birthDate', 'birthCity', 'livedPlaces'] as const;

export type IntakeCard = (typeof INTAKE_CARDS)[number];

const BirthDateSchema = z.iso.date();

export type IntakeBirthRecord = {
  name: string;
  birthDate: string;
  city: Place;
  livedPlaces: LivedPlace[];
  livedStack: string;
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
