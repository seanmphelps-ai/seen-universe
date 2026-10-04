import Link from 'next/link';

export default function PersonPage() {
  return (
    <main className="seenAlivePage">
      <div className="seenPanel">
        <h1>person</h1>
        <p className="seenFieldSupport">
          No Western chart is stored for this person yet.
        </p>
        <Link className="seenButtonPrimary" href="/poster/">
          The Forge →
        </Link>
      </div>
    </main>
  )
,
}
