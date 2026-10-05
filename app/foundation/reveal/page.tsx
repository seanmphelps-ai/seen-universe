'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BIRTH_SESSION_KEY } from '../../../lib/foundation/intakeDeck';

type RevealShell = {
  birthLocation: string;
  birthDate: string;
};

export default function RevealPage() {
  const router = useRouter();
  const [shell, setShell] = useState<RevealShell | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(BIRTH_SESSION_KEY);
    const rectificationRaw = sessionStorage.getItem('seen.foundation.rectification');
    if (!raw || !rectificationRaw) {
      router.replace(raw ? '/foundation/rectification' : '/foundation/location');
      return;
    }
    try {
      const birth = JSON.parse(raw) as { birthLocation?: string; birthDate?: string };
      const rectification = JSON.parse(rectificationRaw) as { locked?: boolean };
      if (!birth.birthLocation || !birth.birthDate) {
        router.replace('/foundation/date');
        return;
      }
      if (rectification.locked !== true) {
        router.replace('/foundation/rectification');
        return;
      }
      setShell({
        birthLocation: birth.birthLocation,
        birthDate: birth.birthDate,
      });
    } catch {
      router.replace('/foundation/location');
    }
  }, [router]);

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <section className="seenPanel seenFlowForm" aria-labelledby="reveal-title">
        <h1 id="reveal-title">reveal</h1>
        <p className="seenFieldSupport">Seed. Soil. Mark. Resonance.</p>
        {shell ? (
          <dl className="seenResultList">
            <div className="seenResultRow">
              <dt className="seenResultName">environmental exposure</dt>
              <dd className="seenResultValue">{shell.birthLocation}</dd>
            </div>
            <div className="seenResultRow">
              <dt className="seenResultName">birth date</dt>
              <dd className="seenResultValue">{shell.birthDate}</dd>
            </div>
            <div className="seenResultRow">
              <dt className="seenResultName">time</dt>
              <dd className="seenResultValue">Recognition recorded.</dd>
            </div>
          </dl>
        ) : (
          <p className="seenFieldSupport">Opening the shell…</p>
        )}
      </section>
    </main>
  );
}
