import { defineAgent } from 'eve'
import { calculateNatalChart, type NatalChartInput } from '../../../lib/natalChart'

// Wheel: swisseph-wasm. Call: calculateNatalChart. Input: NatalChartInput. Output: NatalChartResult.
export function readWesternChart(input: NatalChartInput) {
  return calculateNatalChart(input)
}

export default defineAgent({
  description: 'Return the Swiss Ephemeris natal calculation from lib/natalChart.ts.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: true,
})
