'use client';

import Image from 'next/image';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';

type LocationEntry = { id: string; value: string; startYear: string; endYear: string; showPeriod: boolean };
type YearPeriodBubbleProps = { startYear: string; endYear?: string; present?: boolean; onStartYearChange: (value: string) => void; onEndYearChange?: (value: string) => void };
type ForgeLocationFieldProps = { label: string; children: ReactNode };

const createLocationEntry = (): LocationEntry => ({ id: crypto.randomUUID(), value: '', startYear: '', endYear: '', showPeriod: false });

function YearPeriodBubble({ startYear, endYear = '', present = false, onStartYearChange, onEndYearChange }: YearPeriodBubbleProps) {
  return <div className="seenForgePeriodBubble"><span className="seenForgePeriodTitle">Approximate calendar years</span><div className="seenForgePeriodFields"><label><span>From</span><input type="text" inputMode="numeric" maxLength={4} placeholder="Year" value={startYear} onChange={(event) => onStartYearChange(event.target.value.replace(/\D/g, ''))} /></label><span className="seenForgePeriodDash" aria-hidden="true">—</span>{present ? <span className="seenForgePeriodPresent">Present</span> : <label><span>To</span><input type="text" inputMode="numeric" maxLength={4} placeholder="Year" value={endYear} onChange={(event) => onEndYearChange?.(event.target.value.replace(/\D/g, ''))} /></label>}</div></div>;
}

function LocationPinIcon() { return <svg className="seenForgePin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>; }
function ForgeTargetIcon() { return <span className="seenForgeTarget" aria-hidden="true"><span /></span>; }
function ForgeLocationField({ label, children }: ForgeLocationFieldProps) { return <div className="seenForgeField"><LocationPinIcon /><div className="seenForgeFieldBody"><span className="seenForgeFieldLabel">{label}</span>{children}</div><ForgeTargetIcon /></div>; }

export default function ForgeLocationPage() {
  const router = useRouter();
  const [introductionComplete, setIntroductionComplete] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [livedLocations, setLivedLocations] = useState<LocationEntry[]>([createLocationEntry()]);
  const [currentLocation, setCurrentLocation] = useState(''); const [currentStartYear, setCurrentStartYear] = useState(''); const [showCurrentPeriod, setShowCurrentPeriod] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('seen.introduction.v2.complete') !== 'true') {
      router.replace('/');
      return;
    }
    setIntroductionComplete(true);
  }, [router]);

  function updateLivedLocation(id: string, value: string) { setLivedLocations((locations) => locations.map((location) => location.id === id ? { ...location, value } : location)); }
  function updateLivedPeriod(id: string, field: 'startYear' | 'endYear' | 'showPeriod', value: string | boolean) { setLivedLocations((locations) => locations.map((location) => location.id === id ? { ...location, [field]: value } : location)); }
  function addLivedLocation() { setLivedLocations((locations) => [...locations, createLocationEntry()]); }
  function removeLivedLocation(id: string) { setLivedLocations((locations) => locations.length === 1 ? [createLocationEntry()] : locations.filter((location) => location.id !== id)); }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const normalizedBirthLocation = birthLocation.trim(); const normalizedCurrentLocation = currentLocation.trim();
    const normalizedLivedLocations = livedLocations.filter((location) => location.value.trim()).map((location) => location.value.trim());
    const livedPeriods = livedLocations.filter((location) => location.value.trim()).map((location) => ({ location: location.value.trim(), startYear: location.startYear || null, endYear: location.endYear || null }));
    if (!birthDate || !normalizedBirthLocation || !normalizedCurrentLocation) { setError('Enter your date of birth, birth location, and current city to continue.'); return; }
    setError('');
    sessionStorage.setItem('seen.foundation.locations', JSON.stringify({ birthLocation: normalizedBirthLocation, livedLocations: normalizedLivedLocations, livedPeriods, currentLocation: normalizedCurrentLocation, currentPeriod: { startYear: currentStartYear || null, endYear: 'present' }, minimumResidenceMonths: 12 }));
    sessionStorage.setItem('seen.foundation.birthDate', birthDate);
    router.push('/foundation/birth');
  }

  if (!introductionComplete) return null;

  return <main className="seenForgePage"><Image className="seenForgeBackdrop" src="/foundation/location-forge-background.png" alt="" aria-hidden="true" fill priority sizes="(max-width: 760px) 100vw, 760px" /><div className="seenForgeBackdropVeil" aria-hidden="true" /><section className="seenForgeShell" aria-labelledby="forge-title"><header className="seenForgeMasthead"><span className="seenForgeNumber">01</span><h1 id="forge-title" className="seenForgeTitle">The Forge</h1></header><div className="seenForgeGlobeSpace" aria-hidden="true" /><section className="seenForgeExposure" aria-labelledby="exposure-title"><header className="seenForgeExposureHeader"><h2 id="exposure-title">Tell us where and in what years the twists &amp; turns of your journey have taken place.</h2></header>
    <form className="seenForgeForm" onSubmit={handleSubmit}>
      <label className="seenForgeField"><span className="seenForgeFieldBody"><span className="seenForgeFieldLabel">Date of Birth</span><input className="seenForgeInput" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></span></label>
      <ForgeLocationField label="Birth Location"><LocationAutocompleteInput id="birth-location" className="seenForgeInput" ariaLabel="Birth location" placeholder="Enter city, state, country" value={birthLocation} onChange={setBirthLocation} /></ForgeLocationField>
      <fieldset className="seenForgeFieldset"><legend className="seenVisuallyHidden">Locations lived more than one year</legend><div className="seenForgeLocationList">{livedLocations.map((location, index) => <div className="seenForgeLivedRow" key={location.id}><ForgeLocationField label={index === 0 ? 'Places Lived More Than 1 Year' : `Lived Location ${index + 1}`}><LocationAutocompleteInput className="seenForgeInput" ariaLabel={`Location lived more than one year ${index + 1}`} placeholder="Enter city, state, country" value={location.value} onChange={(next) => updateLivedLocation(location.id, next)} onLocationEntered={() => updateLivedPeriod(location.id, 'showPeriod', true)} /></ForgeLocationField>{location.showPeriod && location.value.trim() && <YearPeriodBubble startYear={location.startYear} endYear={location.endYear} onStartYearChange={(value) => updateLivedPeriod(location.id, 'startYear', value)} onEndYearChange={(value) => updateLivedPeriod(location.id, 'endYear', value)} />}{(location.value || livedLocations.length > 1) && <button className="seenForgeRemove" type="button" aria-label={`Remove lived location ${index + 1}`} onClick={() => removeLivedLocation(location.id)}>×</button>}</div>)}</div><button className="seenForgeAdd" type="button" onClick={addLivedLocation}><span aria-hidden="true">+</span>Add another location</button></fieldset>
      <ForgeLocationField label="Current City"><LocationAutocompleteInput id="current-location" className="seenForgeInput" ariaLabel="Current city" placeholder="Enter city, state, country" value={currentLocation} onChange={setCurrentLocation} onLocationEntered={() => setShowCurrentPeriod(true)} /></ForgeLocationField>{showCurrentPeriod && currentLocation.trim() && <YearPeriodBubble startYear={currentStartYear} present onStartYearChange={setCurrentStartYear} />}
      {error && <p className="seenForgeError" role="alert">{error}</p>}<button className="seenForgeSubmit" type="submit">Continue<span aria-hidden="true">›</span></button>
    </form></section></section></main>;
}
