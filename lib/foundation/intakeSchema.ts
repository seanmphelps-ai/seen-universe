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

export const BirthAnchorSchema = z.object({
  name: z.string().trim().min(1),
  birthDate: z.iso.date(),
  birthCity: PlaceSchema,
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
  location: z.string().trim().min(1),
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
  birthLocation: z.string().trim().min(1),
  birthCity: PlaceSchema.optional(),
  maternityLocation: z.string().trim().optional(),
  livedLocations: z.array(z.string().trim().min(1)),
  livedPeriods: z.array(ResidencePeriodSchema),
  livedPlaces: z.array(LivedPlaceSchema).optional(),
  currentLocation: z.string().trim().min(1),
  currentPeriod: CurrentResidencePeriodSchema,
  minimumResidenceMonths: z.literal(6),
}).superRefine(({ livedLocations, livedPeriods }, context) => {
  if (
    livedLocations.length !== livedPeriods.length ||
    livedLocations.some((location, index) => location !== livedPeriods[index]?.location)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['livedLocations'],
      message: 'Lived locations must match their exposure periods.',
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
