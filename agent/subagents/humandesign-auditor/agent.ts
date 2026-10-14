import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Human Design auditor. Re-derives gates and the design solar arc independently; does not take the humandesign subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
