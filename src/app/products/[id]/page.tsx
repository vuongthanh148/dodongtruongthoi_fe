'use client'

import { IconClose, IconHeart, IconPhone, IconStar } from '@/components/icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { TopBar } from '@/components/layout/TopBar'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { BottomActionBar } from '@/components/ui/BottomActionBar'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { ShareSheet } from '@/components/ui/ShareSheet'
import { Skeleton } from '@/components/ui/Skeleton'
import { VariantSwatch } from '@/components/ui/VariantSwatch'
import { campaignEndLine, variantSale } from '@/lib/campaign-price'
import { formatVnd } from '@/lib/format'
import { HOTLINE_TEL, HOTLINE, SOCIAL_LINKS } from '@/lib/constants'
import { DEFAULT_PLACE_LABELS, DEFAULT_SPEC_LABELS, ZODIAC } from '@/lib/data'
import { PDP_COPY } from '@/lib/content-data'
import { pickVariantImage } from '@/lib/image'
import { productPath } from '@/lib/product-links'
import { resolveSKUPrice, resolveSizeDisplayPrice } from '@/lib/sku'
import {
  addRecentlyViewed,
  getRecentlyViewedIds,
  getSavedProducts,
  toggleSavedProduct,
  upsertCartItem,
} from '@/lib/storage'
import {
  fetchCategories,
  fetchProduct,
  fetchProductReviews,
  fetchProducts,
  fetchSettings,
  parseLabelOverrides,
  submitReview,
} from '@/lib/storefront-api'
import { SWR_KEYS } from '@/lib/swr-keys'
import type { Product, SavedProductVariant, VariantOption } from '@/lib/types'
import { useCampaigns } from '@/lib/use-campaigns'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useId, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

type TabId = 'description' | 'meaning' | 'specs' | 'reviews'
type ReviewFormErrors = { name?: string; rating?: string; body?: string }

const TABS: { id: TabId; label: string }[] = [
  { id: 'description', label: PDP_COPY.tabs.description },
  { id: 'meaning', label: PDP_COPY.tabs.meaning },
  { id: 'specs', label: PDP_COPY.tabs.specs },
  { id: 'reviews', label: PDP_COPY.tabs.reviews },
]

const reviewFieldStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  outline: 'none',
}

const reviewErrorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'var(--accent)',
}

// Option buttons: selected = accent border + subtle accent fill.
function optionClass(on: boolean) {
  return `flex min-h-[44px] flex-col items-start justify-center gap-0.5 whitespace-nowrap rounded-[6px] px-3.5 py-2 font-body text-[14px] transition-colors ${
    on
      ? 'border-[1.5px] border-[var(--accent)] bg-[var(--accent-subtle)] font-semibold text-[var(--accent)]'
      : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]'
  }`
}

function pickQueryAttrs(options: VariantOption[], params: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {}
  for (const option of options) {
    const value = params.get(option.key)
    if (value && option.values.includes(value)) out[option.key] = value
  }
  return out
}

function OptionRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="font-medium text-[var(--bronze)]">{label}</span>
        <span className="text-right text-[var(--text-secondary)]">{value}</span>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function ReviewForm({ productId }: { productId: string }) {
  const idPrefix = useId()
  const [reviewerName, setReviewerName] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<ReviewFormErrors>({})
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const nextErrors: ReviewFormErrors = {}
    if (!reviewerName.trim()) nextErrors.name = 'Vui lòng nhập tên'
    if (rating < 1) nextErrors.rating = 'Vui lòng chọn số sao'
    if (content.trim().length < 10) nextErrors.body = 'Nội dung tối thiểu 10 ký tự'
    setErrors(nextErrors)
    setStatus('idle')
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    const ok = await submitReview(productId, {
      reviewerName: reviewerName.trim(),
      rating,
      body: content.trim(),
    })
    setSending(false)

    if (ok) {
      setReviewerName('')
      setRating(0)
      setContent('')
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-4 flex flex-col gap-4 border-t border-[var(--border-soft)] pt-5"
    >
      <p className="eyebrow m-0">{PDP_COPY.reviewFormTitle}</p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-name`} className="text-[14px] text-[var(--text-secondary)]">
          Tên của bạn
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={reviewerName}
          onChange={(e) => {
            setReviewerName(e.target.value)
            setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
          style={reviewFieldStyle}
        />
        {errors.name && (
          <p id={`${idPrefix}-name-error`} style={reviewErrorStyle}>
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span id={`${idPrefix}-rating-label`} className="text-[14px] text-[var(--text-secondary)]">
          Số sao
        </span>
        <div
          role="group"
          aria-labelledby={`${idPrefix}-rating-label`}
          aria-describedby={errors.rating ? `${idPrefix}-rating-error` : undefined}
          className="flex gap-1"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} sao`}
              aria-pressed={rating === star}
              onClick={() => {
                setRating(star)
                setErrors((prev) => ({ ...prev, rating: undefined }))
              }}
              className="h-11 w-11 p-0 text-[26px] leading-none"
              style={{ color: star <= rating ? 'var(--gold)' : 'var(--border)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              ★
            </button>
          ))}
        </div>
        {errors.rating && (
          <p id={`${idPrefix}-rating-error`} style={reviewErrorStyle}>
            {errors.rating}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-body`} className="text-[14px] text-[var(--text-secondary)]">
          Nội dung đánh giá
        </label>
        <textarea
          id={`${idPrefix}-body`}
          rows={4}
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setErrors((prev) => ({ ...prev, body: undefined }))
          }}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? `${idPrefix}-body-error` : undefined}
          style={{ ...reviewFieldStyle, resize: 'vertical' }}
        />
        {errors.body && (
          <p id={`${idPrefix}-body-error`} style={reviewErrorStyle}>
            {errors.body}
          </p>
        )}
      </div>

      {status === 'success' && (
        <p role="status" className="m-0 text-[14px] text-[var(--text-secondary)]">
          Cảm ơn bạn! Đánh giá sẽ hiển thị sau khi được duyệt.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" style={reviewErrorStyle}>
          Không gửi được đánh giá, vui lòng thử lại.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="h-[46px] rounded-[6px] bg-[var(--accent)] font-body text-[15px] font-semibold text-white"
      >
        Gửi đánh giá
      </button>
    </form>
  )
}

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
    { bg: activeBg as 'gold', frame: activeFrame as 'bronze' },
    { bg: (bgValues[1] ?? bgValues[0] ?? 'gold') as 'gold', frame: activeFrame as 'bronze' },
    { bg: (bgValues[2] ?? bgValues[0] ?? 'gold') as 'gold', frame: activeFrame as 'bronze' },
  ])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={PDP_COPY.compare}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(20,14,9,0.72)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center justify-between gap-3 bg-[var(--bg-page)] px-4 py-3.5">
        <div className="min-w-0">
          <p className="eyebrow m-0 text-[14px]">{PDP_COPY.compare}</p>
          <h2 className="m-0 mt-1 truncate text-[20px] leading-[1.2] font-semibold">{product.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng so sánh biến thể"
          className="grid h-11 w-11 shrink-0 place-items-center text-[var(--text-primary)]"
        >
          <IconClose size={22} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-[var(--bg-page)] px-3 pt-3.5 pb-5">
        {combos.map((combo, i) => (
          <div key={i} className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] p-2.5">
            <ArtPiece bg={combo.bg} frame={combo.frame} label="" pad={10} aspect="4/3" />
            <div className="mt-2 flex justify-between text-[14px] text-[var(--text-secondary)]">
              <span>{combo.bg}</span>
              <span>·</span>
              <span>{combo.frame}</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {bgValues.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  aria-label={`Chọn nền ${tone}`}
                  onClick={() =>
                    setCombos((cs) => cs.map((cc, j) => (j === i ? { ...cc, bg: tone as 'gold' } : cc)))
                  }
                  className="grid min-h-[44px] min-w-[44px] place-items-center rounded-full bg-transparent p-1"
                >
                  <VariantSwatch tone={tone} size={24} active={tone === combo.bg} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ART_BGS = ['gold', 'red', 'bronze', 'dark'] as const
const ART_FRAMES = ['bronze', 'gold', 'dark', 'carved'] as const
type ArtBg = (typeof ART_BGS)[number]
type ArtFrame = (typeof ART_FRAMES)[number]

function asArtBg(value: string | undefined): ArtBg {
  return (ART_BGS as readonly string[]).includes(value ?? '') ? (value as ArtBg) : 'gold'
}

function asArtFrame(value: string | undefined): ArtFrame {
  return (ART_FRAMES as readonly string[]).includes(value ?? '') ? (value as ArtFrame) : 'bronze'
}

function ProductDetailPageInner() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: campaigns = [] } = useCampaigns()

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({})
  const [sizeId, setSizeId] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('description')
  const [savedVariants, setSavedVariants] = useState<SavedProductVariant[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showCompare, setShowCompare] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const querySizeId = searchParams.get('sizeId') ?? ''

  const { data: product = null, isLoading } = useSWR(
    params.id ? SWR_KEYS.product(params.id) : null,
    params.id ? () => fetchProduct(params.id).then((p) => p || null) : null
  )

  const { data: reviews = [] } = useSWR(
    product ? SWR_KEYS.reviews(product.id) : null,
    product ? () => fetchProductReviews(product.id) : null
  )

  const { data: relatedProducts = [], isLoading: relatedLoading } = useSWR(
    product?.categoryId ? SWR_KEYS.productsByCategory(product.categoryId) : null,
    product?.categoryId
      ? () =>
          fetchProducts({ category: product.categoryId, limit: 8 }).then((ps) =>
            ps.filter((p) => p.id !== product.id).slice(0, 4)
          )
      : null
  )

  const { data: categories = [] } = useSWR(SWR_KEYS.categories, fetchCategories)
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

  // Options from the URL (shared links, saved items) fill in under the user's own picks.
  const queryAttrs = useMemo(
    () => (product ? pickQueryAttrs(product.variantOptions, searchParams) : {}),
    [product, searchParams]
  )
  const resolvedAttrs = useMemo(
    () => ({ ...(product?.defaultVariant ?? {}), ...queryAttrs, ...selectedAttrs }),
    [product, queryAttrs, selectedAttrs]
  )
  const activeImage = useMemo(
    () => (product ? pickVariantImage(product.images, resolvedAttrs) : null),
    [product, resolvedAttrs]
  )
  const resolvedSizeId = sizeId || querySizeId || (product?.sizes[0]?.id ?? '')
  const selectedSize = product?.sizes.find((size) => size.id === resolvedSizeId) ?? product?.sizes[0]

  // List price for this size and these options, then the campaign that applies to it.
  const basePrice = product
    ? resolveSKUPrice(product.skus, selectedSize?.code, resolvedAttrs, selectedSize?.price ?? product.discountPrice ?? product.price)
    : 0
  const priceView = product ? variantSale(basePrice, product, campaigns) : null
  const campaign = priceView?.campaign ?? null
  const currentPrice = priceView?.price ?? basePrice
  const isSaved = product ? savedVariants.some((v) => v.productId === product.id) : false
  const imageCount = (product?.images.length ?? 0) > 0 ? (product?.images.length ?? 0) : 1

  const { data: recentIds = [] } = useSWR(
    product ? ['recent-ids', product.id] : null,
    product
      ? async () =>
          getRecentlyViewedIds()
            .filter((id) => id !== product.id)
            .slice(0, 6)
      : null
  )

  const { data: recentlyViewedProducts = [] } = useSWR(
    recentIds.length > 0 ? ['recently-viewed-products', recentIds.join(',')] : null,
    recentIds.length > 0
      ? () =>
          fetchProducts().then((ps) =>
            recentIds
              .map((id) => ps.find((p) => p.id === id))
              .filter((p): p is Product => p !== undefined)
          )
      : null
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedVariants(getSavedProducts())
  }, [])

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id)
    }
  }, [product])

  const categoryName = product ? (categories.find((c) => c.id === product.categoryId)?.name ?? product.categoryId) : ''

  // Price change for one option value, measured against the current selection.
  function optionDelta(key: string, value: string): number {
    if (!product) return 0
    const priceFor = (attrs: Record<string, string>) =>
      resolveSKUPrice(product.skus, selectedSize?.code, attrs, basePrice)
    return priceFor({ ...resolvedAttrs, [key]: value }) - priceFor(resolvedAttrs)
  }

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

  function toggleSave() {
    if (!product) return
    setSavedVariants(toggleSavedProduct(product.id, resolvedAttrs, selectedSize?.id))
  }

  function addToCart() {
    if (!product) return
    upsertCartItem({
      productId: product.id,
      productTitle: product.title,
      sizeId: selectedSize?.id,
      sizeLabel: selectedSize?.name,
      selectedAttrs: resolvedAttrs,
      quantity: 1,
      unitPrice: currentPrice,
    })
  }

  function buyNow() {
    addToCart()
    router.push('/cart')
  }

  if (isLoading) {
    return (
      <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
        <DeskHeader />
        <TopBar title="Chi tiết sản phẩm" onBack={() => window.history.back()} />
        <Container className="pt-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
            <Skeleton style={{ aspectRatio: '4/3', borderRadius: 12 }} />
            <div className="flex flex-col gap-3">
              <Skeleton style={{ height: 16, width: '40%' }} />
              <Skeleton style={{ height: 36, width: '75%' }} />
              <Skeleton style={{ height: 16, width: '50%' }} />
              <Skeleton style={{ height: 36, width: '40%', marginTop: 12 }} />
              <Skeleton style={{ height: 50, marginTop: 16 }} />
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="paper flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="text-[15px] text-[var(--text-muted-strong)]">Không tìm thấy sản phẩm</div>
      </div>
    )
  }

  const sharePath = productPath(product.id, { sizeId: selectedSize?.id, attrs: resolvedAttrs })
  const recap = [
    ...product.variantOptions.map((o) => `${o.label} ${resolvedAttrs[o.key] ?? '—'}`),
    selectedSize?.name,
  ]
    .filter(Boolean)
    .join(' · ')
  const endLine = campaign ? campaignEndLine(campaign) : null
  const placeRows = product.purpose.place
  const zodiacRows = product.zodiacIds?.length > 0
    ? product.zodiacIds
        .map((id) => ZODIAC.find((z) => z.id === id))
        .filter((z): z is (typeof ZODIAC)[0] => z !== undefined)
    : ZODIAC
  const specEntries = Object.entries(product.specs)
  const reviewCountLabel = `${product.reviewCount} đánh giá`

  const saveButton = (
    <button
      type="button"
      onClick={toggleSave}
      aria-pressed={isSaved}
      aria-label={isSaved ? PDP_COPY.unsaveLabel : PDP_COPY.saveLabel}
      className={`grid h-[50px] w-[50px] shrink-0 place-items-center rounded-[6px] border bg-[var(--bg-card)] ${
        isSaved ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-primary)]'
      }`}
    >
      <IconHeart size={20} color="currentColor" filled={isSaved} />
    </button>
  )

  return (
    <div className="paper pb-24 md:pb-0" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Zoom overlay */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Đóng phóng to"
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <IconClose size={20} color="white" />
          </button>
          <div className="w-full max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <ArtPiece
              bg={asArtBg(resolvedAttrs['bg_tone'])}
              frame={asArtFrame(resolvedAttrs['frame'])}
              label=""
              pad={16}
              aspect="4/3"
              imgSrc={activeImage?.url}
            />
          </div>
        </div>
      )}

      {showCompare && (
        <CompareModal product={product} onClose={() => setShowCompare(false)} activeAttrs={resolvedAttrs} />
      )}

      <DeskHeader />
      <TopBar
        title="Chi tiết sản phẩm"
        onBack={() => window.history.back()}
        onOpenSaved={() => router.push('/saved')}
        savedCount={savedVariants.length}
      />
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: categoryName, href: `/categories/${product.categoryId}` },
          { label: product.title },
        ]}
      />

      <Container className="pt-4 md:pt-0">
        <div className="grid gap-6 md:gap-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:gap-14">
          {/* Gallery: main image on a surface panel, thumbnails below */}
          <div className="min-w-0">
            <div className="-mx-4 bg-[var(--bg-surface-alt)] p-3 md:mx-0 md:rounded-[12px] md:p-8 xl:p-10">
              <div className="relative overflow-hidden rounded-[8px] bg-[var(--bg-card)]">
                <div
                  ref={carouselRef}
                  className="noscroll flex cursor-zoom-in overflow-x-auto"
                  style={{ aspectRatio: '4/3', scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
                  tabIndex={0}
                  role="region"
                  aria-label="Ảnh sản phẩm"
                  onTouchStart={handleCarouselTouchStart}
                  onTouchEnd={handleCarouselTouchEnd}
                  onKeyDown={handleCarouselKeyDown}
                  onClick={() => setZoomOpen(true)}
                  onScroll={(e) => {
                    const element = e.currentTarget
                    const slideWidth = element.scrollWidth / imageCount
                    const newIndex = Math.round(element.scrollLeft / slideWidth)
                    setActiveImageIndex(Math.min(newIndex, imageCount - 1))
                  }}
                >
                  {product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative flex w-full shrink-0 items-center justify-center"
                        style={{ flex: '0 0 100%', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
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
                    <div className="flex min-w-full items-center justify-center">
                      <ArtPiece
                        bg={asArtBg(resolvedAttrs['bg_tone'])}
                        frame={asArtFrame(resolvedAttrs['frame'])}
                        label=""
                        pad={12}
                        aspect="4/3"
                      />
                    </div>
                  )}
                </div>

                <span className="pointer-events-none absolute right-3 bottom-12 rounded-[4px] bg-[rgba(0,0,0,0.35)] px-2 py-1 text-[12px] text-white">
                  Nhấn để phóng to
                </span>

                {imageCount > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-[20px] bg-[rgba(20,14,9,0.6)] px-3.5 py-2 backdrop-blur-[6px]">
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        aria-label={`Ảnh ${index + 1}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          scrollToImage(index)
                        }}
                        className="h-[6px] w-[6px] rounded-full p-0"
                        style={{ background: index === activeImageIndex ? 'white' : 'rgba(255,255,255,0.4)' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {imageCount > 1 && (
              <div className="mt-3 flex gap-2.5 md:mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => scrollToImage(index)}
                    aria-label={`Xem ảnh ${index + 1}`}
                    aria-current={index === activeImageIndex}
                    className={`w-16 shrink-0 rounded-[6px] p-[3px] md:w-20 xl:w-[88px] ${
                      index === activeImageIndex ? 'border-2 border-[var(--accent)]' : 'border border-[var(--border)]'
                    }`}
                  >
                    <ArtPiece
                      bg={asArtBg(resolvedAttrs['bg_tone'])}
                      frame={asArtFrame(resolvedAttrs['frame'])}
                      label=""
                      pad={3}
                      aspect="1/1"
                      imgSrc={image.url}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <div className="flex flex-col gap-[18px] md:gap-[22px] lg:sticky lg:top-[100px]">
            <div className="relative pr-14">
              <ShareSheet title={product.title} path={sharePath} image={activeImage?.url ?? product.images[0]?.url ?? null} summary={recap} />
              {product.subtitle && <p className="eyebrow m-0">{product.subtitle}</p>}
              <h1 className="mt-2.5 mb-2.5 text-[26px] leading-[1.1] font-semibold md:text-[32px] xl:text-[38px]">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted-strong)]">
                <span className="flex gap-0.5 text-[var(--gold)]" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStar key={i} size={14} color="currentColor" />
                  ))}
                </span>
                <span>
                  {product.rating.toFixed(1)} · {reviewCountLabel}
                </span>
              </div>
            </div>

            {/* Price, with campaign: sale, struck list price, −n%, end date */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="price-num text-[28px] leading-none md:text-[34px]">{formatVnd(currentPrice)}</span>
                  {campaign && priceView?.percent ? (
                    <>
                      <s className="text-[15px] text-[var(--text-muted-strong)] tabular-nums md:text-[17px]">
                        {formatVnd(basePrice)}
                      </s>
                      <span className="inline-flex h-7 items-center rounded-[4px] bg-[var(--accent)] px-2 font-body text-[14px] font-bold text-white tabular-nums">
                        −{priceView.percent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-[13px] text-[var(--text-muted-strong)]">{PDP_COPY.inclVat}</span>
                  )}
                </div>
                <div className="md:hidden">{saveButton}</div>
              </div>
              {campaign && endLine && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-[var(--accent-subtle)] bg-[var(--accent-subtle)] px-3.5 py-2.5">
                  <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                    {campaign.name} · {PDP_COPY.campaignSaving(formatVnd(basePrice - currentPrice))}
                  </span>
                  <span className={`text-[13px] ${endLine.soon ? 'font-semibold text-[var(--accent)]' : 'text-[var(--text-muted-strong)]'}`}>
                    {endLine.text}
                  </span>
                </div>
              )}
              {campaign && <span className="text-[13px] text-[var(--text-muted-strong)]">{PDP_COPY.inclVat}</span>}
            </div>

            <div className="rounded-[6px] bg-[var(--bg-surface-alt)] px-3.5 py-2.5 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
              {recap}
            </div>

            <OptionRow label={PDP_COPY.sizeLabel} value={selectedSize?.name ?? '—'}>
              {product.sizes.map((size) => {
                const on = size.id === resolvedSizeId
                const displayPrice = resolveSizeDisplayPrice(product.skus, size.code, size.price)
                return (
                  <button
                    key={size.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSizeId(size.id)}
                    className={optionClass(on)}
                  >
                    <span>{size.name}</span>
                    <span className={`text-[12px] font-normal tabular-nums ${on ? '' : 'text-[var(--text-muted-strong)]'}`}>
                      {formatVnd(displayPrice)}
                    </span>
                  </button>
                )
              })}
            </OptionRow>

            {product.variantOptions.map((opt) => {
              const value = resolvedAttrs[opt.key]
              const isTone = opt.key === 'bg_tone'
              return (
                <OptionRow key={opt.key} label={opt.label} value={value ?? '—'}>
                  {opt.values.map((val) => {
                    const on = value === val
                    if (isTone) {
                      return (
                        <button
                          key={val}
                          type="button"
                          aria-label={`${opt.label}: ${val}`}
                          aria-pressed={on}
                          onClick={() => setSelectedAttrs((a) => ({ ...a, [opt.key]: val }))}
                          className="grid h-11 w-11 place-items-center rounded-full"
                        >
                          <VariantSwatch tone={val} size={30} active={on} />
                        </button>
                      )
                    }
                    const delta = optionDelta(opt.key, val)
                    return (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSelectedAttrs((a) => ({ ...a, [opt.key]: val }))}
                        className={optionClass(on)}
                      >
                        <span>{val}</span>
                        <span className={`text-[12px] font-normal ${on ? '' : 'text-[var(--text-muted-strong)]'}`}>
                          {delta > 0 ? `+ ${formatVnd(delta)}` : PDP_COPY.surchargeNone}
                        </span>
                      </button>
                    )
                  })}
                </OptionRow>
              )
            })}

            {product.variantOptions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCompare(true)}
                className="self-start text-[13px] font-semibold text-[var(--accent)] underline underline-offset-4"
              >
                {PDP_COPY.compare}
              </button>
            )}

            {/* Desktop CTA row (md+). Mobile uses the bottom bar below. */}
            <div className="hidden gap-2.5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_50px]">
              <button
                type="button"
                onClick={addToCart}
                className="h-[50px] rounded-[6px] border-[1.5px] border-[var(--accent)] bg-transparent px-5 font-body text-[15px] font-semibold text-[var(--accent)]"
              >
                {PDP_COPY.addToCart}
              </button>
              <button
                type="button"
                onClick={buyNow}
                className="h-[50px] rounded-[6px] bg-[var(--accent)] px-5 font-body text-[15px] font-semibold text-white"
              >
                {PDP_COPY.buyNow} · {formatVnd(currentPrice)}
              </button>
              {saveButton}
            </div>

            <div className="flex items-start gap-2 border-t border-[var(--border-soft)] pt-4 text-[14px] leading-[1.6] text-[var(--text-secondary)]">
              <span className="mt-[3px] shrink-0 text-[var(--accent)]" aria-hidden="true">
                <IconPhone size={15} color="currentColor" />
              </span>
              <p className="m-0">
                {PDP_COPY.consult}{' '}
                <a href={HOTLINE_TEL} className="font-semibold text-[var(--accent)]">
                  {HOTLINE}
                </a>{' '}
                {PDP_COPY.consultOr}{' '}
                <a href={SOCIAL_LINKS.zalo} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent)]">
                  {PDP_COPY.consultZalo}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs (left) and spec card (right, lg+) */}
        <div className="mt-10 grid gap-10 md:mt-14 lg:mt-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:mt-[72px] xl:gap-14">
          <div className="min-w-0">
            <div role="tablist" className="noscroll flex gap-7 overflow-x-auto border-b border-[var(--border)] md:gap-8">
              {TABS.map((tab) => {
                const on = activeTab === tab.id
                const label = tab.id === 'reviews' ? `${tab.label} (${product.reviewCount})` : tab.label
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveTab(tab.id)}
                    className={`-mb-px shrink-0 border-b-2 py-3 font-body text-[15px] whitespace-nowrap md:text-[17px] ${
                      on
                        ? 'border-[var(--accent)] font-semibold text-[var(--accent)]'
                        : 'border-transparent font-medium text-[var(--text-secondary)]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <div role="tabpanel" className="pt-6 md:pt-7">
              {activeTab === 'description' && (
                <div className="flex flex-col gap-7">
                  <p className="m-0 max-w-[640px] text-[15px] leading-[1.75] text-[var(--text-primary)] md:text-[16px]">
                    {product.description}
                  </p>
                  {placeRows.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <p className="eyebrow m-0">{PDP_COPY.placeTitle}</p>
                      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                        {placeRows.map((entry) => (
                          <li key={entry} className="flex items-center gap-2.5 text-[15px] text-[var(--text-secondary)]">
                            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--bronze)]" />
                            {placeLabels[entry] ?? entry}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'meaning' && (
                <div className="flex flex-col gap-7">
                  <p className="m-0 max-w-[640px] text-[15px] leading-[1.75] text-[var(--text-primary)] md:text-[16px]">
                    {product.meaning}
                  </p>
                  <div className="flex flex-col gap-3">
                    <p className="eyebrow m-0">{PDP_COPY.zodiacTitle}</p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {zodiacRows.map((z) => (
                        <div key={z.id} className="flex items-center gap-3 rounded-[6px] bg-[var(--bg-surface-alt)] px-3 py-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-body text-[14px] font-bold text-white">
                            {z.name}
                          </span>
                          <div className="min-w-0">
                            <div className="font-body text-[15px] font-semibold text-[var(--text-primary)]">Tuổi {z.name}</div>
                            <div className="text-[13px] text-[var(--text-muted-strong)]">{z.years}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="flex flex-col">
                  {specEntries.map(([key, value], idx) => (
                    <div
                      key={`spec-${idx}`}
                      className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 border-b border-[var(--border-soft)] py-3 text-[15px] md:grid-cols-[140px_minmax(0,1fr)]"
                    >
                      <span className="text-[var(--text-muted-strong)]">{specLabels[key] ?? key}</span>
                      <span className="text-[var(--text-primary)]">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="flex flex-col gap-4">
                  {product.rating > 0 && (
                    <div className="flex items-center gap-4 border-b border-[var(--border-soft)] pb-5">
                      <div className="text-center">
                        <div className="font-body text-[36px] leading-none font-bold text-[var(--accent)] tabular-nums">
                          {product.rating.toFixed(1)}
                        </div>
                        <div className="mt-1 text-[13px] text-[var(--text-muted-strong)]">{reviewCountLabel}</div>
                      </div>
                    </div>
                  )}
                  {reviews.length === 0 ? (
                    <p className="m-0 text-[15px] text-[var(--text-muted-strong)]">Chưa có đánh giá nào.</p>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="border-b border-[var(--border-soft)] py-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <strong className="text-[15px] text-[var(--text-primary)]">{review.reviewerName}</strong>
                          <span className="text-[13px] text-[var(--text-muted-strong)]">{review.date}</span>
                        </div>
                        <div className="my-1 flex gap-0.5 text-[var(--gold)]" aria-label={`${review.rating} sao`}>
                          {Array.from({ length: review.rating }).map((_, index) => (
                            <IconStar key={index} size={12} color="currentColor" />
                          ))}
                        </div>
                        <p className="m-0 text-[15px] leading-[1.6] text-[var(--text-secondary)]">{review.body}</p>
                      </article>
                    ))
                  )}
                  <ReviewForm productId={product.id} />
                </div>
              )}
            </div>
          </div>

          {specEntries.length > 0 && (
            <aside className="hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:block">
              <p className="m-0 mb-3 text-[14px] font-semibold text-[var(--bronze)]">{PDP_COPY.specsCardTitle}</p>
              <div className="flex flex-col">
                {specEntries.slice(0, 6).map(([key, value], idx) => (
                  <div
                    key={`side-spec-${idx}`}
                    className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 border-b border-[var(--border-soft)] py-2.5 text-[14px]"
                  >
                    <span className="text-[var(--text-muted-strong)]">{specLabels[key] ?? key}</span>
                    <span className="text-[var(--text-secondary)]">{value}</span>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>

        {/* Related products: 4 / 3 / 2 columns */}
        {(relatedLoading || relatedProducts.length > 0) && (
          <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
            <div className="mb-5 flex items-end justify-between gap-4 md:mb-6">
              <div>
                <p className="eyebrow m-0">{PDP_COPY.relatedEyebrow}</p>
                <h2 className="m-0 mt-2 text-[24px] leading-[1.1] font-semibold md:text-[28px]">{PDP_COPY.relatedTitle}</h2>
              </div>
              {product?.categoryId ? (
                <button
                  type="button"
                  onClick={() => router.push(`/categories/${product.categoryId}`)}
                  className="hidden whitespace-nowrap pb-1.5 text-base font-medium md:inline-block"
                  style={{ color: 'var(--accent)', background: 'none', border: 'none', borderBottom: '1px solid currentColor', cursor: 'pointer', padding: 0 }}
                >
                  Xem thêm
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-6">
              {relatedLoading
                ? [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)
                : relatedProducts.map((prod, index) => (
                    <div key={prod.id} className={index === 3 ? 'md:hidden xl:block' : undefined}>
                      <ProductCard product={prod} onOpen={() => router.push(`/products/${prod.id}`)} />
                    </div>
                  ))}
            </div>
          </section>
        )}

        {recentlyViewedProducts.length > 0 && (
          <section className="mt-10 md:mt-14">
            <div className="mb-5 md:mb-6">
              <p className="eyebrow m-0">{PDP_COPY.recentEyebrow}</p>
              <h2 className="m-0 mt-2 text-[24px] leading-[1.1] font-semibold md:text-[28px]">{PDP_COPY.recentTitle}</h2>
            </div>
            <div className="noscroll flex gap-3 overflow-x-auto md:gap-4">
              {recentlyViewedProducts.map((prod) => (
                <div key={prod.id} className="w-[160px] shrink-0 md:w-[200px]">
                  <ProductCard product={prod} compact onOpen={() => router.push(`/products/${prod.id}`)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>

      <BottomActionBar
        totalLabel={PDP_COPY.subtotal}
        totalValue={formatVnd(currentPrice)}
        ctaLabel={PDP_COPY.buyNow}
        onCtaClick={buyNow}
        extraActions={
          <button
            type="button"
            onClick={addToCart}
            className="h-[46px] shrink-0 rounded-[6px] border-[1.5px] border-[var(--accent)] bg-transparent px-3.5 font-body text-[14px] font-semibold whitespace-nowrap text-[var(--accent)]"
          >
            {PDP_COPY.addToCartShort}
          </button>
        }
      />

      <VisitBlock />
      <Footer />
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense>
      <ProductDetailPageInner />
    </Suspense>
  )
}
