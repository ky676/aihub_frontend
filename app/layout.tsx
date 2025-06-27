import type { Metadata } from 'next'
import React from 'react'
import AuthSessionProvider from '@/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mr. Advance AI Hub',
  description: 'Enterprise AI Platform for Mr. Advance - Powering intelligent business solutions',
  keywords: 'AI, Machine Learning, Enterprise, Risk Management, Call Agent, Agent Garden',
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
} 