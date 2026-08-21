'use client';

import Image from 'next/image';
import { type FormEvent, type ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';

type LocationEntry = {
  id: string;
  value: string;
};

type ForgeLocationFieldProps = {
  label: string;
  children: ReactNode;
};

const createLocationEntry = (): LocationEntry => ({
  id: crypto.randomUUID(),
  value: '',
});

function LocationPinIcon() {
  return (
    <svg
      className="seenForgePin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function ForgeTargetIcon() {
  return (
    <span className="seenForgeTarget" aria-hidden="true">
      <span />
    </span>
  );
}

function ForgeLocationField({ label, children }: ForgeLocationFieldProps) {
  return (
    <div className="seenForgeField">
      <LocationPinIcon />
      <div className="seenForgeFieldBody">
        <span className="seenForgeFieldLabel">{label}</span>
        {children}
      </div>
      <ForgeTargetIcon />
    </div>
  );
}

export default function ForgeLocationPage() {
  const router = useRouter();

  const [birthLocation, setBirthLocation] = useState('');
  const [livedLocations, setLivedLocations] = useState<LocationEntry[]>([
    createLocationEntry(),
  ]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [error, setError] = useState('');

  function updateLivedLocation(id: string, value: string) {
    setLivedLocations((locations) =>
      locations.map((location) =>
        location.id === id ? { ...location, value } : location,
      ),
    );
  }

  function addLivedLocation() {
    setLivedLocations((locations) => [...locations, createLocationEntry()]);
  }

  function removeLivedLocation(id: string) {
    setLivedLocations((locations) => {
      if (locations.length === 1) {
        return [{ ...locations[0], value: '' }];
      }

      return locations.filter((location) => location.id !== id);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedBirthLocation = birthLocation.trim();
    const normalizedCurrentLocation = currentLocation.trim();
    const normalizedLivedLocations = livedLocations
      .map((location) => location.value.trim())
      .filter(Boolean);

    if (!normalizedBirthLocation || !normalizedCurrentLocation) {
      setError('Enter your birth location and current location to continue.');
      return;
    }

    setError('');

    sessionStorage.setItem(
      'seen.foundation.locations',
      JSON.stringify({
        birthLocation: normalizedBirthLocation,
        livedLocations: normalizedLivedLocations,
        currentLocation: normalizedCurrentLocation,
        minimumResidenceMonths: 6,
      }),
    );

    router.push('/foundation/birth');
  }

  return (
    <main className="seenForgePage">
      <Image
        className="seenForgeBackdrop"
        src="/foundation/location-forge-background.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="(max-width: 760px) 100vw, 760px"
      />
      <div className="seenForgeBackdropVeil" aria-hidden="true" />

      <section className="seenForgeShell" aria-labelledby="forge-title">
        <header className="seenForgeMasthead">
          <span className="seenForgeNumber">01</span>
          <h1 id="forge-title" className="seenForgeTitle">
            The Forge
          </h1>
        </header>

        <div className="seenForgeGlobeSpace" aria-hidden="true" />

        <section className="seenForgeExposure" aria-labelledby="exposure-title">
          <header className="seenForgeExposureHeader">
            <h2 id="exposure-title">What were you exposed to?</h2>
          </header>

          <form className="seenForgeForm" onSubmit={handleSubmit}>
            <ForgeLocationField label="Birth Location">
              <LocationAutocompleteInput
                id="birth-location"
                className="seenForgeInput"
                ariaLabel="Birth location"
                placeholder="Enter city, state, country"
                value={birthLocation}
                onChange={setBirthLocation}
              />
            </ForgeLocationField>

            <fieldset className="seenForgeFieldset">
              <legend className="seenVisuallyHidden">
                Locations lived six months or longer
              </legend>

              <div className="seenForgeLocationList">
                {livedLocations.map((location, index) => (
                  <div className="seenForgeLivedRow" key={location.id}>
                    <ForgeLocationField
                      label={index === 0 ? 'Locations Lived 6+ Months' : `Lived Location ${index + 1}`}
                    >
                      <LocationAutocompleteInput
                        className="seenForgeInput"
                        ariaLabel={`Location lived six months or longer ${index + 1}`}
                        placeholder="Enter city, state, country"
                        value={location.value}
                        onChange={(next) => updateLivedLocation(location.id, next)}
                      />
                    </ForgeLocationField>

                    {(location.value || livedLocations.length > 1) && (
                      <button
                        className="seenForgeRemove"
                        type="button"
                        aria-label={`Remove lived location ${index + 1}`}
                        onClick={() => removeLivedLocation(location.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="seenForgeAdd"
                type="button"
                onClick={addLivedLocation}
              >
                <span aria-hidden="true">+</span>
                Add another location
              </button>
            </fieldset>

            <ForgeLocationField label="Current Location">
              <LocationAutocompleteInput
                id="current-location"
                className="seenForgeInput"
                ariaLabel="Current location"
                placeholder="Enter city, state, country"
                value={currentLocation}
                onChange={setCurrentLocation}
              />
            </ForgeLocationField>

            {error && (
              <p className="seenForgeError" role="alert">
                {error}
              </p>
            )}

            <button className="seenForgeSubmit" type="submit">
              Continue
              <span aria-hidden="true">›</span>
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
