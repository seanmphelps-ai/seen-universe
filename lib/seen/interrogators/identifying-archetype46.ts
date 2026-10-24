// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring); re-export from agent/subagents
import type { ChartSignal } from './types';
import { interrogator } from '../../../agent/subagents/archetypes/subagents/interrogator-46-pushing-upward/agent';

export { interrogator };
export const archetype = interrogator.archetype;
export const questions = interrogator.questions;
export const run = (chartSignals: ChartSignal[]) => interrogator.run(chartSignals);
