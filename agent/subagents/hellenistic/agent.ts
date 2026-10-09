// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { defineAgent } from 'eve'
import { calculateHellenistic, type HellenisticCalcResult } from '../../../lib/hellenisticCalc'
import type { NatalChartInput } from '../../../lib/natalChart'

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
