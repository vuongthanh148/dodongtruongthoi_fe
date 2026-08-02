'use client'

import { IconGrid, IconList } from '@/components/icons'
import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import { ProductCardSkeleton } from '@/components/ui/ProductCard'
import { fetchCategories, fetchProducts } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import useSWR from 'swr'

function ProductsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaign') ?? undefined
  const categoryParam = searchParams.get('category') ?? undefined

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categoryParam ?? 'all')
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'featured'
  )
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const { data: allProducts = [], isLoading } = useSWR(SWR_KEYS.products, () =>
    fetchProducts({ limit: 100 })
  )

  const { data: categories = [] } = useSWR(SWR_KEYS.categories, fetchCategories)

  const title = campaignId
    ? campaignId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Tất cả sản phẩm'

  const visibleProducts = useMemo(() => {
    let ps = allProducts
    if (activeCategoryId !== 'all') {
      ps = ps.filter((p) => p.categoryId === activeCategoryId)
    }
    switch (sort) {
      case 'price-asc':
        return [...ps].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
      case 'price-desc':
        return [...ps].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
      case 'rating-desc':
        return [...ps].sort((a, b) => b.rating - a.rating)
      default:
        return ps
    }
  }, [allProducts, activeCategoryId, sort])

  return (
    <div
      className="paper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-page)',
        minHeight: '100vh',
      }}
    >
      <TopBar
        title={title}
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Category pills */}
      <div
        style={{
          position: 'sticky',
          top: 57,
          zIndex: 30,
          background: 'var(--bg-page)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        <div
          style={{ display: 'flex', overflowX: 'auto', padding: '10px 14px', gap: 7 }}
          className="noscroll"
        >
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 100,
              background: activeCategoryId === 'all' ? 'var(--bg-dark)' : 'transparent',
              color: activeCategoryId === 'all' ? 'var(--text-on-dark)' : 'var(--text-primary)',
              border:
                activeCategoryId === 'all' ? '1px solid var(--bg-dark)' : '1px solid var(--border)',
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 12,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryId(cat.id)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 100,
                background: activeCategoryId === cat.id ? 'var(--bg-dark)' : 'transparent',
                color: activeCategoryId === cat.id ? 'var(--text-on-dark)' : 'var(--text-primary)',
                border:
                  activeCategoryId === cat.id
                    ? '1px solid var(--bg-dark)'
                    : '1px solid var(--border)',
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort/view bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-soft)',
          gap: 8,
        }}
      >
        <div style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
          {isLoading ? '...' : `${visibleProducts.length} sản phẩm`}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: 12,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-be-vietnam), sans-serif',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="featured">Nổi bật</option>
          <option value="price-asc">Giá: thấp → cao</option>
          <option value="price-desc">Giá: cao → thấp</option>
          <option value="rating-desc">Đánh giá cao</option>
        </select>
        <div
          style={{
            display: 'flex',
            border: '1px solid var(--border)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              style={{
                padding: '5px 8px',
                border: 'none',
                cursor: 'pointer',
                background: view === v ? 'var(--bg-dark)' : 'transparent',
                color: view === v ? 'var(--text-on-dark)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {v === 'grid' ? <IconGrid size={13} /> : <IconList size={13} />}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid/list */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, padding: 0 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <ProductCardSkeleton compact />
            </div>
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 14,
          }}
        >
          Không có sản phẩm
        </div>
      ) : view === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderTop: '1px solid var(--border)',
            borderLeft: '1px solid var(--border)',
          }}
        >
          {visibleProducts.map((product) => {
            const price = product.discountPrice ?? product.price
            const imgUrl = product.images[0]?.url ?? null
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                style={{
                  borderRight: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none',
                  background: 'var(--bg-page)',
                }}
              >
                <div style={{ background: 'var(--bg-surface)', padding: 8, position: 'relative' }}>
                  <ArtPiece
                    bg={
                      (product.defaultVariant['bg_tone'] as
                        | 'gold'
                        | 'red'
                        | 'bronze'
                        | 'dark'
                        | undefined) ?? 'gold'
                    }
                    frame={
                      (product.defaultVariant['frame'] as
                        | 'bronze'
                        | 'gold'
                        | 'dark'
                        | 'carved'
                        | undefined) ?? 'bronze'
                    }
                    label=""
                    pad={6}
                    aspect="4/3"
                    imgSrc={imgUrl}
                  />
                  {product.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        background: 'rgba(244,237,224,0.95)',
                        padding: '3px 7px',
                        borderRadius: 3,
                        border: '1px solid rgba(139,30,30,0.15)',
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '8px 10px 12px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      color: 'var(--accent)',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    {price.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {visibleProducts.map((product) => {
            const price = product.discountPrice ?? product.price
            const imgUrl = product.images[0]?.url ?? null
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  borderBottom: '1px solid var(--border-soft)',
                  textDecoration: 'none',
                  background: 'var(--bg-page)',
                }}
              >
                <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
                  <ArtPiece
                    bg={
                      (product.defaultVariant['bg_tone'] as
                        | 'gold'
                        | 'red'
                        | 'bronze'
                        | 'dark'
                        | undefined) ?? 'gold'
                    }
                    frame={
                      (product.defaultVariant['frame'] as
                        | 'bronze'
                        | 'gold'
                        | 'dark'
                        | 'carved'
                        | undefined) ?? 'bronze'
                    }
                    label=""
                    pad={5}
                    aspect="4/3"
                    imgSrc={imgUrl}
                  />
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.25,
                      marginBottom: 4,
                    }}
                  >
                    {product.title}
                  </div>
                  {product.subtitle && (
                    <div
                      style={{
                        fontSize: 11,
                        fontStyle: 'italic',
                        color: 'var(--bronze)',
                        marginBottom: 6,
                        lineHeight: 1.3,
                      }}
                    >
                      {product.subtitle}
                    </div>
                  )}
                  <Price amount={price} size="sm" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageInner />
    </Suspense>
  )
}
