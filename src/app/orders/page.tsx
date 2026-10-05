'use client'

import { useEffect, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { IconBox, IconPhone, IconZalo } from '@/components/icons'
import { HOTLINE } from '@/lib/constants'
import {
  clearStoredOrderToken,
  LOOKUP_CODE_LENGTH,
  maskOrderCode,
  maskPhone,
  writeStoredOrderToken,
} from '@/lib/order-lookup'
import { fetchOrderDetail, getOrdersByPhone, verifyOrderLookup } from '@/lib/storefront-api'
import type { Order, OrderSummary } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending_confirm: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  completed: 'Đã giao',
  cancelled: 'Đã hủy',
}

type Step = 'phone' | 'list' | 'verify' | 'locked' | 'detail'

function fmtVND(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

const STEP_LABELS: Record<Exclude<Step, 'locked'>, string> = {
  phone: 'Số điện thoại',
  list: 'Chọn đơn',
  verify: 'Xác minh',
  detail: 'Chi tiết',
}
const STEP_ORDER: Exclude<Step, 'locked'>[] = ['phone', 'list', 'verify', 'detail']

function StepDots({ step }: { step: Step }) {
  const idx = STEP_ORDER.indexOf(step === 'locked' ? 'verify' : step)
  return (
    <div className="mb-6 hidden flex-wrap items-center gap-2 md:flex">
      {STEP_ORDER.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          {i > 0 && <span className="h-px w-5" style={{ background: 'var(--border)' }} />}
          <span
            className="flex items-center gap-1.5 text-[12.5px]"
            style={{ color: i <= idx ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === idx ? 600 : 400 }}
          >
            <span
              className="grid h-5 w-5 place-items-center rounded-full text-[11px]"
              style={{
                background: i < idx ? 'var(--accent)' : i === idx ? 'rgba(139,30,30,0.1)' : 'var(--bg-surface-alt)',
                color: i < idx ? 'white' : i === idx ? 'var(--accent)' : 'var(--text-muted)',
                border: i === idx ? '1px solid var(--accent)' : 'none',
              }}
            >
              {i < idx ? '✓' : i + 1}
            </span>
            {STEP_LABELS[s]}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function OrdersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [step, setStep] = useState<Step>('phone')
  const [phoneInput, setPhoneInput] = useState('')
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<OrderSummary | null>(null)

  // Verified state lives only in memory. Full order data is set only after GET /orders/{id} succeeds with the token.
  const [token, setToken] = useState<{ value: string; expiresAt: number } | null>(null)
  const [detail, setDetail] = useState<Order | null>(null)

  // Lock state comes only from the server (429 locked_until). Never guessed locally.
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const [verifyValue, setVerifyValue] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const [verifying, setVerifying] = useState(false)

  // Countdown ticks while a lock is active. When it runs out, return to the verify step.
  useEffect(() => {
    if (lockedUntil === null) return
    const tick = () => {
      const current = Date.now()
      setNow(current)
      if (current >= lockedUntil) {
        setLockedUntil(null)
        setStep((s) => (s === 'locked' ? 'verify' : s))
      }
    }
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [lockedUntil])

  const lockRemainingS = lockedUntil === null ? 0 : Math.max(0, Math.round((lockedUntil - now) / 1000))

  // The verified session ends at the server's expires_at; drop the detail and ask for the code again.
  useEffect(() => {
    if (!token) return
    const t = setTimeout(
      () => {
        setToken(null)
        setDetail(null)
        setStep((s) => (s === 'detail' ? 'verify' : s))
      },
      Math.max(0, token.expiresAt - Date.now())
    )
    return () => clearTimeout(t)
  }, [token])

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const normalized = phoneInput.replace(/\D/g, '')
    if (normalized.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ.')
      return
    }
    setLoading(true)
    try {
      const result = await getOrdersByPhone(normalized)
      setOrders(result)
      setPhone(normalized)
      setToken(null)
      setDetail(null)
      setLockedUntil(null)
      setRemainingAttempts(null)
      setStep('list')
    } catch {
      setError('Có lỗi khi tra cứu đơn hàng.')
    } finally {
      setLoading(false)
    }
  }

  function openVerify(order: OrderSummary) {
    setSelected(order)
    setVerifyValue('')
    setVerifyError('')
    setRemainingAttempts(null)
    // The countdown effect clears lockedUntil once it passes, so a non-null value means still locked.
    if (lockedUntil !== null) {
      setStep('locked')
    } else {
      setStep('verify')
    }
  }

  async function submitVerify() {
    if (!selected || verifying) return
    setVerifying(true)
    setVerifyError('')
    try {
      const result = await verifyOrderLookup(phone, verifyValue.trim().toUpperCase())
      if (result.kind === 'invalid') {
        setRemainingAttempts(result.remainingAttempts)
        setVerifyError('Mã tra cứu không đúng.')
        return
      }
      if (result.kind === 'locked') {
        setLockedUntil(result.lockedUntil)
        setNow(Date.now())
        setStep('locked')
        return
      }
      if (result.kind === 'error') {
        setVerifyError('Có lỗi khi xác minh. Vui lòng thử lại.')
        return
      }

      // The token is bound to the order the server verified (result.orderId), which is what
      // the detail request must use. If the code belongs to a different order, do not show it.
      const verifiedOrderId = result.orderId
      writeStoredOrderToken(verifiedOrderId, { token: result.token, expiresAt: result.expiresAt })
      if (verifiedOrderId !== selected.id) {
        setVerifyError('Mã tra cứu không đúng.')
        return
      }

      const verified = { value: result.token, expiresAt: result.expiresAt }
      setToken(verified)
      const detailResult = await fetchOrderDetail(verifiedOrderId, verified.value)
      if (detailResult.kind === 'ok') {
        setDetail(detailResult.order)
        setRemainingAttempts(null)
        setVerifyValue('')
        setStep('detail')
        return
      }
      setToken(null)
      clearStoredOrderToken(verifiedOrderId)
      setVerifyError(
        detailResult.kind === 'unauthorized'
          ? 'Phiên xác minh không hợp lệ. Vui lòng thử lại.'
          : 'Có lỗi khi tải thông tin đơn hàng.'
      )
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title="Tra Cứu Đơn Hàng" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tra cứu đơn hàng' }]} />

      <Container className="w-full pb-16">
        <StepDots step={step} />

        {/* ===== Step: phone ===== */}
        {step === 'phone' && (
          <div key="phone" className="lk-in pt-4 md:pt-2">
            <h1 style={{ fontFamily: 'var(--font-lora), serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: 1.2 }}>Tra cứu đơn hàng</h1>
            <div style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>Nhập số điện thoại đã dùng khi đặt hàng.</div>
            <div className="label-mono mb-3" style={{ color: 'var(--bronze)' }}>
              Nhập số điện thoại đặt hàng
            </div>
            <form onSubmit={handlePhoneSubmit} className="flex max-w-[560px] flex-col gap-2.5 sm:flex-row">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="0912 345 678"
                autoFocus
                className="brand-focus w-full flex-1"
                style={{
                  padding: '13px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 100,
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 100,
                  padding: '13px 24px',
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '...' : 'Tra cứu →'}
              </button>
            </form>
            <button
              type="button"
              onClick={() => setPhoneInput('0899 012 288')}
              style={{
                marginTop: 12,
                padding: 0,
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Dùng số mẫu
            </button>
            {error && (
              <div className="mt-3 max-w-[560px]" style={{ padding: '10px 14px', background: 'rgba(139,30,30,0.08)', border: '1px solid rgba(139,30,30,0.2)', borderRadius: 8, fontSize: 13, color: 'var(--accent)' }}>
                {error}
              </div>
            )}
            <div className="mt-4 flex max-w-[560px] gap-2" style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <IconBox size={16} color="var(--bronze)" />
              <span>Chỉ hiển thị thông tin tóm tắt. Để xem địa chỉ và chi tiết, bạn cần mã tra cứu.</span>
            </div>
          </div>
        )}

        {/* ===== Step: list (masked) ===== */}
        {step === 'list' && (
          <div key="list" className="lk-in max-w-[960px]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              <span>
                {orders.length} đơn hàng của <b style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{maskPhone(phone)}</b>
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setPhoneInput('')
                  setOrders([])
                  setToken(null)
                  setDetail(null)
                  setLockedUntil(null)
                }}
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
              >
                Đổi số
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center" style={{ padding: '48px 20px' }}>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Không tìm thấy đơn hàng
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Vui lòng kiểm tra lại số điện thoại, hoặc liên hệ hotline để được hỗ trợ.
                </div>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 20, color: 'var(--accent)', marginTop: 16 }}>
                  {HOTLINE.replace(/(\d{4})(\d{3})(\d{3})/, '$1 · $2 · $3')}
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div className="label-mono hidden md:grid" style={{ gridTemplateColumns: 'minmax(0,1fr) 110px minmax(0,2fr) 140px 130px', gap: 20, padding: '14px 24px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11 }}>
                  <span>Mã đơn</span>
                  <span>Ngày đặt</span>
                  <span>Sản phẩm</span>
                  <span>Trạng thái</span>
                  <span />
                </div>
                {orders.map((order) => {
                  const names = order.items.map((i) => i.productTitle).join(', ')
                  const dateLabel = new Date(order.createdAt).toLocaleDateString('vi-VN')
                  return (
                    <div key={order.id}>
                      {/* mobile/tablet card */}
                      <div className="flex flex-col gap-2 md:hidden" style={{ padding: 16, borderBottom: '1px solid var(--border-soft)' }}>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{maskOrderCode(order.id)}</span>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{dateLabel}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }}>
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{names}</div>
                        <button
                          type="button"
                          onClick={() => openVerify(order)}
                          className="self-end"
                          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500 }}
                        >
                          Xem chi tiết →
                        </button>
                      </div>
                      {/* desktop row */}
                      <div className="hidden md:grid" style={{ gridTemplateColumns: 'minmax(0,1fr) 110px minmax(0,2fr) 140px 130px', gap: 20, padding: '18px 24px', borderBottom: '1px solid var(--border-soft)', alignItems: 'center', fontSize: 14 }}>
                        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{maskOrderCode(order.id)}</span>
                        <span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{dateLabel}</span>
                        <span className="truncate">{names}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)', width: 'fit-content' }}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => openVerify(order)}
                          className="justify-self-end"
                          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500 }}
                        >
                          Xem chi tiết →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-3" style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              Giá tiền, địa chỉ và tên người nhận được ẩn cho tới khi xác minh.
            </div>
          </div>
        )}

        {/* ===== Step: verify ===== */}
        {step === 'verify' && selected && (
          <div key="verify" className="lk-in max-w-[520px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
              Xác minh để xem đơn {maskOrderCode(selected.id)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.55 }}>
              Để bảo vệ địa chỉ và thông tin của bạn, vui lòng nhập mã tra cứu {LOOKUP_CODE_LENGTH} ký tự.
            </div>

            <form
              className="mt-4 flex flex-col gap-2.5"
              onSubmit={(e) => {
                e.preventDefault()
                if (verifyValue) void submitVerify()
              }}
            >
              <input
                autoFocus
                value={verifyValue}
                maxLength={LOOKUP_CODE_LENGTH}
                onChange={(e) => {
                  setVerifyValue(e.target.value.toUpperCase())
                  setVerifyError('')
                }}
                placeholder="VD: 3F9A1C"
                className="brand-focus"
                style={{ height: 50, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0 16px', fontSize: 15, fontFamily: 'ui-monospace, Menlo, monospace', color: 'var(--text-primary)', outline: 'none' }}
              />
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Mã tra cứu được hiển thị khi đặt hàng thành công.</div>

              {verifyError && (
                <div className="lk-shake mt-1" style={{ fontSize: 13.5, color: 'var(--accent)', background: 'rgba(139,30,30,0.06)', padding: '10px 12px', borderRadius: 6 }}>
                  {verifyError}
                  {remainingAttempts !== null && ` Còn ${remainingAttempts} lần thử.`}
                </div>
              )}

              <button
                type="submit"
                disabled={!verifyValue || verifying}
                style={{
                  width: '100%',
                  marginTop: 16,
                  height: 48,
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: verifyValue && !verifying ? 'pointer' : 'not-allowed',
                  opacity: verifyValue && !verifying ? 1 : 0.45,
                }}
              >
                {verifying ? 'Đang xác minh...' : 'Xem chi tiết đơn'}
              </button>
            </form>

            <div className="mt-4 flex justify-between" style={{ fontSize: 13 }}>
              <button type="button" onClick={() => setStep('list')} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Chọn đơn khác
              </button>
              <a href={`tel:${HOTLINE}`} style={{ color: 'var(--accent)' }}>
                Quên mã? Gọi {HOTLINE}
              </a>
            </div>
          </div>
        )}

        {/* ===== Step: locked ===== */}
        {step === 'locked' && (
          <div key="locked" className="lk-in max-w-[520px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
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
        )}

        {/* ===== Step: detail (verified) ===== */}
        {step === 'detail' && detail && (
          <div key="detail" className="lk-in">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-md px-3.5 py-2.5" style={{ background: 'rgba(58,107,58,0.1)', color: 'var(--color-success)', fontSize: 13.5 }}>
              ✓ Đã xác minh · phiên xem hết hạn sau 15 phút
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    Đơn {maskOrderCode(detail.id)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }}>
                    {STATUS_LABELS[detail.status] ?? detail.status}
                  </span>
                </div>
                {detail.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-3.5" style={{ padding: '10px 0', borderTop: '1px solid var(--border-soft)' }}>
                    <div style={{ width: 80, height: 60, background: 'var(--bg-surface)', borderRadius: 8 }} />
                    <div className="min-w-0">
                      <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{item.productTitle}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>
                        {[item.sizeLabel, ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : [])].filter(Boolean).join(' · ')} · ×{item.quantity}
                      </div>
                    </div>
                    <span className="price-num" style={{ fontSize: 14, color: 'var(--accent)' }}>{fmtVND(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between" style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600 }}>Tổng cộng</span>
                  <span className="price-num" style={{ fontSize: 22, color: 'var(--accent)' }}>{fmtVND(detail.totalAmount)}</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>Giao đến</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {detail.customerName || 'Khách hàng'} · {maskPhone(detail.phone)}
                  <br />
                  {detail.address || '—'}
                </div>
                <a
                  href={`tel:${HOTLINE}`}
                  className="mt-4 flex items-center justify-center gap-2"
                  style={{ width: '100%', height: 44, borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14 }}
                >
                  <IconPhone size={16} /> Liên hệ về đơn này
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setDetail(null)
                setStep('list')
              }}
              className="mt-4"
              style={{ fontSize: 13.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Về danh sách đơn
            </button>
          </div>
        )}
      </Container>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
