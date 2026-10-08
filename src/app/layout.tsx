import type { Metadata } from 'next'
import { Be_Vietnam_Pro, JetBrains_Mono, Lora, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants'
import type { ThemeId } from '@/lib/themes'
import SWRProvider from '@/components/providers/SWRProvider'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
})

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

// Kept for inline font-family styles still in components (not for headings or labels).
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

const FALLBACK_THEME: ThemeId = 'default'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function getActiveTheme(): Promise<ThemeId> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return FALLBACK_THEME
    }

    const payload = (await response.json()) as
      | { active_theme?: string; data?: { active_theme?: string } }
      | undefined

    const theme = payload?.active_theme ?? payload?.data?.active_theme
    if (theme === 'tet' || theme === 'independence' || theme === 'labor-day' || theme === 'default') {
      return theme
    }

    return FALLBACK_THEME
  } catch {
    return FALLBACK_THEME
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const activeTheme = await getActiveTheme()

  return (
    <html
      lang="vi"
      data-theme={activeTheme}
      className={`${beVietnam.variable} ${lora.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body suppressHydrationWarning className="antialiased">
        <SWRProvider>
          <main>{children}</main>
        </SWRProvider>
      </body>
    </html>
  )
}
