// PROVENANCE: bot=codex session=2026-10-09 task=positive instruction language cleanup
import type { NextConfig } from 'next'
import { withEve } from 'eve/next'

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  serverExternalPackages: [
    'swisseph-wasm',
    'all-the-cities',
    'lunar-javascript',
    '@oshimishi/dreamspell-math',
    '@drewsonne/maya-dates',
    'kriya-ephemeris',
    'kriya-ephemeris-timelords',
    'free-human-design',
  ],
}

export default withEve(nextConfig)
