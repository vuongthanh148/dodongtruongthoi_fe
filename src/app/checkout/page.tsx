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

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Form state
  const [phone, setPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const cartItems = getCartItems()
    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }
    setItems(cartItems)
    setMounted(true)
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[--bg-page]">
        <TopBar
          title="Đặt hàng"
          onMenu={() => setIsMenuOpen(true)}
          onOpenSaved={() => router.push('/saved')}
        />
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <div className="flex items-center justify-center py-16">
          <p className="text-center text-[--text-secondary]">Đang tải...</p>
        </div>

        <FooterMinimal />
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate phone
    const normalizedPhone = phone.replace(/\D/g, '')
    if (normalizedPhone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 chữ số).')
      setLoading(false)
      return
    }

    if (items.length === 0) {
      setError('Giỏ hàng trống. Vui lòng thêm sản phẩm.')
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
          bgTone: item.bgTone,
          bgToneLabel: item.bgToneLabel,
          frame: item.frame,
          frameLabel: item.frameLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          variantImageUrl: item.variantImageUrl,
        })),
      })

      if (result?.id) {
        // Clear cart on success
        clearCart()
        // Redirect to order confirmation page
        router.push(`/orders/${result.id}`)
      } else {
        setError('Có lỗi khi đặt hàng. Vui lòng thử lại.')
        setLoading(false)
      }
    } catch (err) {
      setError('Có lỗi khi kết nối. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[--bg-page]">
      <TopBar
        title="Đặt hàng"
        onMenu={() => setIsMenuOpen(true)}
        onOpenSaved={() => router.push('/saved')}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Đặt Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số Điện Thoại <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full px-4 py-2 border border-[--text-secondary]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tên Khách Hàng</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-[--text-secondary]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Địa Chỉ Giao Hàng</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Đường ABC, Phường XYZ, TP. HCM"
                  className="w-full px-4 py-2 border border-[--text-secondary]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ghi Chú</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  rows={4}
                  className="w-full px-4 py-2 border border-[--text-secondary]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent] resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link
                  href="/cart"
                  className="flex-1 px-4 py-3 border border-[--accent] text-[--accent] rounded text-center hover:bg-gray-50 transition-colors"
                >
                  Quay Lại
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[--accent] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt Hàng'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Items Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-serif mb-4">Đơn Hàng</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-[--accent]">{item.productTitle || item.productId}</p>
                      <p className="text-[--text-secondary] text-xs">
                        x{item.quantity}
                        {item.sizeLabel && ` | ${item.sizeLabel}`}
                      </p>
                    </div>
                    <p className="font-medium">
                      {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span>Liên hệ sau</span>
                </div>
                <div className="flex justify-between font-serif text-lg pt-2 border-t">
                  <span>Tổng:</span>
                  <span className="text-[--accent]">
                    {subtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <p className="font-medium mb-1">💡 Thông Tin:</p>
                <p>
                  Đơn hàng sẽ chờ xác nhận. Chúng tôi sẽ gọi điện thoại để xác nhận chi tiết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterMinimal />
    </div>
  )
}
