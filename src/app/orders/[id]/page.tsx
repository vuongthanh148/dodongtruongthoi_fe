'use client'

import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { IconPhone, IconZalo } from '@/components/icons'
import { cancelOrder, fetchOrderDetail, OrderApiError, verifyOrderLookup } from '@/lib/storefront-api'
import { clearStoredOrderToken, maskPhone, readStoredOrderToken, writeStoredOrderToken } from '@/lib/order-lookup'
import { HOTLINE } from '@/lib/constants'
import type { Order } from '@/lib/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const STATUS_LABELS: Record<string, string> = {
  pending_confirm: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  completed: 'Đã giao',
  cancelled: 'Đã hủy',
}

function statusBadgeStyle(status: string): React.CSSProperties {
  const map: Record<string, { bg: string; color: string }> = {
    pending_confirm: { bg: 'rgba(201,169,97,0.18)', color: '#b08a3e' },
    confirmed: { bg: 'rgba(201,169,97,0.18)', color: '#b08a3e' },
    processing: { bg: 'rgba(107,68,35,0.14)', color: '#6b4423' },
    shipped: { bg: 'rgba(0,150,80,0.12)', color: '#006640' },
    completed: { bg: 'rgba(0,150,80,0.12)', color: '#006640' },
    cancelled: { bg: 'rgba(139,30,30,0.10)', color: 'var(--accent)' },
  }
  const s = map[status] ?? { bg: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }
  return {
    background: s.bg,
    color: s.color,
    borderRadius: 100,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-be-vietnam), sans-serif',
    whiteSpace: 'nowrap',
  }
}

function statusBannerStyle(status: string): React.CSSProperties {
  if (status === 'pending_confirm' || status === 'confirmed') {
    return { background: 'rgba(201,169,97,0.12)', border: '1px solid rgba(201,169,97,0.3)' }
  }
  if (status === 'shipped' || status === 'completed') {
    return { background: 'rgba(0,150,80,0.08)', border: '1px solid rgba(0,150,80,0.25)' }
  }
  if (status === 'cancelled') {
    return { background: 'rgba(139,30,30,0.07)', border: '1px solid rgba(139,30,30,0.2)' }
  }
  return { background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)' }
}

function statusBannerText(status: string): { headline: string; sub: string } | null {
  if (status === 'pending_confirm') {
    return {
      headline: 'Đặt hàng thành công!',
      sub: 'Chúng tôi sẽ liên hệ xác nhận trong 30 phút (giờ hành chính).',
    }
  }
  if (status === 'confirmed') {
    return {
      headline: 'Đơn hàng đã xác nhận',
      sub: 'Chúng tôi đang chuẩn bị sản phẩm cho bạn.',
    }
  }
  if (status === 'shipped') {
    return {
      headline: 'Đang trên đường giao',
      sub: 'Đơn hàng đang được vận chuyển đến địa chỉ của bạn.',
    }
  }
  if (status === 'completed') {
    return {
      headline: 'Giao hàng thành công',
      sub: 'Cảm ơn bạn đã tin tưởng Đồ Đồng Trường Thời.',
    }
  }
  if (status === 'cancelled') {
    return {
      headline: 'Đơn hàng đã hủy',
      sub: 'Liên hệ hotline nếu bạn cần hỗ trợ thêm.',
    }
  }
  return null
}

type Phase = 'loading' | 'verify' | 'locked' | 'ready' | 'error'

type RestoreOutcome =
  | { kind: 'ready'; order: Order; token: string }
  | { kind: 'verify' }
  | { kind: 'error' }

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const orderId = params.id

  const [phase, setPhase] = useState<Phase>('loading')
  const [order, setOrder] = useState<Order | null>(null)
  // Token is kept in memory for this view; sessionStorage only restores it within the session.
  const [token, setToken] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const [phoneInput, setPhoneInput] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  // Lock state comes only from the server (429 locked_until).
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (lockedUntil === null) return
    const tick = () => {
      const current = Date.now()
      setNow(current)
      if (current >= lockedUntil) {
        setLockedUntil(null)
        setPhase((p) => (p === 'locked' ? 'verify' : p))
      }
    }
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [lockedUntil])

  const lockRemainingS = lockedUntil === null ? 0 : Math.max(0, Math.round((lockedUntil - now) / 1000))

  // Restore a session token for this order, if one is stored and still accepted by the server.
  useEffect(() => {
    let active = true
    const restore = async (): Promise<RestoreOutcome> => {
      const stored = readStoredOrderToken(orderId)
      if (!stored) return { kind: 'verify' }
      const result = await fetchOrderDetail(orderId, stored.token)
      if (result.kind === 'ok') return { kind: 'ready', order: result.order, token: stored.token }
      if (result.kind === 'unauthorized') {
        clearStoredOrderToken(orderId)
        return { kind: 'verify' }
      }
      return { kind: 'error' }
    }
    restore().then((outcome) => {
      if (!active) return
      if (outcome.kind === 'ready') {
        setOrder(outcome.order)
        setToken(outcome.token)
        setPhase('ready')
      } else if (outcome.kind === 'verify') {
        setPhase('verify')
      } else {
        setErrorMessage('Có lỗi khi tải thông tin đơn hàng.')
        setPhase('error')
      }
    })
    return () => {
      active = false
    }
  }, [orderId])

  const submitVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (verifying) return
    const normalizedPhone = phoneInput.replace(/\D/g, '')
    if (normalizedPhone.length < 9) {
      setVerifyError('Vui lòng nhập số điện thoại hợp lệ.')
      return
    }
    if (codeInput.trim().length !== 6) {
      setVerifyError('Mã tra cứu gồm 6 ký tự.')
      return
    }
    setVerifying(true)
    setVerifyError('')
    try {
      const result = await verifyOrderLookup(normalizedPhone, codeInput.trim().toUpperCase())
      if (result.kind === 'invalid') {
        setRemainingAttempts(result.remainingAttempts)
        setVerifyError('Mã tra cứu không đúng.')
        return
      }
      if (result.kind === 'locked') {
        setLockedUntil(result.lockedUntil)
        setNow(Date.now())
        setPhase('locked')
        return
      }
      if (result.kind === 'error') {
        setVerifyError('Có lỗi khi xác minh. Vui lòng thử lại.')
        return
      }

      // The token is bound to the order the server verified. Only use it for this page's order.
      writeStoredOrderToken(result.orderId, { token: result.token, expiresAt: result.expiresAt })
      if (result.orderId !== orderId) {
        clearStoredOrderToken(result.orderId)
        setVerifyError('Mã tra cứu không đúng.')
        return
      }
      const detailResult = await fetchOrderDetail(orderId, result.token)
      if (detailResult.kind === 'ok') {
        setOrder(detailResult.order)
        setToken(result.token)
        setRemainingAttempts(null)
        setCodeInput('')
        setPhase('ready')
        return
      }
      clearStoredOrderToken(orderId)
      setVerifyError(
        detailResult.kind === 'unauthorized'
          ? 'Phiên xác minh không hợp lệ. Vui lòng thử lại.'
          : 'Có lỗi khi tải thông tin đơn hàng.'
      )
    } finally {
      setVerifying(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return
    // Never attempt cancel without a token for this order; ask for verification first.
    if (!token) {
      setConfirmingCancel(false)
      setCancelError('')
      setPhase('verify')
      return
    }
    setCancelling(true)
    setCancelError('')
    try {
      const updated = await cancelOrder(orderId, token)
      setOrder(updated)
      setConfirmingCancel(false)
    } catch (err) {
      if (err instanceof OrderApiError && err.status === 401) {
        // Token rejected for this order: drop it and ask for the code again.
        clearStoredOrderToken(orderId)
        setToken(null)
        setConfirmingCancel(false)
        setVerifyError('Phiên xác minh không hợp lệ. Vui lòng thử lại.')
        setPhase('verify')
        return
      }
      setCancelError(
        err instanceof OrderApiError && err.status === 409
          ? 'Đơn hàng không còn có thể hủy.'
          : 'Không thể hủy đơn hàng. Vui lòng thử lại.'
      )
    } finally {
      setCancelling(false)
    }
  }

  const topBar = <TopBar title="Chi Tiết Đơn Hàng" onMenu={() => setIsMenuOpen(true)} />

  const frame = (content: React.ReactNode) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-page)',
      }}
    >
      <DeskHeader />
      {topBar}
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tra cứu đơn hàng', href: '/orders' }, { label: 'Chi tiết đơn hàng' }]} />
      {content}
      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )

  if (phase === 'loading') {
    return frame(
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-be-vietnam), sans-serif',
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          Đang tải...
        </div>
      </div>
    )
  }

  if (phase === 'verify') {
    return frame(
      <div style={{ padding: '32px 16px 48px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 520,
            background: '#fffdf7',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
            Xác minh để xem đơn hàng
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.55 }}>
            Để bảo vệ địa chỉ và thông tin của bạn, vui lòng nhập số điện thoại đặt hàng và mã tra cứu 6 ký tự.
          </div>
          <form onSubmit={submitVerify} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
            <div>
              <label style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Số điện thoại đặt hàng</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value)
                  setVerifyError('')
                }}
                placeholder="0912 345 678"
                autoFocus
                className="brand-focus"
                style={{ width: '100%', boxSizing: 'border-box', height: 46, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0 16px', fontSize: 14, fontFamily: 'var(--font-be-vietnam), sans-serif', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Mã tra cứu</label>
              <input
                value={codeInput}
                maxLength={6}
                onChange={(e) => {
                  setCodeInput(e.target.value.toUpperCase())
                  setVerifyError('')
                }}
                placeholder="VD: 3F9A1C"
                className="brand-focus"
                style={{ width: '100%', boxSizing: 'border-box', height: 50, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0 16px', fontSize: 15, fontFamily: 'ui-monospace, Menlo, monospace', color: 'var(--text-primary)', outline: 'none' }}
              />
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6 }}>Mã tra cứu được hiển thị khi đặt hàng thành công.</div>
            </div>
            {verifyError && (
              <div style={{ fontSize: 13.5, color: 'var(--accent)', background: 'rgba(139,30,30,0.06)', padding: '10px 12px', borderRadius: 6 }}>
                {verifyError}
                {remainingAttempts !== null && ` Còn ${remainingAttempts} lần thử.`}
              </div>
            )}
            <button
              type="submit"
              disabled={verifying}
              style={{
                height: 48,
                borderRadius: 6,
                border: 'none',
                background: 'var(--accent)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: verifying ? 'not-allowed' : 'pointer',
                opacity: verifying ? 0.7 : 1,
              }}
            >
              {verifying ? 'Đang xác minh...' : 'Xem đơn hàng'}
            </button>
          </form>
          <div className="mt-4 flex justify-between" style={{ fontSize: 13 }}>
            <Link href="/orders" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              ← Tra cứu bằng số điện thoại
            </Link>
            <a href={`tel:${HOTLINE.replace(/\s/g, '')}`} style={{ color: 'var(--accent)' }}>
              Quên mã? Gọi {HOTLINE}
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'locked') {
    return frame(
      <div style={{ padding: '32px 16px 48px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 520,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 24,
          }}
        >
          <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>
            Tạm khóa tra cứu {lockRemainingS > 0 ? `${Math.ceil(lockRemainingS / 60)} phút` : ''}
          </div>
          <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
            Bạn đã nhập sai quá 5 lần. Để bảo vệ thông tin khách hàng, việc tra cứu đơn này tạm dừng. Nếu cần gấp, hãy liên hệ trực tiếp.
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <a href={`tel:${HOTLINE}`} style={{ height: 46, borderRadius: 6, border: 'none', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
              <IconPhone size={16} color="white" /> Gọi {HOTLINE}
            </a>
            <a href="https://zalo.me/0899012288" target="_blank" rel="noreferrer" style={{ height: 46, borderRadius: 6, border: '1.5px solid var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
              <IconZalo size={18} /> Nhắn Zalo
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'error' || !order || !token) {
    return frame(
      <div style={{ padding: '60px 30px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {errorMessage || 'Không tìm thấy đơn hàng.'}
        </div>
        <Link
          href="/orders"
          style={{
            display: 'inline-block',
            marginTop: 16,
            padding: '12px 24px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: 6,
            fontFamily: 'var(--font-be-vietnam), sans-serif',
            fontSize: 13.5,
            textDecoration: 'none',
          }}
        >
          Tra cứu đơn hàng
        </Link>
      </div>
    )
  }

  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const banner = statusBannerText(order.status)

  // Timeline stages
  const stages: { id: string; label: string }[] = [
    { id: 'pending_confirm', label: 'Đã đặt' },
    { id: 'confirmed', label: 'Đã xác nhận' },
    { id: 'processing', label: 'Đang chế tác' },
    { id: 'shipped', label: 'Đang giao' },
    { id: 'completed', label: 'Đã giao' },
  ]
  const currentIdx = stages.findIndex((s) => s.id === order.status)
  const canCancel = order.status === 'pending_confirm' || order.status === 'confirmed'

  // Card style
  const cardStyle: React.CSSProperties = {
    background: '#fffdf7',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 24,
  }

  const cardHeadingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-lora), serif',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: 'var(--text-primary)',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-page)',
      }}
    >
      <DeskHeader />
      {topBar}
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tra cứu đơn hàng', href: '/orders' }, { label: order.id.slice(0, 8).toUpperCase() }]} />

      <div
        style={{
          maxWidth: 1344,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
        className="px-4 sm:px-6 lg:px-8 xl:px-8"
      >
        {/* Header row: H1 + Status badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: 32,
                fontWeight: 600,
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-primary)',
              }}
            >
              Đơn {order.id.slice(0, 8).toUpperCase()}
            </h1>
            <div
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                marginTop: 4,
              }}
            >
              Đặt ngày{' '}
              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <span style={statusBadgeStyle(order.status)}>
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>

        {/* Status banner */}
        {banner && (
          <div
            style={{
              ...statusBannerStyle(order.status),
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {(order.status === 'pending_confirm' || order.status === 'confirmed') && (
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b08a3e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {(order.status === 'shipped' || order.status === 'completed') && (
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#006640"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <path d="M16 8h4l3 4v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              )}
              {order.status === 'cancelled' && (
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: 'var(--text-primary)',
                  marginBottom: 3,
                }}
              >
                {banner.headline}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {banner.sub}
              </div>
            </div>
          </div>
        )}

        {/* Two-column grid: left (timeline + products) | right (payment + delivery + contact) */}
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Timeline card */}
            {order.status !== 'cancelled' && (
              <div style={cardStyle}>
                <div style={cardHeadingStyle}>Tiến trình</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))`,
                    gap: 0,
                  }}
                >
                  {stages.map((s, i) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            fontSize: 11,
                            flexShrink: 0,
                            background: i <= currentIdx ? 'var(--accent)' : 'var(--bg-surface-alt)',
                            color: i <= currentIdx ? 'white' : 'var(--text-muted)',
                            border: i <= currentIdx ? 'none' : '1px solid var(--border)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {i <= currentIdx ? '✓' : ''}
                        </div>
                        {i < stages.length - 1 && (
                          <div
                            style={{
                              flex: 1,
                              height: 2,
                              background: i < currentIdx ? 'var(--accent)' : 'var(--border)',
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: i <= currentIdx ? 'var(--text-primary)' : 'var(--text-muted)',
                          fontWeight: i === currentIdx ? 600 : 400,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products card */}
            <div style={cardStyle}>
              <div style={cardHeadingStyle}>Sản phẩm</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px minmax(0,1fr) auto',
                      gap: 14,
                      alignItems: 'center',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 110,
                        height: 'auto',
                        aspectRatio: '4/3',
                        flexShrink: 0,
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <ArtPiece
                        pad={4}
                        aspect="4/3"
                        label={item.productTitle}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-lora), serif',
                          fontSize: 17,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.productTitle}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: 'var(--text-muted)',
                          marginTop: 3,
                        }}
                      >
                        {[
                          item.sizeLabel,
                          ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : []),
                        ]
                          .filter(Boolean)
                          .join(' · ')}{' '}
                        ·{' ×'}
                        {item.quantity}
                      </div>
                    </div>
                    {/* Price */}
                    <div
                      style={{
                        fontFamily: 'var(--font-lora), serif',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: 15,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtVND(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column (sticky) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
            className="lg:sticky lg:top-[92px]"
          >
            {/* Payment card */}
            <div style={cardStyle}>
              <div style={cardHeadingStyle}>Thanh toán</div>
              {[
                ['Tạm tính', fmtVND(total)],
                ['Phí giao hàng', 'Miễn phí'],
                ['Phương thức', 'COD'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    padding: '6px 0',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
              <div
                style={{
                  margin: '10px 0',
                  height: 1,
                  background: 'var(--border)',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  Tổng cộng
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  {fmtVND(total)}
                </span>
              </div>
            </div>

            {/* Delivery card */}
            <div style={cardStyle}>
              <div style={cardHeadingStyle}>Giao đến</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {order.customerName ?? ''} · {maskPhone(order.phone)}
                {order.address && (
                  <>
                    <br />
                    {order.address}
                  </>
                )}
                {order.note && (
                  <>
                    <br />
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {order.note}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Contact button */}
            <a
              href={`tel:${HOTLINE.replace(/\s/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 50,
                padding: '0 22px',
                borderRadius: 6,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid var(--accent)',
                background: 'transparent',
                color: 'var(--accent)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Liên hệ về đơn hàng
            </a>

            {/* Cancel order (two-step confirm) */}
            {canCancel && !confirmingCancel && (
              <button
                type="button"
                onClick={() => {
                  setCancelError('')
                  setConfirmingCancel(true)
                }}
                style={{
                  height: 50,
                  padding: '0 22px',
                  borderRadius: 6,
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1.5px solid var(--accent)',
                  background: 'transparent',
                  color: 'var(--accent)',
                  whiteSpace: 'nowrap',
                }}
              >
                Hủy đơn hàng
              </button>
            )}
            {canCancel && confirmingCancel && (
              <div style={{ ...cardStyle, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>
                  Bạn chắc chắn muốn hủy đơn hàng này?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCancelError('')
                      setConfirmingCancel(false)
                    }}
                    disabled={cancelling}
                    style={{
                      height: 50,
                      padding: '0 22px',
                      borderRadius: 6,
                      fontFamily: 'var(--font-be-vietnam), sans-serif',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      border: '1.5px solid var(--accent)',
                      background: 'transparent',
                      color: 'var(--accent)',
                      opacity: cancelling ? 0.6 : 1,
                    }}
                  >
                    Giữ đơn
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    style={{
                      height: 50,
                      padding: '0 22px',
                      borderRadius: 6,
                      fontFamily: 'var(--font-be-vietnam), sans-serif',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      border: '1.5px solid var(--accent)',
                      background: 'var(--accent)',
                      color: 'white',
                      opacity: cancelling ? 0.6 : 1,
                    }}
                  >
                    {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
                  </button>
                </div>
              </div>
            )}
            {cancelError && (
              <div role="alert" style={{ fontSize: 13, color: 'var(--accent)' }}>
                {cancelError}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom nav links */}
      <div
        style={{
          maxWidth: 1344,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          fontSize: 13.5,
          color: 'var(--text-secondary)',
        }}
        className="px-4 sm:px-6 lg:px-8 xl:px-8"
      >
        <Link
          href="/orders"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          ← Tra cứu đơn khác
        </Link>
        <Link
          href="/"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
