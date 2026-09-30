'use client';

import { useState } from 'react';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';
import { LocationPressureCards } from '../../../components/LocationPressureCards';
import type { SketchId } from '../../../lib/location/pressure';

export default function ForgeLocationPage() {
  const [label, setLabel] = useState('');
  const [locked, setLocked] = useState<SketchId | null>(null);

  return (
    <main className="seenAlivePage">
      <section className="seenPanel seenFlowForm">
        <span className="seenLabel">Place</span>
        <h1>Incubators of the field</h1>
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
