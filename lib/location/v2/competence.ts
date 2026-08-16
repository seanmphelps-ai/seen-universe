// Per-(source family × dimension) competence — replaces a single
// universal credibility score, per explicit instruction:
//
//   "We need an explicit rule for how Census-quality structured data,
//    academic research, event databases, local news, Reddit, TikTok,
//    Facebook, search trends, etc. influence each marker. Not a generic
//    credibility score. Different sources are good at measuring
//    different dimensions. TikTok may be excellent evidence of DIG /
//    FRAME / lived testimony, while terrible evidence for estimating
//    population prevalence unless appropriately sampled."
//
// A family's overall "credibility" is not a coherent quantity: SOCIAL_PUBLIC
// is close to worthless for PREV and among the best available signal for
// DIG and FRAME. Collapsing that into one number either overweights social
// data on prevalence or underweights it on the two dimensions it is
// actually good at. This table is the fix — fuse.ts looks up
// (family, dimension) directly instead of a single per-family weight.
//
// Five deliberately coarse levels, not decimal-precision tuning, because
// nothing about these judgments supports finer resolution:
//   1.00 authoritative — a direct, structured measurement of this dimension
//   0.80 strong          — reliable primary evidence for this dimension
//   0.55 moderate        — usable, secondary, or partial evidence
//   0.30 weak            — marginal, indirect, or noisy evidence
//   omitted              — this family cannot competently inform this
//                          dimension at all; it contributes zero weight
//                          and is excluded from the fused value, though it
//                          still appears in the signals list if it
//                          produced one (a transparency, not a deletion)

import type { DimensionId } from './dimensions';
import type { SourceFamily } from './types';

const AUTHORITATIVE = 1.0;
const STRONG = 0.8;
const MODERATE = 0.55;
const WEAK = 0.3;

export const FAMILY_DIMENSION_COMPETENCE: Record<SourceFamily, Partial<Record<DimensionId, number>>> = {
  // Structured government statistics: authoritative wherever a direct
  // rate or count exists; no discourse content at all, so it cannot
  // inform DIG/AMP/FRAME.
  OFFICIAL_DATA: {
    PREV: AUTHORITATIVE,
    SEV: STRONG,
    PHYS: STRONG,
    BRD: STRONG,
    CONC: STRONG,
    PERSIST: STRONG,
    TREND: AUTHORITATIVE,
  },

  // Coded conflict-event database: authoritative for the event types it
  // covers, same reasoning as OFFICIAL_DATA but slightly less complete
  // geographic coverage.
  ACLED: {
    PREV: STRONG,
    SEV: STRONG,
    PHYS: MODERATE,
    BRD: STRONG,
    CONC: STRONG,
    PERSIST: STRONG,
    TREND: STRONG,
  },

  // Gridded population estimates: a denominator source, not an
  // occurrence or discourse source. Competent only where it supplies the
  // "how many people" side of a rate.
  POPULATION_GRID: {
    PREV: MODERATE,
    PHYS: MODERATE,
    BRD: MODERATE,
  },

  // Institutional directories/records (schools, clinics, registries):
  // strong for ambient institutional-presence markers, silent on
  // discourse or severity.
  INSTITUTIONS: {
    PREV: STRONG,
    BRD: STRONG,
    CONC: STRONG,
    PERSIST: STRONG,
  },

  // Map features: strong for place-existence markers (green space,
  // institution density), no notion of severity, discourse, or trend.
  OSM: {
    PREV: STRONG,
    BRD: STRONG,
    CONC: MODERATE,
  },

  // Professional reporting: decent corroboration of occurrence, strong on
  // discourse/interpretation and salience, moderate spatial granularity.
  LOCAL_NEWS: {
    PREV: MODERATE,
    SEV: MODERATE,
    DIG: STRONG,
    AMP: STRONG,
    FRAME: STRONG,
    BRD: MODERATE,
    CONC: WEAK,
    PERSIST: MODERATE,
    TREND: MODERATE,
  },

  // Event listings/calendars: weak evidence almost everywhere — tells you
  // an event was scheduled, not that it reflects a lived condition.
  EVENTS: {
    PREV: WEAK,
    PHYS: WEAK,
    BRD: WEAK,
    TREND: WEAK,
  },

  // Mobility/place-visitation data: the strongest available signal for
  // actual physical presence; no notion of discourse or severity.
  MOVEMENT_PLACE: {
    PREV: MODERATE,
    PHYS: STRONG,
    BRD: MODERATE,
    CONC: MODERATE,
    PERSIST: MODERATE,
    TREND: MODERATE,
  },

  // Global event/mentions coding: broad but coarse coverage, useful for
  // volume and coarse tone, not a reliable rate estimate.
  GDELT: {
    PREV: WEAK,
    DIG: STRONG,
    AMP: MODERATE,
    FRAME: WEAK,
    TREND: MODERATE,
  },

  // First-person consumer reviews: self-selected, but genuine lived
  // testimony — moderate corroborating evidence, some sentiment signal.
  REVIEWS: {
    PREV: WEAK,
    DIG: MODERATE,
    FRAME: WEAK,
    BRD: WEAK,
  },

  // Commercial listings: informative for economic ambient markers
  // (pricing, affluence signals) only; not a discourse or event source.
  MARKETPLACE: {
    PREV: WEAK,
    BRD: WEAK,
  },

  // Query volume: this IS attention, so it is one of the strongest
  // sources for DIG/AMP and a legitimate TREND signal; it says nothing
  // about occurrence.
  SEARCH_INTEREST: {
    DIG: STRONG,
    AMP: STRONG,
    BRD: MODERATE,
    TREND: MODERATE,
  },

  // Local community forums: closer to lived testimony than broadcast
  // social media, per the "residents are telling their lived stories"
  // insight — moderate corroboration for PREV via AMBIENT_CONTENT_SAMPLE,
  // strong for DIG/FRAME.
  LOCAL_FORUM: {
    PREV: WEAK,
    DIG: STRONG,
    AMP: MODERATE,
    FRAME: MODERATE,
    BRD: MODERATE,
  },

  // Paid placements: mostly non-local advertiser noise (see the
  // status_competition_signal marker's own exclusions) — marginal
  // everywhere it is even admissible.
  ADS: {
    DIG: WEAK,
    FRAME: WEAK,
  },

  // General public social media: the canonical "excellent for DIG/FRAME,
  // terrible for PREV" case this table exists to fix. Only
  // AMBIENT_CONTENT_SAMPLE-routed, quality-screened posts should ever
  // reach PREV, and even then only as weak corroboration.
  SOCIAL_PUBLIC: {
    PREV: WEAK,
    DIG: STRONG,
    AMP: STRONG,
    FRAME: STRONG,
    BRD: MODERATE,
    TREND: MODERATE,
  },
};

/**
 * Looks up a family's competence for a dimension. Returns 0 — not a
 * default — when the family has no declared competence: absence from the
 * table means "cannot competently inform this dimension," and 0 weight
 * is exactly what that should contribute to a fused value.
 */
export function familyCompetence(family: SourceFamily, dimension: DimensionId): number {
  return FAMILY_DIMENSION_COMPETENCE[family]?.[dimension] ?? 0;
}
