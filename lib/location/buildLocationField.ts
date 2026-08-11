// SEEN Location V1 — orchestrator.
//
// LocationInput -> geography resolution -> independent source adapters ->
// normalize -> classify -> provenance -> LocationField -> optional delta.
//
// Each adapter is fetched independently (Promise.allSettled): one failing
// source degrades that condition to UNKNOWN with a recorded reason, and
// does not affect the others or crash the result.

import { resolveHistoricalGeography, GeographyResolutionError } from './geography';
import {
  fetchAcsCounty,
  fetchAcsState,
  fetchAcsNational,
  deriveMaterialFieldMetrics,
  CensusAcsError,
} from './adapters/censusAcs';
import { fetchLausCountyUnemploymentRate, BlsLausError } from './adapters/blsLaus';
import { selectAcsVintageYear } from './historicalYear';
import { classifyAgainstComparator, selectComparator } from './comparator';
import type {
  LocationField,
  LocationInput,
  LocationConditionRecord,
  LocationDeltaEntry,
  Provenance,
  ComparatorValue,
} from './types';

function makeProvenance(
  sourceAuthority: string,
  sourceDataset: string,
  sourceUrl: string,
  dataYear: string,
  geographyLabel: string,
  input: LocationInput,
  dataYearOverlapsResidence: boolean,
  substitution: string | null,
): Provenance {
  return {
    sourceAuthority,
    sourceDataset,
    sourceUrl,
    retrievedAt: new Date().toISOString(),
    dataYear,
    geography: geographyLabel,
    geographicResolution: 'county',
    requestedResidencePeriod: { start: input.exposureStart, end: input.exposureEnd },
    dataYearOverlapsResidence,
    substitution,
  };
}

function unknownCondition(conditionId: string, label: string, direction: 'HIGHER_IS_MORE' | 'LOWER_IS_MORE', reason: string): LocationConditionRecord {
  return {
    conditionId,
    label,
    direction,
    status: 'UNKNOWN',
    rawValue: null,
    unit: null,
    comparators: [],
    comparatorUsed: null,
    provenance: null,
    limitations: [reason],
  };
}

export async function buildLocationField(
  input: LocationInput,
  previous?: LocationField | null,
): Promise<LocationField> {
  const adapterFailures: { adapter: string; reason: string }[] = [];
  const findings: LocationConditionRecord[] = [];
  const unknownConditions: string[] = [];

  // --- Geography ---
  let geography: LocationField['geography'] = null;
  try {
    geography = await resolveHistoricalGeography(input.latitude, input.longitude);
  } catch (err) {
    const reason = err instanceof GeographyResolutionError ? err.message : String(err);
    adapterFailures.push({ adapter: 'census-geocoder', reason });
  }

  if (!geography) {
    // Without geography, no source adapter can run — every Material Field
    // condition becomes UNKNOWN rather than partially guessed.
    for (const [id, label, dir] of [
      ['median_household_income', 'Median household income', 'HIGHER_IS_MORE'],
      ['poverty_rate', 'Poverty rate', 'LOWER_IS_MORE'],
      ['unemployment_rate_acs', 'Unemployment rate (ACS)', 'LOWER_IS_MORE'],
      ['unemployment_rate_bls', 'Unemployment rate (BLS LAUS)', 'LOWER_IS_MORE'],
    ] as const) {
      findings.push(unknownCondition(id, label, dir, 'Geography could not be resolved.'));
      unknownConditions.push(id);
    }

    return {
      input,
      geography: null,
      findings,
      unknownConditions,
      adapterFailures,
      delta: null,
      builtAt: new Date().toISOString(),
    };
  }

  const yearSelection = selectAcsVintageYear(input.exposureStart, input.exposureEnd);
  const geographyLabel = `${geography.countyName} County, ${geography.stateName}`;

  // --- Census ACS (county, state, national — independent of BLS) ---
  const acsSettled = await Promise.allSettled([
    fetchAcsCounty(yearSelection.dataYear, geography.stateFips, geography.countyFips),
    fetchAcsState(yearSelection.dataYear, geography.stateFips),
    fetchAcsNational(yearSelection.dataYear),
  ]);

  const [countySettled, stateSettled, nationalSettled] = acsSettled;

  if (countySettled.status === 'rejected') {
    const reason =
      countySettled.reason instanceof CensusAcsError
        ? countySettled.reason.message
        : String(countySettled.reason);
    adapterFailures.push({ adapter: 'census-acs', reason });

    for (const [id, label, dir] of [
      ['median_household_income', 'Median household income', 'HIGHER_IS_MORE'],
      ['poverty_rate', 'Poverty rate', 'LOWER_IS_MORE'],
      ['unemployment_rate_acs', 'Unemployment rate (ACS)', 'LOWER_IS_MORE'],
    ] as const) {
      findings.push(unknownCondition(id, label, dir, reason));
      unknownConditions.push(id);
    }
  } else {
    const countyMetrics = deriveMaterialFieldMetrics(countySettled.value);
    const stateMetrics =
      stateSettled.status === 'fulfilled' ? deriveMaterialFieldMetrics(stateSettled.value) : null;
    const nationalMetrics =
      nationalSettled.status === 'fulfilled'
        ? deriveMaterialFieldMetrics(nationalSettled.value)
        : null;

    if (stateSettled.status === 'rejected') {
      adapterFailures.push({
        adapter: 'census-acs-state-comparator',
        reason:
          stateSettled.reason instanceof CensusAcsError
            ? stateSettled.reason.message
            : String(stateSettled.reason),
      });
    }
    if (nationalSettled.status === 'rejected') {
      adapterFailures.push({
        adapter: 'census-acs-national-comparator',
        reason:
          nationalSettled.reason instanceof CensusAcsError
            ? nationalSettled.reason.message
            : String(nationalSettled.reason),
      });
    }

    const provenanceFor = (dataset: string) =>
      makeProvenance(
        'U.S. Census Bureau',
        dataset,
        `https://api.census.gov/data/${yearSelection.dataYear}/acs/acs5`,
        yearSelection.dataYear,
        geographyLabel,
        input,
        yearSelection.overlapsResidence,
        yearSelection.substitution,
      );

    const buildAcsFinding = (
      conditionId: string,
      label: string,
      direction: 'HIGHER_IS_MORE' | 'LOWER_IS_MORE',
      unit: string,
      dataset: string,
      rawValue: number | null,
      stateValue: number | null,
      nationalValue: number | null,
    ): LocationConditionRecord => {
      const comparators: ComparatorValue[] = [];
      if (stateValue !== null) comparators.push({ label: `${geography.stateName} (state)`, value: stateValue });
      if (nationalValue !== null) comparators.push({ label: 'United States (national)', value: nationalValue });

      const comparator = selectComparator(comparators, `${geography.stateName} (state)`);
      const status = classifyAgainstComparator(rawValue, comparator, direction);
      const limitations: string[] = [];
      if (!yearSelection.overlapsResidence && yearSelection.substitution) {
        limitations.push(yearSelection.substitution);
      }
      if (comparators.length === 0) {
        limitations.push('No comparator available; classification defaulted to UNKNOWN.');
      }

      return {
        conditionId,
        label,
        direction,
        status,
        rawValue,
        unit,
        comparators,
        comparatorUsed: comparator?.label ?? null,
        provenance: rawValue !== null ? provenanceFor(dataset) : null,
        limitations,
      };
    };

    findings.push(
      buildAcsFinding(
        'median_household_income',
        'Median household income',
        'HIGHER_IS_MORE',
        'USD',
        'ACS 5-Year Estimates, Table B19013',
        countyMetrics.medianHouseholdIncome,
        stateMetrics?.medianHouseholdIncome ?? null,
        nationalMetrics?.medianHouseholdIncome ?? null,
      ),
    );
    findings.push(
      buildAcsFinding(
        'poverty_rate',
        'Poverty rate',
        'LOWER_IS_MORE',
        'percent',
        'ACS 5-Year Estimates, Table B17001',
        countyMetrics.povertyRatePercent,
        stateMetrics?.povertyRatePercent ?? null,
        nationalMetrics?.povertyRatePercent ?? null,
      ),
    );
    findings.push(
      buildAcsFinding(
        'unemployment_rate_acs',
        'Unemployment rate (ACS)',
        'LOWER_IS_MORE',
        'percent',
        'ACS 5-Year Estimates, Table B23025',
        countyMetrics.unemploymentRatePercent,
        stateMetrics?.unemploymentRatePercent ?? null,
        nationalMetrics?.unemploymentRatePercent ?? null,
      ),
    );
  }

  // --- BLS LAUS (independent of Census entirely) ---
  try {
    // BLS LAUS is a monthly/annual time series, not a 5-year window — use
    // the single year closest to the residence period's midpoint rather
    // than the ACS vintage year.
    const targetYear = String(
      Math.round(
        (Number(input.exposureStart.slice(0, 4)) +
          Number((input.exposureEnd ?? new Date().toISOString()).slice(0, 4))) /
          2,
      ),
    );

    const laus = await fetchLausCountyUnemploymentRate(
      geography.stateFips,
      geography.countyFips,
      targetYear,
    );

    findings.push({
      conditionId: 'unemployment_rate_bls',
      label: 'Unemployment rate (BLS LAUS annual average)',
      direction: 'LOWER_IS_MORE',
      status: laus.annualAveragePercent !== null ? 'PRESENT' : 'UNKNOWN',
      rawValue: laus.annualAveragePercent,
      unit: 'percent',
      comparators: [],
      comparatorUsed: null,
      provenance:
        laus.annualAveragePercent !== null
          ? makeProvenance(
              'U.S. Bureau of Labor Statistics',
              `Local Area Unemployment Statistics, series ${laus.result.seriesID}`,
              'https://api.bls.gov/publicAPI/v2/timeseries/data/',
              targetYear,
              geographyLabel,
              input,
              true,
              null,
            )
          : null,
      limitations:
        laus.annualAveragePercent === null
          ? ['BLS LAUS returned no annual-average (M13) data point for the requested year.']
          : ['No state/national comparator implemented for BLS LAUS in V1 — cross-check value only.'],
    });
  } catch (err) {
    const reason = err instanceof BlsLausError ? err.message : String(err);
    adapterFailures.push({ adapter: 'bls-laus', reason });
    findings.push(
      unknownCondition(
        'unemployment_rate_bls',
        'Unemployment rate (BLS LAUS annual average)',
        'LOWER_IS_MORE',
        reason,
      ),
    );
    unknownConditions.push('unemployment_rate_bls');
  }

  for (const f of findings) {
    if (f.status === 'UNKNOWN' && !unknownConditions.includes(f.conditionId)) {
      unknownConditions.push(f.conditionId);
    }
  }

  // --- Delta vs previous LocationField ---
  let delta: LocationDeltaEntry[] | null = null;
  if (previous) {
    delta = findings.map((finding): LocationDeltaEntry => {
      const prior = previous.findings.find((f) => f.conditionId === finding.conditionId);
      const previousValue = prior?.rawValue ?? null;
      const currentValue = finding.rawValue;

      let direction: LocationDeltaEntry['direction'] = 'UNKNOWN';
      if (previousValue !== null && currentValue !== null) {
        if (currentValue > previousValue) direction = 'INCREASED';
        else if (currentValue < previousValue) direction = 'DECREASED';
        else direction = 'UNCHANGED';
      }

      return {
        conditionId: finding.conditionId,
        previousValue,
        currentValue,
        previousStatus: prior?.status ?? 'UNKNOWN',
        currentStatus: finding.status,
        direction,
      };
    });
  }

  return {
    input,
    geography,
    findings,
    unknownConditions,
    adapterFailures,
    delta,
    builtAt: new Date().toISOString(),
  };
}
