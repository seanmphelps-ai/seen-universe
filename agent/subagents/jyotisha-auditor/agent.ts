import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Jyotisha auditor. Re-derives sidereal longitudes independently, confirms the ayanamsha used; does not take the jyotisha subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
