import type { Metadata } from 'next'
import { Be_Vietnam_Pro, JetBrains_Mono, Lora, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SHOP_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_LINKS } from '@/lib/constants'
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
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/chim-lac.png', width: 2018, height: 1113 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/chim-lac.png'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/chim-lac.png`,
  email: SHOP_EMAIL,
  sameAs: Object.values(SOCIAL_LINKS),
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <SWRProvider>
          <main>{children}</main>
        </SWRProvider>
      </body>
    </html>
  )
}
