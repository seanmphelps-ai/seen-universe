'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'voice' | 'chat' | 'manuscript';
type Message = { role: 'user' | 'assistant'; content: string };
type Recognition = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void;
};
type RecognitionConstructor = new () => Recognition;
const WORDS = ['YOU', 'ARE', 'NOT', 'YOUR', 'SUN', 'SIGN.'];

function MicIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" /></svg>;
}

export default function IntroductionPage() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [wordActive, setWordActive] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<Mode>('voice');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<Recognition | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => timers.push(setTimeout(fn, delay));
    const show = (index: number) => {
      if (index === WORDS.length) return void schedule(() => setRevealed(true), 450);
      setWord(WORDS[index]); setWordActive(true);
      schedule(() => { setWordActive(false); schedule(() => show(index + 1), 180); }, 330);
    };
    schedule(() => show(0), 220);
    return () => timers.forEach(clearTimeout);
  }, []);

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

  return <main className="seenIntro"><div className="seenIntroAmbient" aria-hidden="true" /><section className="seenIntroContent">
    {!revealed ? <div className="seenIntroWord" data-active={wordActive}>{word}</div> : <>
      <header className="seenIntroReveal"><p>SEEN</p><h1>You are so much more than that.</h1></header>
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
    </>}
  </section></main>;
}
