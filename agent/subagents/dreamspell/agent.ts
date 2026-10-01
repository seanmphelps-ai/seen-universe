import { defineAgent } from 'eve'
import { calculateDreamspell, type DreamspellCalcInput } from '../../../lib/dreamspellCalc'

// Wheel: @oshimishi/dreamspell-math@0.3.2.
// Call: calculateDreamspell → dreamdate([year, monthIndex, day]).
// Input: birthDate YYYY-MM-DD. Output: DreamDate kin, year kin, and oracle fields.
export function readDreamspell(input: DreamspellCalcInput) {
  return calculateDreamspell(input)
}

export default defineAgent({
  description: 'Return the dreamspell-math kin calculation.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
