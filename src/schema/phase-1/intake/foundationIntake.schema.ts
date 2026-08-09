import { z } from 'zod'
import { EnvironmentalIntakeSchema } from './environmentalIntake.schema'

/**
 * Split out of splashAndFoundationIntake.schema.ts deliberately.
 *
 * Client components only need the foundation intake contract here. Keep this
 * module free of unrelated runtime unions so it remains safe in the client bundle.
 */

export const IntakeFieldKeySchema = z.enum([
  'birthLocation',
  'locationsLivedOneYearOrMore',
  'currentLocation',
  'environmentalIntake',
  'birthDate',
  'birthTime',
])
export type IntakeFieldKey = z.infer<typeof IntakeFieldKeySchema>

export const FoundationIntakeSchema = z.object({
  birthLocation: z.string().trim().min(1),
  locationsLivedOneYearOrMore: z.array(z.string().trim().min(1)).default([]),
  currentLocation: z.string().trim().min(1),
  environmentalIntake: EnvironmentalIntakeSchema.default([]),
  birthDate: z.string().trim().min(1),
  birthTime: z.string().trim().min(1).optional(),
})
export type FoundationIntake = z.infer<typeof FoundationIntakeSchema>

export const FoundationIntakeContractSchema = z.object({
  fieldOrder: z.tuple([
    z.literal('birthLocation'),
    z.literal('locationsLivedOneYearOrMore'),
    z.literal('currentLocation'),
    z.literal('environmentalIntake'),
    z.literal('birthDate'),
    z.literal('birthTime'),
  ]),
  locationsLivedOneYearOrMoreAllowsMultiple: z.literal(true),
  environmentalIntakeAttachedPerLocation: z.literal(true),
  birthTimeOptionalAtIntake: z.literal(true),
  birthTimeUsedDirectlyBeforeResolution: z.literal(false),
})
export type FoundationIntakeContract = z.infer<typeof FoundationIntakeContractSchema>

export const FOUNDATION_INTAKE_CONTRACT: FoundationIntakeContract = {
  fieldOrder: [
    'birthLocation',
    'locationsLivedOneYearOrMore',
    'currentLocation',
    'environmentalIntake',
    'birthDate',
    'birthTime',
  ],
  locationsLivedOneYearOrMoreAllowsMultiple: true,
  environmentalIntakeAttachedPerLocation: true,
  birthTimeOptionalAtIntake: true,
  birthTimeUsedDirectlyBeforeResolution: false,
}

FoundationIntakeContractSchema.parse(FOUNDATION_INTAKE_CONTRACT)
