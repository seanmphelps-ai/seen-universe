import { defineAgent } from 'eve'
import { calculateNatalChart, type NatalChartInput } from '../../../lib/natalChart'

// Wheel: swisseph-wasm via lib/natalChart.ts.
// Call: calculateNatalChart(input). Input: NatalChartInput. Output: NatalChartResult.
// Lots, sect, and whole-sign houses are not calculated.
export function readHellenisticPositions(input: NatalChartInput) {
  return calculateNatalChart(input)
}

export default defineAgent({
  description: 'Interpret validated Hellenistic calculations and Lots as one independent Generator evidence stream.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
