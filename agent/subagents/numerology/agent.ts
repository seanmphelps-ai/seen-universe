import { defineAgent } from 'eve'
import { calculateNumerology, type NumerologyCalcInput } from '../../../lib/numerologyCalc'

// Wheel: @csessh/sochumenh@0.3.0.
// Call: calculateNumerology → parseDob and the package numeric calculators.
// Input: name, birthDate YYYY-MM-DD. Output: numeric index values. No interpretation text.
export function readNumerology(input: NumerologyCalcInput) {
  return calculateNumerology(input)
}

export default defineAgent({
  description: 'Return the sochumenh numerology calculation.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
