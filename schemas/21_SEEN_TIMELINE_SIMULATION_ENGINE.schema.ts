export type TimelinePrecision =
  | 'exact'
  | 'approximate'
  | 'range_only'
  | 'unknown'

export type TimelineSceneType =
  | 'relationship_beginning'
  | 'relationship_peak'
  | 'relationship_rupture'
  | 'relationship_repair'
  | 'move'
  | 'family_event'
  | 'career_event'
  | 'breakthrough'
  | 'collapse'
  | 'childhood_memory'
  | 'unknown'

export type TimelineWindow = {
  start?: string
  end?: string
  precision: TimelinePrecision
  label?: string
}

export type TimelineActor = {
  id: string
  role:
    | 'self'
    | 'partner'
    | 'parent'
    | 'child'
    | 'teacher'
    | 'friend'
    | 'other'
  chartId?: string
}

export type TimelineScene = {
  id: string
  type: TimelineSceneType
  title: string
  window: TimelineWindow
  actors: TimelineActor[]
  locationIds?: string[]
  cadenceMarkerIds?: string[]
  notes?: string[]
}

export type TimelineChangeMap = {
  before: string[]
  during: string[]
  after: string[]
}

export type TimelineRecurrenceMap = {
  repeatedPastWindows: string[]
  activeNow?: string[]
  likelyFutureWindows: string[]
}

export type TimelineCounterfactualBranch = {
  id: string
  label: string
  removedVariable: string
  changedOutcomes: string[]
}

export type TimelineOraclePayload = {
  whatHappened: string[]
  whatChanged: string[]
  whatRepeated: string[]
  whatMayReturn: string[]
  chips?: string[]
}

export type SeenTimelineSimulationEngine = {
  schemaVersion: '1.0.0'
  engineName: 'SEEN_TIMELINE_SIMULATION_ENGINE'
  purpose: {
    primary: 'turn_life_relationships_and_events_into_time_based_pattern_maps'
    novelty: 'timeline_theater_and_human_version_control'
  }
  requiredEngines: {
    swissEphemeris: 'SWISS_EPHEMERIS_EVENT_ENGINE'
    closureComposure: 'CLOSURE_AND_COMPOSURE'
    geoPresence: 'GEOPRESENCE_ENGINE'
    biomeAbiotic: 'BIOME_ABIOTIC_ENGINE'
    cadence: 'CADENCE_TRACKING_ENGINE'
    oracle: 'ORACLE_RUNTIME'
  }
  input: {
    scenes: TimelineScene[]
    primaryWindow?: TimelineWindow
    relationshipWindow?: TimelineWindow
  }
  output: {
    changeMap: TimelineChangeMap
    recurrenceMap: TimelineRecurrenceMap
    counterfactualBranches: TimelineCounterfactualBranch[]
    oraclePayload: TimelineOraclePayload
  }
  hardRules: {
    dateOptional: true
    timeWindowImprovesAccuracy: true
    swissRequiredWhenDatePresent: true
    noOutcomeGuarantees: true
    astrologyNeverExcusesBehavior: true
    recursiveSignalsPreserved: true
  }
}

export const SEEN_TIMELINE_SIMULATION_ENGINE: SeenTimelineSimulationEngine = {
  schemaVersion: '1.0.0',
  engineName: 'SEEN_TIMELINE_SIMULATION_ENGINE',
  purpose: {
    primary: 'turn_life_relationships_and_events_into_time_based_pattern_maps',
    novelty: 'timeline_theater_and_human_version_control',
  },
  requiredEngines: {
    swissEphemeris: 'SWISS_EPHEMERIS_EVENT_ENGINE',
    closureComposure: 'CLOSURE_AND_COMPOSURE',
    geoPresence: 'GEOPRESENCE_ENGINE',
    biomeAbiotic: 'BIOME_ABIOTIC_ENGINE',
    cadence: 'CADENCE_TRACKING_ENGINE',
    oracle: 'ORACLE_RUNTIME',
  },
  input: { scenes: [] },
  output: {
    changeMap: { before: [], during: [], after: [] },
    recurrenceMap: { repeatedPastWindows: [], likelyFutureWindows: [] },
    counterfactualBranches: [],
    oraclePayload: { whatHappened: [], whatChanged: [], whatRepeated: [], whatMayReturn: [] },
  },
  hardRules: {
    dateOptional: true,
    timeWindowImprovesAccuracy: true,
    swissRequiredWhenDatePresent: true,
    noOutcomeGuarantees: true,
    astrologyNeverExcusesBehavior: true,
    recursiveSignalsPreserved: true,
  },
}
