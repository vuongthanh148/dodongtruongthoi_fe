'use client'

import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { getOrderById } from '@/lib/storefront-api'
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
      sub: 'Chúng tôi sẽ liên hệ xác nhận trong 1–2 giờ làm việc.',
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

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(params.id)
        if (data) {
          setOrder(data)
        } else {
          setError('Không tìm thấy đơn hàng.')
        }
      } catch {
        setError('Có lỗi khi tải thông tin đơn hàng.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [params.id])

  const topBar = <TopBar title="Chi Tiết Đơn Hàng" onMenu={() => setIsMenuOpen(true)} />

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--bg-page)',
        }}
      >
        {topBar}
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
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
        <FooterMinimal />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--bg-page)',
        }}
      >
        {topBar}
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
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
            {error || 'Không tìm thấy đơn hàng.'}
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
        <div style={{ flex: 1 }} />
        <FooterMinimal />
      </div>
    )
  }

  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const banner = statusBannerText(order.status)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-page)',
      }}
    >
      {topBar}
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
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

        {/* Order header card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'var(--bronze)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Thông tin đơn hàng
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.06em',
                }}
              >
                #{order.id.slice(0, 8).toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
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
        </div>

        {/* Customer info card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
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
            Thông tin giao hàng
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(107,68,35,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--bronze)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-lora), serif',
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {order.phone}
              </div>
            </div>
            {/* Name */}
            {order.customerName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(107,68,35,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={13}
                    height={13}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--bronze)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>
                  {order.customerName}
                </div>
              </div>
            )}
            {/* Address */}
            {order.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(107,68,35,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <svg
                    width={13}
                    height={13}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--bronze)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    paddingTop: 5,
                  }}
                >
                  {order.address}
                </div>
              </div>
            )}
            {/* Note */}
            {order.note && (
              <div
                style={{
                  marginTop: 4,
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.03)',
                  borderRadius: 8,
                  fontSize: 12.5,
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{order.note}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Items card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
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
            Sản phẩm
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr auto',
                  gap: 10,
                  paddingTop: index === 0 ? 0 : 12,
                  paddingBottom: 12,
                  borderBottom:
                    index < order.items.length - 1 ? '1px solid var(--border-soft)' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                {/* Thumbnail placeholder */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: 'var(--bg-surface)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    padding: 4,
                    flexShrink: 0,
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
                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontWeight: 600,
                      fontSize: 13.5,
                      color: 'var(--text-primary)',
                      lineHeight: 1.25,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.productTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      marginTop: 3,
                      lineHeight: 1.5,
                    }}
                  >
                    {[
                      item.sizeLabel,
                      ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : []),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                    {item.quantity > 1 ? ` · ×${item.quantity}` : ''}
                  </div>
                </div>
                {/* Price */}
                <div
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 13.5,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fmtVND(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          {/* Total row */}
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              Tổng cộng
            </div>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                fontSize: 22,
                color: 'var(--accent)',
              }}
            >
              {fmtVND(total)}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{ background: 'var(--bg-dark)', borderRadius: 12, padding: '16px 16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'rgba(201,169,97,0.7)',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Cần hỗ trợ?
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontSize: 22,
              color: 'var(--gold)',
              marginBottom: 12,
            }}
          >
            0899 · 012 · 288
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href="tel:0899012288"
              style={{
                flex: 1,
                padding: '11px 0',
                background: 'rgba(201,169,97,0.15)',
                border: '1px solid rgba(201,169,97,0.3)',
                borderRadius: 8,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 13,
                color: 'var(--gold)',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Gọi ngay
            </a>
            <a
              href="https://zalo.me/0899012288"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '11px 0',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 13,
                color: 'rgba(244,237,224,0.8)',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Zalo
            </a>
            <a
              href="https://m.me/dodongtruongthoi"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '11px 0',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 13,
                color: 'rgba(244,237,224,0.8)',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Messenger
            </a>
          </div>
        </div>

        {/* Bottom nav links */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href="/orders"
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 13,
              color: 'var(--text-primary)',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Đơn khác
          </Link>
          <Link
            href="/"
            style={{
              flex: 1.4,
              padding: '12px 0',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 6,
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontWeight: 500,
              fontSize: 13,
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}
