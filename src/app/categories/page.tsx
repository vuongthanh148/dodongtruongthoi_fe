'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArtPiece } from '@/components/ui/ArtPiece'
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
      <DeskHeader />
      <TopBar
        title="Danh mục"

        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Danh mục sản phẩm' }]} />

      <div className="mx-auto w-full px-4 pt-3 lg:max-w-[1344px] lg:px-8">
        <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 14 }}>
          Tất cả danh mục
        </div>

        {isLoading ? (
          <>
            <div className="flex md:hidden" style={{ flexDirection: 'column', gap: 8 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} style={{ height: 64, borderRadius: 10 }} />
              ))}
            </div>
            <div className="hidden md:grid lg:grid-cols-6 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'} style={{ height: 200, borderRadius: 10 }} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex md:hidden" style={{ flexDirection: 'column' }}>
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
            <div className="hidden md:grid lg:grid-cols-6 md:grid-cols-2 gap-4">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className={`group overflow-hidden rounded-[10px] border ${index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', textDecoration: 'none' }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                        }}
                        className="group-hover:scale-105"
                      />
                    ) : (
                      <ArtPiece
                        bg={(cat.tone as 'gold' | 'red' | 'bronze' | 'dark') ?? 'bronze'}
                        frame="bronze"
                        label=""
                        pad={6}
                        aspect="16/10"
                        imgSrc={undefined}
                      />
                    )}
                  </div>
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {cat.name}
                      </div>
                      {(cat.productCount ?? 0) > 0 && (
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                          {cat.productCount} sản phẩm
                        </div>
                      )}
                    </div>
                    <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                      <IconChevron size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
