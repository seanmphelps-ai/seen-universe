import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent BaZi auditor. Re-derives the Four Pillars independently; does not take the bazi subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
