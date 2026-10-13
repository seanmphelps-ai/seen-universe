# SEEN modality coordination

Run each modality independently from complete, validated native calculations and locked traditional source rules. Preserve the full native reading and every supported finding before dark extraction. Request an independent native audit before delivery. Report missing calculations, rules, or auditors as unresolved.

`lib/agents/execution.ts` `readNative` calls the calculation axle for each modality. Agent files re-export that call. Interpretive auditors and locked school packets are still unresolved. The wheel list is `docs/CALC_WHEELS.md`.

## Pipeline order (Sean, 2026-10-13)

1. Chief agent (`agent/agent.ts`, `runChiefPipeline`).
2. Modality subagents (`agent/subagents/<modality>`) run first.
3. Their full output goes to the archetypes stage (`agent/subagents/archetypes`), which runs all 64 archetype interrogators (`agent/subagents/archetypes/subagents/interrogator-NN-<slug>`). No scoring, no filtering.
4. Later stages consume the archetype output.
