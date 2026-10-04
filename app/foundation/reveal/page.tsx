'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BIRTH_RECORD_KEY,
  INTAKE_DECK_HREF,
  RECTIFICATION_RECORD_KEY,
  birthDateCardError,
  exposureFromStored,
  revealInputsReady,
} from '../../../lib/foundation/intakeDeck';

export default function RevealPage() {
  const router = useRouter();
  const [place, setPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let birth: unknown = null;
    let rectification: unknown = null;
    try {
      const raw = sessionStorage.getItem(BIRTH_RECORD_KEY);
      birth = raw ? JSON.parse(raw) : null;
    } catch {
      birth = null;
    }
    try {
      const raw = sessionStorage.getItem(RECTIFICATION_RECORD_KEY);
      rectification = raw ? JSON.parse(raw) : null;
    } catch {
      rectification = null;
    }

    if (!revealInputsReady(birth, rectification)) {
      const exposure = exposureFromStored(birth);
      if (!exposure) {
        router.replace(INTAKE_DECK_HREF.exposure);
        return;
      }
      const date = birth && typeof birth === 'object'
        ? (birth as { birthDate?: unknown }).birthDate
        : null;
      if (typeof date !== 'string' || birthDateCardError(date)) {
        router.replace(INTAKE_DECK_HREF.mark);
        return;
      }
      router.replace(INTAKE_DECK_HREF.time);
      return;
    }

    const exposure = exposureFromStored(birth);
    const date = (birth as { birthDate: string }).birthDate;
    setPlace(exposure?.birthLocation ?? '');
    setBirthDate(date);
    setOpen(true);
  }, [router]);

  if (!open) {
    return <main className="seenAlivePage seenIntakeDeck" />;
  }

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <section className="seenPanel seenFlowForm" aria-labelledby="reveal-title">
        <h1 id="reveal-title">Reveal</h1>
        <p className="seenFieldSupport">Place, date, and the time selection are on the record.</p>
        <p className="seenFieldSupport">{place}</p>
        <p className="seenFieldSupport">{birthDate}</p>
      </section>
    </main>
  );
}
