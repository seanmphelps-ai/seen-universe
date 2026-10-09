// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup

export type LocationRole = 'BIRTH' | 'LIVED' | 'CURRENT';

export type LocationInput = {
  label: string;
  latitude: number;
  longitude: number;
  exposureStart: string; // "YYYY-MM-DD"
  exposureEnd: string | null; // null = ongoing/current
  role: LocationRole;
};

export type HistoricalGeography = {
  stateFips: string;
  stateName: string;
  countyFips: string;
  countyName: string;
  geographicResolution: 'county';
  resolvedFrom: {
    latitude: number;
    longitude: number;
    source: string;
    sourceUrl: string;
    retrievedAt: string;
  };
};

export type IndicatorDirection = 'HIGHER_IS_MORE' | 'LOWER_IS_MORE';

export type Classification =
  | 'PRESENT'
  | 'ABUNDANT'
  | 'SCARCE'
  | 'ABSENT'
  | 'ACCESSIBLE'
  | 'INACCESSIBLE'
  | 'UNKNOWN';

export type ComparatorValue = {
  label: string; // e.g. "California (state)", "United States (national)"
  value: number;
};

export type Provenance = {
  sourceAuthority: string; // e.g. "U.S. Census Bureau"
  sourceDataset: string; // e.g. "ACS 5-Year Estimates, Table B19013"
  sourceUrl: string;
  retrievedAt: string;
  dataYear: string;
  geography: string; // e.g. "Los Angeles County, CA"
  geographicResolution: 'county';
  requestedResidencePeriod: { start: string; end: string | null };
  dataYearOverlapsResidence: boolean;
  substitution: string | null; // e.g. "nearest available ACS 5-year window used" or null
};

export type LocationConditionRecord = {
  conditionId: string; // e.g. "median_household_income"
  label: string;
  direction: IndicatorDirection;

  status: Classification;

  rawValue: number | null;
  unit: string | null;

  comparators: ComparatorValue[];
  comparatorUsed: string | null; // which comparator label drove the classification

  provenance: Provenance | null;
  limitations: string[];
};

export type LocationDeltaEntry = {
  conditionId: string;
  previousValue: number | null;
  currentValue: number | null;
  previousStatus: Classification;
  currentStatus: Classification;
  direction: 'INCREASED' | 'DECREASED' | 'UNCHANGED' | 'UNKNOWN';
};

export type LocationField = {
  input: LocationInput;
  geography: HistoricalGeography | null;

  findings: LocationConditionRecord[];

  unknownConditions: string[];
  adapterFailures: { adapter: string; reason: string }[];

  delta: LocationDeltaEntry[] | null;

  builtAt: string;
};
