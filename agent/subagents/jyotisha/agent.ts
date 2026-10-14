import { defineAgent } from 'eve'
import { calculateJyotishaAstronomy, type JyotishaAstronomyInput } from '../../../lib/seen/jyotishaAstronomy'

// Wheel: swisseph-wasm sidereal via lib/seen/jyotishaAstronomy.ts.
// Call: calculateJyotishaAstronomy(input).
// Input: birthDate, birthTime, latitude, longitude, siderealMode ('lahiri' | 'raman' | 'fagan-bradley').
// Output: graha longitudes and Swiss provenance, including the ayanamsha the library returns.
export function readJyotishaAstronomy(input: JyotishaAstronomyInput) {
  return calculateJyotishaAstronomy(input)
}

export default defineAgent({
  description: 'Interpret validated Jyotish calculations as one independent Generator evidence stream.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
