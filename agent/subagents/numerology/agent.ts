// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { defineAgent } from 'eve'
import { calculateNumerology, type NumerologyCalcInput } from '../../../lib/numerologyCalc'

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
