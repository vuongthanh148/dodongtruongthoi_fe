'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const PAGE_SIZE = 9
import { IconFilter, IconGrid, IconList, IconStar } from '@/components/icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { DeskHeader } from '@/components/layout/Header'
import { TopBar } from '@/components/layout/TopBar'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { FilterSidebar } from '@/components/layout/FilterSidebar'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { SortSelect } from '@/components/ui/SortSelect'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { VariantSwatch } from '@/components/ui/VariantSwatch'
import { BG_TONES, CATEGORIES } from '@/lib/data'
import { fetchCategories, fetchProducts } from '@/lib/storefront-api'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import useSWR from 'swr'
import { SWR_KEYS } from '@/lib/swr-keys'
import type { Product } from '@/lib/types'

// ── List-view row component ──────────────────────────────────────────────────
function CatListRow({ product, categories, onOpen }: { product: Product; categories: { id: string; name: string }[]; onOpen: () => void }) {
  const catName = categories.find((c) => c.id === product.categoryId)?.name ?? ''
  const price = product.discountPrice ?? product.price
  const imageUrl = product.images[0]?.url ?? null
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        borderBottom: '1px solid var(--border-soft)',
        cursor: 'pointer',
        background: 'var(--bg-page)',
      }}
    >
      <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
        <ArtPiece
          bg={(product.defaultVariant['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
          frame={(product.defaultVariant['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
          label=""
          pad={5}
          aspect="1/1"
          imgSrc={imageUrl}
        />
      </div>
      <div style={{ padding: '12px 14px 12px 10px', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        {catName ? (
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12, letterSpacing: '0.1em', color: 'var(--bronze)', textTransform: 'uppercase' }}>
            {catName}
          </div>
        ) : null}
        <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.title}
        </div>
        <div style={{ fontFamily: 'var(--font-lora), serif', fontStyle: 'italic', fontSize: 12, color: 'var(--bronze)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {product.subtitle}
        </div>
        {(() => {
          const bgOpt = product.variantOptions.find((o) => o.key === 'bg_tone')
          const swatchColors: Record<string, string> = { gold: '#c9a961', red: '#8b2020', bronze: '#6b4423', dark: '#1e140a' }
          return bgOpt && bgOpt.values.length > 0 ? (
            <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
              {bgOpt.values.slice(0, 4).map((v) => (
                <div key={v} style={{ width: 10, height: 10, borderRadius: '50%', background: swatchColors[v] ?? '#888', border: '1px solid rgba(0,0,0,0.12)' }} />
              ))}
            </div>
          ) : null
        })()}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Price amount={price} size="md" />
          {product.rating > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10.5, color: 'var(--text-muted)' }}>
              <IconStar size={10} color="#c9a961" /> {Number(product.rating.toFixed(1))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const initialCategory = params.id

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategory)

  // Next.js reuses this component instance when navigating between
  // /categories/[id] routes (e.g. a Link in the footer or mega-menu), so
  // params.id changes without a remount — resync local state to match.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveCategoryId(params.id)
  }, [params.id])

  // In-page category pickers (sidebar filter, mobile pill strip) must
  // navigate rather than just set local state, or the URL goes stale the
  // moment you pick a different category from this exact page — the bug
  // this fixes. The effect above then syncs activeCategoryId right back
  // from params.id, so this is the single source of truth either way.
  function handleCategoryChange(id: string) {
    router.push(`/categories/${id}`)
  }
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'featured'
  )
  const [priceRange, setPriceRange] = useState<
    'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
  >('all')
  const [sizeFilter, setSizeFilter] = useState<string | null>(null)
  const [bgTone, setBgTone] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [pendingPriceRange, setPendingPriceRange] = useState<
    'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
  >('all')
  const [pendingSizeFilter, setPendingSizeFilter] = useState<string | null>(null)
  const [pendingBgTone, setPendingBgTone] = useState<string | null>(null)
  const [expanded, setExpanded] = useState({ key: '', count: PAGE_SIZE })

  const { data: categoriesData = [] } = useSWR(SWR_KEYS.categories, fetchCategories)
  const categories = useMemo(
    () => categoriesData.length > 0 ? categoriesData : CATEGORIES,
    [categoriesData]
  )

  const { data: products = [], isLoading } = useSWR(
    activeCategoryId ? SWR_KEYS.productsByCategory(activeCategoryId) : null,
    activeCategoryId ? () => fetchProducts({ category: activeCategoryId }) : null
  )

  // Paging resets automatically whenever the filter key changes
  const filterKey = JSON.stringify([activeCategoryId, sort, priceRange, sizeFilter, bgTone, query])
  const visibleProductsCount = expanded.key === filterKey ? expanded.count : PAGE_SIZE
  const loadMore = () => setExpanded({ key: filterKey, count: visibleProductsCount + PAGE_SIZE })

  const category = useMemo(
    () => categories.find((item) => item.id === activeCategoryId),
    [activeCategoryId, categories]
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (priceRange !== 'all') count++
    if (sizeFilter !== null) count++
    if (bgTone !== null) count++
    return count
  }, [priceRange, sizeFilter, bgTone])

  // Search-scoped base list, before price/size/bg-tone filtering — also used to derive
  // the dynamic size filter options.
  const scopedProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery.length === 0) return products
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.subtitle.toLowerCase().includes(normalizedQuery)
    )
  }, [products, query])

  const sizeOptions = useMemo(() => {
    const byCode = new Map<string, string>()
    for (const product of scopedProducts) {
      for (const size of product.sizes) {
        if (!byCode.has(size.code)) byCode.set(size.code, size.name)
      }
    }
    return Array.from(byCode, ([code, name]) => ({ code, name }))
  }, [scopedProducts])

  const allVisibleProducts = useMemo(() => {
    const filtered = scopedProducts.filter((product) => {
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

      const sizeMatch = sizeFilter === null ? true : product.sizes.some((s) => s.code === sizeFilter)

      const bgToneMatch =
        bgTone === null
          ? true
          : product.defaultVariant['bg_tone'] === bgTone

      return priceMatch && sizeMatch && bgToneMatch
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
  }, [scopedProducts, priceRange, sizeFilter, bgTone, sort])

  const visibleProducts = useMemo(() => {
    return allVisibleProducts.slice(0, visibleProductsCount)
  }, [allVisibleProducts, visibleProductsCount])

  const pendingVisibleCount = useMemo(() => {
    const filtered = scopedProducts.filter((product) => {
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

      const sizeMatch = pendingSizeFilter === null ? true : product.sizes.some((s) => s.code === pendingSizeFilter)

      const bgToneMatch =
        pendingBgTone === null
          ? true
          : product.defaultVariant['bg_tone'] === pendingBgTone

      return priceMatch && sizeMatch && bgToneMatch
    })

    return filtered.length
  }, [scopedProducts, pendingPriceRange, pendingSizeFilter, pendingBgTone])

  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <DeskHeader />
      <TopBar title={category?.name ?? 'Danh mục'} onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm', href: '/products' }, { label: category?.name ?? 'Danh mục' }]} />

      {/* Desktop heading row — hidden below lg */}
      <Container className="hidden lg:flex" style={{ alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 20 }}>
        <div>
          <Heading as="h1" size="xl">{category?.name ?? 'Danh mục'}</Heading>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            {isLoading ? '...' : `${visibleProducts.length} / ${allVisibleProducts.length} sản phẩm`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sắp xếp:</span>
          <SortSelect
            value={sort}
            onChange={(v) => setSort(v as typeof sort)}
            options={[
              { value: 'featured', label: 'Nổi bật' },
              { value: 'price-asc', label: 'Giá: thấp → cao' },
              { value: 'price-desc', label: 'Giá: cao → thấp' },
              { value: 'rating-desc', label: 'Đánh giá cao' },
            ]}
          />
        </div>
      </Container>

      {/* Category pills strip — sticky below TopBar */}
      <div className="lg:hidden sticky top-[57px] md:top-[69px] lg:top-[76px]" style={{ zIndex: 30, background: 'var(--bg-page)', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 14px', gap: 7 }} className="noscroll">
          {categories.map((item) => {
            const isActive = item.id === activeCategoryId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryChange(item.id)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 100,
                  background: isActive ? 'var(--bg-dark)' : 'transparent',
                  color: isActive ? 'var(--text-on-dark)' : 'var(--text-primary)',
                  border: isActive ? '1px solid var(--bg-dark)' : '1px solid var(--border)',
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontSize: 12,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms',
                }}
              >
                {item.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort/filter/view bar */}
      <div className="flex lg:hidden" style={{
        alignItems: 'center',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-soft)',
        gap: 8,
      }}>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
          {visibleProducts.length} / {allVisibleProducts.length} sản phẩm
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
        <button
          type="button"
          onClick={() => { setPendingPriceRange(priceRange); setPendingSizeFilter(sizeFilter); setPendingBgTone(bgTone); setFilterSheetOpen(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
            padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 4,
            background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--text-primary)',
            position: 'relative',
          }}
        >
          <IconFilter size={13} />
          Lọc
          {activeFilterCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: 'var(--accent)', color: 'white',
              width: 16, height: 16, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
            }}>{activeFilterCount}</span>
          )}
        </button>
        {/* Grid/List toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              style={{
                padding: '5px 8px', border: 'none', cursor: 'pointer',
                background: view === v ? 'var(--bg-dark)' : 'transparent',
                color: view === v ? 'var(--text-on-dark)' : 'var(--text-primary)',
                display: 'flex', alignItems: 'center',
              }}
            >
              {v === 'grid' ? <IconGrid size={14} /> : <IconList size={14} />}
            </button>
          ))}
        </div>
      </div>

      <Container>
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[216px_minmax(0,1fr)] lg:items-start lg:gap-7 xl:grid-cols-[248px_minmax(0,1fr)] xl:gap-10">
          <FilterSidebar
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sizeOptions={sizeOptions}
            sizeFilter={sizeFilter}
            onSizeFilterChange={setSizeFilter}
            bgTone={bgTone}
            onBgToneChange={setBgTone}
            onClearAll={() => {
              setPriceRange('all')
              setSizeFilter(null)
              setBgTone(null)
            }}
          />

          <div style={{ paddingBottom: 100 }}>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-3 xl:gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: '22px 14px', margin: 16,
              border: '1px dashed var(--border)', borderRadius: 10, background: 'var(--bg-card)',
            }}>
              <div style={{ width: 170 }}>
                <ArtPiece bg="bronze" frame="gold" label="" pad={8} aspect="4/3" />
              </div>
              <Heading as="h3" size="sm" style={{ textAlign: 'center' }}>
                Không tìm thấy sản phẩm
              </Heading>
              <Btn type="button" variant="outline" onClick={() => { setQuery(''); setPriceRange('all'); setBgTone(null); setSort('featured') }}>
                Xem tất cả
              </Btn>
            </div>
          ) : view === 'grid' ? (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-3 xl:gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={() => { window.location.href = `/products/${product.id}` }}
                  />
                ))}
              </div>
              {visibleProducts.length < allVisibleProducts.length && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px', gap: 8 }}>
                  <Btn
                    type="button"
                    variant="outline"
                    onClick={() => loadMore()}
                    style={{ width: '240px', height: '50px', fontSize: '15px', fontWeight: 600 }}
                  >
                    Xem thêm sản phẩm
                  </Btn>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {visibleProducts.map((product) => (
                  <CatListRow
                    key={product.id}
                    product={product}
                    categories={categories}
                    onOpen={() => { window.location.href = `/products/${product.id}` }}
                  />
                ))}
              </div>
              {visibleProducts.length < allVisibleProducts.length && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px', gap: 8 }}>
                  <Btn
                    type="button"
                    variant="outline"
                    onClick={() => loadMore()}
                    style={{ width: '240px', height: '50px', fontSize: '15px', fontWeight: 600 }}
                  >
                    Xem thêm sản phẩm
                  </Btn>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </Container>

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
                setPendingSizeFilter(null)
                setPendingBgTone(null)
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
                setSizeFilter(pendingSizeFilter)
                setBgTone(pendingBgTone)
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

          {/* Size section */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
              Kích thước
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[{ code: null as string | null, label: 'Tất cả' }, ...sizeOptions.map((s) => ({ code: s.code, label: s.name }))].map((item) => {
                const active = pendingSizeFilter === item.code
                return (
                  <Btn
                    key={item.code ?? 'all'}
                    type="button"
                    variant={active ? 'primary' : 'outline'}
                    onClick={() => setPendingSizeFilter(item.code)}
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

          {/* Background tone section */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
              Màu nền
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {BG_TONES.map((tone) => (
                <VariantSwatch
                  key={tone.id}
                  tone={tone.id}
                  active={pendingBgTone === tone.id}
                  size={32}
                  onClick={() => setPendingBgTone(pendingBgTone === tone.id ? null : tone.id)}
                />
              ))}
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

      <VisitBlock />

      <Footer />
    </div>
  )
}
