// PROVENANCE: bot=grok session=2026-10-24 task=rename environmental exposure engine to incubator
import { z } from 'zod';

const CalendarYearSchema = z.string().regex(/^\d{4}$/, 'Enter a four-digit calendar year.');

export const PlaceSchema = z.object({
  name: z.string().trim().min(1),
  country: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const IdentitySchema = z.object({
  name: z.string().trim().min(1),
});

const BirthTimeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Enter birth time as HH:mm, 24-hour.');

export const BirthAnchorSchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.iso.date(),
  birthCity: PlaceSchema,
  /** null when the birth time is not known. */
  birthTime: BirthTimeSchema.nullable(),
});

export const LivedPlaceSchema = z.object({
  place: PlaceSchema,
  startYear: z.number().int().min(1800).max(2100),
  endYear: z.number().int().min(1800).max(2100).nullable(),
  yearsLived: z.number().min(0.5),
});

export const LivedExposureSchema = z.object({
  birthAnchor: BirthAnchorSchema,
  livedPlaces: z.array(LivedPlaceSchema),
});

export const ResidencePeriodSchema = z.object({
  incubator: z.string().trim().min(1),
  startYear: CalendarYearSchema,
  endYear: CalendarYearSchema,
}).superRefine(({ startYear, endYear }, context) => {
  if (Number(startYear) > Number(endYear)) {
    context.addIssue({
      code: 'custom',
      path: ['endYear'],
      message: 'End year must be the same as or later than the start year.',
    });
  }
});

export const CurrentResidencePeriodSchema = z.object({
  startYear: CalendarYearSchema,
  endYear: z.literal('present'),
});

export const FoundationIntakeSchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.iso.date(),
  /** null when the birth time is not known. */
  birthTime: BirthTimeSchema.nullable(),
  birthLocation: z.string().trim().min(1),
  birthCity: PlaceSchema.optional(),
  maternityIncubator: z.string().trim().optional(),
  livedIncubators: z.array(z.string().trim().min(1)),
  livedPeriods: z.array(ResidencePeriodSchema),
  livedPlaces: z.array(LivedPlaceSchema).optional(),
  currentIncubator: z.string().trim().min(1),
  currentPeriod: CurrentResidencePeriodSchema,
  minimumResidenceMonths: z.literal(6),
}).superRefine(({ livedIncubators, livedPeriods }, context) => {
  if (
    livedIncubators.length !== livedPeriods.length ||
    livedIncubators.some((incubator, index) => incubator !== livedPeriods[index]?.incubator)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['livedIncubators'],
      message: 'Lived incubators must match their exposure periods.',
    });
  }
});

export type Place = z.infer<typeof PlaceSchema>;
export type Identity = z.infer<typeof IdentitySchema>;
export type BirthAnchor = z.infer<typeof BirthAnchorSchema>;
export type LivedPlace = z.infer<typeof LivedPlaceSchema>;
export type LivedExposure = z.infer<typeof LivedExposureSchema>;
export type ResidencePeriod = z.infer<typeof ResidencePeriodSchema>;
export type FoundationIntake = z.infer<typeof FoundationIntakeSchema>;
