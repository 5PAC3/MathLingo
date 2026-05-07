import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'MathLingo',
  description: 'Impara la matematica giocando',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
