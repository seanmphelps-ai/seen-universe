'use client';

import { FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// Web Speech API isn't in TypeScript's DOM lib; minimal shape for what this page uses.
type SpeechRecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export default function IntroductionChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Start wherever it hurts, or wherever it started. I\'m listening.' },
  ]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechSupported = typeof window !== 'undefined' && !!getSpeechRecognition();

  function toggleListening() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setError('Voice input is not supported in this browser yet.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const heard = event.results[event.results.length - 1]?.[0]?.transcript ?? '';
      setDraft((current) => (current ? `${current} ${heard}` : heard));
    };
    recognition.onerror = () => setError('Could not hear that. Try again.');
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setDraft('');
    setError('');
    setIsSending(true);

    try {
      const response = await fetch('/api/introduction/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-20) }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || typeof payload?.message !== 'string') {
        throw new Error(payload?.error || 'SEEN could not respond.');
      }
      setMessages((rows) => [...rows, { role: 'assistant', content: payload.message }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SEEN could not respond.');
    } finally {
      setIsSending(false);
    }
  }

  function continueToIntake() {
    try {
      sessionStorage.setItem('seen.foundation.introductionTranscript', JSON.stringify(messages));
    } catch {
      /* storage unavailable */
    }
    router.push('/chart');
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <section className="seenPanel seenFlowForm" aria-labelledby="chat-title">
        <h1 id="chat-title">tell it</h1>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <p
                className={message.role === 'assistant' ? 'seenFieldSupport' : 'seenFlowIntroduction'}
                style={{ margin: 0, flex: 1 }}
              >
                {message.content}
              </p>
              {message.role === 'assistant' && (
                <button
                  type="button"
                  className="seenIntroContinue"
                  aria-label="Play this out loud"
                  onClick={() => speak(message.content)}
                >
                  🔊
                </button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="seenFormError" role="alert">{error}</p>
        )}

        <form onSubmit={send} className="seenField" style={{ marginTop: '1rem' }}>
          <div className="seenInputFrame">
            <input
              className="seenInput"
              type="text"
              value={draft}
              placeholder="Say what's true"
              onChange={(event) => setDraft(event.target.value)}
              disabled={isSending}
            />
          </div>
          {speechSupported && (
            <button
              type="button"
              className={isListening ? 'seenButtonPrimary' : 'seenButtonSecondary'}
              aria-label={isListening ? 'Stop recording' : 'Speak instead of typing'}
              onClick={toggleListening}
              disabled={isSending}
            >
              {isListening ? '● stop' : '🎤'}
            </button>
          )}
          <button className="seenButtonPrimary" type="submit" disabled={isSending || !draft.trim()}>
            {isSending ? 'Listening…' : 'Send'}
          </button>
        </form>

        <div className="seenDivider" aria-hidden="true" />
        <button type="button" className="seenButtonSecondary" onClick={continueToIntake}>
          Ready — continue to intake
        </button>
      </section>
    </main>
  );
}
