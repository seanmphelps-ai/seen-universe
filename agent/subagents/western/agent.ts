// PROVENANCE: bot=claude session=2026-10-18 task=merge Jev subagent set into final-seen-cc-runtime
import { defineAgent } from 'eve'
import { calculateNatalChart, type NatalChartInput } from '../../../lib/natalChart'

// Wheel: swisseph-wasm. Call: calculateNatalChart. Input: NatalChartInput. Output: NatalChartResult.
export function readWesternChart(input: NatalChartInput) {
  return calculateNatalChart(input)
}

export default defineAgent({
  description: 'Return the Swiss Ephemeris natal calculation from lib/natalChart.ts.',
  model: 'openai/gpt-6-sol',
  reasoning: 'low',
  defaultTools: false,
  tool: false,
})

// ---------------------------------------------------------------------------
// WESTERN AUDITOR (Agent B) — derivation logic and audit status
// Authority: /workspace/seen-western/SOURCE_LOCK/ (00–07) + COS_RULING_2026-10-12_chiron_lilith.md
// Audit reports: /workspace/seen-western/AUDITS/AGENT_B_WESTERN_INCUBATOR_v0.1–v0.4.md
// ---------------------------------------------------------------------------
export const WESTERN_AUDITOR = {
  role: 'Independent adversarial auditor (Agent B). Reconstruct first, then compare. Defects to CoS only. Never rubber-stamp.',
  derivation: {
    layerA_raw: 'Birth date, time or dark-card window, place lat/lon, timezone to UT. No fabricated birth time; no noon fallback for houses/angles.',
    layerB_calc: 'Swiss Ephemeris only (Koch/Treindl, Astrodienst). Tropical, true equinox of date, geocentric apparent. Placidus houses. Polar latitudes: houses null + flag, never a substitute system. Applying/separating by sign of instantaneous closing rate; exact and stationary labels; per-body station thresholds (placeholder, MISSING). True node used, mean vs true unresolved (06 U5).',
    layerC_tradition: 'Ptolemy Tetrabiblos (Robbins 1940), Lilly Christian Astrology (1647), Hand, Leo. Orb tables cited per 02:88-89; no single-school silent merge.',
    layerD_seen: 'Wound triggers only per 02 §12: Sun/Moon via Mars or Saturn; outer planets tagged modern-outer, never classical; Chiron/Lilith seen-layer-d + modern-point per CoS ruling 2026-10-12. Every Layer D record carries "SEEN-derived; not traditional doctrine". Dignity/reception MISSING. Typhon and archetypeId MISSING.',
    output: 'Shared t555 contribution shape. Reads no other modality. No prose, gifts, or scores.',
  },
  checks: [
    'Positions vs independent pyswisseph (bodies within ~0.2", Asc/MC within 3e-5 deg)',
    'Applying/separating at exact, wrap 0/360, retrograde, stations, fast angles',
    'Every trigger and tag traceable to SOURCE_LOCK; no orphan or ghost citations',
    'Contract field-for-field vs t555; guard rejects score/gift/prose',
    'Ephemeris files loaded (no silent Moshier fallback)',
    'Suite and typecheck delta vs baseline = 0',
  ],
  status: {
    verified: [
      'Swiss Ephemeris positions and angles (Tarzana 1979, 3 windows)',
      'Applying/separating, stations (Mercury 2024-04-01)',
      'Triggers and tags vs 02 §12 and CoS ruling',
      't555 contract conformance',
      'Zero new test/typecheck failures vs baseline e42e976',
    ],
    validated: false,
    lastVerdict: 'CONDITIONAL — audit v0.4 of commit 2b43d54',
    openAtLastAudit: [
      'W1 MAJOR: Moshier check false-flags fallback on ~51% of dates (0.5" threshold)',
      'V2 MINOR: guard bypassable (synonym/homoglyph keys, prose in arrays)',
    ],
    pending: 'Commit 1a70e6e claims W1–W4 fixes; not yet audited. Not PASS until audited.',
  },
} as const
