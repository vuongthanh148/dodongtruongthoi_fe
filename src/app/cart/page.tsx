'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { BottomActionBar } from '@/components/ui/BottomActionBar'
import { getCartItems, removeCartItem, setCartItems } from '@/lib/storage'
import { dropLinePrice, fetchLivePrices, type CartLinePrice } from '@/lib/cart-prices'
import { campaignEndLine } from '@/lib/campaign-price'
import { formatVnd } from '@/lib/format'
import { CART_COPY } from '@/lib/content-data'
import type { CartItem } from '@/lib/types'

const CTA_LINK_CLASS =
  'inline-flex h-[50px] w-full items-center justify-center rounded-[6px] bg-[var(--accent)] px-5 font-body text-[15px] font-semibold text-white no-underline'

function QtyStepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const btn =
    'flex h-8 w-8 items-center justify-center text-[16px] text-[var(--text-primary)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="inline-flex items-center overflow-hidden rounded-[6px] border border-[var(--border)]">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={CART_COPY.decrease}>
        −
      </button>
      <span className="w-9 text-center font-body text-[15px] font-semibold tabular-nums text-[var(--text-primary)]" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} aria-label={CART_COPY.increase}>
        +
      </button>
    </div>
  )
}

interface CartLineProps {
  item: CartItem
  index: number
  line: CartLinePrice | undefined
  onRemove: () => void
  onQuantity: (next: number) => void
}

function CartLine({ item, line, onRemove, onQuantity }: CartLineProps) {
  const campaign = line?.campaign ?? null
  const unitPrice = line?.price ?? item.unitPrice
  const lineTotal = unitPrice * item.quantity
  // Stored at add-to-cart time on sale, and the campaign has since ended: show the list price.
  const expired = !!line && !campaign && item.unitPrice < line.listPrice
  const endLine = campaign ? campaignEndLine(campaign) : null
  const attrs = item.selectedAttrs ? Object.values(item.selectedAttrs) : []
  const meta = [item.sizeLabel, ...attrs].filter(Boolean).join(' · ')
  const title = item.productTitle || item.productId
  const art = (pad: number) => (
    <ArtPiece
      bg={(item.selectedAttrs?.['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
      frame={(item.selectedAttrs?.['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
      label=""
      pad={pad}
      aspect="4/3"
      imgSrc={item.variantImageUrl}
    />
  )

  const priceBlock = (
    <div className="flex flex-col items-end gap-1 text-right">
      {campaign && line && (
        <div className="flex items-center gap-2">
          <s className="text-[13px] tabular-nums text-[var(--text-muted-strong)]">{formatVnd(line.listPrice * item.quantity)}</s>
          <span className="inline-flex h-6 items-center rounded-[4px] bg-[var(--accent)] px-1.5 font-body text-[13px] font-bold text-white tabular-nums">
            −{line.percent}%
          </span>
        </div>
      )}
      <span className="price-num text-[16px] md:text-[18px]">{formatVnd(lineTotal)}</span>
    </div>
  )

  const notices = (
    <>
      {expired && (
        <p role="status" className="rounded-[6px] bg-[var(--bg-surface-alt)] px-3 py-2 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
          {CART_COPY.endedNotice}
        </p>
      )}
      {endLine?.soon && (
        <p className="text-[13px] font-semibold text-[var(--accent)]">{endLine.text}</p>
      )}
      {campaign && !endLine?.soon && <p className="text-[13px] text-[var(--text-muted-strong)]">{campaign.name}</p>}
    </>
  )

  return (
    <>
      {/* Mobile and tablet: item card */}
      <div className="flex flex-col gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-4 lg:hidden md:p-5">
        <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-3.5 md:grid-cols-[96px_minmax(0,1fr)] md:gap-4">
          <div className="overflow-hidden rounded-[8px] bg-[var(--bg-surface)] p-1.5">{art(4)}</div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 font-body text-[15px] font-semibold leading-[1.3] text-[var(--text-primary)]">{title}</div>
              <button
                type="button"
                onClick={onRemove}
                aria-label={CART_COPY.remove}
                className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-[20px] leading-none text-[var(--text-muted-strong)] hover:text-[var(--accent)]"
              >
                ×
              </button>
            </div>
            {meta && <div className="text-[13px] leading-[1.4] text-[var(--text-muted-strong)]">{meta}</div>}
            <Link href={`/products/${item.productId}`} className="text-[13px] text-[var(--accent)] no-underline">
              {CART_COPY.changeOptions}
            </Link>
            {notices}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <QtyStepper value={item.quantity} onChange={onQuantity} />
          {priceBlock}
        </div>
      </div>

      {/* Desktop: table row */}
      <div className="hidden items-center gap-5 border-b border-[var(--border-soft)] px-6 py-6 last:border-b-0 lg:grid lg:grid-cols-[minmax(0,1fr)_120px_130px_28px] xl:grid-cols-[minmax(0,1fr)_140px_150px_40px]">
        <div className="flex min-w-0 items-center gap-[18px]">
          <div className="w-[120px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--bg-surface)] p-1.5">{art(5)}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="font-body text-[18px] font-semibold leading-[1.25] text-[var(--text-primary)]">{title}</div>
            {meta && <div className="text-[13px] text-[var(--text-muted-strong)]">{meta}</div>}
            <Link href={`/products/${item.productId}`} className="w-fit text-[13px] text-[var(--accent)] no-underline">
              {CART_COPY.changeOptions}
            </Link>
            {notices}
          </div>
        </div>
        <QtyStepper value={item.quantity} onChange={onQuantity} />
        <div className="flex justify-end">{priceBlock}</div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={CART_COPY.remove}
          className="flex h-7 w-7 items-center justify-center text-[22px] leading-none text-[var(--text-muted-strong)] hover:text-[var(--accent)]"
        >
          ×
        </button>
      </div>
    </>
  )
}

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [linePrices, setLinePrices] = useState<Record<number, CartLinePrice>>({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const stored = getCartItems()
    fetchLivePrices(stored).then(setLinePrices)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(stored)
    setLoaded(true)
  }, [])

  const handleRemove = (index: number) => {
    removeCartItem(index)
    setItems(getCartItems())
    setLinePrices((prev) => dropLinePrice(prev, index))
  }

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return
    const updated = [...items]
    updated[index] = { ...updated[index], quantity: newQty }
    setCartItems(updated)
    setItems(updated)
  }

  const linePrice = (item: CartItem, index: number) => linePrices[index]?.price ?? item.unitPrice
  const subtotal = items.reduce((sum, item, i) => sum + linePrice(item, i) * item.quantity, 0)

  const emptyState = (
    <div className="flex flex-col items-center px-6 py-16 text-center md:py-20">
      <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.2" className="mb-4" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
      <h1 className="font-heading text-[26px] font-semibold leading-[1.15] text-[var(--text-primary)] md:text-[30px]">{CART_COPY.emptyTitle}</h1>
      <p className="mb-6 mt-2.5 max-w-[420px] text-[15px] leading-[1.6] text-[var(--text-muted-strong)]">{CART_COPY.emptyBody}</p>
      <Link
        href="/"
        className="inline-flex h-[50px] items-center justify-center rounded-[6px] bg-[var(--accent)] px-[22px] font-body text-[15px] font-semibold text-white no-underline"
      >
        {CART_COPY.emptyCta}
      </Link>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] pb-24 md:pb-0">
      <DeskHeader />
      <TopBar
        title={CART_COPY.title}
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Container>
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: CART_COPY.title }]} />

        {!loaded ? null : items.length === 0 ? (
          emptyState
        ) : (
          <>
            <h1 className="mb-5 mt-4 font-heading text-[26px] font-semibold leading-[1.1] text-[var(--text-primary)] md:mb-6 md:mt-6 md:text-[30px] lg:mb-7 lg:text-[34px] xl:mb-8 xl:text-[36px]">
              {CART_COPY.title}{' '}
              <span className="font-body text-[15px] font-normal text-[var(--text-muted-strong)] md:text-[18px]">
                ({items.length} {CART_COPY.countSuffix})
              </span>
            </h1>

            <div className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
              <section
                aria-label={CART_COPY.listLabel}
                className="flex min-w-0 flex-col gap-3 md:gap-4 lg:gap-0 lg:overflow-hidden lg:rounded-[10px] lg:border lg:border-[var(--border)] lg:bg-[var(--bg-card)]"
              >
                <div className="label-mono hidden border-b border-[var(--border)] px-6 py-3.5 text-[var(--text-muted-strong)] lg:grid lg:grid-cols-[minmax(0,1fr)_120px_130px_28px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_140px_150px_40px]">
                  <span>{CART_COPY.colProduct}</span>
                  <span>{CART_COPY.colQty}</span>
                  <span className="text-right">{CART_COPY.colTotal}</span>
                  <span />
                </div>

                {items.map((item, index) => (
                  <CartLine
                    key={`${item.productId}-${item.sizeId ?? ''}-${index}`}
                    item={item}
                    index={index}
                    line={linePrices[index]}
                    onRemove={() => handleRemove(index)}
                    onQuantity={(next) => handleUpdateQuantity(index, next)}
                  />
                ))}

                <Link
                  href="/"
                  className="block px-1 py-3 font-body text-[15px] italic text-[var(--accent)] no-underline lg:px-6 lg:py-[18px]"
                >
                  {CART_COPY.continueShopping}
                </Link>
              </section>

              <aside className="lg:sticky lg:top-[92px]">
                <div className="flex flex-col gap-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] md:p-6 xl:p-7">
                  <h2 className="font-body text-[18px] font-semibold xl:text-[20px]">{CART_COPY.summaryTitle}</h2>
                  <dl className="flex flex-col gap-2.5 text-[14px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--text-muted-strong)]">{CART_COPY.subtotal}</dt>
                      <dd className="tabular-nums">{formatVnd(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--text-muted-strong)]">{CART_COPY.shipping}</dt>
                      <dd>{CART_COPY.shippingValue}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--text-muted-strong)]">{CART_COPY.installation}</dt>
                      <dd className="text-right">{CART_COPY.installationValue}</dd>
                    </div>
                  </dl>
                  <div className="h-px bg-[var(--border-soft)]" />
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-body text-[16px] font-semibold">{CART_COPY.total}</span>
                    <span className="price-num text-[24px] md:text-[26px]">{formatVnd(subtotal)}</span>
                  </div>
                  {/* Below md the BottomActionBar carries the CTA */}
                  <div className="hidden md:block">
                    <Link href="/checkout" className={CTA_LINK_CLASS}>
                      {CART_COPY.checkout}
                    </Link>
                  </div>
                  <p className="border-t border-[var(--border-soft)] pt-3 text-[13px] leading-[1.5] text-[var(--text-muted-strong)]">
                    {CART_COPY.staffNote}
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </Container>

      <VisitBlock />

      <div className="flex-1" />
      <Footer />

      {loaded && items.length > 0 && (
        <BottomActionBar
          totalLabel={CART_COPY.total}
          totalValue={formatVnd(subtotal)}
          ctaLabel={CART_COPY.checkout}
          ctaHref="/checkout"
        />
      )}
    </div>
  )
}
