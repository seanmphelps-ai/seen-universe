'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [working, setWorking] = useState(false);

  async function authenticate(mode: 'signin' | 'signup') {
    setWorking(true);
    setMessage('');

    try {
      const supabase = createClient();
      const result = mode === 'signup'
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) {
        setMessage('Check your email to confirm your account.');
      } else {
        window.location.assign('/account');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Account access failed.');
    } finally {
      setWorking(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await authenticate('signin');
  }

  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="account-access-title">
        <header className="seenFlowHeader">
          <h1 id="account-access-title" className="seenDisplayLarge">Your SEEN account</h1>
          <p className="seenFlowIntroduction">
            Save multiple people, their birth information, locations, charts, and readings.
          </p>
          <div className="seenDivider" aria-hidden="true" />
        </header>

        <form className="seenPanel seenFlowForm" onSubmit={handleSubmit}>
          <div className="seenField">
            <label className="seenLabel" htmlFor="account-email">Email</label>
            <div className="seenInputFrame">
              <input id="account-email" className="seenInput" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>
          <div className="seenField">
            <label className="seenLabel" htmlFor="account-password">Password</label>
            <div className="seenInputFrame">
              <input id="account-password" className="seenInput" type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </div>
          {message && <p className="seenFieldSupport" role="status">{message}</p>}
          <button className="seenButtonPrimary" type="submit" disabled={working}>Sign in</button>
          <button className="seenButtonSecondary" type="button" disabled={working} onClick={() => authenticate('signup')}>Create account</button>
        </form>
      </section>
    </main>
  );
}
