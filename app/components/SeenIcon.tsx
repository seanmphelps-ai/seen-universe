export type IconName = 'location' | 'calendar' | 'clock' | 'plus' | 'arrow' | 'sparkle' | 'close'

export function SeenIcon({ name }: { name: IconName }) {
  const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg className="seenIcon" viewBox="0 0 24 24" aria-hidden="true">
      {name === 'location' && <><path {...line} d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle {...line} cx="12" cy="10" r="2.5" /></>}
      {name === 'calendar' && <><rect {...line} x="3" y="5" width="18" height="16" rx="2" /><path {...line} d="M16 3v4M8 3v4M3 10h18" /></>}
      {name === 'clock' && <><circle {...line} cx="12" cy="12" r="9" /><path {...line} d="M12 7v5l3 2" /></>}
      {name === 'plus' && <path {...line} d="M12 5v14M5 12h14" />}
      {name === 'arrow' && <path {...line} d="m9 18 6-6-6-6" />}
      {name === 'sparkle' && <><path {...line} d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" /><path {...line} d="M19 15c.2 1.7 1.1 2.6 2.8 2.8-1.7.2-2.6 1.1-2.8 2.8-.2-1.7-1.1-2.6-2.8-2.8 1.7-.2 2.6-1.1 2.8-2.8Z" /></>}
      {name === 'close' && <path {...line} d="m7 7 10 10M17 7 7 17" />}
    </svg>
  )
}
