'use client';

import Image from 'next/image';
import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationAutocompleteInput } from '../../../components/LocationAutocompleteInput';

type LocationEntry = {
  id: string;
  value: string;
  startYear: string;
  endYear: string;
  showPeriod: boolean;
};

type IntakeMode = 'choose' | 'chat' | 'voice' | 'manual';
type ConversationStep =
  | 'birthLocation'
  | 'birthEndYear'
  | 'livedLocation'
  | 'livedStartYear'
  | 'livedEndYear'
  | 'moreLived'
  | 'currentLocation'
  | 'currentStartYear'
  | 'confirm';

type YearPeriodBubbleProps = {
  startYear: string;
  endYear?: string;
  present?: boolean;
  onStartYearChange: (value: string) => void;
  onEndYearChange?: (value: string) => void;
};

type ForgeLocationFieldProps = {
  label: string;
  children: ReactNode;
};

type SpeechRecognitionResultEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const createLocationEntry = (): LocationEntry => ({
  id: crypto.randomUUID(),
  value: '',
  startYear: '',
  endYear: '',
  showPeriod: false,
});

function YearPeriodBubble({
  startYear,
  endYear = '',
  present = false,
  onStartYearChange,
  onEndYearChange,
}: YearPeriodBubbleProps) {
  return (
    <div className="seenForgePeriodBubble">
      <span className="seenForgePeriodTitle">Approximate calendar years</span>
      <div className="seenForgePeriodFields">
        <label>
          <span>From</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="Year"
            value={startYear}
            onChange={(event) =>
              onStartYearChange(event.target.value.replace(/\D/g, ''))
            }
          />
        </label>
        <span className="seenForgePeriodDash" aria-hidden="true">—</span>
        {present ? (
          <span className="seenForgePeriodPresent">Present</span>
        ) : (
          <label>
            <span>To</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="Year"
              value={endYear}
              onChange={(event) =>
                onEndYearChange?.(event.target.value.replace(/\D/g, ''))
              }
            />
          </label>
        )}
      </div>
    </div>
  );
}

function LocationPinIcon() {
  return (
    <svg className="seenForgePin" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function ForgeTargetIcon() {
  return <span className="seenForgeTarget" aria-hidden="true"><span /></span>;
}

function MicrophoneIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        display: 'block',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </svg>
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
  const [mode, setMode] = useState<IntakeMode>('choose');
  const [step, setStep] = useState<ConversationStep>('birthLocation');
  const [answer, setAnswer] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  const [birthLocation, setBirthLocation] = useState('');
  const [birthStartYear, setBirthStartYear] = useState('');
  const [birthEndYear, setBirthEndYear] = useState('');
  const [showBirthPeriod, setShowBirthPeriod] = useState(false);
  const [livedLocations, setLivedLocations] = useState<LocationEntry[]>([
    createLocationEntry(),
  ]);
  const [activeLivedId, setActiveLivedId] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentStartYear, setCurrentStartYear] = useState('');
  const [showCurrentPeriod, setShowCurrentPeriod] = useState(false);

  const conversationPrompt = useMemo(() => {
    if (step === 'birthLocation') {
      return 'Every place adds a twist or turn to the journey. Let’s start where this one began. Where was this person born?';
    }
    if (step === 'birthEndYear') {
      return `About what year did they leave ${birthLocation || 'that place'}?`;
    }
    if (step === 'livedLocation') {
      return 'And where did the journey go next?';
    }
    if (step === 'livedStartYear') {
      return 'About what year did they arrive there?';
    }
    if (step === 'livedEndYear') {
      return 'About what year did they leave?';
    }
    if (step === 'moreLived') {
      return 'Did another place add a twist or turn before where they live now?';
    }
    if (step === 'currentLocation') {
      return 'Where has the journey brought them now?';
    }
    if (step === 'currentStartYear') {
      return `About what year did they arrive in ${currentLocation || 'their current location'}?`;
    }
    return 'Here’s the path I heard. Does this look right?';
  }, [step, birthLocation, currentLocation]);

  function startVoiceForAnswer() {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setError('Voice dictation is not available in this browser.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) setAnswer(transcript);
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      setError('Voice dictation stopped. Tap the microphone to try again.');
    };
    recognition.onend = () => setListening(false);
    setError('');
    setListening(true);
    recognition.start();
  }

  function updateLivedLocation(id: string, value: string) {
    setLivedLocations((locations) =>
      locations.map((location) =>
        location.id === id ? { ...location, value } : location,
      ),
    );
  }

  function updateLivedPeriod(
    id: string,
    field: 'startYear' | 'endYear' | 'showPeriod',
    value: string | boolean,
  ) {
    setLivedLocations((locations) =>
      locations.map((location) =>
        location.id === id ? { ...location, [field]: value } : location,
      ),
    );
  }

  function addLivedLocation() {
    setLivedLocations((locations) => [...locations, createLocationEntry()]);
  }

  function removeLivedLocation(id: string) {
    setLivedLocations((locations) =>
      locations.length === 1
        ? [createLocationEntry()]
        : locations.filter((location) => location.id !== id),
    );
  }

  function submitConversationAnswer(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const value = answer.trim();
    if (!value && step !== 'moreLived') return;

    if (step === 'birthLocation') {
      setBirthLocation(value);
      setShowBirthPeriod(true);
      setAnswer('');
      setStep('birthEndYear');
      return;
    }

    if (step === 'birthEndYear') {
      setBirthEndYear(value.replace(/\D/g, '').slice(0, 4));
      setAnswer('');
      setStep('moreLived');
      return;
    }

    if (step === 'livedLocation') {
      const entry = createLocationEntry();
      entry.value = value;
      entry.showPeriod = true;
      setLivedLocations((locations) => {
        const hasBlankOnly =
          locations.length === 1 && !locations[0].value.trim();
        return hasBlankOnly ? [entry] : [...locations, entry];
      });
      setActiveLivedId(entry.id);
      setAnswer('');
      setStep('livedStartYear');
      return;
    }

    if (step === 'livedStartYear' && activeLivedId) {
      updateLivedPeriod(
        activeLivedId,
        'startYear',
        value.replace(/\D/g, '').slice(0, 4),
      );
      setAnswer('');
      setStep('livedEndYear');
      return;
    }

    if (step === 'livedEndYear' && activeLivedId) {
      updateLivedPeriod(
        activeLivedId,
        'endYear',
        value.replace(/\D/g, '').slice(0, 4),
      );
      setActiveLivedId(null);
      setAnswer('');
      setStep('moreLived');
      return;
    }

    if (step === 'currentLocation') {
      setCurrentLocation(value);
      setShowCurrentPeriod(true);
      setAnswer('');
      setStep('currentStartYear');
      return;
    }

    if (step === 'currentStartYear') {
      setCurrentStartYear(value.replace(/\D/g, '').slice(0, 4));
      setAnswer('');
      setStep('confirm');
    }
  }

  function chooseMoreLived(yes: boolean) {
    setAnswer('');
    setStep(yes ? 'livedLocation' : 'currentLocation');
  }

  function saveAndContinue() {
    const normalizedBirthLocation = birthLocation.trim();
    const normalizedCurrentLocation = currentLocation.trim();
    const normalizedLivedLocations = livedLocations
      .filter((location) => location.value.trim())
      .map((location) => location.value.trim());
    const livedPeriods = livedLocations
      .filter((location) => location.value.trim())
      .map((location) => ({
        location: location.value.trim(),
        startYear: location.startYear || null,
        endYear: location.endYear || null,
      }));

    if (!normalizedBirthLocation || !normalizedCurrentLocation) {
      setError('Enter the birth location and current location to continue.');
      return;
    }

    sessionStorage.setItem(
      'seen.foundation.locations',
      JSON.stringify({
        birthLocation: normalizedBirthLocation,
        birthPeriod: {
          startYear: birthStartYear || null,
          endYear: birthEndYear || null,
        },
        livedLocations: normalizedLivedLocations,
        livedPeriods,
        currentLocation: normalizedCurrentLocation,
        currentPeriod: {
          startYear: currentStartYear || null,
          endYear: 'present',
        },
        minimumResidenceMonths: 6,
      }),
    );

    router.push('/foundation/birth');
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveAndContinue();
  }

  const modeButtonStyle = {
    minHeight: 54,
    padding: '0 18px',
    color: '#f4cf69',
    background: 'rgba(5,4,2,.88)',
    border: '1px solid rgba(246,188,69,.92)',
    borderRadius: 999,
    boxShadow: '0 0 10px rgba(255,169,37,.28)',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.05rem',
    letterSpacing: '.08em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  };

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
          <h1 id="forge-title" className="seenForgeTitle">The Forge</h1>
        </header>

        <div className="seenForgeGlobeSpace" aria-hidden="true" />

        <section className="seenForgeExposure" aria-labelledby="exposure-title">
          <header className="seenForgeExposureHeader">
            <h2 id="exposure-title">What were you exposed to?</h2>
          </header>

          {mode === 'choose' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <p
                style={{
                  margin: '0 0 4px',
                  color: '#f4ead8',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.25rem',
                  lineHeight: 1.35,
                  textAlign: 'center',
                }}
              >
                Every place adds a twist or turn to the journey. How would you like to tell us the story?
              </p>
              <button style={modeButtonStyle} type="button" onClick={() => setMode('voice')}>
                Voice
              </button>
              <button style={modeButtonStyle} type="button" onClick={() => setMode('chat')}>
                Chat
              </button>
              <button style={modeButtonStyle} type="button" onClick={() => setMode('manual')}>
                Manual
              </button>
            </div>
          )}

          {(mode === 'chat' || mode === 'voice') && (
            <div
              style={{
                display: 'grid',
                gap: 16,
                padding: 18,
                background: 'rgba(6,5,3,.88)',
                border: '1px solid rgba(246,188,69,.76)',
                borderRadius: 20,
                boxShadow: '0 0 18px rgba(255,156,19,.16)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#f6d474',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.35rem',
                  lineHeight: 1.35,
                }}
              >
                {conversationPrompt}
              </p>

              {step === 'moreLived' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button style={modeButtonStyle} type="button" onClick={() => chooseMoreLived(true)}>
                    Yes
                  </button>
                  <button style={modeButtonStyle} type="button" onClick={() => chooseMoreLived(false)}>
                    No
                  </button>
                </div>
              ) : step === 'confirm' ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ color: '#f4ead8', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', lineHeight: 1.5 }}>
                    <div>{birthLocation}{birthEndYear ? ` → ${birthEndYear}` : ''}</div>
                    {livedLocations.filter((item) => item.value.trim()).map((item) => (
                      <div key={item.id}>{item.value}{item.startYear || item.endYear ? ` · ${item.startYear || '?'}–${item.endYear || '?'}` : ''}</div>
                    ))}
                    <div>{currentLocation}{currentStartYear ? ` · ${currentStartYear}–present` : ''}</div>
                  </div>
                  <button style={modeButtonStyle} type="button" onClick={saveAndContinue}>
                    Looks right
                  </button>
                  <button style={modeButtonStyle} type="button" onClick={() => setMode('manual')}>
                    Edit manually
                  </button>
                </div>
              ) : (
                <form onSubmit={submitConversationAnswer} style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={mode === 'voice' ? 'Speak or type your answer' : 'Type your answer'}
                    inputMode={step.toLowerCase().includes('year') ? 'numeric' : 'text'}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      minHeight: 48,
                      padding: '0 14px',
                      color: '#f5f0e7',
                      background: 'rgba(10,8,5,.9)',
                      border: '1px solid rgba(246,188,69,.72)',
                      borderRadius: 14,
                      outline: 0,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.05rem',
                    }}
                  />
                  {mode === 'voice' && (
                    <button
                      type="button"
                      onClick={startVoiceForAnswer}
                      aria-label="Speak answer"
                      style={{
                        display: 'grid',
                        width: 48,
                        height: 48,
                        padding: 0,
                        placeItems: 'center',
                        color: listening ? '#fff1bd' : '#e7b852',
                        background: 'rgba(6,5,3,.88)',
                        border: '1px solid rgba(246,188,69,.92)',
                        borderRadius: '50%',
                        boxShadow: listening
                          ? '0 0 18px rgba(255,177,39,.9)'
                          : '0 0 8px rgba(255,169,37,.45)',
                        cursor: 'pointer',
                      }}
                    >
                      <MicrophoneIcon />
                    </button>
                  )}
                  <button
                    type="submit"
                    style={{ ...modeButtonStyle, minWidth: 58, padding: '0 12px' }}
                  >
                    ›
                  </button>
                </form>
              )}

              {error && <p className="seenForgeError" role="alert">{error}</p>}
              <button
                type="button"
                onClick={() => setMode('choose')}
                style={{
                  justifySelf: 'center',
                  padding: 0,
                  color: '#d8b257',
                  background: 'transparent',
                  border: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '.72rem',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Change input method
              </button>
            </div>
          )}

          {mode === 'manual' && (
            <form className="seenForgeForm" onSubmit={handleManualSubmit}>
              <ForgeLocationField label="Birth Location">
                <LocationAutocompleteInput
                  id="birth-location"
                  className="seenForgeInput"
                  ariaLabel="Birth location"
                  placeholder="Enter city, state, country"
                  value={birthLocation}
                  onChange={setBirthLocation}
                  onLocationEntered={() => setShowBirthPeriod(true)}
                />
              </ForgeLocationField>
              {showBirthPeriod && birthLocation.trim() && (
                <YearPeriodBubble
                  startYear={birthStartYear}
                  endYear={birthEndYear}
                  onStartYearChange={setBirthStartYear}
                  onEndYearChange={setBirthEndYear}
                />
              )}

              <fieldset className="seenForgeFieldset">
                <legend className="seenVisuallyHidden">Locations lived six months or longer</legend>
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
                          onLocationEntered={() =>
                            updateLivedPeriod(location.id, 'showPeriod', true)
                          }
                        />
                      </ForgeLocationField>
                      {location.showPeriod && location.value.trim() && (
                        <YearPeriodBubble
                          startYear={location.startYear}
                          endYear={location.endYear}
                          onStartYearChange={(value) =>
                            updateLivedPeriod(location.id, 'startYear', value)
                          }
                          onEndYearChange={(value) =>
                            updateLivedPeriod(location.id, 'endYear', value)
                          }
                        />
                      )}
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
                <button className="seenForgeAdd" type="button" onClick={addLivedLocation}>
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
                  onLocationEntered={() => setShowCurrentPeriod(true)}
                />
              </ForgeLocationField>
              {showCurrentPeriod && currentLocation.trim() && (
                <YearPeriodBubble
                  startYear={currentStartYear}
                  present
                  onStartYearChange={setCurrentStartYear}
                />
              )}

              {error && <p className="seenForgeError" role="alert">{error}</p>}

              <button className="seenForgeSubmit" type="submit">
                Continue
                <span aria-hidden="true">›</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('choose')}
                style={{
                  justifySelf: 'center',
                  padding: 0,
                  color: '#d8b257',
                  background: 'transparent',
                  border: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '.72rem',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Change input method
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}
