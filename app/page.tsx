'use client';

import { useRouter } from 'next/navigation';
import { SplashScreen } from './components/SplashScreen';

const INTRO_COMPLETE_KEY = 'seen.introduction.v2.complete';

export default function HomePage() {
  const router = useRouter();

  function completeIntroduction() {
    sessionStorage.setItem(INTRO_COMPLETE_KEY, 'true');
    router.push('/foundation/location');
  }

  return <SplashScreen onComplete={completeIntroduction} />;
}
