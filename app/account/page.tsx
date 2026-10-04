import Link from 'next/link';

export default function AccountPage() {
  return (
    <main className="seenAlivePage">
      <div className="seenPanel">
        <h1>account</h1>
        <p className="seenFieldSupport">
          Saved people and their charts live here.
        </p>
        <Link className="seenButtonPrimary" href="/poster/">
          The Forge →
        </Link>
      </div>
    </main>
  )
,
}
