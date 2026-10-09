// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import { defineAgent } from 'eve'
import { calculateIChing } from '../../../lib/ichingCalc'

export function readIChing(): never {
  return calculateIChing()
}

export default defineAgent({
  description: 'I Ching calculation requires a cast containing a question, method, and six lines.',
  model: 'openai/gpt-6-sol',
  reasoning: 'high',
  defaultTools: false,
  tool: true,
})
