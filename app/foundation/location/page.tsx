'use client';

import { useState } from 'react';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';
import { LocationPressureCards } from '../../../components/LocationPressureCards';
import type { SketchId } from '../../../lib/location/pressure';

/** Location card. Its label is environmental exposure. */
export default function LocationPage() {
  const [label, setLabel] = useState('');
  const [locked, setLocked] = useState<SketchId | null>(null);

  return (
    <main className="seenAlivePage">
      <section className="seenPanel seenFlowForm" aria-labelledby="location-card-title">
        <h1 id="location-card-title">environmental exposure</h1>
        <p className="seenFieldSupport">Incubators of the field</p>
        <p className="seenFieldSupport">Reveal the places that shaped the pressure.</p>
        <div className="seenField">
          <label className="seenLabel" htmlFor="location-q">
            City
          </label>
          <div className="seenInputFrame">
            <LocationAutocompleteInput
              id="location-q"
              className="seenInput"
              value={label}
              onChange={(value) => {
                setLabel(value);
                setLocked(null);
              }}
              placeholder="City"
              ariaLabel="City"
            />
          </div>
        </div>
        <LocationPressureCards label={label} onLocked={setLocked} />
        {locked ? <p className="seenFieldSupport">Locked: {locked}</p> : null}
      </section>
    </main>
  );
}
