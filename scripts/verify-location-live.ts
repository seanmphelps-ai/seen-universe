#!/usr/bin/env tsx
// SEEN Location V1 — live verification script.
//
// One-command proof that the real Census/BLS integration works, run from
// a network-enabled environment (this sandbox cannot reach these domains —
// see the adapter file comments). Uses one fixed, known test location so
// the result is reproducible run to run.
//
//   npm run verify:location:live
//
// This does NOT fall back to mock data on failure. If an adapter's
// response shape doesn't match what the parser expects, it throws, and
// this script reports that plainly and exits non-zero — that is the
// correct outcome for "prove it actually works," not something to catch
// and paper over.

import { buildLocationField } from '../lib/location/buildLocationField';
import type { LocationInput } from '../lib/location/types';

// Fixed test location: Los Angeles, CA. Chosen because it's large enough
// to have full ACS/BLS/geocoder coverage under any reasonable historical
// window, minimizing "real coverage gap" as a confound when checking
// whether the *code* works.
const TEST_INPUT: LocationInput = {
  label: 'Los Angeles, CA (fixed live-verification location)',
  latitude: 34.0522,
  longitude: -118.2437,
  exposureStart: '2018-01-01',
  exposureEnd: '2022-12-31',
  role: 'LIVED',
};

function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

async function main() {
  console.log('SEEN Location V1 — live verification run');
  console.log(`Test input: ${JSON.stringify(TEST_INPUT, null, 2)}`);

  const field = await buildLocationField(TEST_INPUT);

  section('Geography');
  if (!field.geography) {
    console.log('FAILED TO RESOLVE — see adapter failures below.');
  } else {
    console.log(`Resolved: ${field.geography.countyName} County, ${field.geography.stateName}`);
    console.log(`  FIPS: state=${field.geography.stateFips} county=${field.geography.countyFips}`);
    console.log(`  Source: ${field.geography.resolvedFrom.source}`);
    console.log(`  URL: ${field.geography.resolvedFrom.sourceUrl}`);
  }

  section('Findings');
  for (const finding of field.findings) {
    console.log(`\n- ${finding.label} (${finding.conditionId})`);
    console.log(`  status: ${finding.status}`);
    console.log(`  rawValue: ${finding.rawValue ?? 'null'} ${finding.unit ?? ''}`);
    console.log(`  comparators: ${JSON.stringify(finding.comparators)}`);
    console.log(`  comparatorUsed: ${finding.comparatorUsed ?? 'none'}`);
    if (finding.provenance) {
      console.log(`  provenance.sourceAuthority: ${finding.provenance.sourceAuthority}`);
      console.log(`  provenance.sourceDataset: ${finding.provenance.sourceDataset}`);
      console.log(`  provenance.sourceUrl: ${finding.provenance.sourceUrl}`);
      console.log(`  provenance.dataYear: ${finding.provenance.dataYear}`);
      console.log(`  provenance.dataYearOverlapsResidence: ${finding.provenance.dataYearOverlapsResidence}`);
    } else {
      console.log('  provenance: none (condition is UNKNOWN)');
    }
    if (finding.limitations.length > 0) {
      console.log(`  limitations: ${finding.limitations.join(' | ')}`);
    }
  }

  section('Adapter failures');
  if (field.adapterFailures.length === 0) {
    console.log('None.');
  } else {
    for (const failure of field.adapterFailures) {
      console.log(`- ${failure.adapter}: ${failure.reason}`);
    }
  }

  section('Result');
  const success = field.adapterFailures.length === 0 && field.unknownConditions.length === 0;
  console.log(`unknownConditions: [${field.unknownConditions.join(', ')}]`);
  console.log(success ? 'LIVE VERIFICATION: PASSED' : 'LIVE VERIFICATION: FAILED');

  if (!success) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('\nLIVE VERIFICATION: CRASHED (this is the correct, visible failure mode —');
  console.error('no mock data was substituted).');
  console.error(err);
  process.exitCode = 1;
});
