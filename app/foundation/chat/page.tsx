'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function IntroductionChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Start wherever it hurts, or wherever it started. I\'m listening.' },
  ]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

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
            <p
              key={index}
              className={message.role === 'assistant' ? 'seenFieldSupport' : 'seenFlowIntroduction'}
              style={{ margin: 0 }}
            >
              {message.content}
            </p>
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
