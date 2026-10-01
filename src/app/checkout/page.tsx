'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { getCartItems, clearCart } from '@/lib/storage'
import { createOrder } from '@/lib/storefront-api'
import type { CartItem } from '@/lib/types'

const fieldStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 100,
  fontFamily: 'var(--font-be-vietnam), sans-serif',
  fontSize: 12,
  color: 'var(--text-primary)',
  outline: 'none',
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items] = useState<CartItem[]>(() => getCartItems())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [orderId, setOrderId] = useState<string | null>(null)

  const [phone, setPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer' | 'showroom'>('cod')

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      router.push('/cart')
    }
  }, [router, items.length, submitted])

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'

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

    const paymentMethodLabels: Record<'cod' | 'transfer' | 'showroom', string> = {
      cod: 'Thanh toán khi nhận (COD)',
      transfer: 'Chuyển khoản',
      showroom: 'Tại showroom',
    }

    try {
      const result = await createOrder({
        phone: normalizedPhone,
        customerName: customerName || undefined,
        address: address || undefined,
        note: [`Thanh toán: ${paymentMethodLabels[paymentMethod]}`, note].filter(Boolean).join(' — ') || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          productTitle: item.productTitle || item.productId,
          sizeCode: item.sizeId,
          sizeLabel: item.sizeLabel || item.sizeId,
          selectedAttrs: item.selectedAttrs,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          variantImageUrl: item.variantImageUrl,
        })),
      })

      if (result?.id) {
        clearCart()
        setOrderId(result.id)
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

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-be-vietnam), sans-serif',
    fontWeight: 500,
    fontSize: 12.5,
    color: 'var(--text-secondary)',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)'}}>
      <DeskHeader />
      <TopBar
        title="Đặt hàng"
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng', href: '/cart' }, { label: 'Đặt hàng' }]} />

      {submitted && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,150,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#009650" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 24, fontWeight: 500, color: 'var(--text-primary)', marginTop: 20 }}>
            Đặt hàng thành công!
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
            Chúng tôi sẽ liên hệ {phone} trong 1–2 giờ
          </div>
          {orderId && (
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 12, color: 'var(--bronze)', marginTop: 8 }}>
              #{orderId}
            </div>
          )}
          <Link
            href="/"
            style={{ display: 'block', marginTop: 32, background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 100, padding: '14px 32px', fontFamily: 'var(--font-be-vietnam), sans-serif', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}
          >
            Tiếp tục mua sắm
          </Link>
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              style={{ display: 'block', marginTop: 14, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              Xem đơn hàng →
            </Link>
          )}
        </div>
      )}

      {!submitted && (<div style={{ padding: '16px 16px 0' }}>
        <h1 className="lg:mx-auto lg:max-w-[1344px] lg:px-8" style={{ fontFamily: 'var(--font-lora), serif', fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24, marginTop: 0 }}>Đặt hàng</h1>
        <div className="flex flex-col gap-4 lg:mx-auto lg:grid lg:max-w-[1344px] lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10 lg:px-8">

        {/* Form */}
        <div className="lg:order-1">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Thông tin người nhận</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label style={labelStyle}>Họ và tên</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nguyễn Văn A" style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>Số điện thoại <span style={{ color: 'var(--accent)' }}>*</span></label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912 345 678" style={fieldStyle} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Địa chỉ giao hàng</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" style={fieldStyle} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Giao giờ hành chính, gọi trước 30 phút..."
                rows={3}
                style={{ ...fieldStyle, borderRadius: 14, resize: 'none' }}
              />
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Thanh toán</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { id: 'cod' as const, label: 'Thanh toán khi nhận', desc: 'COD' },
                { id: 'transfer' as const, label: 'Chuyển khoản', desc: 'Nhận STK sau khi đặt' },
                { id: 'showroom' as const, label: 'Tại showroom', desc: 'Làng Đại Bái' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    textAlign: 'left',
                    fontSize: 13,
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    cursor: 'pointer',
                    border: paymentMethod === opt.id ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                    background: paymentMethod === opt.id ? 'rgba(139,30,30,0.06)' : 'var(--bg-card)',
                    color: paymentMethod === opt.id ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: paymentMethod === opt.id ? 600 : 400,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 13.5 }}>{opt.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(139,30,30,0.08)', border: '1px solid rgba(139,30,30,0.2)', borderRadius: 8, fontSize: 13, color: 'var(--accent)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, padding: 14, fontFamily: 'var(--font-be-vietnam), sans-serif', fontWeight: 500, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, width: '100%' }}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
          <Link
            href="/cart"
            style={{ display: 'block', textAlign: 'center', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 20px', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13.5, textDecoration: 'none' }}
          >
            ← Quay lại giỏ hàng
          </Link>
          </form>
        </div>

        {/* Order summary & info banner */}
        <div className="lg:sticky lg:top-[92px] lg:order-2 lg:flex lg:flex-col lg:gap-4">
          {/* Order items card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 16, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)' }}>
              Sản phẩm
            </div>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0,1fr)', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: index < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ background: 'var(--bg-surface)', borderRadius: 8, overflow: 'hidden', padding: 6 }}>
                  <ArtPiece
                    bg={(item.selectedAttrs?.['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
                    frame={(item.selectedAttrs?.['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
                    label=""
                    pad={3}
                    aspect="4/3"
                    imgSrc={item.variantImageUrl}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {item.productTitle || item.productId}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    ×{item.quantity}{item.sizeLabel ? ` · ${item.sizeLabel}` : ''}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {fmtVND(item.unitPrice * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary card with totals */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Tạm tính</span><span>{fmtVND(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Phí giao hàng</span><span>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Thanh toán</span><span>Xác nhận sau</span>
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(42,31,26,0.14)', marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-lora), serif', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Tổng cộng</span>
              <span style={{ fontFamily: 'var(--font-lora), serif', fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent)' }}>{fmtVND(subtotal)}</span>
            </div>
          </div>

          {/* Info banner */}
          <div style={{ padding: '12px 14px', background: 'rgba(120,160,200,0.12)', border: '1px solid rgba(120,160,200,0.25)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(60,100,160,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#3d6090" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div style={{ fontSize: 13, color: '#3d5a7a', lineHeight: 1.6 }}>
              Sẽ liên hệ xác nhận trong <strong>1–2 giờ</strong> làm việc.
            </div>
          </div>
        </div>
        </div>
      </div>)}

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
