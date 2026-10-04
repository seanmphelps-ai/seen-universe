import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEEN — Closure & Composure',
  description: 'You are not your sun sign. You are so much more than that.',
  manifest: '/manifest.webmanifest',
  applicationName: 'SEEN',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SEEN',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#171512',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <a
          href="/status"
          aria-label="Open live build status"
          style={{
            position: 'fixed',
            right: 'max(12px, env(safe-area-inset-right))',
            bottom: 'max(12px, env(safe-area-inset-bottom))',
            zIndex: 1000,
            border: '1px solid rgba(255,255,255,.22)',
            borderRadius: 999,
            padding: '8px 11px',
            background: 'rgba(23,21,18,.88)',
            color: 'rgba(255,255,255,.78)',
            fontSize: 11,
            letterSpacing: '.08em',
            textDecoration: 'none',
            backdropFilter: 'blur(10px)',
          }}
        >
          BUILD
        </a>
      </body>
    </html>
  );
}
