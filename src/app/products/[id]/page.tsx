'use client'

import { IconClose, IconCompare, IconHeart, IconStar } from '@/components/icons'
import { TopBar } from '@/components/layout/TopBar'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { Price } from '@/components/ui/Price'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Skeleton } from '@/components/ui/Skeleton'
import { VariantSwatch } from '@/components/ui/VariantSwatch'
import {
  DEFAULT_PLACE_LABELS,
  DEFAULT_SPEC_LABELS,
  PRODUCTS,
  ZODIAC,
} from '@/lib/data'
import { addRecentlyViewed, getSavedProducts, getRecentlyViewedIds, toggleSavedProduct, upsertCartItem } from '@/lib/storage'
import { pickVariantImage } from '@/lib/image'
import { resolveSKUPrice, resolveSizeDisplayPrice } from '@/lib/sku'
import {
  fetchProduct,
  fetchProductReviews,
  fetchProducts,
  fetchSettings,
  parseLabelOverrides,
} from '@/lib/storefront-api'
import type { Product, SavedProductVariant } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { SWR_KEYS } from '@/lib/swr-keys'

type TabId = 'description' | 'guide' | 'specs' | 'reviews'
type ArtBg = 'gold' | 'red' | 'bronze' | 'dark'
type ArtFrame = 'bronze' | 'gold' | 'dark' | 'carved'

function CompareModal({
  product,
  onClose,
  activeAttrs,
}: {
  product: Product
  onClose: () => void
  activeAttrs: Record<string, string>
}) {
  const bgToneOpt = product.variantOptions.find((o) => o.key === 'bg_tone')
  const bgValues = bgToneOpt?.values ?? []
  const activeBg = activeAttrs['bg_tone'] ?? product.defaultVariant['bg_tone'] ?? bgValues[0] ?? 'gold'
  const activeFrame = activeAttrs['frame'] ?? product.defaultVariant['frame'] ?? 'bronze'

  const [combos, setCombos] = useState(() => [
    { bg: activeBg as ArtBg, frame: activeFrame as ArtFrame },
    { bg: (bgValues[1] ?? bgValues[0] ?? 'gold') as ArtBg, frame: activeFrame as ArtFrame },
    { bg: (bgValues[2] ?? bgValues[0] ?? 'gold') as ArtBg, frame: activeFrame as ArtFrame },
  ])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,14,9,0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-page)',
        }}
      >
        <div>
          <Label style={{ fontSize: 11 }}>So sánh biến thể</Label>
          <Heading as="h2" size="sm" style={{ fontSize: 17 }}>
            {product.title}
          </Heading>
        </div>
        <Btn
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          style={{
            color: 'var(--text-primary)',
            padding: 4,
            minWidth: 30,
            minHeight: 30,
          }}
          aria-label="Đóng so sánh biến thể"
        >
          <IconClose size={22} />
        </Btn>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: 'var(--bg-page)',
        }}
      >
        {combos.map((combo, i) => (
          <div
            key={i}
            style={{ background: 'var(--bg-card)', borderRadius: 8, padding: 10, border: '1px solid var(--border)' }}
          >
            <ArtPiece bg={combo.bg} frame={combo.frame} label="" pad={10} aspect="4/3" />
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{combo.bg}</span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span>{combo.frame}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {bgValues.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setCombos((cs) => cs.map((cc, j) => (j === i ? { ...cc, bg: tone as ArtBg } : cc)))}
                  style={{ border: 'none', background: 'transparent', padding: 3, cursor: 'pointer', borderRadius: 999, display: 'grid', placeItems: 'center', minWidth: 34, minHeight: 34 }}
                  aria-label={`Chọn nền ${tone}`}
                >
                  <VariantSwatch tone={tone} size={22} active={tone === combo.bg} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({})
  const [sizeId, setSizeId] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('description')
  const [savedVariants, setSavedVariants] = useState<SavedProductVariant[]>(() =>
    getSavedProducts()
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showCompare, setShowCompare] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const querySizeId = searchParams.get('sizeId') ?? ''

  const { data: product = null, isLoading } = useSWR(
    params.id ? SWR_KEYS.product(params.id) : null,
    params.id ? () => fetchProduct(params.id).then(p => p || PRODUCTS.find(e => e.id === params.id) || null) : null
  )

  const { data: reviews = [] } = useSWR(
    product ? SWR_KEYS.reviews(product.id) : null,
    product ? () => fetchProductReviews(product.id) : null
  )

  const { data: relatedProducts = [], isLoading: relatedLoading } = useSWR(
    product?.categoryId ? SWR_KEYS.productsByCategory(product.categoryId) : null,
    product?.categoryId ? () => fetchProducts({ category: product.categoryId, limit: 8 }).then(ps => ps.filter(p => p.id !== product.id).slice(0, 6)) : null
  )

  const { data: settings = {} } = useSWR(SWR_KEYS.settings, fetchSettings)

  const labelOverrides = useMemo(() => parseLabelOverrides(settings), [settings])
  const placeLabels = useMemo(
    () => ({ ...DEFAULT_PLACE_LABELS, ...labelOverrides.placeLabels }),
    [labelOverrides.placeLabels]
  )
  const specLabels = useMemo(
    () => ({ ...DEFAULT_SPEC_LABELS, ...labelOverrides.specLabels }),
    [labelOverrides.specLabels]
  )

  // Merge: explicit user selection wins, then product default
  const resolvedAttrs = useMemo(() => ({ ...(product?.defaultVariant ?? {}), ...selectedAttrs }), [product, selectedAttrs])
  // For ArtPiece backward compat: derive bg/frame from attrs if present
  const resolvedBgTone = resolvedAttrs['bg_tone'] ?? 'gold'
  const resolvedFrame = resolvedAttrs['frame'] ?? 'bronze'
  // Pick image by matching variant attrs; fall back to activeImageIndex
  const attrMatchedImage = useMemo(
    () => product ? pickVariantImage(product.images, resolvedAttrs) : null,
    [product, resolvedAttrs]
  )
  const activeImage = attrMatchedImage ?? product?.images[activeImageIndex] ?? null
  const resolvedSizeId = sizeId || querySizeId || (product?.sizes[0]?.id ?? '')

  const { data: recentIds = [] } = useSWR(
    product ? ['recent-ids', product.id] : null,
    product
      ? async () => getRecentlyViewedIds().filter((id) => id !== product.id).slice(0, 6)
      : null
  )

  const { data: recentlyViewedProducts = [] } = useSWR(
    recentIds.length > 0 ? ['recently-viewed-products', recentIds.join(',')] : null,
    recentIds.length > 0 ? () => fetchProducts().then(ps => recentIds.map(id => ps.find(p => p.id === id)).filter((p): p is Product => p !== undefined)) : null
  )

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id)
    }
  }, [product])

  const category = product?.categoryId ?? ''

  const selectedSize = product?.sizes.find((size) => size.id === resolvedSizeId) ?? product?.sizes[0]
  const currentPrice = product
    ? resolveSKUPrice(product.skus, selectedSize?.code, resolvedAttrs, product.discountPrice ?? product.price)
    : 0
  const isSaved = product ? savedVariants.some((v) => v.productId === product.id) : false
  const imageCount = (product?.images.length ?? 0) > 0 ? (product?.images.length ?? 0) : 1

  function scrollToImage(index: number) {
    const container = carouselRef.current
    if (!container) {
      return
    }

    const clampedIndex = Math.max(0, Math.min(index, imageCount - 1))
    container.scrollTo({ left: container.clientWidth * clampedIndex, behavior: 'smooth' })
    setActiveImageIndex(clampedIndex)
  }

  function handleCarouselTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
  }

  function handleCarouselTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const startX = touchStartXRef.current
    const endX = event.changedTouches[0]?.clientX
    touchStartXRef.current = null

    if (startX === null || endX === undefined) {
      return
    }

    const deltaX = startX - endX
    const swipeThreshold = 35
    if (deltaX > swipeThreshold) {
      scrollToImage(activeImageIndex + 1)
    } else if (deltaX < -swipeThreshold) {
      scrollToImage(activeImageIndex - 1)
    }
  }

  function handleCarouselKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToImage(activeImageIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToImage(activeImageIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      scrollToImage(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      scrollToImage(imageCount - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
        <TopBar title="Chi tiết sản phẩm" onMenu={() => setIsMenuOpen(true)} />
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div style={{ padding: '12px 16px 0' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <Skeleton style={{ aspectRatio: '4/3', borderRadius: 0 }} />
            <div style={{ padding: '16px' }}>
              <Skeleton style={{ height: 24, marginBottom: 8, width: '70%' }} />
              <Skeleton style={{ height: 14, marginBottom: 16, width: '50%' }} />
              <Skeleton style={{ height: 20, marginBottom: 12, width: '40%' }} />
              <Skeleton style={{ height: 48, marginTop: 16 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div
        className="paper"
        style={{
          background: 'var(--bg-page)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Không tìm thấy sản phẩm</div>
      </div>
    )
  }

  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Zoom overlay */}
      {zoomOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconClose size={20} color="white" />
          </button>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', width: '100%' }} onClick={e => e.stopPropagation()}>
            <ArtPiece
              bg={resolvedBgTone as ArtBg}
              frame={resolvedFrame as ArtFrame}
              label={product.title}
              pad={16}
              aspect="4/3"
              imgSrc={activeImage?.url}
            />
          </div>
        </div>
      )}

      <TopBar
        title="Chi tiết sản phẩm"
       
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => (window.location.href = '/saved')}
        savedCount={savedVariants.length}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div style={{ padding: '12px 16px 0' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Overlaid back + save buttons */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Quay lại"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          </div>
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
            <button
              type="button"
              onClick={() => {
                setSavedVariants(toggleSavedProduct(product.id, resolvedAttrs, selectedSize?.id))
              }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Lưu sản phẩm"
            >
              <IconHeart size={18} color={isSaved ? 'var(--accent)' : 'white'} />
            </button>
          </div>

          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              scrollPaddingLeft: 0,
              gap: 0,
              aspectRatio: '4/3',
              cursor: 'zoom-in',
            }}
            className="noscroll"
            tabIndex={0}
            role="region"
            aria-label="Ảnh sản phẩm"
            onTouchStart={handleCarouselTouchStart}
            onTouchEnd={handleCarouselTouchEnd}
            onKeyDown={handleCarouselKeyDown}
            onClick={() => setZoomOpen(true)}
            onScroll={(e) => {
              const element = e.currentTarget
              const scrollWidth = element.scrollWidth / imageCount
              const newIndex = Math.round(element.scrollLeft / scrollWidth)
              setActiveImageIndex(Math.min(newIndex, imageCount - 1))
            }}
          >
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div
                  key={image.id}
                  style={{
                    flex: '0 0 100%',
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-card)',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.name || product.title}
                    width={1200}
                    height={900}
                    unoptimized
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))
            ) : (
              <div style={{ minWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArtPiece
                  bg={resolvedBgTone as 'gold' | 'red' | 'bronze' | 'dark'}
                  frame={resolvedFrame as 'bronze' | 'gold' | 'dark' | 'carved'}
                  label={product.title}
                  pad={12}
                  aspect="4/3"
                />
              </div>
            )}
          </div>

          {/* Zoom hint */}
          <div style={{ position: 'absolute', bottom: 44, right: 12, fontSize: 10, color: 'rgba(255,255,255,0.6)', pointerEvents: 'none', background: 'rgba(0,0,0,0.3)', borderRadius: 4, padding: '3px 7px' }}>
            Nhấn để phóng to
          </div>

          {/* Carousel dots */}
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', gap: 6, background: 'rgba(20, 14, 9, 0.6)', backdropFilter: 'blur(6px)', padding: '8px 14px', borderRadius: 20 }}>
            {(product.images.length > 0 ? product.images : [{}]).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => { e.stopPropagation(); scrollToImage(index) }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: index === activeImageIndex ? 'white' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 150ms ease' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href={`/categories/${category}`}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              letterSpacing: '0.15em',
              color: 'var(--bronze)',
              textTransform: 'uppercase',
              background: 'rgba(107,68,35,0.08)',
              padding: '3px 8px',
              borderRadius: 3,
              border: '1px solid rgba(107,68,35,0.15)',
              textDecoration: 'none',
            }}
          >
            ◦ Danh mục
          </Link>
        </div>
        <Heading as="h1" size="xl" style={{ fontSize: 26, margin: '10px 0 6px', lineHeight: 1.15 }}>
          {product.title}
        </Heading>
        <div
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontStyle: 'italic',
            fontSize: 13,
            color: 'var(--bronze)',
          }}
        >
          {product.subtitle}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStar key={i} size={12} color="#c9a961" />
            ))}
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {product.rating.toFixed(1)} · {product.reviewCount} đánh giá
          </span>
        </div>
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            paddingBottom: 14,
            borderBottom: '1px solid var(--border-soft)',
          }}
        >
          <Price amount={currentPrice} size="lg" />
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>(đã bao gồm lắp đặt)</div>
        </div>
      </div>

      <div style={{ padding: '18px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            Tùy chọn
          </div>
          <Btn
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCompare(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 100, padding: '6px 10px', fontSize: 13, color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          >
            <IconCompare size={12} /> So sánh
          </Btn>
        </div>

        {/* Dynamic variant selectors from product.variantOptions */}
        {product.variantOptions.map((opt) => (
          <div key={opt.key} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              {opt.label} · <span style={{ color: 'var(--text-secondary)' }}>{resolvedAttrs[opt.key] ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {opt.values.map((val) => {
                const active = resolvedAttrs[opt.key] === val
                if (opt.key === 'bg_tone') {
                  return (
                    <button key={val} type="button" onClick={() => setSelectedAttrs(a => ({ ...a, [opt.key]: val }))}
                      style={{ flexShrink: 0, padding: '6px 10px 6px 6px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 7, border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: active ? 'rgba(139,30,30,0.06)' : 'var(--bg-card)', cursor: 'pointer' }}>
                      <VariantSwatch tone={val} size={18} active={active} />
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{val}</span>
                    </button>
                  )
                }
                return (
                  <button key={val} type="button" onClick={() => setSelectedAttrs(a => ({ ...a, [opt.key]: val }))}
                    style={{ padding: '6px 14px', borderRadius: 100, border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: active ? 'rgba(139,30,30,0.06)' : 'var(--bg-card)', cursor: 'pointer', fontSize: 13, color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--accent)', color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{product.variantOptions.length + 1}</div>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Kích thước</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {product.sizes.map((size) => {
            const on = size.id === resolvedSizeId
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setSizeId(size.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  width: '100%',
                  padding: 12,
                  background: on ? 'rgba(139,30,30,0.06)' : 'transparent',
                  border: 'none',
                  borderLeft: on ? '3px solid var(--accent)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 14, fontWeight: 600, color: on ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {size.name}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 16, color: on ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {resolveSizeDisplayPrice(product.skus, size.code, size.price).toLocaleString('vi-VN')}đ
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 24, borderTop: '1px solid var(--border-soft)' }}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-soft)',
            padding: '0 8px',
            overflowX: 'auto',
            position: 'sticky',
            top: 0,
            zIndex: 15,
            background: 'var(--bg-page)',
          }}
          className="noscroll"
        >
          {[
            { id: 'description', label: 'Mô tả' },
            { id: 'guide', label: 'Hướng dẫn' },
            { id: 'specs', label: 'Thông số' },
            { id: 'reviews', label: 'Đánh giá' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabId)}
              style={{
                flex: '1 0 auto',
                padding: '12px 14px',
                minWidth: 70,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 12.5,
                fontWeight: 600,
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom:
                  activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 18px 40px' }}>
          {activeTab === 'description' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <Label style={{ fontSize: 9.5, letterSpacing: '0.18em', marginBottom: 8 }}>
                  Về tác phẩm
                </Label>
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.85,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {product.description}
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 20 }}>
                <Label style={{ fontSize: 9.5, letterSpacing: '0.18em', marginBottom: 8 }}>
                  Ý nghĩa phong thủy
                </Label>
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.85,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {product.meaning}
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'guide' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <Label style={{ fontSize: 9.5, letterSpacing: '0.18em', marginBottom: 14 }}>
                  Vị trí phù hợp
                </Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {product.purpose.place.map((entry) => (
                    <div
                      key={entry}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: 'var(--bronze)',
                          opacity: 0.6,
                          flexShrink: 0,
                        }}
                      />
                      {placeLabels[entry] ?? entry}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 20 }}>
                <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Tuổi Phong Thủy
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(product.zodiacIds?.length > 0
                    ? product.zodiacIds.map((id) => ZODIAC.find((z) => z.id === id)).filter((z): z is typeof ZODIAC[0] => z !== undefined)
                    : ZODIAC
                  ).map((z) => (
                    <div
                      key={z.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 1fr',
                        gap: 10,
                        alignItems: 'center',
                        padding: '10px 12px',
                        background: 'rgba(201,169,97,0.06)',
                        borderRadius: 6,
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontFamily: 'var(--font-lora), serif' }}>
                          {z.name}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                          Tuổi {z.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>
                          {z.years}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'specs' ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Object.entries(product.specs).map(([key, value], idx) => (
                <div
                  key={`spec-${idx}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '11px 0',
                    borderBottom: '1px solid var(--border-soft)',
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      letterSpacing: '0.05em',
                      flexShrink: 0,
                    }}
                  >
                    {specLabels[key] ?? key}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', textAlign: 'right' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'reviews' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Rating summary */}
              {product.rating > 0 && (
                <div style={{ display: 'flex', gap: 14, paddingBottom: 18, borderBottom: '1px solid var(--border-soft)', marginBottom: 6, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent)', lineHeight: 1 }}>
                      {product.rating.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      {product.reviewCount} đánh giá
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 8, textAlign: 'right' }}>{star}</div>
                        <div style={{ flex: 1, height: 5, background: 'var(--border-soft)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--gold)', width: star === 5 ? '80%' : star === 4 ? '15%' : '5%', borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {reviews.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Chưa có đánh giá nào.</p>
              ) : (
                reviews.map((review) => (
                  <article
                    key={review.id}
                    style={{ padding: '12px 0', borderBottom: '1px solid var(--border-soft)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                        {review.reviewerName}
                      </strong>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {review.date}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 1, margin: '4px 0' }}>
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <IconStar key={index} size={10} color="#c9a961" />
                      ))}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                      {review.body}
                    </p>
                  </article>
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: '28px 0 0' }}>
          <div style={{ padding: '0 16px', marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 3 }}>Cùng danh mục</div>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>Sản phẩm liên quan</div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }} className="noscroll">
            {relatedLoading
              ? [0, 1, 2].map((i) => (
                  <div key={i} style={{ flexShrink: 0, width: 148, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <ProductCardSkeleton compact />
                  </div>
                ))
              : relatedProducts.map((prod) => {
                  const imgUrl = prod.images[0]?.url ?? null
                  return (
                    <div
                      key={prod.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => { window.location.href = `/products/${prod.id}` }}
                      onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/products/${prod.id}` }}
                      style={{ flexShrink: 0, width: 148, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-page)', cursor: 'pointer' }}
                    >
                      <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
                        <ArtPiece bg={(prod.defaultVariant['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'} frame={(prod.defaultVariant['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'} label="" pad={6} aspect="4/3" imgSrc={imgUrl} />
                      </div>
                      <div style={{ padding: '8px 10px 12px' }}>
                        <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prod.title}</div>
                        <div style={{ fontFamily: 'var(--font-lora), serif', color: 'var(--accent)', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 13, marginTop: 4 }}>{(prod.discountPrice ?? prod.price).toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  )
                })}
          </div>
        </section>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedProducts.length > 0 && (
        <section style={{ padding: '24px 0 0' }}>
          <div style={{ padding: '0 16px', marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 3 }}>Gợi nhớ</div>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>Đã xem gần đây</div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }} className="noscroll">
            {recentlyViewedProducts.map((prod) => {
              const imgUrl = prod.images[0]?.url ?? null
              return (
                <div
                  key={prod.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => { window.location.href = `/products/${prod.id}` }}
                  onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/products/${prod.id}` }}
                  style={{ flexShrink: 0, width: 136, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-page)', cursor: 'pointer' }}
                >
                  <div style={{ background: 'var(--bg-surface)', padding: 8 }}>
                    <ArtPiece bg={(prod.defaultVariant['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'} frame={(prod.defaultVariant['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'} label="" pad={5} aspect="4/3" imgSrc={imgUrl} />
                  </div>
                  <div style={{ padding: '7px 10px 10px' }}>
                    <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prod.title}</div>
                    <div style={{ fontFamily: 'var(--font-lora), serif', color: 'var(--accent)', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 13, marginTop: 3 }}>{(prod.discountPrice ?? prod.price).toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'color-mix(in oklab, var(--bg-card) 92%, white 8%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--border)',
          padding: '12px 14px 22px',
          display: 'flex',
          gap: 8,
          zIndex: 20,
        }}
      >
        <Btn
          type="button"
          variant={isSaved ? 'outline' : 'ghost'}
          size="lg"
          onClick={() =>
            setSavedVariants(toggleSavedProduct(product.id, resolvedAttrs, selectedSize?.id))
          }
          style={{
            padding: '12px 14px',
            borderRadius: 4,
            background: isSaved ? 'rgba(139,30,30,0.08)' : 'transparent',
            color: isSaved ? 'var(--accent)' : 'var(--text-primary)',
            fontSize: 12,
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderColor: isSaved ? 'var(--accent)' : 'var(--text-primary)',
          }}
        >
          <IconHeart
            size={14}
            color={isSaved ? 'var(--accent)' : 'currentColor'}
            filled={isSaved}
          />{' '}
          {isSaved ? 'Đã lưu' : 'Lưu'}
        </Btn>
        <Btn
          type="button"
          size="lg"
          onClick={() => {
            upsertCartItem({
              productId: product.id,
              productTitle: product.title,
              sizeId: selectedSize?.id,
              sizeLabel: selectedSize?.name,
              selectedAttrs: resolvedAttrs,
              quantity: 1,
              unitPrice: currentPrice,
            })
          }}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 4,
            fontSize: 13,
            letterSpacing: '0.03em',
            background: 'transparent',
            border: '1px solid var(--text-primary)',
            color: 'var(--text-primary)',
          }}
        >
          Thêm vào giỏ
        </Btn>
        <Btn
          type="button"
          size="lg"
          onClick={() => {
            upsertCartItem({
              productId: product.id,
              productTitle: product.title,
              sizeId: selectedSize?.id,
              sizeLabel: selectedSize?.name,
              selectedAttrs: resolvedAttrs,
              quantity: 1,
              unitPrice: currentPrice,
            })
            window.location.href = '/cart'
          }}
          style={{
            flex: 1.3,
            padding: '12px 14px',
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          Mua ngay · {currentPrice.toLocaleString('vi-VN')}đ
        </Btn>
      </div>

      {showCompare && product && (
        <CompareModal
          product={product}
          onClose={() => setShowCompare(false)}
          activeAttrs={resolvedAttrs}
        />
      )}
    </div>
  )
}
