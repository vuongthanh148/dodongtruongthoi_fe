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
import { BankTransferPanel, CopyButton } from '@/components/checkout/BankTransferPanel'
import { fetchLivePrices, type CartLinePrice } from '@/lib/cart-prices'
import { getCartItems, clearCart } from '@/lib/storage'
import { createOrder } from '@/lib/storefront-api'
import { formatVnd } from '@/lib/format'
import { CART_COPY, CHECKOUT_COPY, CONFIRM_COPY } from '@/lib/content-data'
import type { CartItem } from '@/lib/types'

type PaymentMethod = 'cod' | 'transfer' | 'showroom'

const PAYMENT_OPTIONS: PaymentMethod[] = ['cod', 'transfer', 'showroom']
const FIELD_CLASS =
  'w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-3 font-body text-[15px] text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-subtle)]'
const LABEL_CLASS = 'mb-1.5 block font-body text-[13px] font-medium text-[var(--text-secondary)]'
const CARD_CLASS = 'rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-5 md:p-6'

function OrderItemsCard({
  items,
  linePrices,
  title,
}: {
  items: CartItem[]
  linePrices: Record<number, CartLinePrice>
  title: string
}) {
  return (
    <section className="flex flex-col gap-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] p-4 md:p-5">
      <h2 className="font-body text-[16px] font-semibold text-[var(--text-primary)]">{title}</h2>
      {items.map((item, index) => {
        const unitPrice = linePrices[index]?.price ?? item.unitPrice
        const meta = [item.sizeLabel, ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : [])]
          .filter(Boolean)
          .join(' · ')
        return (
          <div
            key={`${item.productId}-${item.sizeId ?? ''}-${index}`}
            className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--border-soft)] pb-4 last:border-b-0 last:pb-0"
          >
            <div className="overflow-hidden rounded-[8px] bg-[var(--bg-surface)] p-1.5">
              <ArtPiece
                bg={(item.selectedAttrs?.['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
                frame={(item.selectedAttrs?.['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
                label=""
                pad={3}
                aspect="4/3"
                imgSrc={item.variantImageUrl}
              />
            </div>
            <div className="min-w-0">
              <div className="font-body text-[15px] font-semibold leading-[1.3] text-[var(--text-primary)]">
                {item.productTitle || item.productId}
              </div>
              <div className="mt-0.5 text-[13px] text-[var(--text-muted-strong)]">
                {meta ? `${meta} · ` : ''}x{item.quantity}
              </div>
            </div>
            <span className="price-num text-[15px] tabular-nums">{formatVnd(unitPrice * item.quantity)}</span>
          </div>
        )
      })}
    </section>
  )
}

function TotalsCard({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  return (
    <section className={`${CARD_CLASS} flex flex-col gap-4`}>
      <h2 className="font-body text-[18px] font-semibold text-[var(--text-primary)] xl:text-[20px]">{CART_COPY.summaryTitle}</h2>
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
        <span className="font-body text-[16px] font-semibold text-[var(--text-primary)]">{CART_COPY.total}</span>
        <span className="price-num text-[24px] md:text-[26px]">{formatVnd(subtotal)}</span>
      </div>
      {children}
    </section>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [linePrices, setLinePrices] = useState<Record<number, CartLinePrice>>({})
  const [cartLoaded, setCartLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Returned once by the create response; the backend never returns it again.
  const [lookupCode, setLookupCode] = useState<string | null>(null)

  const [phone, setPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getCartItems())
    setCartLoaded(true)
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    fetchLivePrices(items).then(setLinePrices)
  }, [items])

  useEffect(() => {
    if (cartLoaded && items.length === 0 && !submitted) {
      router.push('/cart')
    }
  }, [router, cartLoaded, items.length, submitted])

  // Live price when available, otherwise the price stored at add-to-cart time.
  // The server prices the order itself; this value is only sent as unitPrice and ignored there.
  const effectivePrice = (item: CartItem, index: number) => linePrices[index]?.price ?? item.unitPrice
  const subtotal = items.reduce((sum, item, i) => sum + effectivePrice(item, i) * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const normalizedPhone = phone.replace(/\D/g, '')
    if (normalizedPhone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 chữ số).')
      setLoading(false)
      return
    }

    try {
      const result = await createOrder({
        phone: normalizedPhone,
        customerName: customerName || undefined,
        address: address || undefined,
        note: note || undefined,
        paymentMethod,
        items: items.map((item, index) => ({
          productId: item.productId,
          productTitle: item.productTitle || item.productId,
          sizeCode: item.sizeId,
          sizeLabel: item.sizeLabel || item.sizeId,
          selectedAttrs: item.selectedAttrs,
          quantity: item.quantity,
          unitPrice: effectivePrice(item, index),
          variantImageUrl: item.variantImageUrl,
        })),
      })

      if (result?.id) {
        clearCart()
        setLookupCode(result.lookup_code)
        setSubmitted(true)
      } else {
        setError('Có lỗi khi đặt hàng. Vui lòng thử lại.')
        setLoading(false)
      }
    } catch {
      setError('Có lỗi khi kết nối. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  const confirmation = (
    <div className="grid gap-6 pt-4 md:pt-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
      <section className="flex min-w-0 flex-col gap-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] md:h-14 md:w-14" aria-hidden="true">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div className="min-w-0">
            <h1 className="font-heading text-[26px] font-semibold leading-[1.15] text-[var(--text-primary)] md:text-[30px] lg:text-[34px] xl:text-[36px]">
              {CONFIRM_COPY.title}
            </h1>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-[var(--text-secondary)]">{CONFIRM_COPY.body(phone)}</p>
          </div>
        </div>

        <div className={`${CARD_CLASS} flex flex-col gap-2`}>
          <div className="text-[14px] text-[var(--text-muted-strong)]">{CONFIRM_COPY.codeLabel}</div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-body text-[28px] font-bold tracking-[0.12em] text-[var(--accent)] tabular-nums md:text-[32px]">
              {lookupCode}
            </span>
            {lookupCode && <CopyButton text={lookupCode} label={CONFIRM_COPY.codeLabel} />}
          </div>
          <p className="text-[13px] leading-[1.5] text-[var(--text-muted-strong)]">{CONFIRM_COPY.codeHint}</p>
        </div>

        {paymentMethod === 'transfer' && <BankTransferPanel mode="confirm" amount={subtotal} memo={lookupCode} />}

        <div className="flex flex-col gap-1.5 rounded-[10px] bg-[var(--bg-surface-alt)] p-5">
          <h2 className="font-body text-[16px] font-semibold text-[var(--text-primary)]">{CONFIRM_COPY.nextTitle}</h2>
          <p className="text-[14px] leading-[1.55] text-[var(--text-secondary)]">{CONFIRM_COPY.nextBody}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="inline-flex h-[50px] flex-1 items-center justify-center rounded-[6px] bg-[var(--accent)] px-[22px] font-body text-[15px] font-semibold text-white no-underline"
          >
            {CONFIRM_COPY.track}
          </Link>
          <Link
            href="/"
            className="inline-flex h-[50px] flex-1 items-center justify-center rounded-[6px] border-[1.5px] border-[var(--accent)] px-[22px] font-body text-[15px] font-semibold text-[var(--accent)] no-underline"
          >
            {CONFIRM_COPY.continueShopping}
          </Link>
        </div>
      </section>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-[92px]">
        <OrderItemsCard items={items} linePrices={linePrices} title={CONFIRM_COPY.itemsTitle} />
        <TotalsCard subtotal={subtotal}>
          <div className="border-t border-[var(--border-soft)] pt-3 text-[13px] text-[var(--text-muted-strong)]">
            {CONFIRM_COPY.paymentLabel}: {CHECKOUT_COPY.methods[paymentMethod].label}
          </div>
        </TotalsCard>
      </aside>
    </div>
  )

  // lg: two columns, form left and items + summary sticky right.
  // md/sm: one column, items card first, form, then summary (the right column dissolves
  // with `contents` so its cards take part in the form's flex order).
  const form = (
    <form
      id="checkout-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 pt-4 md:gap-5 md:pt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10"
    >
      <div className="order-2 flex min-w-0 flex-col gap-4 md:gap-5 lg:order-none">
        <section className={CARD_CLASS}>
          <h2 className="mb-5 font-body text-[18px] font-semibold text-[var(--text-primary)] md:text-[20px]">
            {CHECKOUT_COPY.recipientTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="checkout-name" className={LABEL_CLASS}>
                {CHECKOUT_COPY.nameLabel}
              </label>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={CHECKOUT_COPY.namePlaceholder}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label htmlFor="checkout-phone" className={LABEL_CLASS}>
                {CHECKOUT_COPY.phoneLabel} <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={CHECKOUT_COPY.phonePlaceholder}
                className={FIELD_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="checkout-address" className={LABEL_CLASS}>
                {CHECKOUT_COPY.addressLabel}
              </label>
              <input
                id="checkout-address"
                type="text"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={CHECKOUT_COPY.addressPlaceholder}
                className={FIELD_CLASS}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="checkout-note" className={LABEL_CLASS}>
                {CHECKOUT_COPY.noteLabel}
              </label>
              <textarea
                id="checkout-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={CHECKOUT_COPY.notePlaceholder}
                rows={3}
                className={`${FIELD_CLASS} resize-none rounded-[8px]`}
              />
            </div>
          </div>
        </section>

        <section className={CARD_CLASS}>
          <h2 className="mb-5 font-body text-[18px] font-semibold text-[var(--text-primary)] md:text-[20px]">
            {CHECKOUT_COPY.paymentTitle}
          </h2>
          <div role="radiogroup" aria-label={CHECKOUT_COPY.paymentTitle} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {PAYMENT_OPTIONS.map((id) => {
              const selected = paymentMethod === id
              const option = CHECKOUT_COPY.methods[id]
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex flex-col gap-1 rounded-[8px] p-4 text-left transition-colors ${
                    selected
                      ? 'border-[1.5px] border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]'
                      : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                  }`}
                >
                  <span className="font-body text-[15px] font-semibold">{option.label}</span>
                  <span className="text-[13px] text-[var(--text-muted-strong)]">{option.desc}</span>
                </button>
              )
            })}
          </div>
          {paymentMethod === 'transfer' && (
            <div className="mt-5">
              <BankTransferPanel mode="checkout" amount={subtotal} memo={null} />
            </div>
          )}
        </section>

        {error && (
          <div role="alert" className="rounded-[8px] border border-[var(--accent-subtle)] bg-[var(--accent-subtle)] px-3.5 py-3 text-[14px] text-[var(--accent)]">
            {error}
          </div>
        )}

        <Link href="/cart" className="w-fit font-body text-[15px] italic text-[var(--accent)] no-underline">
          {CHECKOUT_COPY.back}
        </Link>
      </div>

      <div className="contents lg:sticky lg:top-[92px] lg:flex lg:flex-col lg:gap-4">
        <div className="order-1 lg:order-none">
          <OrderItemsCard items={items} linePrices={linePrices} title={CHECKOUT_COPY.itemsTitle} />
        </div>
        <div className="order-3 flex flex-col gap-4 lg:order-none">
          <TotalsCard subtotal={subtotal}>
            {/* Below md the BottomActionBar submits the form */}
            <button
              type="submit"
              disabled={loading}
              className="hidden h-[50px] w-full items-center justify-center rounded-[6px] bg-[var(--accent)] font-body text-[15px] font-semibold text-white md:flex disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? CHECKOUT_COPY.submitting : CHECKOUT_COPY.submit}
            </button>
            <p className="text-[12.5px] leading-[1.5] text-[var(--text-muted-strong)]">{CHECKOUT_COPY.terms}</p>
          </TotalsCard>
          <p className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--bg-surface-alt)] px-4 py-3 text-[13px] leading-[1.55] text-[var(--text-secondary)]">
            {CHECKOUT_COPY.staffNote}
          </p>
        </div>
      </div>
    </form>
  )

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] pb-24 md:pb-0">
      <DeskHeader />
      <TopBar
        title={CHECKOUT_COPY.title}
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: CART_COPY.title, href: '/cart' },
            { label: CHECKOUT_COPY.title },
          ]}
        />
        {submitted ? (
          confirmation
        ) : (
          <>
            <h1 className="mt-4 font-heading text-[26px] font-semibold leading-[1.1] text-[var(--text-primary)] md:mt-6 md:text-[30px] lg:text-[34px] xl:text-[36px]">
              {CHECKOUT_COPY.title}
            </h1>
            {form}
          </>
        )}
      </Container>

      <VisitBlock />

      <div className="flex-1" />
      <Footer />

      {!submitted && items.length > 0 && (
        <BottomActionBar
          totalLabel={CART_COPY.total}
          totalValue={formatVnd(subtotal)}
          ctaLabel={loading ? CHECKOUT_COPY.submitting : CHECKOUT_COPY.submit}
          ctaType="submit"
          ctaForm="checkout-form"
          ctaDisabled={loading}
        />
      )}
    </div>
  )
}
