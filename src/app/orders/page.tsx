'use client'

import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { getOrdersByPhone } from '@/lib/storefront-api'
import type { Order } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'

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
    shipped: { bg: 'rgba(0,150,80,0.12)', color: '#006640' },
    completed: { bg: 'rgba(0,150,80,0.12)', color: '#006640' },
    cancelled: { bg: 'rgba(139,30,30,0.10)', color: 'var(--accent)' },
  }
  const s = map[status] ?? { bg: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)' }
  return {
    background: s.bg,
    color: s.color,
    borderRadius: 100,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-be-vietnam), sans-serif',
    whiteSpace: 'nowrap',
  }
}

export default function OrdersPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    } catch {
      setError('Có lỗi khi tra cứu đơn hàng.')
      setOrders([])
    } finally {
      setLoading(false)
    }
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
      <TopBar title="Tra Cứu Đơn Hàng" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Search input */}
      <div style={{ padding: '18px 16px 0' }}>
        <div
          style={{
            fontFamily: 'var(--font-be-vietnam), sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'var(--bronze)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Nhập số điện thoại đặt hàng
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as unknown as React.FormEvent)}
            placeholder="0912 345 678"
            style={{
              flex: 1,
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
              padding: '12px 20px',
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '...' : 'Tìm →'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            margin: '12px 16px 0',
            padding: '10px 14px',
            background: 'rgba(139,30,30,0.08)',
            border: '1px solid rgba(139,30,30,0.2)',
            borderRadius: 8,
            fontSize: 13,
            color: 'var(--accent)',
          }}
        >
          {error}
        </div>
      )}

      {/* Initial state — info alert */}
      {!searched && (
        <div style={{ padding: '24px 16px 0' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(107,68,35,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--bronze)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: 'var(--text-primary)',
                  marginBottom: 5,
                }}
              >
                Tra cứu bằng số điện thoại
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Nhập số điện thoại bạn đã dùng khi đặt hàng để xem trạng thái đơn.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && searched && orders.length === 0 && !error && (
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: 22,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Không tìm thấy đơn hàng
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Vui lòng kiểm tra lại số điện thoại, hoặc liên hệ hotline để được hỗ trợ.
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontSize: 20,
              color: 'var(--accent)',
              marginTop: 20,
            }}
          >
            0899 · 012 · 288
          </div>
        </div>
      )}

      {/* Order cards */}
      {orders.length > 0 && (
        <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'var(--bronze)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {orders.length} đơn hàng
          </div>
          {orders.map((order) => {
            const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
            const firstItem = order.items[0]
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  background: '#fffdf7',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <span style={statusBadgeStyle(order.status)}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                {firstItem && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        flexShrink: 0,
                        background: 'var(--bg-surface)',
                        borderRadius: 8,
                        overflow: 'hidden',
                        padding: 4,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'var(--bg-surface-alt)',
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-lora), serif',
                          fontWeight: 600,
                          fontSize: 13,
                          color: 'var(--text-primary)',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {firstItem.productTitle}
                      </div>
                      {order.items.length > 1 && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          +{order.items.length - 1} sản phẩm khác
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderTop: '1px solid var(--border-soft)',
                    paddingTop: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: 16,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {total.toLocaleString('vi-VN')}đ
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontStyle: 'italic',
                      fontSize: 12,
                      color: 'var(--accent)',
                    }}
                  >
                    Xem chi tiết →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}
