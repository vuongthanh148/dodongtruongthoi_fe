'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { IconChevron, IconFilter } from '@/components/icons'
import { TopBar } from '@/components/layout/TopBar'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { Input } from '@/components/ui/Input'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { CATEGORIES } from '@/lib/data'
import { fetchCategories, fetchProducts } from '@/lib/storefront-api'
import { ArtPiece } from '@/components/ui/ArtPiece'
import type { Category, Product } from '@/lib/types'
import useSWR from 'swr'
import { SWR_KEYS } from '@/lib/swr-keys'

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const initialCategory = params.id

  const [activeCategoryId, setActiveCategoryId] = useState(initialCategory)
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'featured'
  )
  const [priceRange, setPriceRange] = useState<
    'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
  >('all')
  const [ratingFilter, setRatingFilter] = useState<'all' | '4+' | '5'>('all')
  const [query, setQuery] = useState('')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [pendingPriceRange, setPendingPriceRange] = useState<
    'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
  >('all')
  const [pendingRating, setPendingRating] = useState<'all' | '4+' | '5'>('all')

  const { data: categoriesData = [] } = useSWR(SWR_KEYS.categories, fetchCategories)
  const categories = useMemo(
    () => categoriesData.length > 0 ? categoriesData : CATEGORIES,
    [categoriesData]
  )

  const { data: products = [], isLoading } = useSWR(
    activeCategoryId ? SWR_KEYS.productsByCategory(activeCategoryId) : null,
    activeCategoryId ? () => fetchProducts({ category: activeCategoryId }) : null
  )

  const category = useMemo(
    () => categories.find((item) => item.id === activeCategoryId),
    [activeCategoryId, categories]
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (priceRange !== 'all') count++
    if (ratingFilter !== 'all') count++
    return count
  }, [priceRange, ratingFilter])

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = products.filter((product) => {
      const price = product.discountPrice ?? product.price

      const priceMatch =
        priceRange === 'all'
          ? true
          : priceRange === 'under-1m'
            ? price < 1_000_000
            : priceRange === '1m-3m'
              ? price >= 1_000_000 && price <= 3_000_000
              : priceRange === '3m-5m'
                ? price > 3_000_000 && price <= 5_000_000
                : price > 5_000_000

      const ratingMatch =
        ratingFilter === 'all'
          ? true
          : ratingFilter === '4+'
            ? product.rating >= 4
            : product.rating === 5

      const queryMatch =
        normalizedQuery.length === 0 ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.subtitle.toLowerCase().includes(normalizedQuery)

      return priceMatch && ratingMatch && queryMatch
    })

    if (sort === 'price-asc') {
      return [...filtered].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
    }
    if (sort === 'price-desc') {
      return [...filtered].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
    }
    if (sort === 'rating-desc') {
      return [...filtered].sort((a, b) => b.rating - a.rating)
    }
    return filtered
  }, [products, priceRange, ratingFilter, query, sort])

  const pendingVisibleCount = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = products.filter((product) => {
      const price = product.discountPrice ?? product.price

      const priceMatch =
        pendingPriceRange === 'all'
          ? true
          : pendingPriceRange === 'under-1m'
            ? price < 1_000_000
            : pendingPriceRange === '1m-3m'
              ? price >= 1_000_000 && price <= 3_000_000
              : pendingPriceRange === '3m-5m'
                ? price > 3_000_000 && price <= 5_000_000
                : price > 5_000_000

      const ratingMatch =
        pendingRating === 'all'
          ? true
          : pendingRating === '4+'
            ? product.rating >= 4
            : product.rating === 5

      const queryMatch =
        normalizedQuery.length === 0 ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.subtitle.toLowerCase().includes(normalizedQuery)

      return priceMatch && ratingMatch && queryMatch
    })

    return filtered.length
  }, [products, pendingPriceRange, pendingRating, query])

  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar title="Danh mục" onBack={() => window.history.back()} />

      {category && (
        <>
          <div style={{ padding: '4px 16px 0', fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <IconChevron size={10} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-primary)' }}>{category.name}</span>
          </div>

          <div style={{ padding: '10px 16px 6px' }}>
            <Heading as="h1" size="xl">{category.name}</Heading>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontStyle: 'italic', fontSize: 14, color: 'var(--bronze)', lineHeight: 1.6 }}>
              {products.length} tác phẩm · chạm thủ công 100%
            </div>
          </div>
        </>
      )}

      {/* Category filter pills */}
      <div style={{ padding: '10px 0 4px', overflowX: 'auto' }} className="noscroll">
        <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
          {categories.map((item) => {
            const isActive = item.id === activeCategoryId
            return (
              <Btn
                key={item.id}
                type="button"
                onClick={() => setActiveCategoryId(item.id)}
                variant={isActive ? 'primary' : 'outline'}
                size="sm"
                style={{
                  flexShrink: 0,
                  padding: '7px 13px',
                  borderRadius: 100,
                  borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  color: isActive ? 'white' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.name}
              </Btn>
            )
          })}
        </div>
      </div>

      {/* Sticky filter action bar */}
      <div
        style={{
          position: 'sticky',
          top: 57,
          zIndex: 40,
          background: 'var(--bg-page)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm trong danh mục..."
          type="text"
          style={{ flex: 1 }}
        />
        <Btn
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setPendingPriceRange(priceRange)
            setPendingRating(ratingFilter)
            setFilterSheetOpen(true)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            padding: '8px 12px',
            fontSize: 14,
            position: 'relative',
          }}
        >
          <IconFilter size={14} />
          Lọc
          {activeFilterCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: 'var(--accent)',
                color: 'white',
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </Btn>
        <Btn
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSortSheetOpen(true)}
          style={{
            flexShrink: 0,
            padding: '8px 12px',
            fontSize: 14,
          }}
        >
          ↕
        </Btn>
      </div>

      <div style={{ padding: '14px 16px 100px' }}>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '22px 14px',
              border: '1px dashed var(--border)',
              borderRadius: 10,
              background: 'var(--bg-card)',
            }}
          >
            <div style={{ width: 170 }}>
              <ArtPiece bg="bronze" frame="gold" label="" pad={8} aspect="4/3" />
            </div>
            <Heading as="h3" size="sm" style={{ textAlign: 'center' }}>
              Không tìm thấy sản phẩm
            </Heading>
            <Btn
              type="button"
              variant="outline"
              onClick={() => {
                setQuery('')
                setPriceRange('all')
                setSort('featured')
              }}
            >
              Xem tất cả
            </Btn>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onOpen={(bgTone) =>
                  (window.location.href = `/products/${product.id}${bgTone ? `?bgTone=${bgTone}` : ''}`)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Lọc sản phẩm"
        footer={
          <>
            <Btn
              type="button"
              variant="ghost"
              onClick={() => {
                setPendingPriceRange('all')
                setPendingRating('all')
              }}
              style={{ flex: 1 }}
            >
              Xóa bộ lọc
            </Btn>
            <Btn
              type="button"
              variant="primary"
              onClick={() => {
                setPriceRange(pendingPriceRange)
                setRatingFilter(pendingRating)
                setFilterSheetOpen(false)
              }}
              style={{ flex: 1 }}
            >
              Áp dụng ({pendingVisibleCount})
            </Btn>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Price range section */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
              Khoảng giá
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'under-1m', label: 'Dưới 1 triệu' },
                { id: '1m-3m', label: '1–3 triệu' },
                { id: '3m-5m', label: '3–5 triệu' },
                { id: 'over-5m', label: 'Trên 5 triệu' },
              ].map((item) => {
                const active = pendingPriceRange === item.id
                return (
                  <Btn
                    key={item.id}
                    type="button"
                    variant={active ? 'primary' : 'outline'}
                    onClick={() =>
                      setPendingPriceRange(item.id as 'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m')
                    }
                    style={{
                      borderRadius: 100,
                      borderColor: active ? 'var(--accent)' : 'var(--border)',
                      fontSize: 14,
                    }}
                  >
                    {item.label}
                  </Btn>
                )
              })}
            </div>
          </div>

          {/* Rating section */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
              Đánh giá
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: '4+', label: '4★ trở lên' },
                { id: '5', label: '5★' },
              ].map((item) => {
                const active = pendingRating === item.id
                return (
                  <Btn
                    key={item.id}
                    type="button"
                    variant={active ? 'primary' : 'outline'}
                    onClick={() => setPendingRating(item.id as 'all' | '4+' | '5')}
                    style={{
                      borderRadius: 100,
                      borderColor: active ? 'var(--accent)' : 'var(--border)',
                      fontSize: 14,
                    }}
                  >
                    {item.label}
                  </Btn>
                )
              })}
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Sort Bottom Sheet */}
      <BottomSheet
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        title="Sắp xếp"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'featured', label: 'Nổi bật' },
            { id: 'price-asc', label: 'Giá tăng dần' },
            { id: 'price-desc', label: 'Giá giảm dần' },
            { id: 'rating-desc', label: 'Đánh giá cao nhất' },
          ].map((item) => {
            const active = sort === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSort(item.id as 'featured' | 'price-asc' | 'price-desc' | 'rating-desc')
                  setSortSheetOpen(false)
                }}
                style={{
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: active ? 'var(--accent)' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{active ? '●' : '○'}</span>
                {item.label}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </div>
  )
}
