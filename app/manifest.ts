import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEEN',
    short_name: 'SEEN',
    description: 'Recognition begins with the environment that shaped you.',
    start_url: '/',
    display: 'standalone',
    background_color: '#171512',
    theme_color: '#171512',
    orientation: 'portrait',
    categories: ['lifestyle', 'health'],
    icons: [
      {
        src: '/seen-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
