import { defineAgent } from 'eve'
import { calculateTzolkin, type TzolkinCalcInput } from '../../../lib/tzolkinCalc'

// Wheel: @drewsonne/maya-dates@1.3.14.
// Call: calculateTzolkin → LongCount.fromGregorian(date, getCorrelationConstant(584283)).
// Input: birthDate YYYY-MM-DD. Output: long count, Tzolk'in, and Haab strings.
export function readTzolkin(input: TzolkinCalcInput) {
  return calculateTzolkin(input)
}

export default defineAgent({
  description: 'Return the maya-dates Tzolk\'in calculation.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
