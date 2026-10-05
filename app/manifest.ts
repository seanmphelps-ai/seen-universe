import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEEN',
    short_name: 'SEEN',
    description: 'SEEN',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#171512',
    theme_color: '#171512',
    icons: [
      {
        src: '/icons/seen-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/seen-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
