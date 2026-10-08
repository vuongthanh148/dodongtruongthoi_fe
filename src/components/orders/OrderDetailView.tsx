'use client'

import { useState } from 'react'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { cancelOrder, OrderApiError } from '@/lib/storefront-api'
import { clearStoredOrderToken, maskAddress, maskName, maskPhone } from '@/lib/order-lookup'
import { ORDER_DETAIL_COPY, ORDER_LOOKUP_COPY } from '@/lib/content-data'
import type { Order } from '@/lib/types'
import { ContactActions } from './ContactActions'
import { OrderStatusBadge } from './OrderStatusBadge'
import { OrderStepper } from './OrderStepper'

const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'

const SECTION_CARD = 'rounded-[10px] border p-5 md:p-6'
const SECTION_CARD_STYLE = { background: 'var(--bg-card)', borderColor: 'var(--border)' } as const

// Shown after a successful verify (both the lookup flow and /orders/[id]). Address and phone stay
// partly masked here per the board; the token gates access, the masking is presentation only.
export function OrderDetailView({
  order,
  token,
  onOrderChange,
  onUnauthorized,
}: {
  order: Order
  token: string
  onOrderChange: (order: Order) => void
  onUnauthorized: () => void
}) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const code = order.id.slice(0, 8).toUpperCase()
  const cancelled = order.status === 'cancelled'
  const canCancel = order.status === 'pending_confirm' || order.status === 'confirmed'
  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const date = new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })

  async function handleCancel() {
    setCancelling(true)
    setCancelError('')
    try {
      const updated = await cancelOrder(order.id, token)
      setConfirmingCancel(false)
      onOrderChange(updated)
    } catch (err) {
      if (err instanceof OrderApiError && err.status === 401) {
        // Token rejected for this order: the parent drops it and asks for the code again.
        clearStoredOrderToken(order.id)
        setConfirmingCancel(false)
        onUnauthorized()
        return
      }
      setCancelError(
        err instanceof OrderApiError && err.status === 409
          ? ORDER_DETAIL_COPY.cancelNotAllowed
          : ORDER_DETAIL_COPY.cancelFailed
      )
    } finally {
      setCancelling(false)
    }
  }

  const banner = cancelled
    ? { title: ORDER_DETAIL_COPY.cancelledTitle, body: ORDER_DETAIL_COPY.cancelledBody }
    : { title: ORDER_DETAIL_COPY.bannerTitles[order.status], body: ORDER_DETAIL_COPY.bannerBodies[order.status] }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-[28px] font-medium leading-[1.1] tabular-nums md:text-[32px] lg:text-[34px]" style={{ color: 'var(--text-primary)' }}>
            {ORDER_DETAIL_COPY.orderPrefix} {code}
          </h1>
          <div className="mt-1 text-[14px]" style={{ color: 'var(--text-muted)' }}>
            {ORDER_DETAIL_COPY.placedOn(date)}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex max-w-fit items-center gap-2.5 rounded-md px-3.5 py-2 text-[14px]" style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)' }}>
        ✓ {ORDER_LOOKUP_COPY.verifiedBanner}
      </div>

      <div className="flex gap-3.5 rounded-[10px] border p-4" style={{ background: cancelled ? 'var(--accent-subtle)' : 'var(--bg-card)', borderColor: cancelled ? 'var(--accent)' : 'var(--border)' }}>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {banner.title}
          </div>
          <div className="mt-1 text-[14px] leading-[1.55]" style={{ color: 'var(--text-secondary)' }}>
            {banner.body}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
        <div className="flex flex-col gap-5">
          {!cancelled ? (
            <section className={SECTION_CARD} style={SECTION_CARD_STYLE}>
              <h2 className="mb-5 text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {ORDER_DETAIL_COPY.progressTitle}
              </h2>
              <OrderStepper status={order.status} />
            </section>
          ) : null}

          <section className={SECTION_CARD} style={SECTION_CARD_STYLE}>
            <h2 className="mb-4 text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {ORDER_DETAIL_COPY.itemsTitle}
            </h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item, index) => {
                const options = [item.sizeLabel, ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : [])].filter(Boolean)
                return (
                  <div key={index} className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-3.5 border-t pt-4 first:border-t-0 first:pt-0 md:grid-cols-[120px_minmax(0,1fr)_auto]" style={{ borderColor: 'var(--border-soft)' }}>
                    <div className="overflow-hidden rounded-lg">
                      {/* Placeholder art shows no caption (ArtPiece caption is 9px); the title is alt text for real images. */}
                      <ArtPiece pad={4} aspect="4/3" label={item.variantImageUrl ? item.productTitle : ''} imgSrc={item.variantImageUrl ?? null} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-body text-[16px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {item.productTitle}
                      </div>
                      <div className="mt-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        {[...options, `×${item.quantity}`].join(' · ')}
                      </div>
                    </div>
                    <span className="price-num whitespace-nowrap text-[15px]">{fmtVND(item.unitPrice * item.quantity)}</span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-[92px]">
          <section className={SECTION_CARD} style={SECTION_CARD_STYLE}>
            <h2 className="mb-4 text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {ORDER_DETAIL_COPY.paymentTitle}
            </h2>
            <div className="flex justify-between py-1.5 text-[14px]">
              <span style={{ color: 'var(--text-muted)' }}>{ORDER_DETAIL_COPY.subtotal}</span>
              <span className="font-body tabular-nums" style={{ color: 'var(--text-primary)' }}>{fmtVND(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[14px]">
              <span style={{ color: 'var(--text-muted)' }}>{ORDER_DETAIL_COPY.shipping}</span>
              <span style={{ color: 'var(--text-primary)' }}>{ORDER_DETAIL_COPY.shippingFree}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[14px]">
              <span style={{ color: 'var(--text-muted)' }}>{ORDER_DETAIL_COPY.paymentMethod}</span>
              <span style={{ color: 'var(--text-primary)' }}>{ORDER_DETAIL_COPY.paymentCod}</span>
            </div>
            <div className="dongson-rule my-3" />
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ORDER_DETAIL_COPY.total}</span>
              <span className="price-num text-[24px]">{fmtVND(order.totalAmount)}</span>
            </div>
          </section>

          <section className={SECTION_CARD} style={SECTION_CARD_STYLE}>
            <h2 className="mb-3 text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {ORDER_DETAIL_COPY.deliveryTitle}
            </h2>
            <div className="text-[15px] leading-[1.65]" style={{ color: 'var(--text-primary)' }}>
              {order.customerName ? maskName(order.customerName) : ORDER_DETAIL_COPY.customerFallback} · {maskPhone(order.phone)}
              <br />
              {order.address ? maskAddress(order.address) : ORDER_DETAIL_COPY.noAddress}
            </div>
            {order.note ? (
              <div className="mt-2 text-[13px] italic" style={{ color: 'var(--text-muted)' }}>
                {order.note}
              </div>
            ) : null}
            <div className="mt-3 text-[13px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
              {ORDER_DETAIL_COPY.maskedNote}
            </div>
          </section>

          <div>
            <div className="mb-2.5 text-[14px]" style={{ color: 'var(--text-muted-strong)' }}>
              {ORDER_DETAIL_COPY.contactOrder}
            </div>
            <ContactActions />
          </div>

          {canCancel && !confirmingCancel ? (
            <button
              type="button"
              onClick={() => {
                setCancelError('')
                setConfirmingCancel(true)
              }}
              className="h-12 rounded-md border-[1.5px] text-[15px] font-semibold"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'transparent' }}
            >
              {ORDER_DETAIL_COPY.cancelOrder}
            </button>
          ) : null}

          {canCancel && confirmingCancel ? (
            <div className={`${SECTION_CARD} flex flex-col gap-3.5`} style={SECTION_CARD_STYLE}>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {ORDER_DETAIL_COPY.cancelConfirm}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCancelError('')
                    setConfirmingCancel(false)
                  }}
                  disabled={cancelling}
                  className="h-12 rounded-md border-[1.5px] text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'transparent' }}
                >
                  {ORDER_DETAIL_COPY.cancelKeep}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="h-12 rounded-md border-[1.5px] text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ borderColor: 'var(--accent)', color: 'var(--primitive-white)', background: 'var(--accent)' }}
                >
                  {cancelling ? ORDER_DETAIL_COPY.cancelling : ORDER_DETAIL_COPY.cancelYes}
                </button>
              </div>
            </div>
          ) : null}

          {cancelError ? (
            <div role="alert" className="text-[14px]" style={{ color: 'var(--accent)' }}>
              {cancelError}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
