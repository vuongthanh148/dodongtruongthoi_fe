'use client'

import { IconClose, IconCompare, IconHeart, IconStar } from '@/components/icons'
import { TopBar } from '@/components/layout/TopBar'
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
  BG_TONES,
  DEFAULT_PLACE_LABELS,
  DEFAULT_SPEC_LABELS,
  FRAME_STYLES,
  PRODUCTS,
  mergeLabelOverrides,
} from '@/lib/data'
import { addRecentlyViewed, getSavedProducts, getRecentlyViewedIds, toggleSavedProduct, upsertCartItem } from '@/lib/storage'
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
  activeBg,
  activeFrame,
  bgTones,
  frameStyles,
}: {
  product: Product
  onClose: () => void
  activeBg: string | undefined
  activeFrame: string | undefined
  bgTones: Array<{ id: string; name: string }>
  frameStyles: Array<{ id: string; name: string }>
}) {
  const [combos, setCombos] = useState(() => [
    {
      bg: (activeBg ?? product.defaultBg) as ArtBg,
      frame: (activeFrame ?? product.defaultFrame) as ArtFrame,
    },
    {
      bg: (product.bgTones[1] ?? product.bgTones[0]) as ArtBg,
      frame: (product.frames[1] ?? product.frames[0]) as ArtFrame,
    },
    {
      bg: (product.bgTones[2] ?? product.bgTones[0]) as ArtBg,
      frame: product.frames[0] as ArtFrame,
    },
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
        {combos.map((combo, i) => {
          const bgInfo = bgTones.find((b) => b.id === combo.bg)
          const frameInfo = frameStyles.find((f) => f.id === combo.frame)
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 8,
                padding: 10,
                border: '1px solid var(--border)',
              }}
            >
              <ArtPiece bg={combo.bg} frame={combo.frame} label="" pad={10} aspect="4/3" />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{bgInfo?.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <span>{frameInfo?.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {product.bgTones.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() =>
                      setCombos((cs) =>
                        cs.map((cc, j) => (j === i ? { ...cc, bg: tone as ArtBg } : cc))
                      )
                    }
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 3,
                      cursor: 'pointer',
                      borderRadius: 999,
                      display: 'grid',
                      placeItems: 'center',
                      minWidth: 34,
                      minHeight: 34,
                    }}
                    aria-label={`Chọn nền ${bgTones.find((b) => b.id === tone)?.name ?? tone}`}
                  >
                    <VariantSwatch tone={tone} size={22} active={tone === combo.bg} />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const [bgTone, setBgTone] = useState<string | undefined>(undefined)
  const [frame, setFrame] = useState<string | undefined>(undefined)
  const [sizeId, setSizeId] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('description')
  const [savedVariants, setSavedVariants] = useState<SavedProductVariant[]>(() =>
    getSavedProducts()
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showCompare, setShowCompare] = useState(false)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const queryBgTone = searchParams.get('bgTone') ?? undefined
  const queryFrame = searchParams.get('frame') ?? undefined
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
  const displayBgTones = useMemo(
    () => mergeLabelOverrides(BG_TONES, labelOverrides.bgTones),
    [labelOverrides.bgTones]
  )
  const displayFrameStyles = useMemo(
    () => mergeLabelOverrides(FRAME_STYLES, labelOverrides.frames),
    [labelOverrides.frames]
  )
  const placeLabels = useMemo(
    () => ({ ...DEFAULT_PLACE_LABELS, ...labelOverrides.placeLabels }),
    [labelOverrides.placeLabels]
  )
  const specLabels = useMemo(
    () => ({ ...DEFAULT_SPEC_LABELS, ...labelOverrides.specLabels }),
    [labelOverrides.specLabels]
  )

  const resolvedBgTone = bgTone ?? queryBgTone ?? product?.defaultBg
  const resolvedFrame = frame ?? queryFrame ?? product?.defaultFrame
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
  const currentPrice = selectedSize?.price ?? product?.discountPrice ?? product?.price ?? 0
  const isSaved = product
    ? savedVariants.some(
        (v) =>
          v.productId === product.id &&
          v.bgTone === resolvedBgTone &&
          v.frame === resolvedFrame &&
          v.sizeId === selectedSize?.id
      )
    : false
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
        <TopBar title="Chi tiết sản phẩm" onBack={() => window.history.back()} />
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
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar
        title="Chi tiết sản phẩm"
        onBack={() => window.history.back()}
        onOpenSaved={() => (window.location.href = '/saved')}
        savedCount={savedVariants.length}
      />

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
            }}
            className="noscroll"
            tabIndex={0}
            role="region"
            aria-label="Ảnh sản phẩm"
            onTouchStart={handleCarouselTouchStart}
            onTouchEnd={handleCarouselTouchEnd}
            onKeyDown={handleCarouselKeyDown}
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
                    alt={image.altText || product.title}
                    width={1200}
                    height={900}
                    unoptimized
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))
            ) : (
              <div
                style={{
                  minWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
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
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', gap: 6, background: 'rgba(20, 14, 9, 0.6)', backdropFilter: 'blur(6px)', padding: '8px 14px', borderRadius: 20 }}>
            {(product.images.length > 0 ? product.images : [{}]).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToImage(index)}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: index === activeImageIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 150ms ease',
                }}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 10,
          }}
        >
          <div>
            <Label>Chọn nền tranh</Label>
            <Heading as="h3" size="sm" style={{ fontSize: 17, marginTop: 2 }}>
              {displayBgTones.find((tone) => tone.id === resolvedBgTone)?.name}
            </Heading>
          </div>
          <Btn
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCompare(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              borderRadius: 100,
              padding: '6px 10px',
              fontSize: 13,
              color: 'var(--text-primary)',
              borderColor: 'var(--border)',
            }}
          >
            <IconCompare size={12} /> So sánh
          </Btn>
        </div>

        <div
          style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 0 4px' }}
          className="noscroll"
        >
          {product.bgTones.map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => setBgTone(tone)}
              style={{
                flexShrink: 0,
                padding: '6px 10px 6px 6px',
                borderRadius: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                border: tone === resolvedBgTone ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: tone === resolvedBgTone ? 'rgba(139,30,30,0.06)' : 'var(--bg-card)',
                cursor: 'pointer',
              }}
            >
              <VariantSwatch tone={tone} size={18} active={tone === resolvedBgTone} />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {displayBgTones.find((item) => item.id === tone)?.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <Label>Chọn khung</Label>
        <Heading as="h3" size="sm" style={{ fontSize: 17, margin: '2px 0 10px' }}>
          {displayFrameStyles.find((item) => item.id === resolvedFrame)?.name}
        </Heading>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7 }}>
          {product.frames.map((frameId) => (
            <button
              key={frameId}
              type="button"
              onClick={() => setFrame(frameId)}
              style={{
                padding: 4,
                borderRadius: 6,
                cursor: 'pointer',
                border: frameId === resolvedFrame ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: frameId === resolvedFrame ? 'rgba(139,30,30,0.06)' : 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                className={`art-frame frame-${frameId}`}
                style={{ ['--p' as string]: '3px', width: '100%', aspectRatio: '1/1' }}
              >
                <div className={`bronze-art ${resolvedBgTone}`} style={{ width: '100%', height: '100%' }} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  color: frameId === resolvedFrame ? 'var(--accent)' : 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {displayFrameStyles.find((item) => item.id === frameId)?.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <Label>Kích thước</Label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
          {product.sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setSizeId(size.id)}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                border:
                  size.id === resolvedSizeId ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: size.id === resolvedSizeId ? 'rgba(139,30,30,0.06)' : 'var(--bg-card)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {size.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, borderTop: '1px solid var(--border-soft)' }}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-soft)',
            padding: '0 8px',
            overflowX: 'auto',
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
                minWidth: 90,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 15,
                fontWeight: 600,
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom:
                  activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
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
                <Label style={{ letterSpacing: '0.18em', marginBottom: 8 }}>
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
                <Label style={{ letterSpacing: '0.18em', marginBottom: 8 }}>
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
            <div>
              <Label style={{ letterSpacing: '0.18em', marginBottom: 14 }}>
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
        <section style={{ padding: '24px 0', borderBottom: '1px solid var(--border-soft)' }}>
          <SectionHeading eyebrow="Gợi ý" title="Sản phẩm liên quan" />
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '0 16px',
              overflowX: 'auto',
            }}
            className="noscroll"
          >
            {relatedLoading
              ? [0, 1].map((i) => (
                  <div key={i} style={{ flex: '0 0 48%' }}>
                    <ProductCardSkeleton compact />
                  </div>
                ))
              : relatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    style={{ flex: '0 0 48%' }}
                  >
                    <ProductCard
                      product={prod}
                      compact
                      onOpen={(bgTone) =>
                        (window.location.href = `/products/${prod.id}${bgTone ? `?bgTone=${bgTone}` : ''}`)
                      }
                    />
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedProducts.length > 0 && (
        <section style={{ padding: '24px 0', borderBottom: '1px solid var(--border-soft)' }}>
          <SectionHeading eyebrow="Lịch sử" title="Đã xem gần đây" />
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '0 16px',
              overflowX: 'auto',
            }}
            className="noscroll"
          >
            {recentlyViewedProducts.map((prod) => (
              <div
                key={prod.id}
                style={{ flex: '0 0 48%' }}
              >
                <ProductCard
                  product={prod}
                  compact
                  onOpen={(bgTone) =>
                    (window.location.href = `/products/${prod.id}${bgTone ? `?bgTone=${bgTone}` : ''}`)
                  }
                />
              </div>
            ))}
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
            setSavedVariants(toggleSavedProduct(product.id, resolvedBgTone, resolvedFrame, selectedSize?.id))
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
            const bgToneOption = displayBgTones.find((t) => t.id === resolvedBgTone)
            const frameOption = displayFrameStyles.find((f) => f.id === resolvedFrame)
            upsertCartItem({
              productId: product.id,
              productTitle: product.title,
              sizeId: selectedSize?.id,
              sizeLabel: selectedSize?.name,
              bgTone: resolvedBgTone,
              bgToneLabel: bgToneOption?.name,
              frame: resolvedFrame,
              frameLabel: frameOption?.name,
              quantity: 1,
              unitPrice: currentPrice,
            })
            window.location.href = '/cart'
          }}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 4,
            fontSize: 13,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Thêm vào giỏ hàng
        </Btn>
      </div>

      {showCompare && product && (
        <CompareModal
          product={product}
          onClose={() => setShowCompare(false)}
          activeBg={resolvedBgTone}
          activeFrame={resolvedFrame}
          bgTones={displayBgTones}
          frameStyles={displayFrameStyles}
        />
      )}
    </div>
  )
}
