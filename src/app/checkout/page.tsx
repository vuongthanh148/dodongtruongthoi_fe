'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
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

    try {
      const result = await createOrder({
        phone: normalizedPhone,
        customerName: customerName || undefined,
        address: address || undefined,
        note: note || undefined,
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
      <TopBar
        title="Đặt hàng"
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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

      {!submitted && (<div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Order summary block */}
        <div style={{ background: 'var(--bg-dark)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>
            Đơn hàng của bạn
          </div>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 15, color: 'var(--text-on-dark)', lineHeight: 1.2 }}>
                  {item.productTitle || item.productId}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(244,237,224,0.5)', marginTop: 2 }}>
                  ×{item.quantity}{item.sizeLabel ? ` · ${item.sizeLabel}` : ''}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 14, color: 'var(--gold)', marginLeft: 10 }}>
                {fmtVND(item.unitPrice * item.quantity)}
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-lora), serif', fontSize: 16, fontWeight: 600, color: 'var(--text-on-dark)' }}>Tổng</span>
            <span style={{ fontFamily: 'var(--font-lora), serif', fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--gold)' }}>{fmtVND(subtotal)}</span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Số điện thoại <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912 345 678" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tên khách hàng</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nguyễn Văn A" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Địa chỉ giao hàng</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Giao giờ hành chính, gọi trước 30 phút..."
              rows={3}
              style={{ ...fieldStyle, borderRadius: 14, resize: 'none' }}
            />
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
      </div>)}

      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}
