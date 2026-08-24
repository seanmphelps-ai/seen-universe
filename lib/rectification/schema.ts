import { z } from 'zod';

export const RectificationCandidateSchema = z.object({
  index: z.number().int().min(0).max(2),
  chart: z.unknown(),
});

export const RectificationScenarioSchema = z.object({
  scenario: z.string().min(20),
  reactions: z.array(
    z.object({
      candidateIndex: z.number().int().min(0).max(2),
      reaction: z.string().min(20),
    }),
  ).length(3),
});

export const RectificationScenarioResponseSchema = z.object({
  scenarios: z.array(RectificationScenarioSchema).length(3),
});

export const RectificationScenarioRequestSchema = z.object({
  round: z.number().int().min(0).max(3),
  candidates: z.array(RectificationCandidateSchema).length(3),
});

export type RectificationScenarioResponse = z.infer<typeof RectificationScenarioResponseSchema>;
