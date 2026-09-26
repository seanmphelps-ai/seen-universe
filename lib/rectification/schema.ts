import { z } from 'zod';

export const HiddenClockSchema = z.enum(['04:00', '12:00', '20:00']);

export const WoundMarkerSchema = z.object({
  id: z.string().min(1),
  sourceSystemId: z.string().min(1),
  sign: z.string().min(1),
  degree: z.number(),
  house: z.number().int().min(1).max(12).nullable(),
});

export const HiddenRunSchema = z.object({
  clock: z.string().regex(/^\d{2}:\d{2}$/),
  woundMarkers: z.array(WoundMarkerSchema),
});

export const AttachmentOnCardSchema = z.object({
  howTheyAttach: z.string().min(1),
  howTheySabotageLove: z.string().min(1),
  whatLoveFallsVictimTo: z.string().min(1),
  costToTheOtherPerson: z.string().min(1),
});

export const DarkCardSchema = z.object({
  runId: z.string().min(1),
  /** Metadata only — never required for face render. */
  clock: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  /**
   * TODO (HARD LAW): not the recognition contract.
   * Recognition is not one anonymous folded paragraph.
   * Retained so the current rectification screen still typechecks.
   * Replace with PORTAL_EXTRACTION_FIELDS from lib/portals/template.ts.
   * Modalities stay whole. Location does not rewrite the native reading.
   */
  paragraph: z.string().min(80),
  reveal: z.string().min(1),
  pressure: z.string().min(1),
  consequence: z.string().min(1),
  release: z.string().min(1),
  trigger: z.string().min(1),
  pressurePoint: z.string().min(1),
  behavior: z.string().min(1),
  collapse: z.string().min(1),
  thrive: z.string().min(1),
  costToThem: z.string().min(1),
  costToOthers: z.string().min(1),
  whatIsLost: z.string().min(1),
  attachment: AttachmentOnCardSchema,
  wounds: z.array(z.object({
    sourceSystemId: z.string().min(1),
    sourceFindingId: z.string().min(1),
    wound: z.string().min(1),
    injury: z.string().min(1),
    darknessUnderneath: z.string().min(1),
  })),
  /** Ship-facing calibration — set by UI after recognition. */
  resonancePercent: z.number().int().min(0).max(100).optional(),
  /** Ship-facing calibration — age or age range text. */
  fromAge: z.string().min(1).optional(),
});

export const LockedTimeSchema = z.object({
  localClock: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1),
  confidence: z.enum(['round1', 'round2', 'round3', 'round4']),
  rounds: z.array(z.number().int().min(0).max(3)),
});

export const RectificationCandidateSchema = z.object({
  index: z.number().int().min(0).max(2),
  clock: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  chart: z.unknown(),
});

export const RectificationScenarioSchema = z.object({
  scenario: z.string().min(80),
  reactions: z.array(
    z.object({
      candidateIndex: z.number().int().min(0).max(2),
      reaction: z.string().min(80),
    }),
  ).min(2).max(3),
});

export const RectificationScenarioResponseSchema = z.object({
  scenarios: z.array(RectificationScenarioSchema).min(2).max(3),
});

export const RectificationScenarioRequestSchema = z.object({
  round: z.number().int().min(0).max(3),
  candidates: z.array(RectificationCandidateSchema).min(2).max(3),
  livedExposure: z.unknown().optional(),
  livedStack: z.string().optional(),
});

export type HiddenRun = z.infer<typeof HiddenRunSchema>;
export type DarkCard = z.infer<typeof DarkCardSchema>;
export type AttachmentOnCard = z.infer<typeof AttachmentOnCardSchema>;
export type LockedTime = z.infer<typeof LockedTimeSchema>;
export type WoundMarker = z.infer<typeof WoundMarkerSchema>;
export type RectificationScenarioResponse = z.infer<typeof RectificationScenarioResponseSchema>;
