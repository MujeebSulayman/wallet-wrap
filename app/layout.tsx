import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ethereum Wallet Wrapped 2025',
  description: 'Your Ethereum wallet activity wrapped for 2025',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black text-white min-h-screen antialiased">{children}</body>
    </html>
  )
}

