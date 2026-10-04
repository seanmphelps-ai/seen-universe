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
      <body>{children}</body>
    </html>
  );
}
