/**
 * Wound specialist — first Eve specialist path.
 * Delegates to existing extractWoundMarkers. No new wound logic.
 */

import type { NatalChartResult } from "../natalChart";
import type { BaselinePressureEffect } from "../seen/geoPresence";
import { extractWoundMarkers, type WoundMarkerHit } from "../seen/woundMarkers";
import type { EveResult, EveTask } from "../types";

export async function runWoundSpecialist(task: EveTask): Promise<EveResult> {
  const chart = task.payload.chart as NatalChartResult | undefined;
  const baseline = (task.payload.baseline as BaselinePressureEffect | undefined) ?? {
    amplification: 0,
    suppression: 0,
    sensitization: 0,
    delay: 0,
    distortion: 0,
    rerouteWeight: 0,
  };

  if (!chart || !Array.isArray(chart.planets)) {
    return {
      taskId: task.id,
      specialist: "wound",
      status: "error",
      output: null,
      error: "Missing or invalid NatalChartResult in payload.chart",
    };
  }

  try {
    const hits: WoundMarkerHit[] = extractWoundMarkers(chart, baseline);
    return {
      taskId: task.id,
      specialist: "wound",
      status: "ok",
      output: hits,
      evidence: hits.map((h) => `${h.id}: ${h.sign} ${h.degree}°`),
    };
  } catch (err) {
    return {
      taskId: task.id,
      specialist: "wound",
      status: "error",
      output: null,
      error: err instanceof Error ? err.message : "Wound specialist failed",
    };
  }
}
