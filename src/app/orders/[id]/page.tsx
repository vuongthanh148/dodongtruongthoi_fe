'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { LookupLockedPanel } from '@/components/orders/LookupLockedPanel'
import { LookupOfflineNotice } from '@/components/orders/LookupOfflineNotice'
import { LookupVerifyPanel, type VerifyFeedback } from '@/components/orders/LookupVerifyPanel'
import { OrderDetailView } from '@/components/orders/OrderDetailView'
import { OrderPageShell } from '@/components/orders/OrderPageShell'
import { HOTLINE, HOTLINE_TEL } from '@/lib/constants'
import { ORDER_DETAIL_COPY, ORDER_LOOKUP_COPY } from '@/lib/content-data'
import {
  clearStoredOrderToken,
  readStoredLock,
  readStoredOrderToken,
  writeStoredLock,
  writeStoredOrderToken,
} from '@/lib/order-lookup'
import { fetchOrderDetail, verifyOrderLookup } from '@/lib/storefront-api'
import type { Order } from '@/lib/types'

type Phase = 'loading' | 'verify' | 'locked' | 'ready' | 'offline' | 'error'
type Session = { token: string; expiresAt: number }

const HOTLINE_DISPLAY = HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')

// Direct link to /orders/{id}. The page never shows order data without a token bound to this order.
export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const orderId = params.id

  const [phase, setPhase] = useState<Phase>('loading')
  const [order, setOrder] = useState<Order | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [restoreKey, setRestoreKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<VerifyFeedback>(null)
  const [notice, setNotice] = useState('')
  const [offlineRetry, setOfflineRetry] = useState<(() => Promise<void>) | null>(null)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  // Restore a stored token for this order (same browser session) if the server still accepts it.
  useEffect(() => {
    let active = true
    void (async () => {
      const stored = readStoredOrderToken(orderId)
      if (!stored) {
        if (active) setPhase('verify')
        return
      }
      const result = await fetchOrderDetail(orderId, stored.token)
      if (!active) return
      if (result.kind === 'ok') {
        setOrder(result.order)
        setSession({ token: stored.token, expiresAt: stored.expiresAt })
        setPhase('ready')
      } else if (result.kind === 'unauthorized') {
        clearStoredOrderToken(orderId)
        setPhase('verify')
      } else if (result.kind === 'offline') {
        setPhase('offline')
      } else {
        setPhase('error')
      }
    })()
    return () => {
      active = false
    }
  }, [orderId, restoreKey])

  // The verified session ends at the server's expires_at: drop the order and ask for the code again.
  useEffect(() => {
    if (!session) return
    const t = setTimeout(
      () => {
        clearStoredOrderToken(orderId)
        setSession(null)
        setOrder(null)
        setFeedback(null)
        setNotice(ORDER_LOOKUP_COPY.sessionEnded)
        setPhase('verify')
      },
      Math.max(0, session.expiresAt - Date.now())
    )
    return () => clearTimeout(t)
  }, [session, orderId])

  const handleLockExpired = useCallback(() => {
    setLockedUntil(null)
    setNotice(ORDER_LOOKUP_COPY.lockEnded)
    setFeedback(null)
    setPhase('verify')
  }, [])

  async function loadDetail(token: string, expiresAt: number) {
    setBusy(true)
    const result = await fetchOrderDetail(orderId, token)
    setBusy(false)
    if (result.kind === 'offline') {
      setOfflineRetry(() => () => loadDetail(token, expiresAt))
      return
    }
    setOfflineRetry(null)
    if (result.kind === 'ok') {
      setOrder(result.order)
      setSession({ token, expiresAt })
      setFeedback(null)
      setPhase('ready')
      return
    }
    clearStoredOrderToken(orderId)
    setFeedback({
      message: result.kind === 'unauthorized' ? ORDER_LOOKUP_COPY.sessionInvalid : ORDER_LOOKUP_COPY.detailError,
      remaining: null,
      key: Date.now(),
    })
  }

  async function submitVerify(phone: string, code: string) {
    // A lock set earlier in this browser session still applies to this phone.
    const storedLock = readStoredLock(phone)
    if (storedLock !== null) {
      setLockedUntil(storedLock)
      setPhase('locked')
      return
    }
    setBusy(true)
    setFeedback(null)
    setNotice('')
    const result = await verifyOrderLookup(phone, code)
    setBusy(false)
    if (result.kind === 'offline') {
      setOfflineRetry(() => () => submitVerify(phone, code))
      return
    }
    setOfflineRetry(null)
    if (result.kind === 'invalid') {
      setFeedback({ message: ORDER_LOOKUP_COPY.wrongCode, remaining: result.remainingAttempts, key: Date.now() })
      return
    }
    if (result.kind === 'locked') {
      if (result.lockedUntil !== null) writeStoredLock(phone, result.lockedUntil)
      setLockedUntil(result.lockedUntil)
      setPhase('locked')
      return
    }
    if (result.kind === 'error') {
      setFeedback({ message: ORDER_LOOKUP_COPY.verifyError, remaining: null, key: Date.now() })
      return
    }
    // The token is bound to the order the server verified. Only use it for this page's order.
    if (result.orderId !== orderId) {
      setFeedback({ message: ORDER_LOOKUP_COPY.wrongCode, remaining: null, key: Date.now() })
      return
    }
    writeStoredOrderToken(orderId, { token: result.token, expiresAt: result.expiresAt })
    await loadDetail(result.token, result.expiresAt)
  }

  const crumbs = [{ label: 'Tra cứu đơn hàng', href: '/orders' }, { label: 'Chi tiết đơn hàng' }]
  const back = (
    <Link href="/orders" className="text-[14px] no-underline" style={{ color: 'var(--text-secondary)' }}>
      {ORDER_LOOKUP_COPY.otherOrder}
    </Link>
  )

  if (phase === 'loading') {
    return (
      <OrderPageShell topBarTitle="Chi Tiết Đơn Hàng" crumbs={crumbs}>
        <div className="py-16 text-center text-[14px]" style={{ color: 'var(--text-muted)' }}>
          {ORDER_DETAIL_COPY.loading}
        </div>
      </OrderPageShell>
    )
  }

  if (phase === 'verify') {
    return (
      <OrderPageShell topBarTitle="Chi Tiết Đơn Hàng" crumbs={crumbs}>
        <div key="verify" className="lk-in flex max-w-[560px] flex-col gap-4 pt-4 md:pt-6">
          {notice ? (
            <div className="rounded-md px-3.5 py-2.5 text-[14px]" style={{ background: 'var(--bg-surface-alt)', color: 'var(--text-secondary)' }}>
              {notice}
            </div>
          ) : null}
          {offlineRetry ? <LookupOfflineNotice onRetry={() => offlineRetry()} /> : null}
          <LookupVerifyPanel
            title={ORDER_LOOKUP_COPY.verifyTitleDirect}
            askPhone
            busy={busy}
            feedback={feedback}
            onSubmit={(phone, code) => void submitVerify(phone, code)}
            footer={
              <>
                <Link href="/orders" className="text-[14px] no-underline" style={{ color: 'var(--text-secondary)' }}>
                  {ORDER_LOOKUP_COPY.lookupByPhone}
                </Link>
                <a href={HOTLINE_TEL} className="text-[14px] no-underline" style={{ color: 'var(--accent)' }}>
                  {ORDER_LOOKUP_COPY.forgotCode(HOTLINE_DISPLAY)}
                </a>
              </>
            }
          />
        </div>
      </OrderPageShell>
    )
  }

  if (phase === 'locked') {
    return (
      <OrderPageShell topBarTitle="Chi Tiết Đơn Hàng" crumbs={crumbs}>
        <div key="locked" className="lk-in flex max-w-[560px] flex-col gap-4 pt-4 md:pt-6">
          <LookupLockedPanel lockedUntil={lockedUntil} onExpired={handleLockExpired} />
          {back}
        </div>
      </OrderPageShell>
    )
  }

  if (phase === 'offline') {
    return (
      <OrderPageShell topBarTitle="Chi Tiết Đơn Hàng" crumbs={crumbs}>
        <div key="offline" className="lk-in flex flex-col gap-4 pt-4 md:pt-6">
          <LookupOfflineNotice
            onRetry={() => {
              setPhase('loading')
              setRestoreKey((k) => k + 1)
            }}
          />
          {back}
        </div>
      </OrderPageShell>
    )
  }

  if (phase === 'error' || !order || !session) {
    return (
      <OrderPageShell topBarTitle="Chi Tiết Đơn Hàng" crumbs={crumbs}>
        <div className="flex flex-col items-start gap-4 py-12">
          <div className="font-heading text-[22px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {ORDER_DETAIL_COPY.notFound}
          </div>
          <div className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
            {ORDER_LOOKUP_COPY.detailError}
          </div>
          <Link href="/orders" className="rounded-md px-5 py-3 text-[15px] font-semibold no-underline" style={{ background: 'var(--accent)', color: 'var(--primitive-white)' }}>
            {ORDER_DETAIL_COPY.lookupAgain}
          </Link>
        </div>
      </OrderPageShell>
    )
  }

  return (
    <OrderPageShell topBarTitle="Chi Tiết Đơn Hàng" crumbs={crumbs}>
      <div key="ready" className="lk-in flex flex-col gap-6 pt-2 md:pt-4">
        <OrderDetailView
          order={order}
          token={session.token}
          onOrderChange={setOrder}
          onUnauthorized={() => {
            clearStoredOrderToken(orderId)
            setSession(null)
            setOrder(null)
            setFeedback({ message: ORDER_LOOKUP_COPY.sessionInvalid, remaining: null, key: Date.now() })
            setPhase('verify')
          }}
        />
        <div className="flex flex-wrap gap-5 text-[14px]">
          {back}
          <Link href="/" className="no-underline" style={{ color: 'var(--text-secondary)' }}>
            {ORDER_DETAIL_COPY.continueShopping}
          </Link>
        </div>
      </div>
    </OrderPageShell>
  )
}
