import Link from 'next/link';

export default function PosterPage() {
  return (
    <main className="seenPosterPage">
      <img
        className="seenPosterImage"
        src="/foundation/seen-poster.jpg"
        alt="SEEN — The Forge. A golden tree of light rising through mountains and crystals, with the words: Same seed. Different soil. Different tree."
      />
      <div className="seenPosterActions">
        <Link className="seenButtonPrimary" href="/foundation/birth/">
          Enter the Forge
        </Link>
      </div>
    </main>
  );
}
