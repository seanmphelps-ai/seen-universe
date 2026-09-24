import { defineAgent } from 'eve'

export default defineAgent({
  description: 'Interpret validated Hellenistic calculations and Lots as one independent Generator evidence stream.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: false,
})
