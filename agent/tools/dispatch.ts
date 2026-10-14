import { defineWorkflowTool } from 'eve/tools'
import { z } from 'zod'

// Transferred from jev-ux-eve (agent/tools/dispatch.ts), adapted to this
// repo's real modalities from lib/agents/execution.ts ModalityId.
const auditor = {
  western: 'western-auditor',
  hellenistic: 'hellenistic-auditor',
  jyotish: 'jyotish-auditor',
  bazi: 'bazi-auditor',
  numerology: 'numerology-auditor',
  tzolkin: 'tzolkin-auditor',
  dreamspell: 'dreamspell-auditor',
  humandesign: 'humandesign-auditor',
  iching: 'iching-auditor',
} as const

export default defineWorkflowTool({
  description:
    'Run exactly one modality lineage agent, then that lineage\'s auditor. Does not calculate. One lineage per call.',
  inputSchema: z.object({
    lineage: z.enum([
      'western',
      'hellenistic',
      'jyotish',
      'bazi',
      'numerology',
      'tzolkin',
      'dreamspell',
      'humandesign',
      'iching',
    ]),
    record: z.string().min(1).max(100000),
  }),
  async execute({ lineage, record }, ctx) {
    'use workflow'
    const reading = await ctx.agent(lineage, { message: record })
    const audit = await ctx.agent(auditor[lineage], {
      message: typeof reading === 'string' ? reading : JSON.stringify(reading),
    })
    return { lineage, reading, audit }
  },
})
