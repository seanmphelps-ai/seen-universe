import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEEN',
  description: 'Recognition begins with the environment that shaped you.',
  applicationName: 'SEEN',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SEEN',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: '/seen-mark.svg',
    apple: '/seen-mark.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#171512',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
