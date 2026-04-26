'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getOrdersByPhone } from '@/lib/storefront-api'
import type { Order } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending_confirm: 'Chờ Xác Nhận',
  confirmed: 'Đã Xác Nhận',
  processing: 'Đang Xử Lý',
  shipped: 'Đang Giao',
  completed: 'Đã Giao',
  cancelled: 'Đã Hủy',
}

const STATUS_COLORS: Record<string, string> = {
  pending_confirm: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)

    const normalizedPhone = phone.replace(/\D/g, '')
    if (normalizedPhone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ.')
      setLoading(false)
      return
    }

    try {
      const result = await getOrdersByPhone(normalizedPhone)
      setOrders(result || [])
    } catch (err) {
      setError('Có lỗi khi tra cứu đơn hàng.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[--bg-page] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Tra Cứu Đơn Hàng</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              className="flex-1 px-4 py-2 border border-[--text-secondary]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[--accent] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Đang tìm...' : 'Tìm'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && searched && orders.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-[--text-secondary] mb-4">Không tìm thấy đơn hàng nào.</p>
            <Link
              href="/cart"
              className="inline-block px-6 py-3 bg-[--accent] text-white rounded hover:opacity-90 transition-opacity"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-lg mb-1">Mã Đơn: {order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-[--text-secondary]">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 py-4 border-t border-b">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-sm flex justify-between">
                        <span>{item.productTitle} x{item.quantity}</span>
                        <span>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}₫</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-[--text-secondary]">+{order.items.length - 2} sản phẩm khác</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[--text-secondary]">Tổng:</span>
                    <span className="font-serif text-lg text-[--accent]">
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Info Box */}
        {!searched && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-900 mb-2">📱 Nhập số điện thoại mà bạn sử dụng khi đặt hàng</p>
            <p className="text-blue-800 text-sm">
              Chúng tôi sẽ hiển thị tất cả đơn hàng của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
