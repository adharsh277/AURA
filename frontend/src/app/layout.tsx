import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AURA - Autonomous Unified Resource Agent',
  description: 'AI agent that autonomously manages, optimizes, and protects your crypto portfolio on Hedera.',
  keywords: ['Hedera', 'AI', 'Crypto', 'Portfolio', 'DeFi', 'Web3', 'Blockchain'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'AURA - AI-Powered Portfolio Management',
    description: 'Autonomous AI agent for crypto portfolio optimization on Hedera',
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
