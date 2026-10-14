import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Tzolk\'in auditor. Re-derives the Long Count and Tzolk\'in/Haab independently; does not take the tzolkin subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
