'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { IconChevron } from '@/components/icons'
import { fetchCategories } from '@/lib/storefront-api'
import useSWR from 'swr'
import { SWR_KEYS } from '@/lib/swr-keys'

const BG_TONE_COLORS: Record<string, string> = {
  gold: '#c9a961',
  red: '#8b1e1e',
  bronze: '#6b4423',
  dark: '#2a1d13',
}

export default function CategoriesPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data: categories = [], isLoading } = useSWR(
    SWR_KEYS.categories,
    fetchCategories
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)'}}>
      <TopBar
        title="Danh mục"
       
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 14 }}>
          Tất cả danh mục
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} style={{ height: 64, borderRadius: 10 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border-soft)',
                  textDecoration: 'none',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: BG_TONE_COLORS[cat.tone] ?? BG_TONE_COLORS.bronze,
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {cat.name}
                    </div>
                    {(cat.productCount ?? 0) > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {cat.productCount} sản phẩm
                      </div>
                    )}
                  </div>
                </div>
                <IconChevron size={14} color="var(--text-muted)" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}
