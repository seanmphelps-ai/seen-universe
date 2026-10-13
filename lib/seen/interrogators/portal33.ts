// PROVENANCE: bot=grok session=2026-10-13 task=64 interrogator sub-agents (no scoring)
import { makeInterrogator } from './makeInterrogator';
import type { ChartSignal } from './types';

export const interrogator = makeInterrogator(33);
export const archetype = interrogator.archetype;
export const questions = interrogator.questions;
export const run = (chartSignals: ChartSignal[]) => interrogator.run(chartSignals);
