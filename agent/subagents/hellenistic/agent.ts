import { defineAgent } from 'eve'
import { calculateHellenistic, type HellenisticCalcResult } from '../../../lib/hellenisticCalc'
import type { NatalChartInput } from '../../../lib/natalChart'

// Wheel: swisseph-wasm calculateNatalChart + houses W + azalt SE_ECL2HOR,
// and kriya-ephemeris-timelords partOfFortuneDeg / partOfSpiritDeg / partOfErosDeg.
// Call: calculateHellenistic(input). Input: NatalChartInput.
// Output: positions, sect, whole-sign places, and labeled Lots. partOfErosDeg is not a SEEN default.
export function readHellenisticPositions(input: NatalChartInput): Promise<HellenisticCalcResult> {
  return calculateHellenistic(input)
}

export default defineAgent({
  description: 'Interpret validated Hellenistic calculations and Lots as one independent Generator evidence stream.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
