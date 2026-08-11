// SEEN Location V1 — canonical contract.
//
// Scope: this is the tightened V1 spec, which supersedes the older
// 25-question / full Environmental Forge scope. V1 deliberately omits
// percentile/extremity normalization, pressure/support composite scores,
// and multi-location accumulation — those belonged to the older, wider
// spec. V1 keeps only: exposure, one real Material Field vertical slice,
// explicit comparator-based classification, provenance, and optional
// delta against a previous LocationField.
//
// Location examines the environment. It does not interpret the person.

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
  // V1 resolves county-level geography only. County FIPS boundaries are
  // effectively stable for decades, unlike census tract boundaries, which
  // are redrawn between censuses — resolving to tract would silently imply
  // historical-boundary precision this V1 does not reconcile.
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
