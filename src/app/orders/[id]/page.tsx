'use client'

import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { getOrderById } from '@/lib/storefront-api'
import { maskPhone, maskName, maskAddress } from '@/lib/order-lookup'
import { HOTLINE } from '@/lib/constants'
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
        <DeskHeader />
        {topBar}
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tra cứu đơn hàng', href: '/orders' }, { label: 'Chi tiết đơn hàng' }]} />
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
        <Footer />
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
        <DeskHeader />
        {topBar}
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tra cứu đơn hàng', href: '/orders' }, { label: 'Chi tiết đơn hàng' }]} />
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
        <Footer />
      </div>
    )
  }

  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const fmtVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const banner = statusBannerText(order.status)

  // Timeline stages
  const stages: { id: string; label: string }[] = [
    { id: 'pending_confirm', label: 'Đã đặt' },
    { id: 'confirmed', label: 'Đã xác nhận' },
    { id: 'processing', label: 'Đang chế tác' },
    { id: 'shipped', label: 'Đang giao' },
    { id: 'completed', label: 'Đã giao' },
  ]
  const currentIdx = stages.findIndex((s) => s.id === order.status)

  // Card style
  const cardStyle: React.CSSProperties = {
    background: '#fffdf7',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 24,
  }

  const cardHeadingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-lora), serif',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: 'var(--text-primary)',
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
      <DeskHeader />
      {topBar}
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tra cứu đơn hàng', href: '/orders' }, { label: order.id.slice(0, 8).toUpperCase() }]} />

      <div
        style={{
          maxWidth: 1344,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
        className="px-4 sm:px-6 lg:px-8 xl:px-8"
      >
        {/* Header row: H1 + Status badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: 32,
                fontWeight: 600,
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-primary)',
              }}
            >
              Đơn {order.id.slice(0, 8).toUpperCase()}
            </h1>
            <div
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                marginTop: 4,
              }}
            >
              Đặt ngày{' '}
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

        {/* Two-column grid: left (timeline + products) | right (payment + delivery + contact) */}
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Timeline card */}
            {order.status !== 'cancelled' && (
              <div style={cardStyle}>
                <div style={cardHeadingStyle}>Tiến trình</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))`,
                    gap: 0,
                  }}
                >
                  {stages.map((s, i) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            fontSize: 11,
                            flexShrink: 0,
                            background: i <= currentIdx ? 'var(--accent)' : 'var(--bg-surface-alt)',
                            color: i <= currentIdx ? 'white' : 'var(--text-muted)',
                            border: i <= currentIdx ? 'none' : '1px solid var(--border)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {i <= currentIdx ? '✓' : ''}
                        </div>
                        {i < stages.length - 1 && (
                          <div
                            style={{
                              flex: 1,
                              height: 2,
                              background: i < currentIdx ? 'var(--accent)' : 'var(--border)',
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: i <= currentIdx ? 'var(--text-primary)' : 'var(--text-muted)',
                          fontWeight: i === currentIdx ? 600 : 400,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products card */}
            <div style={cardStyle}>
              <div style={cardHeadingStyle}>Sản phẩm</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px minmax(0,1fr) auto',
                      gap: 14,
                      alignItems: 'center',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 110,
                        height: 'auto',
                        aspectRatio: '4/3',
                        flexShrink: 0,
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <ArtPiece
                        pad={4}
                        aspect="4/3"
                        label={item.productTitle}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-lora), serif',
                          fontSize: 17,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.productTitle}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: 'var(--text-muted)',
                          marginTop: 3,
                        }}
                      >
                        {[
                          item.sizeLabel,
                          ...(item.selectedAttrs ? Object.values(item.selectedAttrs) : []),
                        ]
                          .filter(Boolean)
                          .join(' · ')}{' '}
                        ·{' ×'}
                        {item.quantity}
                      </div>
                    </div>
                    {/* Price */}
                    <div
                      style={{
                        fontFamily: 'var(--font-lora), serif',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: 15,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtVND(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column (sticky) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
            className="lg:sticky lg:top-[92px]"
          >
            {/* Payment card */}
            <div style={cardStyle}>
              <div style={cardHeadingStyle}>Thanh toán</div>
              {[
                ['Tạm tính', fmtVND(total)],
                ['Phí giao hàng', 'Miễn phí'],
                ['Phương thức', 'COD'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    padding: '6px 0',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
              <div
                style={{
                  margin: '10px 0',
                  height: 1,
                  background: 'var(--border)',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  Tổng cộng
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--accent)',
                  }}
                >
                  {fmtVND(total)}
                </span>
              </div>
            </div>

            {/* Delivery card */}
            <div style={cardStyle}>
              <div style={cardHeadingStyle}>Giao đến</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {order.customerName ? maskName(order.customerName) : ''} · {maskPhone(order.phone)}
                {order.address && (
                  <>
                    <br />
                    {maskAddress(order.address)}
                  </>
                )}
                {order.note && (
                  <>
                    <br />
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {order.note}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Contact button */}
            <a
              href={`tel:${HOTLINE.replace(/\s/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 50,
                padding: '0 22px',
                borderRadius: 6,
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid var(--accent)',
                background: 'transparent',
                color: 'var(--accent)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Liên hệ về đơn hàng
            </a>
          </div>

        </div>
      </div>

      {/* Bottom nav links */}
      <div
        style={{
          maxWidth: 1344,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          fontSize: 13.5,
          color: 'var(--text-secondary)',
        }}
        className="px-4 sm:px-6 lg:px-8 xl:px-8"
      >
        <Link
          href="/orders"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          ← Tra cứu đơn khác
        </Link>
        <Link
          href="/"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
