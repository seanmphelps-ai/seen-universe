import { defineAgent } from 'eve'
import { calculateHumanDesign, type HumanDesignCalcInput } from '../../../lib/humanDesignCalc'

// Wheel: free-human-design@1.0.1.
// Call: calculateHumanDesign → computeChart.
// Input: birthDate, birthTime, latitude, longitude. Output: bodygraph type, profile, centers, gates.
export function readHumanDesign(input: HumanDesignCalcInput) {
  return calculateHumanDesign(input)
}

export default defineAgent({
  description: 'Return the free-human-design bodygraph calculation as its own cocoon.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
