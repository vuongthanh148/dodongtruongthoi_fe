'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCartItems, removeCartItem, setCartItems } from '@/lib/storage'
import type { CartItem } from '@/lib/types'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getCartItems())
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[--bg-page] flex items-center justify-center">
        <p className="text-center text-[--text-secondary]">Đang tải...</p>
      </div>
    )
  }

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

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[--bg-page] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-serif mb-8 text-center">Giỏ Hàng</h1>
          <div className="text-center py-12">
            <p className="text-[--text-secondary] mb-6">Giỏ hàng của bạn đang trống</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[--accent] text-white rounded hover:opacity-90 transition-opacity"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--bg-page] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Giỏ Hàng</h1>

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {items.map((item, index) => (
            <div key={index} className="border-b last:border-b-0 p-4 sm:p-6 flex gap-4">
              {/* Variant Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg text-[--accent] mb-1">
                  {item.productId}
                </h3>
                <div className="text-sm text-[--text-secondary] space-y-1">
                  {item.sizeId && <p>Kích thước: {item.sizeId}</p>}
                  {item.bgToneLabel && (
                    <p>
                      Tông màu: {item.bgToneLabel}
                    </p>
                  )}
                  {item.frameLabel && (
                    <p>
                      Khung: {item.frameLabel}
                    </p>
                  )}
                </div>
              </div>

              {/* Qty & Price */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                    className="px-2 py-1 border border-[--text-secondary] rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                    className="px-2 py-1 border border-[--text-secondary] rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-[--text-secondary]">
                  {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}₫
                </p>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-sm text-red-600 hover:text-red-800 mt-2"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <span className="text-lg font-serif">Tổng Cộng:</span>
              <span className="text-2xl font-serif text-[--accent]">
                {subtotal.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Link
                href="/"
                className="flex-1 px-4 py-3 border border-[--accent] text-[--accent] rounded text-center hover:bg-gray-50 transition-colors"
              >
                Tiếp Tục Mua Sắm
              </Link>
              <Link
                href="/checkout"
                className="flex-1 px-4 py-3 bg-[--accent] text-white rounded text-center hover:opacity-90 transition-opacity"
              >
                Tiến Hành Thanh Toán
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
