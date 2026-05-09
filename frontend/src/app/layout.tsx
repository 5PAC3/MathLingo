import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/theme'
import { I18nProvider } from '@/lib/i18n'
import SkipLink from '@/components/SkipLink'
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'MathLingo',
  description: 'Impara la matematica giocando | Learn math through play',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning className={jetbrainsMono.variable}>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}})();`
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var l=localStorage.getItem('lang');if(l==='en')document.documentElement.lang='en'}catch(e){}})();`
        }} />
        <ThemeProvider>
          <I18nProvider>
          <SkipLink />
          <AuthProvider>
            <main id="main-content">
              {children}
            </main>
          </AuthProvider>
          <KeyboardShortcutsHelp />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
