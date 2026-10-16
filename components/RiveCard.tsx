'use client';

import { useEffect, useState } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

type RiveCardProps = {
  title: string;
  deepText: string;
  progress: number;
  onProgressChange: (value: number) => void;
};
export default function RiveCard({ title, deepText, progress, onProgressChange }: RiveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { rive, RiveComponent } = useRive({ src: '/animations/card.riv', stateMachine: 'Card_SM', autoplay: false });
  const progressInput = useStateMachineInput(rive, 'Card_SM', 'Progress');
  const tappedInput = useStateMachineInput(rive, 'Card_SM', 'Tapped');
  const revealInput = useStateMachineInput(rive, 'Card_SM', 'Reveal');

  useEffect(() => {
    if (!rive || !progressInput) return;
    progressInput.value = progress;
    onProgressChange(progress);
  }, [rive, progressInput, progress, onProgressChange]);

  useEffect(() => {
    return () => rive?.cleanup();
  }, [rive]);

  function handleTap() {
    if (!tappedInput) return;
    const next = !tappedInput.value;
    tappedInput.value = next;
    if (next && revealInput) revealInput.fire();
    setExpanded(next);
  }

  return (
    <div className="riveCard" onClick={handleTap} role="button" tabIndex={0}>
      <RiveComponent />
      <p className="riveCardTitle">{title}</p>
      {expanded && <p className="riveCardDeepText">{deepText}</p>}
    </div>
  );
}
