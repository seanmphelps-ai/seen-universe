import { z } from 'zod'

export const EnvironmentalStateSchema = z.enum([
  'present',
  'absent',
  'constrained',
  'displaced',
])
export type EnvironmentalState = z.infer<typeof EnvironmentalStateSchema>

export const EnvironmentalDomainSchema = z.enum([
  'physical',
  'ecological',
  'housing',
  'material',
  'economic',
  'work',
  'education',
  'health',
  'household',
  'social',
  'cultural',
  'religious',
  'institutional',
  'safety',
  'substance',
  'mobility',
  'information',
  'recreation',
  'status',
  'identity',
  'relationship',
  'timeRhythm',
  'instability',
  'opportunity',
  'naturalAffordance',
  'sensory',
])
export type EnvironmentalDomain = z.infer<typeof EnvironmentalDomainSchema>

export const EnvironmentalObservationSchema = z.object({
  domain: EnvironmentalDomainSchema.optional(),
  state: EnvironmentalStateSchema,
  value: z.string().trim().min(1),
})
export type EnvironmentalObservation = z.infer<typeof EnvironmentalObservationSchema>

export const LocationEnvironmentSchema = z.object({
  location: z.string().trim().min(1),
  observations: z.array(EnvironmentalObservationSchema).default([]),
})
export type LocationEnvironment = z.infer<typeof LocationEnvironmentSchema>

export const EnvironmentalIntakeSchema = z.array(LocationEnvironmentSchema).default([])
export type EnvironmentalIntake = z.infer<typeof EnvironmentalIntakeSchema>
