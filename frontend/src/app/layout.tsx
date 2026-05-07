import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'MathLingo',
  description: 'Impara la matematica giocando',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Salta al contenuto
        </a>
        <ThemeProvider>
          <AuthProvider>
            <main id="main-content">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
