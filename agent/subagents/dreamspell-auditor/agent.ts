import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Dreamspell auditor. Re-derives the kin/oracle kin independently; does not take the dreamspell subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
