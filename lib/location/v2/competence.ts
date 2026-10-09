// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

import type { DimensionId } from './dimensions';
import type { SourceFamily } from './types';

const AUTHORITATIVE = 1.0;
const STRONG = 0.8;
const MODERATE = 0.55;
const WEAK = 0.3;

export const FAMILY_DIMENSION_COMPETENCE: Record<SourceFamily, Partial<Record<DimensionId, number>>> = {
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

  EVENTS: {
    PREV: WEAK,
    PHYS: WEAK,
    BRD: WEAK,
    TREND: WEAK,
  },

  MOVEMENT_PLACE: {
    PREV: MODERATE,
    PHYS: STRONG,
    BRD: MODERATE,
    CONC: MODERATE,
    PERSIST: MODERATE,
    TREND: MODERATE,
  },

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

  MARKETPLACE: {
    PREV: WEAK,
    BRD: WEAK,
  },

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


export function familyCompetence(family: SourceFamily, dimension: DimensionId): number {
  return FAMILY_DIMENSION_COMPETENCE[family]?.[dimension] ?? 0;
}
