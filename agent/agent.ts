// PROVENANCE: bot=grok session=2026-10-13 task=chief pipeline: modality subagents first, then 64 archetypes (no scoring)
import { defineAgent } from 'eve'
import { readNative, type ModalityId, type NativeCalcInput, type NativeReading } from '../lib/agents/execution'
import type { ChartSignal, InterrogatorResult, SectionFiling } from '../lib/seen/interrogators/types'
import { fileIntoSections } from '../lib/seen/interrogators/fileIntoSections'
import { runArchetypesOnModalityOutput } from './subagents/archetypes/pipeline'

/** Stage 1 roster: the modality subagents in agent/subagents. */
export const MODALITY_SUBAGENTS: readonly ModalityId[] = [
  'western', 'hellenistic', 'jyotisha', 'bazi', 'numerology', 'tzolkin', 'dreamspell', 'humandesign', 'iching',
]

export type ChiefPipelineResult = {
  modalityOutput: Array<{ modality: ModalityId; reading?: NativeReading; error?: string }>
  archetypes: InterrogatorResult[]
  /** Every answer filed directly into the 45 life sections. */
  lifeSections: SectionFiling
}

/** Chief agent: call every modality subagent first, then hand their full output to all 64 archetypes. */
export async function runChiefPipeline(input: NativeCalcInput): Promise<ChiefPipelineResult> {
  // STAGE 1 — modality subagents (astro modules). Promise.all: every one must finish before stage 2 starts.
  const modalityOutput = await Promise.all(
    MODALITY_SUBAGENTS.map(async (modality) => {
      try {
        return { modality, reading: await readNative(modality, input) }
      } catch (e) {
        return { modality, error: e instanceof Error ? e.message : String(e) }
      }
    }),
  )
  // STAGE 2 — immediately after, nothing in between: archetypes receive every modality output (nothing dropped, nothing scored)
  const signals: ChartSignal[] = modalityOutput.map((m) => ({
    modality: m.modality,
    id: m.modality.toUpperCase(),
    label: m.reading ? `${m.modality} native reading (${m.reading.status})` : `${m.modality} unresolved: ${m.error}`,
    source: m.reading ?? { error: m.error },
  }))
  const archetypes = runArchetypesOnModalityOutput(signals)
  return { modalityOutput, archetypes, lifeSections: fileIntoSections(archetypes) }
}

export default defineAgent({
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: true,
})
