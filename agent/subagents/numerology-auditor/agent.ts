import { defineAgent } from 'eve'

export default defineAgent({
  description:
    'Independent Numerology auditor. Re-derives the Pythagorean reduction independently; does not take the numerology subagent\'s output as proof.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})
