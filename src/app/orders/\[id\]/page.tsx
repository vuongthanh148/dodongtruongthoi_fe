'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getOrderById } from '@/lib/storefront-api'
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(params.id)
        if (data) {
          setOrder(data)
        } else {
          setError('Không tìm thấy đơn hàng.')
        }
      } catch (err) {
        setError('Có lỗi khi tải thông tin đơn hàng.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[--bg-page] flex items-center justify-center">
        <p className="text-center text-[--text-secondary]">Đang tải...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[--bg-page] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn hàng.'}</p>
            <Link
              href="/orders"
              className="inline-block px-6 py-3 bg-[--accent] text-white rounded hover:opacity-90 transition-opacity"
            >
              Tra Cứu Đơn Hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  return (
    <div className="min-h-screen bg-[--bg-page] py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        {order.status === 'pending_confirm' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium mb-2">✓ Đặt Hàng Thành Công!</p>
            <p className="text-green-700 text-sm">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận chi tiết.
            </p>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-serif mb-2">Đơn Hàng #{order.id.slice(0, 8).toUpperCase()}</h1>
              <p className="text-[--text-secondary] text-sm">
                Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-t border-b">
            <div>
              <p className="text-[--text-secondary] text-sm mb-1">Số Điện Thoại</p>
              <p className="font-medium">{order.phone}</p>
            </div>
            {order.customerName && (
              <div>
                <p className="text-[--text-secondary] text-sm mb-1">Tên Khách Hàng</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
            )}
            {order.address && (
              <div className="col-span-2">
                <p className="text-[--text-secondary] text-sm mb-1">Địa Chỉ</p>
                <p className="font-medium">{order.address}</p>
              </div>
            )}
            {order.note && (
              <div className="col-span-2">
                <p className="text-[--text-secondary] text-sm mb-1">Ghi Chú</p>
                <p className="font-medium">{order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-serif mb-4">Chi Tiết Sản Phẩm</h2>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-[--accent]">{item.productTitle}</p>
                  <div className="text-sm text-[--text-secondary] space-y-1 mt-1">
                    {item.sizeLabel && <p>Kích thước: {item.sizeLabel}</p>}
                    {item.bgToneLabel && <p>Tông màu: {item.bgToneLabel}</p>}
                    {item.frameLabel && <p>Khung: {item.frameLabel}</p>}
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}₫
                  </p>
                  <p className="text-sm text-[--text-secondary]">
                    {item.unitPrice.toLocaleString('vi-VN')}₫ x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="text-lg font-serif">Tổng Cộng:</span>
            <span className="text-2xl font-serif text-[--accent]">
              {total.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Link
            href="/orders"
            className="flex-1 px-4 py-3 border border-[--accent] text-[--accent] rounded text-center hover:bg-gray-50 transition-colors"
          >
            Xem Đơn Hàng Khác
          </Link>
          <Link
            href="/"
            className="flex-1 px-4 py-3 bg-[--accent] text-white rounded text-center hover:opacity-90 transition-opacity"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>

        {/* Next Steps */}
        {order.status === 'pending_confirm' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-900 mb-2">📞 Bước Tiếp Theo:</p>
            <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
              <li>Chúng tôi sẽ gọi để xác nhận chi tiết đơn hàng</li>
              <li>Xác nhận giá và phương thức thanh toán</li>
              <li>Sắp xếp thời gian giao hàng</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
