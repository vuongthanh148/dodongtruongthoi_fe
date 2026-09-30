'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { getCartItems, removeCartItem, setCartItems } from '@/lib/storage'
import { fetchProduct } from '@/lib/storefront-api'
import { resolveSKUPrice } from '@/lib/sku'
import type { CartItem } from '@/lib/types'

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window !== 'undefined' ? getCartItems() : []
  )
  const [livePrices, setLivePrices] = useState<Record<string, number>>({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const stored = getCartItems()

    const uniqueIds = [...new Set(stored.map((i) => i.productId))]
    Promise.all(uniqueIds.map((id) => fetchProduct(id))).then((products) => {
      const map: Record<string, number> = {}
      stored.forEach((item, idx) => {
        const product = products[uniqueIds.indexOf(item.productId)]
        if (!product) return
        const size = product.sizes.find((s) => s.id === item.sizeId)
        const sizeCode = size?.code ?? null
        const live = resolveSKUPrice(product.skus, sizeCode, item.selectedAttrs ?? {}, size?.price ?? product.discountPrice ?? product.price)
        map[idx] = live
      })
      setLivePrices(map)
    })
  }, [])

  const handleRemove = (index: number) => {
    removeCartItem(index)
    setItems(getCartItems())
  }

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return
    const updated = [...items]
    updated[index] = { ...updated[index], quantity: newQty }
    setCartItems(updated)
    setItems(updated)
  }

  const effectivePrice = (item: CartItem, index: number) =>
    livePrices[index] !== undefined ? livePrices[index] : item.unitPrice
  const subtotal = items.reduce((sum, item, i) => sum + effectivePrice(item, i) * item.quantity, 0)
  const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  const emptyState = (
    <div style={{ padding: '80px 30px', textAlign: 'center' }}>
      <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.2" style={{ margin: '0 auto 14px' }}>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
      <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Giỏ hàng trống</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
        Khám phá bộ sưu tập tranh đồng và đỉnh đồng truyền thống.
      </div>
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, padding: '13px 24px', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 14, cursor: 'pointer' }}
      >
        Tiếp tục mua sắm
      </button>
    </div>
  )

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)'}}>
      <DeskHeader />
      <TopBar
        title="Giỏ Hàng"
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Container>
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]} />

        {items.length === 0 ? emptyState : (
          <>
          <div
            className="mt-4 mb-3.5 md:mt-6 md:mb-6"
            style={{ fontFamily: 'var(--font-lora), serif', fontSize: 24, fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Giỏ hàng{' '}
            <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400 }}>
              ({items.length} sản phẩm)
            </span>
          </div>
          <div className="flex flex-col gap-px lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10" style={{ padding: '0 16px 16px' }}>

          {/* Left column: items list */}
          <div className="lg:min-w-0" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {/* Desktop column header */}
            <div
              className="label-mono hidden lg:grid xl:grid-cols-[minmax(0,1fr)_140px_150px_40px]"
              style={{ gridTemplateColumns: 'minmax(0,1fr) 120px 130px 28px', gap: 20, padding: '14px 24px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 12 }}
            >
              <span>Sản phẩm</span>
              <span>Số lượng</span>
              <span style={{ textAlign: 'right' }}>Thành tiền</span>
              <span />
            </div>

            {/* Items */}
            {items.map((item, index) => (
            <div key={index}>
              {/* Mobile / tablet card */}
              <div
                className="grid lg:hidden"
                style={{
                  borderBottom: '1px solid var(--border-soft)',
                  padding: '14px 16px',
                  gridTemplateColumns: '80px 1fr',
                  gap: 12,
                }}
              >
                {/* Thumbnail */}
                <div style={{ background: 'var(--bg-surface)', borderRadius: 8, overflow: 'hidden', padding: 6 }}>
                  <ArtPiece
                    bg={(item.selectedAttrs?.['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
                    frame={(item.selectedAttrs?.['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
                    label=""
                    pad={4}
                    aspect="1/1"
                  />
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, position: 'relative' }}>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ×
                  </button>

                  <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2, paddingRight: 24 }}>
                    {item.productTitle || item.productId}
                  </div>

                  {(item.sizeLabel || (item.selectedAttrs && Object.keys(item.selectedAttrs).length > 0)) && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 6 }}>
                      {[item.sizeLabel, ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : [])].filter(Boolean).join(' · ')}
                    </div>
                  )}
                  <Link href={`/products/${item.productId}`} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Đổi tùy chọn</Link>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    {/* Qty stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      <button type="button" onClick={() => handleUpdateQuantity(index, item.quantity - 1)} style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: 16 }}>−</button>
                      <div style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'var(--text-primary)' }}>{item.quantity}</div>
                      <button type="button" onClick={() => handleUpdateQuantity(index, item.quantity + 1)} style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: 16 }}>+</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      {livePrices[index] !== undefined && livePrices[index] !== item.unitPrice && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                          {fmtVND(item.unitPrice * item.quantity)}
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 15, color: livePrices[index] !== undefined && livePrices[index] !== item.unitPrice ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {fmtVND(effectivePrice(item, index) * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop row */}
              <div
                className="hidden lg:grid xl:grid-cols-[minmax(0,1fr)_140px_150px_40px]"
                style={{ gridTemplateColumns: 'minmax(0,1fr) 120px 130px 28px', gap: 20, padding: 24, alignItems: 'center', borderBottom: '1px solid var(--border-soft)' }}
              >
                <div style={{ display: 'flex', gap: 18, alignItems: 'center', minWidth: 0 }}>
                  <div style={{ width: 96, flexShrink: 0, background: 'var(--bg-surface)', borderRadius: 8, overflow: 'hidden', padding: 6 }}>
                    <ArtPiece
                      bg={(item.selectedAttrs?.['bg_tone'] as 'gold' | 'red' | 'bronze' | 'dark' | undefined) ?? 'gold'}
                      frame={(item.selectedAttrs?.['frame'] as 'bronze' | 'gold' | 'dark' | 'carved' | undefined) ?? 'bronze'}
                      label=""
                      pad={5}
                      aspect="4/3"
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 18, fontWeight: 600, lineHeight: 1.25, color: 'var(--text-primary)' }}>
                      {item.productTitle || item.productId}
                    </div>
                    {(item.sizeLabel || (item.selectedAttrs && Object.keys(item.selectedAttrs).length > 0)) && (
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, marginBottom: 8 }}>
                        {[item.sizeLabel, ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : [])].filter(Boolean).join(' · ')}
                      </div>
                    )}
                    <Link href={`/products/${item.productId}`} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Đổi tùy chọn</Link>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', width: 'fit-content' }}>
                  <button type="button" onClick={() => handleUpdateQuantity(index, item.quantity - 1)} style={{ width: 30, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: 16 }}>−</button>
                  <div style={{ width: 30, textAlign: 'center', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'var(--text-primary)' }}>{item.quantity}</div>
                  <button type="button" onClick={() => handleUpdateQuantity(index, item.quantity + 1)} style={{ width: 30, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: 16 }}>+</button>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {livePrices[index] !== undefined && livePrices[index] !== item.unitPrice && (
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtVND(item.unitPrice * item.quantity)}
                    </div>
                  )}
                  <div
                    className="price-num"
                    style={{ fontSize: 18, fontVariantNumeric: 'tabular-nums', color: livePrices[index] !== undefined && livePrices[index] !== item.unitPrice ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {fmtVND(effectivePrice(item, index) * item.quantity)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label="Xóa"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
              </div>
            </div>
            ))}

            <Link
              href="/"
              className="hidden lg:block"
              style={{ padding: '18px 24px', fontFamily: 'var(--font-lora), serif', fontStyle: 'italic', color: 'var(--accent)', fontSize: 15, textDecoration: 'none' }}
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>

          {/* Right column: summary + trust row */}
          <div className="lg:sticky lg:top-[92px]">
            {/* Summary box — light cream */}
            <div className="p-5 lg:p-7" style={{ marginTop: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)' }}>
              <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 20, fontWeight: 600, marginBottom: 14 }}>Tóm tắt đơn hàng</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>Tạm tính</span><span>{fmtVND(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>Phí giao hàng</span><span>Miễn phí</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                  <span>Lắp đặt</span><span>Miễn phí nội thành HN</span>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(42,31,26,0.14)', marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 10, letterSpacing: '0.15em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 4 }}>Tổng cộng</div>
              <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent)', marginBottom: 16 }}>
                {fmtVND(subtotal)}
              </div>

              <Link
                href="/checkout"
                style={{
                  display: 'block', width: '100%', marginTop: 16,
                  background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6,
                  padding: '13px 20px', fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontWeight: 500, fontSize: 14, cursor: 'pointer', textAlign: 'center',
                  textDecoration: 'none', boxSizing: 'border-box',
                }}
              >
                Tiến hành đặt hàng →
              </Link>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="block lg:hidden"
                style={{
                  width: '100%', marginTop: 8,
                  background: 'transparent', color: 'var(--text-primary)',
                  border: '1px solid rgba(42,31,26,0.14)', borderRadius: 6,
                  padding: '12px 20px', fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontSize: 13.5, cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box',
                }}
              >
                Tiếp tục mua sắm
              </button>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(42,31,26,0.14)' }}>
                Nhân viên sẽ gọi xác nhận đơn trong 30 phút (giờ hành chính).
              </div>
            </div>

          </div>
        </div>
        </>
      )}
      </Container>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
