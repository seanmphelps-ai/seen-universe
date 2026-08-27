import { z } from 'zod';

const CalendarYearSchema = z.string().regex(/^\d{4}$/, 'Enter a four-digit calendar year.');

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
  birthDate: z.iso.date(),
  birthLocation: z.string().trim().min(1),
  livedLocations: z.array(z.string().trim().min(1)),
  livedPeriods: z.array(ResidencePeriodSchema),
  currentLocation: z.string().trim().min(1),
  currentPeriod: CurrentResidencePeriodSchema,
  minimumResidenceMonths: z.literal(12),
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

export type ResidencePeriod = z.infer<typeof ResidencePeriodSchema>;
export type FoundationIntake = z.infer<typeof FoundationIntakeSchema>;
