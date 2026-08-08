'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type LocationEntry = {
  id: string;
  value: string;
};

const createLocationEntry = (): LocationEntry => ({
  id: crypto.randomUUID(),
  value: '',
});

export default function GeographicalImprintsPage() {
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
      }),
    );

    router.push('/foundation/birth');
  }

  return (
    <main className="seenFlowPage">
      <section
        className="seenFlowShell"
        aria-labelledby="geographical-imprints-title"
      >
        <div className="seenProgress" aria-label="Foundation progress">
          <span className="seenProgressLabel">Foundation</span>
          <span className="seenProgressValue">01 / 02</span>
        </div>

        <header className="seenFlowHeader">
          <h1 id="geographical-imprints-title" className="seenDisplayLarge">
            Geographical Imprints
          </h1>

          <p className="seenFlowIntroduction">
            Tell us where in the world your life has taken place.
          </p>

          <div className="seenDivider" aria-hidden="true" />
        </header>

        <form className="seenPanel seenFlowForm" onSubmit={handleSubmit}>
          <div className="seenField">
            <label className="seenLabel" htmlFor="birth-location">
              Where were you born?
            </label>

            <div className="seenInputFrame">
              <span className="seenFieldIcon" aria-hidden="true">
                ⟡
              </span>

              <input
                id="birth-location"
                className="seenInput seenInputWithIcon"
                type="text"
                autoComplete="off"
                placeholder="City, state or country"
                value={birthLocation}
                onChange={(event) => setBirthLocation(event.target.value)}
              />
            </div>
          </div>

          <fieldset className="seenFieldset">
            <legend className="seenLabel">Where else have you lived?</legend>

            <p className="seenFieldSupport">
              Add each location where you lived for one year or longer.
            </p>

            <div className="seenLocationList">
              {livedLocations.map((location, index) => (
                <div className="seenLocationRow" key={location.id}>
                  <div className="seenInputFrame">
                    <span className="seenFieldIcon" aria-hidden="true">
                      ⟡
                    </span>

                    <input
                      className="seenInput seenInputWithIcon"
                      type="text"
                      autoComplete="off"
                      aria-label={`Lived location ${index + 1}`}
                      placeholder="City, state or country"
                      value={location.value}
                      onChange={(event) =>
                        updateLivedLocation(location.id, event.target.value)
                      }
                    />
                  </div>

                  {location.value && (
                    <button
                      className="seenLocationRemove"
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
              className="seenAddLocation"
              type="button"
              onClick={addLivedLocation}
            >
              <span aria-hidden="true">+</span>
              Add another location
            </button>
          </fieldset>

          <div className="seenField">
            <label className="seenLabel" htmlFor="current-location">
              Where do you live now?
            </label>

            <div className="seenInputFrame">
              <span className="seenFieldIcon" aria-hidden="true">
                ⟡
              </span>

              <input
                id="current-location"
                className="seenInput seenInputWithIcon"
                type="text"
                autoComplete="off"
                placeholder="City, state or country"
                value={currentLocation}
                onChange={(event) => setCurrentLocation(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="seenFormError" role="alert">
              {error}
            </p>
          )}

          <button className="seenButtonPrimary" type="submit">
            Continue
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <div
          className="seenDivider seenCompletionDivider"
          aria-hidden="true"
        />
      </section>
    </main>
  );
}
