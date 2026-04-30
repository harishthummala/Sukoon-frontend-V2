import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '@/lib/config'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sukoon - Mental Wellness Companion',
  description: 'Your personal AI mental wellness companion. Chat, reflect, and find peace with Sukoon.',
  generator: 'Sukoon',
  icons: {
    shortcut: '/favicon.ico?v=sukoon-20260430',
    icon: [
      { url: '/favicon.ico?v=sukoon-20260430', sizes: 'any' },
      { url: '/logo.png?v=sukoon-20260430', type: 'image/png' },
      { url: '/favicon-32x32.png?v=sukoon-20260430', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=sukoon-20260430', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=sukoon-20260430', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico?v=sukoon-20260430" />
        <link rel="icon" href="/favicon.ico?v=sukoon-20260430" sizes="any" />
        <link rel="icon" href="/logo.png?v=sukoon-20260430" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png?v=sukoon-20260430" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png?v=sukoon-20260430" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=sukoon-20260430" sizes="180x180" />
      </head>
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
