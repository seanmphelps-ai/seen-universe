import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent I Ching auditor. Confirms the calculator still fails closed; does not take the iching subagent\'s output as proof once a cast authority exists.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
