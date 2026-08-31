import { z } from 'zod'
import {
  FOUNDATION_INTAKE_CONTRACT,
  FoundationIntakeContractSchema,
  FoundationIntakeSchema,
  IntakeFieldKeySchema,
  type FoundationIntake,
  type FoundationIntakeContract,
  type IntakeFieldKey,
} from './foundationIntake.schema'

/**
 * FoundationIntakeSchema and its directly related types/consts now live in
 * foundationIntake.schema.ts and are re-exported here for compatibility — see
 * that file's header for why. Client components should import them from
 * foundationIntake.schema.ts directly rather than through this file, so
 * OperatingTimeStateSchema's discriminatedUnion below never enters a client
 * bundle that doesn't need it.
 */
export {
  FOUNDATION_INTAKE_CONTRACT,
  FoundationIntakeContractSchema,
  FoundationIntakeSchema,
  IntakeFieldKeySchema,
}
export type { FoundationIntake, FoundationIntakeContract, IntakeFieldKey }

export const SplashSequenceStepSchema = z.enum([
  'BLACK_SCREEN',
  'PLAY_MUTED_INLINE_VIDEO',
  'TRIPLE_WHITE_FLASH',
  'FADE_TO_BLACK',
  'PRIMARY_LINE_WORD_SEQUENCE',
  'PAUSE',
  'SECONDARY_LINE',
  'EXPAND_GOLD_LINE',
  'FADE_IN_BIRTH_DATA_INTAKE',
  'SHOW_READY_CTA',
])
export type SplashSequenceStep = z.infer<typeof SplashSequenceStepSchema>

export const SplashSequenceSchema = z.object({
  order: z.tuple([
    z.literal('BLACK_SCREEN'),
    z.literal('PLAY_MUTED_INLINE_VIDEO'),
    z.literal('TRIPLE_WHITE_FLASH'),
    z.literal('FADE_TO_BLACK'),
    z.literal('PRIMARY_LINE_WORD_SEQUENCE'),
    z.literal('PAUSE'),
    z.literal('SECONDARY_LINE'),
    z.literal('EXPAND_GOLD_LINE'),
    z.literal('FADE_IN_BIRTH_DATA_INTAKE'),
    z.literal('SHOW_READY_CTA'),
  ]),
  video: z.object({
    format: z.literal('mp4'),
    playsInline: z.literal(true),
    muted: z.literal(true),
  }),
  flash: z.object({
    count: z.literal(3),
    fadeOutMs: z.literal(2000),
  }),
  primaryLine: z.object({
    text: z.literal('You are not your sun sign.'),
    color: z.literal('gold'),
    reveal: z.literal('word_by_word'),
    nextWordOverlapSeconds: z.literal(0.05),
    previousWordBeginsDisappearingAsNextAppears: z.literal(true),
    startsAtMs: z.literal(2400),
  }),
  secondaryLine: z.object({
    text: z.literal('You are so much more than that.'),
    color: z.literal('gold'),
    italic: z.literal(true),
    reveal: z.literal('all_at_once'),
    startsAtMs: z.literal(3800),
  }),
  goldLine: z.object({
    startWidthPx: z.literal(0),
    endWidthPx: z.literal(200),
    startsAtMs: z.literal(5000),
  }),
  intakeFadesInBeneath: z.literal(true),
  cta: z.object({
    label: z.literal('Are you ready to be SEEN?'),
    appearsLast: z.literal(true),
    presentation: z.literal('chip_button'),
  }),
})
export type SplashSequence = z.infer<typeof SplashSequenceSchema>

export const OperatingTimeCandidateSchema = z.object({
  candidateId: z.string().trim().min(1),
  time: z.string().trim().min(1),
  convergenceScore: z.number().min(0).max(1),
  recognitionScore: z.number().min(0).max(1),
})
export type OperatingTimeCandidate = z.infer<typeof OperatingTimeCandidateSchema>

export const OperatingTimeStateSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('unresolved'),
    submittedBirthTime: z.string().trim().min(1).optional(),
    usedAsExactTime: z.literal(false),
  }),
  z.object({
    status: z.literal('calibrating'),
    submittedBirthTime: z.string().trim().min(1).optional(),
    candidates: z.array(OperatingTimeCandidateSchema).min(1),
    convergenceRequired: z.literal(true),
    userRecognitionRequired: z.literal(true),
    usedAsExactTime: z.literal(false),
  }),
  z.object({
    status: z.literal('resolved'),
    resolvedBirthTime: z.string().trim().min(1),
    resolvedCandidateId: z.string().trim().min(1),
    resolvedThroughConvergence: z.literal(true),
    confirmedThroughUserRecognition: z.literal(true),
    usedDirectlyAndFullyAsExactTime: z.literal(true),
  }),
])
export type OperatingTimeState = z.infer<typeof OperatingTimeStateSchema>

export const SPLASH_SEQUENCE: SplashSequence = {
  order: [
    'BLACK_SCREEN',
    'PLAY_MUTED_INLINE_VIDEO',
    'TRIPLE_WHITE_FLASH',
    'FADE_TO_BLACK',
    'PRIMARY_LINE_WORD_SEQUENCE',
    'PAUSE',
    'SECONDARY_LINE',
    'EXPAND_GOLD_LINE',
    'FADE_IN_BIRTH_DATA_INTAKE',
    'SHOW_READY_CTA',
  ],
  video: {
    format: 'mp4',
    playsInline: true,
    muted: true,
  },
  flash: {
    count: 3,
    fadeOutMs: 2000,
  },
  primaryLine: {
    text: 'You are not your sun sign.',
    color: 'gold',
    reveal: 'word_by_word',
    nextWordOverlapSeconds: 0.05,
    previousWordBeginsDisappearingAsNextAppears: true,
    startsAtMs: 2400,
  },
  secondaryLine: {
    text: 'You are so much more than that.',
    color: 'gold',
    italic: true,
    reveal: 'all_at_once',
    startsAtMs: 3800,
  },
  goldLine: {
    startWidthPx: 0,
    endWidthPx: 200,
    startsAtMs: 5000,
  },
  intakeFadesInBeneath: true,
  cta: {
    label: 'Are you ready to be SEEN?',
    appearsLast: true,
    presentation: 'chip_button',
  },
}

SplashSequenceSchema.parse(SPLASH_SEQUENCE)
