// PROVENANCE: bot=claude session=2026-10-18 task=merge Jev subagent set into final-seen-cc-runtime
import { defineAgent } from "eve";

export default defineAgent({
  description: "Oracle. Speaks only after stored lineage records and auditor results. Does not calculate.",
  model: "openai/gpt-6-sol",
  defaultTools: false,
  tool: false,
});
