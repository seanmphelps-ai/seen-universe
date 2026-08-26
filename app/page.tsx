'use client';

import Image from 'next/image';
import { type FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'voice' | 'chat' | 'manuscript';
type Message = { role: 'user' | 'assistant'; content: string };
type Recognition = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void;
};
type RecognitionConstructor = new () => Recognition;

function MicIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" /></svg>;
}

export default function IntroductionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('voice');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<Recognition | null>(null);

  function saveAndContinue() {
    sessionStorage.setItem('seen.introduction.complete', 'true');
    sessionStorage.setItem('seen.introduction.mode', mode);
    sessionStorage.setItem('seen.introduction.story', JSON.stringify({ draft: draft.trim(), messages }));
    router.push('/foundation/location');
  }

  function toggleVoice() {
    if (listening) return recognitionRef.current?.stop();
    const speechWindow = window as typeof window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const RecognitionApi = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!RecognitionApi) return setError('Voice input is unavailable here. Use Chat or Manuscript.');
    const recognition = new RecognitionApi();
    recognition.lang = 'en-US'; recognition.interimResults = false; recognition.continuous = false;
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) setDraft((current) => current ? `${current} ${text}` : text);
    };
    recognition.onerror = () => setError('Voice input stopped. Tap the microphone to try again.');
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition; setError(''); setListening(true); recognition.start();
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next); setDraft(''); setSending(true); setError('');
    try {
      const response = await fetch('/api/introduction/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }),
      });
      const body = await response.json();
      if (!response.ok || typeof body.message !== 'string') throw new Error();
      setMessages((current) => [...current, { role: 'assistant', content: body.message }]);
      if (mode === 'voice' && 'speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(body.message));
    } catch {
      setError('SEEN could not respond. Your words remain on this device.');
    } finally {
      setSending(false);
    }
  }

  return <main className="seenForgePage">
    <Image className="seenForgeBackdrop" src="/foundation/location-forge-background.png" alt="" aria-hidden="true" fill priority sizes="(max-width: 760px) 100vw, 760px" />
    <div className="seenForgeBackdropVeil" aria-hidden="true" />
    <section className="seenForgeShell">
      <header className="seenForgeMasthead">
        <span className="seenForgeNumber">01</span>
        <h1 className="seenForgeTitle">The Forge</h1>
      </header>
      <div className="seenForgeGlobeSpace" aria-hidden="true" />
      <section className="seenForgeExposure">
      <div className="seenIntroContent">
      <div className="seenIntroModes" role="tablist" aria-label="Introduction format">
        {(['voice', 'chat', 'manuscript'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => setMode(item)}>{item}</button>)}
      </div>
      <section className="seenIntroComposer">
        {messages.length > 0 && mode !== 'manuscript' && <div className="seenIntroThread" aria-live="polite">{messages.map((message, index) => <p key={index} data-role={message.role}>{message.content}</p>)}</div>}
        <form onSubmit={sendMessage}>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={mode === 'manuscript' ? 'Begin wherever the story begins.' : 'Tell SEEN what feels important.'} aria-label={mode === 'manuscript' ? 'Your manuscript' : 'Message SEEN'} rows={mode === 'manuscript' ? 7 : 3} />
          <div className="seenIntroActions">
            {mode === 'voice' && <button className="seenIntroMic" type="button" onClick={toggleVoice} aria-label={listening ? 'Stop listening' : 'Start voice input'} data-listening={listening}><MicIcon /></button>}
            {mode !== 'manuscript' && <button className="seenIntroSend" type="submit" disabled={!draft.trim() || sending}>{sending ? 'Listening' : 'Send'}</button>}
            <button className="seenIntroContinue" type="button" onClick={saveAndContinue}>Enter The Forge</button>
          </div>
        </form>
        {error && <p className="seenIntroError" role="alert">{error}</p>}
      </section>
      </div>
      </section>
    </section>
  </main>;
}
