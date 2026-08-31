export type TemporalCalibrationAnchor = '6_AM' | 'NOON' | '6_PM' | 'KNOWN_TIME' | 'RECURSIVE_REFINEMENT';

export type SeenLensRoute =
  | 'dark_chart'
  | 'relationship_pattern'
  | 'argument_pattern'
  | 'intimacy_pattern'
  | 'attachment_pattern'
  | 'jung_inversion'
  | 'childhood_imprint'
  | 'wound_marker_expression'
  | 'environmental_amplifier'
  | 'counter_pattern_response'
  | 'sovereignty_protection'
  | 'cadence_tracking'
  | 'printable_export';

export type SeenDepthChip = {
  id: string;
  label: string;
  route: SeenLensRoute;
  sourceSignalIds: string[];
  userFacing: true;
  inventsNewTruth: false;
};

export type ActiveSeenSignal = {
  id: string;
  domain: string;
  source:
    | 'intake'
    | 'birth_signature'
    | 'temporal_calibration'
    | 'western_chart'
    | 'vedic_chart'
    | 'wound_marker'
    | 'attachment_indicator'
    | 'jung_inversion'
    | 'portal_route'
    | 'contextual_pressure'
    | 'cadence_tracking'
    | 'oracle_follow_up';
  summary: string;
  confidence: 'low' | 'medium' | 'high' | 'working_anchor';
  userFacingByDefault: boolean;
};

export type ActiveSeenMap = {
  schemaVersion: '1.0.0';
  mapId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  intake: {
    birthDate?: string;
    birthPlace?: string;
    reportedBirthTime?: string;
    childhoodPlace?: string;
    livedPlaces?: string[];
    maternalEnvironmentSignalIds: string[];
    familyEnvironmentSignalIds: string[];
    contextualPressureSignalIds: string[];
  };

  temporalCalibration: {
    initialAnchors: TemporalCalibrationAnchor[];
    selectedAnchor?: TemporalCalibrationAnchor;
    selectedSummaryId?: string;
    recursiveRefinementActive: boolean;
    finalTimeClaimIsAuthoritative: false;
  };

  backstage: {
    activeSignals: ActiveSeenSignal[];
    workingChartStackSignalIds: string[];
    westernSignalIds: string[];
    vedicSignalIds: string[];
    woundMarkerSignalIds: string[];
    attachmentSignalIds: string[];
    jungInversionSignalIds: string[];
    portalRouteSignalIds: string[];
    darkChartOutputSignalIds: string[];
    sovereigntyRouteSignalIds: string[];
    cadenceFieldSignalIds: string[];
  };

  frontstage: {
    currentUserQuestion?: string;
    currentRoute?: SeenLensRoute;
    availableDepthChips: SeenDepthChip[];
    selectedExportSections: string[];
  };

  laws: {
    everyOracleAnswerMustTraceBackToActiveMap: true;
    latestUserMessageSelectsRouteOnly: true;
    activeMapSuppliesSourceSignal: true;
    recursivePassExecutionRequired: true;
    noImprovisationFromLatestMessageAlone: true;
    printoutExportsSelectedSectionsOnly: true;
  };
};
