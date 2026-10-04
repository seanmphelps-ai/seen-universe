export const dynamic = 'force-dynamic';

function value(input: string | undefined, fallback = 'unknown') {
  return input && input.trim() ? input : fallback;
}

export default function BuildStatusPage() {
  const sha = value(process.env.VERCEL_GIT_COMMIT_SHA);
  const branch = value(process.env.VERCEL_GIT_COMMIT_REF);
  const deployment = value(process.env.VERCEL_URL);
  const environment = value(process.env.VERCEL_ENV, 'local');
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';

  return (
    <main className="seenAlivePage seenIntakeDeck">
      <section className="seenPanel seenFlowForm" aria-labelledby="build-status-title">
        <span className="seenLabel">LIVE BUILD</span>
        <h1 id="build-status-title">SEEN status</h1>
        <p className="seenFlowIntroduction">
          This screen is rendered by the deployment you are looking at now.
        </p>
        <div className="seenDivider" aria-hidden="true" />
        <dl style={{ display: 'grid', gap: '1rem', margin: 0 }}>
          <div><dt className="seenLabel">Environment</dt><dd>{environment}</dd></div>
          <div><dt className="seenLabel">Branch</dt><dd>{branch}</dd></div>
          <div><dt className="seenLabel">Commit</dt><dd style={{ overflowWrap: 'anywhere' }}>{sha}</dd></div>
          <div><dt className="seenLabel">Deployment</dt><dd style={{ overflowWrap: 'anywhere' }}>{deployment}</dd></div>
          {production && <div><dt className="seenLabel">Production</dt><dd style={{ overflowWrap: 'anywhere' }}>{production}</dd></div>}
        </dl>
        <div className="seenDivider" aria-hidden="true" />
        <a className="seenButtonPrimary" href="/">Open SEEN</a>
      </section>
    </main>
  );
}
