// PROVENANCE: bot=grok session=2026-10-13 task=stage-2 archetype agents (no scoring)
import { defineAgent } from 'eve'
import { runArchetypesOnModalityOutput } from './pipeline'

export { ARCHETYPE_AGENTS, PIPELINE_ORDER, runArchetypesOnModalityOutput } from './pipeline'
export const readArchetypes = runArchetypesOnModalityOutput

export default defineAgent({
  description: 'SEEN stage 2: receives the modality subagents\' output from the chief agent and runs all 64 archetype interrogators (subagents/interrogator-NN-*) on it. Every signal carried with provenance. No scoring, no filtering.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
