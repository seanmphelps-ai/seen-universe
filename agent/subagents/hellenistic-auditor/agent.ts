import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Hellenistic auditor. Re-derives houses, sect, and Lots independently; does not take the hellenistic subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
