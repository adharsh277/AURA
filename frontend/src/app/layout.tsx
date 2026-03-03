import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AURA-T - Autonomous Stable Treasury Agent',
  description: 'Autonomous Stable Treasury Agent managing USD₮ and XAU₮ capital with transparent AI decisions.',
  keywords: ['AURA-T', 'AI', 'Treasury', 'USD₮', 'XAU₮', 'DeFi', 'Autonomous Agent'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'AURA-T - Autonomous Stable Treasury Agent',
    description: 'AI-managed stable treasury operations for USD₮ and XAU₮ capital',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark-950 text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
