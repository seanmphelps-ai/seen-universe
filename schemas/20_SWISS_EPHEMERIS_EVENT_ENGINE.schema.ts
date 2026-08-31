export type SwissEphemerisConfidence =
  | 'locked'
  | 'nearest_available'
  | 'approximate'
  | 'uncertain'

export type SwissPlanetKey =
  | 'su'
  | 'mo'
  | 'me'
  | 've'
  | 'ma'
  | 'ju'
  | 'sa'

export type SwissEphemerisRuntimeRole =
  | 'local_ephemeris_lookup'
  | 'historical_event_lookup'
  | 'universal_field_snapshot'
  | 'personal_transit_overlay'
  | 'relational_transit_overlay'
  | 'environmental_context_overlay'
  | 'recurrence_detection'
  | 'behavior_pressure_mapping'
  | 'accountability_boundary'
  | 'user_facing_output'
  | 'hidden_mechanic'

export type SwissEventDomain =
  | 'childhood_memory'
  | 'family_event'
  | 'relationship_conflict'
  | 'separation_or_loss'
  | 'school_event'
  | 'legal_event'
  | 'relapse_or_compulsion'
  | 'career_event'
  | 'breakthrough'
  | 'unknown'

export type SwissEventActorRole =
  | 'self'
  | 'parent'
  | 'partner'
  | 'child'
  | 'sibling'
  | 'teacher'
  | 'offender'
  | 'witness'
  | 'other'

export type SwissEphemerisMarkerType =
  | 'planetary_position'
  | 'planetary_transit'
  | 'aspect'
  | 'return_cycle'
  | 'house_activation'
  | 'wound_marker_activation'
  | 'astrocartography_activation'
  | 'daily_auxiliary_marker'
  | 'recurrence_window'

export type SwissPlanetPosition = Record<SwissPlanetKey, number>

export type SwissPlanetPositionTable = Record<string, SwissPlanetPosition>

export type SwissDailyAuxiliaryMarkerTable = Record<string, number>

export type SwissEphemerisLocalJsonShape = {
  p: SwissPlanetPositionTable
  m: SwissDailyAuxiliaryMarkerTable
}

export type SwissEphemerisLocalFileProfile = {
  sourceName: 'Mirrored 1 ephermis 50mblocal .json'
  sourceType: 'local_json'
  rootKeys: ['p', 'm']
  planetTableKey: 'p'
  auxiliaryMarkerTableKey: 'm'
  planetKeys: SwissPlanetKey[]
  planetCadence: 'weekly'
  auxiliaryMarkerCadence: 'daily'
  supportedStartDate: '1920-01-01'
  supportedEndDate: '2050-12-31'
  planetStartDate: '1920-01-05'
  planetEndDate: '2050-12-26'
  planetEntryCount: 6835
  auxiliaryMarkerEntryCount: 47848
  auxiliaryMarkerMeaningLocked: false
}

export type SwissEphemerisLookupRequest = {
  requestedDate: string
  exactDateKnown: boolean
  approximateDateAllowed: boolean
  timezone?: string
  location?: {
    label?: string
    latitude?: number
    longitude?: number
  }
}

export type SwissEphemerisLookupResult = {
  requestedDate: string
  nearestPlanetDateUsed: string
  exactPlanetDateMatch: boolean
  dateResolution: SwissEphemerisConfidence
  planets: SwissPlanetPosition
  dailyAuxiliaryMarker?: number
}

export type SwissEventActor = {
  id: string
  role: SwissEventActorRole
  birthDataStatus: SwissEphemerisConfidence
  chartReferenceId?: string
  knownContext: string[]
}

export type SwissHistoricalEventInput = {
  id: string
  approximateDate: string
  exactDateKnown: boolean
  approximateTime?: string
  location?: {
    label: string
    latitude?: number
    longitude?: number
  }
  domain: SwissEventDomain
  description: string
  actors: SwissEventActor[]
}

export type SwissUniversalFieldMarker = {
  id: string
  markerType: SwissEphemerisMarkerType
  bodyOrPoint: string
  rawDegree?: number
  aspectOrCondition?: string
  interpretedPressure: string
  confidence: SwissEphemerisConfidence
}

export type SwissUniversalFieldSnapshot = {
  eventId: string
  ephemerisSource: 'local_swiss_ephemeris_json'
  lookup: SwissEphemerisLookupResult
  markers: SwissUniversalFieldMarker[]
}

export type SwissPersonalEventOverlay = {
  actorId: string
  eventId: string
  activatedNatalZones: string[]
  activatedWoundMarkers: string[]
  likelyPressurePoints: string[]
  likelyDefenses: string[]
  likelyImpactOnOthers: string[]
  confidence: SwissEphemerisConfidence
}

export type SwissRelationalEventOverlay = {
  eventId: string
  actorIds: string[]
  sharedPressurePoints: string[]
  asymmetricPressurePoints: string[]
  likelyCollisionPattern: string[]
  likelyImprintCreated: string[]
  confidence: SwissEphemerisConfidence
}

export type SwissRecurrenceMapping = {
  originalEventId: string
  repeatedPatternIds: string[]
  similarPastWindows: string[]
  possibleFutureWindows: string[]
  recurrenceBasis: SwissEphemerisMarkerType[]
  confidence: SwissEphemerisConfidence
}

export type SwissBehaviorPressureMap = {
  eventId: string
  pressure: string[]
  trigger: string[]
  defense: string[]
  behavior: string[]
  impactOnSelf: string[]
  impactOnOthers: string[]
  imprintCreated: string[]
  regulationInterrupts: string[]
}

export type SwissAccountabilityBoundary = {
  eventId: string
  rule: 'astrology_never_excuses_behavior'
  explanation: 'ephemeris_and_context_may_reveal_pressure_patterns_but_do_not_remove_choice_responsibility_or_accountability'
  userFacingDisclaimerRequired: true
}

export type SwissEphemerisEventEngineSchema = {
  schemaVersion: '1.0.0'
  engineName: 'SWISS_EPHEMERIS_EVENT_ENGINE'
  purpose: 'map_historical_life_events_against_local_swiss_ephemeris_data_universal_astrological_markers_personal_transits_relational_context_environmental_pressure_and_recurrence_windows'
  mayExcuseBehavior: false
  localFileProfile: SwissEphemerisLocalFileProfile
  runtimeRoles: SwissEphemerisRuntimeRole[]
  input: {
    localEphemerisDataShape: SwissEphemerisLocalJsonShape
    historicalEvent: SwissHistoricalEventInput
  }
  output: {
    universalFieldSnapshot: SwissUniversalFieldSnapshot
    personalOverlays: SwissPersonalEventOverlay[]
    relationalOverlay: SwissRelationalEventOverlay
    recurrenceMapping: SwissRecurrenceMapping
    behaviorPressureMap: SwissBehaviorPressureMap
    accountabilityBoundary: SwissAccountabilityBoundary
  }
}

export const SWISS_EPHEMERIS_EVENT_ENGINE_SCHEMA: SwissEphemerisEventEngineSchema = {
  schemaVersion: '1.0.0',
  engineName: 'SWISS_EPHEMERIS_EVENT_ENGINE',
  purpose: 'map_historical_life_events_against_local_swiss_ephemeris_data_universal_astrological_markers_personal_transits_relational_context_environmental_pressure_and_recurrence_windows',
  mayExcuseBehavior: false,
  localFileProfile: {
    sourceName: 'Mirrored 1 ephermis 50mblocal .json',
    sourceType: 'local_json',
    rootKeys: ['p', 'm'],
    planetTableKey: 'p',
    auxiliaryMarkerTableKey: 'm',
    planetKeys: ['su', 'mo', 'me', 've', 'ma', 'ju', 'sa'],
    planetCadence: 'weekly',
    auxiliaryMarkerCadence: 'daily',
    supportedStartDate: '1920-01-01',
    supportedEndDate: '2050-12-31',
    planetStartDate: '1920-01-05',
    planetEndDate: '2050-12-26',
    planetEntryCount: 6835,
    auxiliaryMarkerEntryCount: 47848,
    auxiliaryMarkerMeaningLocked: false,
  },
  runtimeRoles: [
    'local_ephemeris_lookup',
    'historical_event_lookup',
    'universal_field_snapshot',
    'personal_transit_overlay',
    'relational_transit_overlay',
    'environmental_context_overlay',
    'recurrence_detection',
    'behavior_pressure_mapping',
    'accountability_boundary',
    'user_facing_output',
    'hidden_mechanic',
  ],
  input: {
    localEphemerisDataShape: {
      p: {},
      m: {},
    },
    historicalEvent: {
      id: '',
      approximateDate: '',
      exactDateKnown: false,
      domain: 'unknown',
      description: '',
      actors: [],
    },
  },
  output: {
    universalFieldSnapshot: {
      eventId: '',
      ephemerisSource: 'local_swiss_ephemeris_json',
      lookup: {
        requestedDate: '',
        nearestPlanetDateUsed: '',
        exactPlanetDateMatch: false,
        dateResolution: 'uncertain',
        planets: {
          su: 0,
          mo: 0,
          me: 0,
          ve: 0,
          ma: 0,
          ju: 0,
          sa: 0,
        },
      },
      markers: [],
    },
    personalOverlays: [],
    relationalOverlay: {
      eventId: '',
      actorIds: [],
      sharedPressurePoints: [],
      asymmetricPressurePoints: [],
      likelyCollisionPattern: [],
      likelyImprintCreated: [],
      confidence: 'uncertain',
    },
    recurrenceMapping: {
      originalEventId: '',
      repeatedPatternIds: [],
      similarPastWindows: [],
      possibleFutureWindows: [],
      recurrenceBasis: [],
      confidence: 'uncertain',
    },
    behaviorPressureMap: {
      eventId: '',
      pressure: [],
      trigger: [],
      defense: [],
      behavior: [],
      impactOnSelf: [],
      impactOnOthers: [],
      imprintCreated: [],
      regulationInterrupts: [],
    },
    accountabilityBoundary: {
      eventId: '',
      rule: 'astrology_never_excuses_behavior',
      explanation: 'ephemeris_and_context_may_reveal_pressure_patterns_but_do_not_remove_choice_responsibility_or_accountability',
      userFacingDisclaimerRequired: true,
    },
  },
}
