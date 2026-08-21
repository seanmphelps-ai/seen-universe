import Link from 'next/link';

const cards = [
  {
    number: '01',
    title: 'THE FORGE',
    line: 'What were you exposed to? Birth location, locations lived 6 months or more, current location.',
    href: '/foundation/location',
  },
  {
    number: '02',
    title: 'DATE',
    line: 'On what date was this system etched / DOB arrival?',
    href: '/foundation/birth',
  },
  {
    number: '03',
    title: 'TIME RECTIFICATION',
    line: 'Please help us narrow it down. Select which summaries and to what degree resonate with the experiences you have lived.',
    href: '/foundation/birth#foundation-time',
  },
  {
    number: '04',
    title: 'BEGIN',
    line: 'Enter SEEN.',
    href: '/chart',
  },
];

export default function FoundationPage() {
  return (
    <main className="seenFlowPage">
      <section className="seenFlowShell" aria-labelledby="foundation-title">
        <header className="seenFlowHeader">
          <h1 id="foundation-title" className="seenDisplayLarge">
            The Forge
          </h1>
          <div className="seenDivider" aria-hidden="true" />
        </header>

        <div style={{ display: 'grid', gap: '16px' }}>
          {cards.map((card) => (
            <Link
              key={card.number}
              href={card.href}
              className="seenPanel"
              style={{
                display: 'grid',
                gap: '10px',
                padding: '28px 24px',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <span className="seenLabel">{card.number}</span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(2rem, 10vw, 3.6rem)',
                  fontWeight: 500,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                }}
              >
                {card.title}
              </span>
              <span className="seenFieldSupport" style={{ margin: 0 }}>
                {card.line}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
