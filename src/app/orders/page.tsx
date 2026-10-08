'use client'

import { useCallback, useEffect, useState } from 'react'
import { LookupLockedPanel } from '@/components/orders/LookupLockedPanel'
import { LookupOfflineNotice } from '@/components/orders/LookupOfflineNotice'
import { LookupVerifyPanel, type VerifyFeedback } from '@/components/orders/LookupVerifyPanel'
import { OrderDetailView } from '@/components/orders/OrderDetailView'
import { OrderPageShell } from '@/components/orders/OrderPageShell'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { IconBox, IconPhone } from '@/components/icons'
import { HOTLINE, HOTLINE_TEL } from '@/lib/constants'
import { ORDER_LOOKUP_COPY } from '@/lib/content-data'
import {
  clearStoredOrderToken,
  maskOrderCode,
  maskPhone,
  readStoredLock,
  writeStoredLock,
  writeStoredOrderToken,
} from '@/lib/order-lookup'
import { fetchOrderDetail, getOrdersByPhone, verifyOrderLookup } from '@/lib/storefront-api'
import type { Order, OrderSummary } from '@/lib/types'

type Step = 'phone' | 'list' | 'verify' | 'locked' | 'detail'

const STEP_LABELS = ['Số điện thoại', 'Chọn đơn', 'Xác minh', 'Chi tiết']
const STEP_INDEX: Record<Step, number> = { phone: 0, list: 1, verify: 2, locked: 2, detail: 3 }
const HOTLINE_DISPLAY = HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
const COLS = 'minmax(0,1fr) 110px minmax(0,2fr) 150px 120px'

// Board: phone → list (masked) → verify (code) → locked | detail (partly masked). Every decision
// (wrong code, lock, token) comes from the server; the client only displays it.
export default function OrdersPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phoneInput, setPhoneInput] = useState('')
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [selected, setSelected] = useState<OrderSummary | null>(null)
  const [busy, setBusy] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [offlineRetry, setOfflineRetry] = useState<(() => Promise<void>) | null>(null)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [verifyFeedback, setVerifyFeedback] = useState<VerifyFeedback>(null)
  const [verifyNotice, setVerifyNotice] = useState('')
  const [session, setSession] = useState<{ token: string; expiresAt: number } | null>(null)
  const [detail, setDetail] = useState<Order | null>(null)

  // Verified session ends at the server's expires_at: drop the detail and ask for the code again.
  useEffect(() => {
    if (!session) return
    const t = setTimeout(
      () => {
        setSession(null)
        setDetail(null)
        setVerifyFeedback(null)
        setVerifyNotice(ORDER_LOOKUP_COPY.sessionEnded)
        setStep((s) => (s === 'detail' ? 'verify' : s))
      },
      Math.max(0, session.expiresAt - Date.now())
    )
    return () => clearTimeout(t)
  }, [session])

  const handleLockExpired = useCallback(() => {
    setLockedUntil(null)
    setVerifyNotice(ORDER_LOOKUP_COPY.lockEnded)
    setVerifyFeedback(null)
    setStep((s) => (s === 'locked' ? 'verify' : s))
  }, [])

  async function lookupPhone(normalized: string) {
    setBusy(true)
    setPhoneError('')
    const result = await getOrdersByPhone(normalized)
    setBusy(false)
    if (result.kind === 'offline') {
      setOfflineRetry(() => () => lookupPhone(normalized))
      return
    }
    setOfflineRetry(null)
    if (result.kind === 'error') {
      setPhoneError(ORDER_LOOKUP_COPY.requestFailed)
      return
    }
    setPhone(normalized)
    setOrders(result.orders)
    setSession(null)
    setDetail(null)
    setVerifyFeedback(null)
    setVerifyNotice('')
    // A lock set earlier in this browser session still applies to this phone.
    setLockedUntil(readStoredLock(normalized))
    setStep('list')
  }

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    const normalized = phoneInput.replace(/\D/g, '')
    if (normalized.length < 9) {
      setPhoneError(ORDER_LOOKUP_COPY.phoneInvalid)
      return
    }
    void lookupPhone(normalized)
  }

  function openVerify(order: OrderSummary) {
    setSelected(order)
    setVerifyFeedback(null)
    setVerifyNotice('')
    setOfflineRetry(null)
    // Only a lock still in the future keeps the lock screen; an expired one returns to the code step.
    setStep(lockedUntil !== null && lockedUntil > Date.now() ? 'locked' : 'verify')
  }

  async function openDetail(orderId: string, token: string, expiresAt: number) {
    setBusy(true)
    const result = await fetchOrderDetail(orderId, token)
    setBusy(false)
    if (result.kind === 'offline') {
      setOfflineRetry(() => () => openDetail(orderId, token, expiresAt))
      return
    }
    setOfflineRetry(null)
    if (result.kind === 'ok') {
      setSession({ token, expiresAt })
      setDetail(result.order)
      setVerifyFeedback(null)
      setStep('detail')
      return
    }
    clearStoredOrderToken(orderId)
    setVerifyFeedback({
      message: result.kind === 'unauthorized' ? ORDER_LOOKUP_COPY.sessionInvalid : ORDER_LOOKUP_COPY.detailError,
      remaining: null,
      key: Date.now(),
    })
  }

  async function submitVerify(code: string) {
    if (!selected) return
    setBusy(true)
    setVerifyFeedback(null)
    setVerifyNotice('')
    const result = await verifyOrderLookup(phone, code)
    setBusy(false)
    if (result.kind === 'offline') {
      setOfflineRetry(() => () => submitVerify(code))
      return
    }
    setOfflineRetry(null)
    if (result.kind === 'invalid') {
      setVerifyFeedback({ message: ORDER_LOOKUP_COPY.wrongCode, remaining: result.remainingAttempts, key: Date.now() })
      return
    }
    if (result.kind === 'locked') {
      if (result.lockedUntil !== null) writeStoredLock(phone, result.lockedUntil)
      setLockedUntil(result.lockedUntil)
      setStep('locked')
      return
    }
    if (result.kind === 'error') {
      setVerifyFeedback({ message: ORDER_LOOKUP_COPY.verifyError, remaining: null, key: Date.now() })
      return
    }
    // The token is bound to the order the server verified. If it is not the row the user chose, do not show it.
    if (result.orderId !== selected.id) {
      setVerifyFeedback({ message: ORDER_LOOKUP_COPY.wrongCode, remaining: null, key: Date.now() })
      return
    }
    writeStoredOrderToken(result.orderId, { token: result.token, expiresAt: result.expiresAt })
    await openDetail(result.orderId, result.token, result.expiresAt)
  }

  function backToPhone() {
    setStep('phone')
    setPhoneInput('')
    setOrders([])
    setSession(null)
    setDetail(null)
    setLockedUntil(null)
    setOfflineRetry(null)
  }

  const stepIndex = STEP_INDEX[step]
  const offlineNotice = offlineRetry ? <LookupOfflineNotice onRetry={() => offlineRetry()} /> : null

  return (
    <OrderPageShell topBarTitle="Tra Cứu Đơn Hàng" crumbs={[{ label: 'Tra cứu đơn hàng' }]}>
      <div className="pt-2 md:pt-4">
        <h1 className="font-heading text-[28px] font-medium leading-[1.1] md:text-[34px] xl:text-[36px]" style={{ color: 'var(--text-primary)' }}>
          {ORDER_LOOKUP_COPY.title}
        </h1>
        {step === 'phone' ? (
          <p className="mt-2 text-[15px]" style={{ color: 'var(--text-muted)' }}>
            {ORDER_LOOKUP_COPY.sub}
          </p>
        ) : null}

        <ol className="mb-6 mt-5 hidden flex-wrap items-center gap-2 md:flex" aria-label="Các bước tra cứu">
          {STEP_LABELS.map((label, i) => (
            <li key={label} className="flex items-center gap-2" aria-current={i === stepIndex ? 'step' : undefined}>
              {i > 0 ? <span className="h-px w-5" style={{ background: 'var(--border)' }} /> : null}
              <span className="flex items-center gap-1.5 text-[13px]" style={{ color: i <= stepIndex ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === stepIndex ? 600 : 400 }}>
                <span
                  className="grid h-5 w-5 place-items-center rounded-full text-[12px]"
                  style={{
                    background: i < stepIndex ? 'var(--accent)' : i === stepIndex ? 'var(--accent-subtle)' : 'var(--bg-surface-alt)',
                    color: i < stepIndex ? 'var(--primitive-white)' : i === stepIndex ? 'var(--accent)' : 'var(--text-muted)',
                    border: i === stepIndex ? '1px solid var(--accent)' : 'none',
                  }}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </span>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div key={step} className="lk-in">
        {step === 'phone' && (
          <div className="flex max-w-[560px] flex-col gap-4">
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-2.5 sm:flex-row">
              <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                {ORDER_LOOKUP_COPY.phoneLabel}
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value)
                    setPhoneError('')
                  }}
                  placeholder={ORDER_LOOKUP_COPY.phonePlaceholder}
                  autoFocus
                  className="brand-focus h-12 w-full rounded-md border px-4 text-[15px] outline-none"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="h-12 rounded-md px-6 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-45 sm:min-w-[140px]"
                style={{ background: 'var(--accent)', color: 'var(--primitive-white)' }}
              >
                {ORDER_LOOKUP_COPY.phoneSubmit}
              </button>
            </form>
            <div className="flex items-center gap-4 text-[14px]">
              <button type="button" onClick={() => setPhoneInput('0899 012 288')} className="underline" style={{ color: 'var(--accent)', background: 'none', border: 'none', padding: 0 }}>
                {ORDER_LOOKUP_COPY.sample}
              </button>
            </div>
            {phoneError ? (
              <div role="alert" className="rounded-md px-3.5 py-2.5 text-[14px]" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                {phoneError}
              </div>
            ) : null}
            {offlineNotice}
            <div className="flex gap-2 text-[14px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
              <IconBox size={16} color="var(--bronze)" />
              <span>{ORDER_LOOKUP_COPY.phoneNote}</span>
            </div>
          </div>
        )}

        {step === 'list' && (
          <div className="max-w-[960px]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[14px]" style={{ color: 'var(--text-muted)' }}>
              <span>
                {ORDER_LOOKUP_COPY.listCount(orders.length)} <b className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{maskPhone(phone)}</b>
              </span>
              <button type="button" onClick={backToPhone} className="text-[14px]" style={{ color: 'var(--accent)', background: 'none', border: 'none', padding: 0 }}>
                {ORDER_LOOKUP_COPY.changePhone}
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-[10px] border px-5 py-12 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="font-heading text-[22px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {ORDER_LOOKUP_COPY.emptyTitle}
                </div>
                <div className="mx-auto mt-2 max-w-[460px] text-[15px] leading-[1.6]" style={{ color: 'var(--text-muted)' }}>
                  {ORDER_LOOKUP_COPY.emptyBody}
                </div>
                <a href={HOTLINE_TEL} className="mt-4 inline-flex items-center gap-2 text-[18px] font-bold tabular-nums no-underline" style={{ color: 'var(--accent)' }}>
                  <IconPhone size={18} color="var(--accent)" /> {HOTLINE_DISPLAY}
                </a>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[10px] border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="hidden gap-5 border-b px-6 py-3.5 text-[12px] font-medium md:grid" style={{ gridTemplateColumns: COLS, borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <span>{ORDER_LOOKUP_COPY.listColCode}</span>
                  <span>{ORDER_LOOKUP_COPY.listColDate}</span>
                  <span>{ORDER_LOOKUP_COPY.listColItems}</span>
                  <span>{ORDER_LOOKUP_COPY.listColStatus}</span>
                  <span />
                </div>
                {orders.map((order) => {
                  const names = order.items.map((i) => i.productTitle).join(', ')
                  const dateLabel = new Date(order.createdAt).toLocaleDateString('vi-VN')
                  return (
                    <div key={order.id}>
                      <div className="flex flex-col gap-2 border-b p-4 md:hidden" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold tabular-nums">{maskOrderCode(order.id)}</div>
                            <div className="mt-0.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>{dateLabel}</div>
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{names}</div>
                        <button type="button" onClick={() => openVerify(order)} className="self-end text-[14px] font-medium" style={{ color: 'var(--accent)', background: 'none', border: 'none' }}>
                          {ORDER_LOOKUP_COPY.viewDetail}
                        </button>
                      </div>
                      <div className="hidden items-center gap-5 border-b px-6 py-4 text-[14px] md:grid" style={{ gridTemplateColumns: COLS, borderColor: 'var(--border-soft)' }}>
                        <span className="font-semibold tabular-nums">{maskOrderCode(order.id)}</span>
                        <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{dateLabel}</span>
                        <span className="truncate">{names}</span>
                        <OrderStatusBadge status={order.status} />
                        <button type="button" onClick={() => openVerify(order)} className="justify-self-end whitespace-nowrap text-[14px] font-medium" style={{ color: 'var(--accent)', background: 'none', border: 'none' }}>
                          {ORDER_LOOKUP_COPY.viewDetail}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>
              {ORDER_LOOKUP_COPY.listMaskedNote}
            </div>
          </div>
        )}

        {step === 'verify' && selected && (
          <div className="flex max-w-[560px] flex-col gap-4">
            {verifyNotice ? (
              <div className="rounded-md px-3.5 py-2.5 text-[14px]" style={{ background: 'var(--bg-surface-alt)', color: 'var(--text-secondary)' }}>
                {verifyNotice}
              </div>
            ) : null}
            {offlineNotice}
            <LookupVerifyPanel
              title={ORDER_LOOKUP_COPY.verifyTitle(maskOrderCode(selected.id))}
              askPhone={false}
              knownPhone={phone}
              busy={busy}
              feedback={verifyFeedback}
              onSubmit={(_phone, code) => void submitVerify(code)}
              footer={
                <>
                  <button type="button" onClick={() => setStep('list')} className="text-[14px]" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', padding: 0 }}>
                    {ORDER_LOOKUP_COPY.backToList}
                  </button>
                  <a href={HOTLINE_TEL} className="text-[14px] no-underline" style={{ color: 'var(--accent)' }}>
                    {ORDER_LOOKUP_COPY.forgotCode(HOTLINE_DISPLAY)}
                  </a>
                </>
              }
            />
          </div>
        )}

        {step === 'locked' && (
          <div className="flex max-w-[560px] flex-col gap-4">
            <LookupLockedPanel lockedUntil={lockedUntil} onExpired={handleLockExpired} />
            <button type="button" onClick={() => setStep('list')} className="self-start text-[14px]" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', padding: 0 }}>
              {ORDER_LOOKUP_COPY.backToList}
            </button>
          </div>
        )}

        {step === 'detail' && detail && session && (
          <div className="flex flex-col gap-5">
            <OrderDetailView
              order={detail}
              token={session.token}
              onOrderChange={setDetail}
              onUnauthorized={() => {
                clearStoredOrderToken(detail.id)
                setSession(null)
                setDetail(null)
                setVerifyFeedback({ message: ORDER_LOOKUP_COPY.sessionInvalid, remaining: null, key: Date.now() })
                setStep('verify')
              }}
            />
            <button
              type="button"
              onClick={() => {
                setSession(null)
                setDetail(null)
                setStep('list')
              }}
              className="self-start text-[14px]"
              style={{ color: 'var(--accent)', background: 'none', border: 'none', padding: 0 }}
            >
              {ORDER_LOOKUP_COPY.back}
            </button>
          </div>
        )}
      </div>
    </OrderPageShell>
  )
}
