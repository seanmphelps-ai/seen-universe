'use client';

import { useRouter } from 'next/navigation';

export default function SeenEntry() {
  const router = useRouter();

  function begin() {
    sessionStorage.setItem('seen.introduction.v2.complete', 'true');
    router.push('/foundation/birth');
  }

  return (
    <main className="seenPoster">
      <img
        src="/foundation/seen-poster.jpg"
        alt="SEEN. Same seed. Different soil. Different tree. Forge is the convergence."
      />
      <button type="button" onClick={begin}>
        Begin
      </button>
    </main>
  );
}
