import { defineAgent } from 'eve'
import { calculateBazi, type BaziCalcInput } from '../../../lib/baziCalc'

// Wheel: lunar-javascript@1.7.7.
// Call: calculateBazi → Solar.fromYmdHms → getLunar().getEightChar.
// Input: birthDate YYYY-MM-DD, birthTime HH:mm. Output: EightChar pillars and library sect.
export function readBazi(input: BaziCalcInput) {
  return calculateBazi(input)
}

export default defineAgent({
  description: 'Return the lunar-javascript EightChar calculation.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
