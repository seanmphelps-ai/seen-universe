import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Western auditor. Re-derives natal positions from swisseph-wasm independently; does not take the western subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
