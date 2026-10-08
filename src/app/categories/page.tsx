'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { Skeleton } from '@/components/ui/Skeleton'
import { IconChevron } from '@/components/icons'
import { CATEGORIES_INDEX_STATE, CATEGORY_INDEX_COPY } from '@/lib/content-data'
import { HOTLINE_TEL } from '@/lib/constants'
import { loadCategories } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import type { Category } from '@/lib/types'

// Category index (cats-*): 6-column grid at xl/lg (first two tiles span 3, next three span 2),
// 2 columns at md, horizontal cards at sm. Loading, error (retry) and empty states.
export default function CategoriesPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data, error, isLoading, mutate } = useSWR<Category[]>(SWR_KEYS.categories, loadCategories)
  const categories = data ?? []
  const failed = !!error && !data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar
        title="Danh mục"
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: CATEGORY_INDEX_COPY.title }]} />

      <Container className="pt-2 md:pt-3">
        <h1
          className="font-heading m-0 text-[26px] font-medium leading-[1.08] md:text-[30px] lg:text-[34px] xl:text-[36px]"
          style={{ color: 'var(--text-primary)' }}
        >
          {CATEGORY_INDEX_COPY.title}
        </h1>
        <p className="mb-5 mt-2 text-[15px] md:mb-6 md:text-[16px] lg:mb-7 xl:mb-8" style={{ color: 'var(--text-muted-strong)' }}>
          {CATEGORY_INDEX_COPY.sub}
        </p>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 gap-3 sm:gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-6 lg:gap-5 xl:gap-6">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}
                style={{ height: i < 2 ? 320 : 220, borderRadius: 10 }}
              />
            ))}
          </div>
        ) : failed ? (
          <StateBox
            title={CATEGORIES_INDEX_STATE.error.title}
            body={CATEGORIES_INDEX_STATE.error.body}
            primary={{ label: CATEGORIES_INDEX_STATE.error.retry, onClick: () => mutate() }}
            secondary={{ label: CATEGORIES_INDEX_STATE.error.call, href: HOTLINE_TEL }}
          />
        ) : categories.length === 0 ? (
          <StateBox
            title={CATEGORIES_INDEX_STATE.empty.title}
            body={CATEGORIES_INDEX_STATE.empty.body}
            primary={{ label: CATEGORIES_INDEX_STATE.empty.action, href: '/products' }}
          />
        ) : (
          <>
            <div className="flex flex-col md:hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="flex items-center gap-3.5 border-b py-3.5 no-underline"
                  style={{ borderColor: 'var(--border-soft)' }}
                >
                  <div
                    className={`bronze-art relative h-[64px] w-[88px] shrink-0 overflow-hidden rounded-[8px] ${cat.tone === 'bronze' ? '' : cat.tone}`}
                    style={cat.imageUrl ? { backgroundImage: `url(${cat.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-semibold leading-[1.25]" style={{ color: 'var(--text-primary)' }}>
                      {cat.name}
                    </div>
                    {(cat.productCount ?? 0) > 0 ? (
                      <div className="mt-1 text-[13px]" style={{ color: 'var(--text-muted-strong)' }}>
                        {cat.productCount} sản phẩm
                      </div>
                    ) : null}
                  </div>
                  <IconChevron size={14} color="var(--text-muted-strong)" />
                </Link>
              ))}
            </div>

            <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-6 lg:gap-5 xl:gap-6">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className={`group relative block min-h-[200px] overflow-hidden rounded-[10px] text-white no-underline lg:min-h-[240px] xl:min-h-[280px] ${
                    index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
                  }`}
                  style={{ color: 'var(--text-on-dark)' }}
                >
                  <div
                    className={`bronze-art absolute inset-0 transition-transform duration-[400ms] group-hover:scale-[1.03] ${cat.tone === 'bronze' ? '' : cat.tone}`}
                    style={cat.imageUrl ? { backgroundImage: `url(${cat.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(20,14,9,0.82) 0%, rgba(20,14,9,0) 55%)' }} />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 md:bottom-5 md:left-5 md:right-5">
                    <div className="min-w-0">
                      <div
                        className={`font-semibold leading-[1.1] ${index < 2 ? 'text-[24px] xl:text-[28px]' : 'text-[20px]'}`}
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {cat.name}
                      </div>
                      <div className="mt-1 text-[14px] md:text-[15px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                        {(cat.productCount ?? 0) > 0 ? `${cat.productCount} sản phẩm` : 'Sắp ra mắt'}
                      </div>
                    </div>
                    <IconChevron size={16} color="var(--text-on-dark)" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>

      <div className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <VisitBlock />
      </div>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}

function StateBox({
  title,
  body,
  primary,
  secondary,
}: {
  title: string
  body: string
  primary: { label: string; onClick?: () => void; href?: string }
  secondary?: { label: string; href: string }
}) {
  const buttonBase =
    'inline-flex h-[50px] items-center justify-center rounded-[6px] px-[22px] text-[15px] font-semibold no-underline'
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed px-6 py-12 text-center"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
    >
      <h2 className="font-heading m-0 text-[22px] font-medium md:text-[26px]" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <p className="m-0 max-w-[520px] text-[15px] leading-[1.6]" style={{ color: 'var(--text-muted-strong)' }}>
        {body}
      </p>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        {primary.href ? (
          <Link href={primary.href} className={buttonBase} style={{ background: 'var(--accent)', color: '#fff' }}>
            {primary.label}
          </Link>
        ) : (
          <button type="button" onClick={primary.onClick} className={buttonBase} style={{ background: 'var(--accent)', color: '#fff' }}>
            {primary.label}
          </button>
        )}
        {secondary ? (
          <a href={secondary.href} className={buttonBase} style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}>
            {secondary.label}
          </a>
        ) : null}
      </div>
    </div>
  )
}
