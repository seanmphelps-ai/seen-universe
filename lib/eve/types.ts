// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup


export type EveTask = {
  id: string;
  kind: 'wound-extract' | 'portal-express' | 'echo';
  payload: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export type EveResult = {
  taskId: string;
  specialist: string;
  status: 'ok' | 'error';
  output: unknown;
  error?: string;
  evidence?: string[];
}

export type EveOrchestratorInput = {
  tasks: EveTask[];
}

export type EveOrchestratorOutput = {
  results: EveResult[];
  summary: string;
}
