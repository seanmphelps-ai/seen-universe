// PROVENANCE: bot=claude session=2026-10-18 task=merge Jev subagent set into final-seen-cc-runtime
import { defineWorkflowTool } from 'eve/tools'
import { z } from 'zod'

// Transferred from jev-ux-eve (agent/tools/dispatch.ts), adapted to this
// repo's real modalities from lib/agents/execution.ts ModalityId.
const auditor = {
  western: 'western-auditor',
  hellenistic: 'hellenistic-auditor',
  jyotisha: 'jyotisha-auditor',
  bazi: 'bazi-auditor',
  numerology: 'numerology-auditor',
  tzolkin: 'tzolkin-auditor',
  dreamspell: 'dreamspell-auditor',
  humandesign: 'humandesign-auditor',
  iching: 'iching-auditor',
  'identifying-archetypes': 'identifying-archetypes-auditor',
  'time-rectification': 'time-rectification-auditor',
  oracle: 'oracle-auditor',
  'forge-ui': 'forge-ui-auditor',
} as const

export default defineWorkflowTool({
  description:
    'Run exactly one modality lineage agent, then that lineage\'s auditor. Does not calculate. One lineage per call.',
  inputSchema: z.object({
    lineage: z.enum([
      'western',
      'hellenistic',
      'jyotisha',
      'bazi',
      'numerology',
      'tzolkin',
      'dreamspell',
      'humandesign',
      'iching',
      'identifying-archetypes',
      'time-rectification',
      'oracle',
      'forge-ui',
    ]),
    record: z.string().min(1).max(100000),
  }),
  async execute({ lineage, record }, ctx) {
    'use workflow'
    const reading = await ctx.agent(lineage, { message: record })
    // The auditor receives the original record with the reading so it can reconstruct independently.
    const audit = await ctx.agent(auditor[lineage], {
      message: JSON.stringify({ record, reading }),
    })
    return { lineage, reading, audit }
  },
})
