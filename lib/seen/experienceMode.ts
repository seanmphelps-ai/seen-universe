import { z } from 'zod';

export const ExperienceModeInputSchema = z.object({
  mode: z.enum(['single_person', 'multi_person']),
});

export const ExperienceModeOutputSchema = z.object({
  mode: z.enum(['single_person', 'multi_person']),
  requiredPersonCount: z.union([z.literal(1), z.literal(2)]),
  activePersonIndex: z.literal(0),
  next: z.enum(['person_a_foundation', 'closure_people']),
});

export type ExperienceModeInput = z.infer<typeof ExperienceModeInputSchema>;
export type ExperienceModeOutput = z.infer<typeof ExperienceModeOutputSchema>;

export function resolveExperienceMode(input: ExperienceModeInput): ExperienceModeOutput {
  const parsed = ExperienceModeInputSchema.parse(input);
  if (parsed.mode === 'single_person') {
    return {
      mode: 'single_person',
      requiredPersonCount: 1,
      activePersonIndex: 0,
      next: 'person_a_foundation',
    };
  }
  return {
    mode: 'multi_person',
    requiredPersonCount: 2,
    activePersonIndex: 0,
    next: 'closure_people',
  };
}
