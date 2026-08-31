import { z } from 'zod'

/**
 * Split out of splashAndFoundationIntake.schema.ts deliberately.
 *
 * That file also defines OperatingTimeStateSchema (a z.discriminatedUnion).
 * Client components only need FoundationIntakeSchema, but importing it from
 * the combined file still executes every top-level statement in that module
 * — including the discriminatedUnion construction — because ES modules run
 * their whole body on import regardless of which named export is used.
 *
 * That discriminatedUnion construction hits a real Next.js production
 * minifier bug: `ReferenceError: discriminator is not defined` during
 * prerendering, because the minifier mis-scopes Zod's internal `discriminator`
 * parameter when this code is bundled into a client component. Confirmed via
 * `npm run build` and isolated with a standalone Node reproduction of
 * z.discriminatedUnion, which works correctly outside Next's bundler — so this
 * is a bundling interaction, not a Zod logic bug, and not fixable by a Zod
 * version bump (4.4.3 is already latest stable).
 *
 * Fix: client components import FoundationIntakeSchema/FoundationIntake from
 * here instead, so OperatingTimeStateSchema's discriminatedUnion never enters
 * the client bundle. splashAndFoundationIntake.schema.ts re-exports these for
 * any other existing import path.
 */

export const IntakeFieldKeySchema = z.enum([
  'birthLocation',
  'locationsLivedOneYearOrMore',
  'currentLocation',
  'birthDate',
  'birthTime',
])
export type IntakeFieldKey = z.infer<typeof IntakeFieldKeySchema>

export const FoundationIntakeSchema = z.object({
  birthLocation: z.string().trim().min(1),
  locationsLivedOneYearOrMore: z.array(z.string().trim().min(1)).default([]),
  currentLocation: z.string().trim().min(1),
  birthDate: z.string().trim().min(1),
  birthTime: z.string().trim().min(1).optional(),
})
export type FoundationIntake = z.infer<typeof FoundationIntakeSchema>

export const FoundationIntakeContractSchema = z.object({
  fieldOrder: z.tuple([
    z.literal('birthLocation'),
    z.literal('locationsLivedOneYearOrMore'),
    z.literal('currentLocation'),
    z.literal('birthDate'),
    z.literal('birthTime'),
  ]),
  locationsLivedOneYearOrMoreAllowsMultiple: z.literal(true),
  birthTimeOptionalAtIntake: z.literal(true),
  birthTimeUsedDirectlyBeforeResolution: z.literal(false),
})
export type FoundationIntakeContract = z.infer<typeof FoundationIntakeContractSchema>

export const FOUNDATION_INTAKE_CONTRACT: FoundationIntakeContract = {
  fieldOrder: [
    'birthLocation',
    'locationsLivedOneYearOrMore',
    'currentLocation',
    'birthDate',
    'birthTime',
  ],
  locationsLivedOneYearOrMoreAllowsMultiple: true,
  birthTimeOptionalAtIntake: true,
  birthTimeUsedDirectlyBeforeResolution: false,
}

FoundationIntakeContractSchema.parse(FOUNDATION_INTAKE_CONTRACT)
