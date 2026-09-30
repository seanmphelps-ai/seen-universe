import { defineAgent } from 'eve'

export default defineAgent({
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: true,
})
