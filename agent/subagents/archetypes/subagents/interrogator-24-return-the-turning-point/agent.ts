// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { defineAgent } from 'eve'
import { makeInterrogatorFromRecord } from '../../../../../lib/seen/interrogators/makeInterrogator'
import type { ChartSignal } from '../../../../../lib/seen/interrogators/types'
import { archetype } from './archetype'

export { archetype }
export const interrogator = makeInterrogatorFromRecord(archetype)
export const questions = interrogator.questions

/** Runs interrogator 24 on every incoming chart signal. No scoring, no filtering. */
export function readInterrogator24(chartSignals: ChartSignal[]) {
  return interrogator.run(chartSignals)
}

export default defineAgent({
  description: 'SEEN interrogator 24 (Return (The Turning Point)): asks its 52 interrogation questions of every chart signal and carries all signals with provenance. No scoring.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
