import { defineAgent } from 'eve'
import { calculateIChing } from '../../../lib/ichingCalc'

// Wheel: none. calculateIChing throws IChingCalcBlocked and returns no hexagram.
export function readIChing(): never {
  return calculateIChing()
}

export default defineAgent({
  description: 'I Ching calc is blocked until a cast exists. This axle does not invent a hexagram.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
