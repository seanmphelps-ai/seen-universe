import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEEN — The Forge'
,
  description:
    'Same seed. Different soil. Different tree.'
,
  openGraph: {
    title: 'SEEN — The Forge'
,
    description: 'Same seed. Different soil. Different tree.'
,
    images: ['/foundation/seen-poster.jpg']
,
  }
,
  twitter: {
    card: 'summary_large_image'
,
    title: 'SEEN — The Forge'
,
    description: 'Same seed. Different soil. Different tree.'
,
    images: ['/foundation/seen-poster.jpg']
,
  }
,
}
,

export default function PosterPage() {
  return (
    <main className="seenPosterPage">
      <a className="seenPosterBack" href="/chart">
        ← back to the forge
      </a>
      <img
        className="seenPosterImage"
        src="/foundation/seen-poster.jpg"
        alt="SEEN — The Forge. A golden tree of light rising through mountains and crystals, with the words: Same seed. Different soil. Different tree."
      />
    </main>
  )
,
}
