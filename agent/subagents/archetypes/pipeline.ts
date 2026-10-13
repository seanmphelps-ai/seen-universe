// PROVENANCE: bot=grok session=2026-10-13 task=64 archetype agents run after modality subagents (no scoring)
import type { ChartSignal, InterrogatorResult } from '../../../lib/seen/interrogators/types'
import { interrogator as a1 } from './subagents/interrogator-01-the-creative/agent'
import { interrogator as a2 } from './subagents/interrogator-02-the-receptive/agent'
import { interrogator as a3 } from './subagents/interrogator-03-difficulty-at-the-beginning/agent'
import { interrogator as a4 } from './subagents/interrogator-04-youthful-folly/agent'
import { interrogator as a5 } from './subagents/interrogator-05-waiting-nourishment/agent'
import { interrogator as a6 } from './subagents/interrogator-06-conflict/agent'
import { interrogator as a7 } from './subagents/interrogator-07-the-army/agent'
import { interrogator as a8 } from './subagents/interrogator-08-holding-together-union/agent'
import { interrogator as a9 } from './subagents/interrogator-09-the-taming-power-of-the-small/agent'
import { interrogator as a10 } from './subagents/interrogator-10-treading-conduct/agent'
import { interrogator as a11 } from './subagents/interrogator-11-peace/agent'
import { interrogator as a12 } from './subagents/interrogator-12-standstill-stagnation/agent'
import { interrogator as a13 } from './subagents/interrogator-13-fellowship-with-men/agent'
import { interrogator as a14 } from './subagents/interrogator-14-possession-in-great-measure/agent'
import { interrogator as a15 } from './subagents/interrogator-15-modesty/agent'
import { interrogator as a16 } from './subagents/interrogator-16-enthusiasm/agent'
import { interrogator as a17 } from './subagents/interrogator-17-following/agent'
import { interrogator as a18 } from './subagents/interrogator-18-work-on-what-has-been-spoiled-decay/agent'
import { interrogator as a19 } from './subagents/interrogator-19-approach/agent'
import { interrogator as a20 } from './subagents/interrogator-20-contemplation-view/agent'
import { interrogator as a21 } from './subagents/interrogator-21-biting-through/agent'
import { interrogator as a22 } from './subagents/interrogator-22-grace/agent'
import { interrogator as a23 } from './subagents/interrogator-23-splitting-apart/agent'
import { interrogator as a24 } from './subagents/interrogator-24-return-the-turning-point/agent'
import { interrogator as a25 } from './subagents/interrogator-25-innocence-the-unexpected/agent'
import { interrogator as a26 } from './subagents/interrogator-26-the-taming-power-of-the-great/agent'
import { interrogator as a27 } from './subagents/interrogator-27-the-corners-of-the-mouth-providing-nourishment/agent'
import { interrogator as a28 } from './subagents/interrogator-28-preponderance-of-the-great/agent'
import { interrogator as a29 } from './subagents/interrogator-29-the-abysmal-water/agent'
import { interrogator as a30 } from './subagents/interrogator-30-the-clinging-fire/agent'
import { interrogator as a31 } from './subagents/interrogator-31-influence-wooing/agent'
import { interrogator as a32 } from './subagents/interrogator-32-duration/agent'
import { interrogator as a33 } from './subagents/interrogator-33-retreat/agent'
import { interrogator as a34 } from './subagents/interrogator-34-the-power-of-the-great/agent'
import { interrogator as a35 } from './subagents/interrogator-35-progress/agent'
import { interrogator as a36 } from './subagents/interrogator-36-darkening-of-the-light/agent'
import { interrogator as a37 } from './subagents/interrogator-37-the-family-the-clan/agent'
import { interrogator as a38 } from './subagents/interrogator-38-opposition/agent'
import { interrogator as a39 } from './subagents/interrogator-39-obstruction/agent'
import { interrogator as a40 } from './subagents/interrogator-40-deliverance/agent'
import { interrogator as a41 } from './subagents/interrogator-41-decrease/agent'
import { interrogator as a42 } from './subagents/interrogator-42-increase/agent'
import { interrogator as a43 } from './subagents/interrogator-43-break-through-resoluteness/agent'
import { interrogator as a44 } from './subagents/interrogator-44-coming-to-meet/agent'
import { interrogator as a45 } from './subagents/interrogator-45-gathering-together-massing/agent'
import { interrogator as a46 } from './subagents/interrogator-46-pushing-upward/agent'
import { interrogator as a47 } from './subagents/interrogator-47-oppression-exhaustion/agent'
import { interrogator as a48 } from './subagents/interrogator-48-the-well/agent'
import { interrogator as a49 } from './subagents/interrogator-49-revolution-molting/agent'
import { interrogator as a50 } from './subagents/interrogator-50-the-caldron/agent'
import { interrogator as a51 } from './subagents/interrogator-51-the-arousing-shock-thunder/agent'
import { interrogator as a52 } from './subagents/interrogator-52-keeping-still-mountain/agent'
import { interrogator as a53 } from './subagents/interrogator-53-development-gradual-progress/agent'
import { interrogator as a54 } from './subagents/interrogator-54-the-marrying-maiden/agent'
import { interrogator as a55 } from './subagents/interrogator-55-abundance-fullness/agent'
import { interrogator as a56 } from './subagents/interrogator-56-the-wanderer/agent'
import { interrogator as a57 } from './subagents/interrogator-57-the-gentle-the-penetrating-wind/agent'
import { interrogator as a58 } from './subagents/interrogator-58-the-joyous-lake/agent'
import { interrogator as a59 } from './subagents/interrogator-59-dispersion-dissolution/agent'
import { interrogator as a60 } from './subagents/interrogator-60-limitation/agent'
import { interrogator as a61 } from './subagents/interrogator-61-inner-truth/agent'
import { interrogator as a62 } from './subagents/interrogator-62-preponderance-of-the-small/agent'
import { interrogator as a63 } from './subagents/interrogator-63-after-completion/agent'
import { interrogator as a64 } from './subagents/interrogator-64-before-completion/agent'

/** Pipeline order: chief agent (agent/agent.ts) calls the modality subagents (agent/subagents) run FIRST; archetype agents (agent/subagents/archetypes) run SECOND on their output. */
export const PIPELINE_ORDER = ['chief', 'subagents', 'archetypes'] as const

export const ARCHETYPE_AGENTS = [
  a1,
  a2,
  a3,
  a4,
  a5,
  a6,
  a7,
  a8,
  a9,
  a10,
  a11,
  a12,
  a13,
  a14,
  a15,
  a16,
  a17,
  a18,
  a19,
  a20,
  a21,
  a22,
  a23,
  a24,
  a25,
  a26,
  a27,
  a28,
  a29,
  a30,
  a31,
  a32,
  a33,
  a34,
  a35,
  a36,
  a37,
  a38,
  a39,
  a40,
  a41,
  a42,
  a43,
  a44,
  a45,
  a46,
  a47,
  a48,
  a49,
  a50,
  a51,
  a52,
  a53,
  a54,
  a55,
  a56,
  a57,
  a58,
  a59,
  a60,
  a61,
  a62,
  a63,
  a64,
] as const

/** Stage 2: every one of the 64 archetype agents runs on the full modality output. No scoring, no filtering. */
export function runArchetypesOnModalityOutput(modalitySignals: ChartSignal[]): InterrogatorResult[] {
  return ARCHETYPE_AGENTS.map((a) => a.run(modalitySignals))
}
