// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup


import type { EveOrchestratorInput, EveOrchestratorOutput, EveResult, EveTask } from "./";
import { runWoundSpecialist } from "./";

async function dispatch(task: EveTask): Promise<EveResult> {
  switch (task.kind) {
    case "wound-extract":
      return runWoundSpecialist(task);
    case "echo":
      return {
        taskId: task.id,
        specialist: "echo",
        status: "ok",
        output: task.payload,
      };
    default:
      return {
        taskId: task.id,
        specialist: "unknown",
        status: "error",
        output: null,
        error: `Specialist registration required for kind: ${task.kind}`,
      };
  }
}

export async function runEveOrchestrator(
  input: EveOrchestratorInput,
): Promise<EveOrchestratorOutput> {
  const results: EveResult[] = [];

  for (const task of input.tasks) {
    results.push(await dispatch(task));
  }

  const ok = results.filter((r) => r.status === "ok").length;
  const summary = `Eve ran ${results.length} task(s); ${ok} succeeded.`;

  return {
    results,
    summary,
  };
}
