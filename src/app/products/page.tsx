'use client'

import Link from 'next/link'
import { IconClose, IconFilter, IconGrid, IconList } from '@/components/icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { FilterSidebar, PRICE_RANGES } from '@/components/layout/FilterSidebar'
import { Container } from '@/components/layout/Container'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Price } from '@/components/ui/Price'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { SortSelect } from '@/components/ui/SortSelect'
import { VariantSwatch } from '@/components/ui/VariantSwatch'
import { BG_TONES } from '@/lib/data'
import { LISTING_CHIP_COPY, LISTING_COPY, SEARCH_EMPTY_COPY } from '@/lib/content-data'
import { HOTLINE_TEL } from '@/lib/constants'
import { fetchCategories, loadProducts } from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import useSWR from 'swr'
import type { Product } from '@/lib/types'

const PAGE_SIZE = 9

// ── List-view row component ──────────────────────────────────────────────────
function ProductsListRow({ product, categories, onOpen }: { product: Product; categories: { id: string; name: string }[]; onOpen: () => void }) {
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
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--bronze)' }}>
            {catName}
          </div>
        ) : null}
        <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.title}
        </div>
        <div style={{ fontFamily: 'var(--font-lora), serif', fontStyle: 'italic', fontSize: 12, color: 'var(--bronze)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {product.subtitle}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Price amount={price} size="md" />
        </div>
      </div>
    </div>
  )
}

function ProductsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaign') ?? undefined
  const categoryParam = searchParams.get('category') ?? undefined
  const qParam = searchParams.get('q')?.trim() || undefined

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categoryParam ?? 'all')
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'featured'
  )
  const [priceRange, setPriceRange] = useState<
    'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
  >('all')
  const [sizeFilter, setSizeFilter] = useState<string | null>(null)
  const [bgTone, setBgTone] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [pendingPriceRange, setPendingPriceRange] = useState<
    'all' | 'under-1m' | '1m-3m' | '3m-5m' | 'over-5m'
  >('all')
  const [pendingSizeFilter, setPendingSizeFilter] = useState<string | null>(null)
  const [pendingBgTone, setPendingBgTone] = useState<string | null>(null)
  const [expanded, setExpanded] = useState({ key: '', count: PAGE_SIZE })

  const { data: productsData, error: productsError, isLoading, mutate: retryProducts } = useSWR(
    SWR_KEYS.products,
    () => loadProducts({ limit: 100 })
  )
  const allProducts = useMemo(() => productsData ?? [], [productsData])
  const listFailed = !!productsError && !productsData

  const { data: categories = [] } = useSWR(SWR_KEYS.categories, fetchCategories)

  // Paging resets automatically whenever the filter key changes
  const filterKey = JSON.stringify([activeCategoryId, sort, priceRange, sizeFilter, bgTone, qParam])
  const visibleProductsCount = expanded.key === filterKey ? expanded.count : PAGE_SIZE
  const loadMore = () => setExpanded({ key: filterKey, count: visibleProductsCount + PAGE_SIZE })

  const title = qParam
    ? `Kết quả cho “${qParam}”`
    : campaignId
      ? campaignId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Tất cả sản phẩm'

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (priceRange !== 'all') count++
    if (sizeFilter !== null) count++
    if (bgTone !== null) count++
    return count
  }, [priceRange, sizeFilter, bgTone])

  const clearAllFilters = () => {
    setActiveCategoryId('all')
    setPriceRange('all')
    setSizeFilter(null)
    setBgTone(null)
  }

  // Category/search-scoped base list, before price/size/bg-tone filtering — also used to
  // derive the dynamic size filter options.
  const scopedProducts = useMemo(() => {
    let ps = allProducts
    if (activeCategoryId !== 'all') {
      ps = ps.filter((p) => p.categoryId === activeCategoryId)
    }
    if (qParam) {
      const q = qParam.toLowerCase()
      ps = ps.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.subtitle && p.subtitle.toLowerCase().includes(q))
      )
    }
    return ps
  }, [allProducts, activeCategoryId, qParam])

  const sizeOptions = useMemo(() => {
    const byCode = new Map<string, string>()
    for (const product of scopedProducts) {
      for (const size of product.sizes) {
        if (!byCode.has(size.code)) byCode.set(size.code, size.name)
      }
    }
    return Array.from(byCode, ([code, name]) => ({ code, name }))
  }, [scopedProducts])

  // Active filters as removable chips (board: list-a-*). Search text is not a filter chip.
  const activeChips = (() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    if (activeCategoryId !== 'all') {
      chips.push({
        key: 'category',
        label: categories.find((c) => c.id === activeCategoryId)?.name ?? activeCategoryId,
        onRemove: () => setActiveCategoryId('all'),
      })
    }
    if (priceRange !== 'all') {
      chips.push({
        key: 'price',
        label: PRICE_RANGES.find((r) => r.id === priceRange)?.label ?? priceRange,
        onRemove: () => setPriceRange('all'),
      })
    }
    if (sizeFilter !== null) {
      chips.push({
        key: 'size',
        label: sizeOptions.find((s) => s.code === sizeFilter)?.name ?? sizeFilter,
        onRemove: () => setSizeFilter(null),
      })
    }
    if (bgTone !== null) {
      chips.push({
        key: 'tone',
        label: LISTING_CHIP_COPY.tones[bgTone] ?? bgTone,
        onRemove: () => setBgTone(null),
      })
    }
    return chips
  })()

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

      const bgToneMatch = bgTone === null ? true : product.defaultVariant['bg_tone'] === bgTone

      return priceMatch && sizeMatch && bgToneMatch
    })

    switch (sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
      case 'price-desc':
        return [...filtered].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
      case 'rating-desc':
        return [...filtered].sort((a, b) => b.rating - a.rating)
      default:
        return filtered
    }
  }, [scopedProducts, sort, priceRange, sizeFilter, bgTone])

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

      const bgToneMatch = pendingBgTone === null ? true : product.defaultVariant['bg_tone'] === pendingBgTone

      return priceMatch && sizeMatch && bgToneMatch
    })

    return filtered.length
  }, [scopedProducts, pendingPriceRange, pendingSizeFilter, pendingBgTone])

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
      <DeskHeader />
      <TopBar
        title={title}
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: title }]} />

      {/* Desktop heading row — hidden below lg */}
      <Container className="hidden lg:flex" style={{ alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 20 }}>
        <div>
          <Heading as="h1" size="xl">{title}</Heading>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            {isLoading ? '...' : `${visibleProducts.length} / ${allVisibleProducts.length} sản phẩm`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sắp xếp:</span>
          <SortSelect
            value={sort}
            onChange={(v) => setSort(v as 'featured' | 'price-asc' | 'price-desc' | 'rating-desc')}
            options={[
              { value: 'featured', label: 'Nổi bật' },
              { value: 'price-asc', label: 'Giá tăng dần' },
              { value: 'price-desc', label: 'Giá giảm dần' },
              { value: 'rating-desc', label: 'Đánh giá cao nhất' },
            ]}
          />
        </div>
      </Container>

      {/* Category pills — hidden at lg+ */}
      <div
        className="sticky top-[57px] md:top-[69px] lg:top-[76px] lg:hidden"
        style={{
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

      {/* Sort/filter/view bar — hidden at lg+ */}
      <div
        className="flex lg:hidden"
        style={{
          alignItems: 'center',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-soft)',
          gap: 8,
        }}
      >
        <div style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
          {isLoading ? '...' : `${visibleProducts.length} / ${allVisibleProducts.length} sản phẩm`}
        </div>
        <button
          type="button"
          onClick={() => { setPendingPriceRange(priceRange); setPendingSizeFilter(sizeFilter); setPendingBgTone(bgTone); setFilterSheetOpen(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            height: 40, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 6,
            background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
          }}
        >
          <IconFilter size={14} />
          {activeFilterCount > 0 ? `Bộ lọc (${activeFilterCount})` : 'Bộ lọc'}
        </button>
        <button
          type="button"
          onClick={() => setSortSheetOpen(true)}
          style={{
            height: 40, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 6,
            background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
            flexShrink: 0,
          }}
        >
          Sắp xếp
        </button>
        {/* Grid/List toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
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

      {/* Main content with desktop sidebar + product grid/list */}
      <Container>
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[216px_minmax(0,1fr)] lg:items-start lg:gap-7 xl:grid-cols-[248px_minmax(0,1fr)] xl:gap-10" style={{ paddingBottom: 100 }}>
          <FilterSidebar
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sizeOptions={sizeOptions}
            sizeFilter={sizeFilter}
            onSizeFilterChange={setSizeFilter}
            bgTone={bgTone}
            onBgToneChange={setBgTone}
            onClearAll={clearAllFilters}
          />
          <div>
            {!isLoading && activeChips.length > 0 ? (
              <ActiveFilterChips chips={activeChips} onClearAll={clearAllFilters} />
            ) : null}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-3 xl:gap-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : listFailed ? (
              <ListingStateBox
                title={LISTING_COPY.error.title}
                body={LISTING_COPY.error.body}
                primary={{ label: LISTING_COPY.error.retry, onClick: () => retryProducts() }}
                secondary={{ label: LISTING_COPY.error.call, href: HOTLINE_TEL }}
              />
            ) : visibleProducts.length === 0 ? (
              allProducts.length === 0 ? (
                <ListingStateBox
                  title={LISTING_COPY.empty.title}
                  body={LISTING_COPY.empty.body}
                  primary={{ label: LISTING_COPY.empty.primary, href: '/categories' }}
                  secondary={{ label: LISTING_COPY.empty.secondary, href: '/products' }}
                />
              ) : qParam ? (
                <ListingStateBox
                  title={SEARCH_EMPTY_COPY.title}
                  body={SEARCH_EMPTY_COPY.body(qParam)}
                  primary={{ label: SEARCH_EMPTY_COPY.suggestions[0].label, href: SEARCH_EMPTY_COPY.suggestions[0].href }}
                  secondary={{ label: SEARCH_EMPTY_COPY.suggestions[1].label, href: SEARCH_EMPTY_COPY.suggestions[1].href }}
                />
              ) : (
                <ListingStateBox
                  title={LISTING_COPY.filtered.title}
                  body={LISTING_COPY.filtered.body}
                  primary={{
                    label: LISTING_COPY.filtered.primary,
                    onClick: () => {
                      setPriceRange('all')
                      setSizeFilter(null)
                      setBgTone(null)
                      setActiveCategoryId('all')
                    },
                  }}
                  secondary={{ label: LISTING_COPY.filtered.secondary, href: HOTLINE_TEL }}
                />
              )
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
                    <ProductsListRow
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
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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

// Removable chips for the active filters, with "Xóa tất cả" (board: list-a-*, st-list-filtered-*).
function ActiveFilterChips({
  chips,
  onClearAll,
}: {
  chips: { key: string; label: string; onRemove: () => void }[]
  onClearAll: () => void
}) {
  return (
    <div className="noscroll mb-5 flex items-center gap-2 overflow-x-auto md:mb-6 xl:mb-6" style={{ paddingBottom: 2 }}>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[16px] border px-2.5 py-1.5 text-[13px]"
          style={{ background: 'var(--bg-surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`${LISTING_CHIP_COPY.remove} ${chip.label}`}
            className="grid h-4 w-4 place-items-center rounded-full bg-transparent p-0"
            style={{ color: 'var(--text-muted-strong)', cursor: 'pointer', border: 'none' }}
          >
            <IconClose size={12} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 shrink-0 whitespace-nowrap bg-transparent text-[13px]"
        style={{ color: 'var(--accent)', cursor: 'pointer', border: 'none' }}
      >
        {LISTING_CHIP_COPY.clearAll}
      </button>
    </div>
  )
}

// Empty, filtered-empty, search-empty and error states for the listing (st-list-*, st-search-*).
function ListingStateBox({
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
      className="my-4 flex flex-col items-center gap-3 rounded-[10px] border border-dashed px-6 py-12 text-center"
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

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageInner />
    </Suspense>
  )
}
