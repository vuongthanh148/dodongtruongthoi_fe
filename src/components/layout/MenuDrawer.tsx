'use client'

import {
  DrumMark,
  IconChevron,
  IconClose,
  IconFacebook,
  IconHeart,
  IconMessenger,
  IconTiktok,
  IconZalo,
} from '@/components/icons'
import { HOTLINE, SHOP_ADDRESS, SITE_NAME } from '@/lib/constants'
import { getCartItems, getSavedProducts } from '@/lib/storage'
import { fetchCategories } from '@/lib/storefront-api'
import type { Category } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

const BG_TONE_COLORS: Record<string, string> = {
  gold: '#c9a961',
  red: '#8b1e1e',
  bronze: '#6b4423',
  dark: '#2a1d13',
}

const infoLinks = [
  { id: 'craft', href: '/lang-nghe', label: 'Câu chuyện làng nghề' },
  { id: 'guide', href: '/huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { id: 'faq', href: '/faq', label: 'Câu hỏi thường gặp' },
]

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])

  const navigate = (href: string) => {
    onClose()
    setTimeout(() => router.push(href), prefersReduced ? 0 : 290)
  }

  const savedCount = open ? getSavedProducts().length : 0
  const cartCount = open ? getCartItems().reduce((s, i) => s + i.quantity, 0) : 0

  useEffect(() => {
    if (open) {
      fetchCategories().then(setCategories)
    }
  }, [open])

  const quickActions = [
    { id: 'home', href: '/', label: 'Trang chủ', Icon: IconHomeInline, badge: 0 },
    { id: 'saved', href: '/saved', label: 'Đã lưu', Icon: IconHeart, badge: savedCount },
    { id: 'cart', href: '/cart', label: 'Giỏ hàng', Icon: IconCartInline, badge: cartCount },
    { id: 'orders', href: '/orders', label: 'Đơn hàng', Icon: IconBoxInline, badge: 0 },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        pointerEvents: open ? 'all' : 'none',
      }}
    >
      <aside
        style={{
          width: '86%',
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '8px 0 48px rgba(0,0,0,0.28)',
          height: '100%',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          opacity: open ? 1 : 0,
          transition: prefersReduced ? 'none' : 'transform 280ms ease-out, opacity 280ms ease-out',
          overflow: 'hidden',
        }}
      >
        {/* Header — dark ink background */}
        <div
          style={{
            background: 'var(--bg-dark)',
            padding: '52px 20px 22px',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 50,
              right: 16,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconClose size={18} color="white" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <DrumMark size={40} color="var(--gold)" />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-be-vietnam), sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-on-dark)',
                  lineHeight: 1.1,
                }}
              >
                {SITE_NAME}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-lora), serif',
                  fontStyle: 'italic',
                  fontSize: 11,
                  color: 'var(--gold)',
                  marginTop: 3,
                }}
              >
                tinh hoa làng nghề Việt
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Quick actions 2-col grid */}
          <div
            style={{
              padding: '16px 16px 0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            {quickActions.map(({ id, href, label, Icon, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(href)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                <Icon size={18} color="var(--bg-dark)" />
                <div
                  style={{
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontWeight: 600,
                    fontSize: 12,
                    color: 'var(--bg-dark)',
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </div>
                {badge > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      minWidth: 16,
                      height: 16,
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {badge}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '20px 16px 0' }} />

          {/* Categories */}
          <div style={{ padding: '16px 0 0' }}>
            <div
              style={{
                padding: '0 16px 10px',
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'var(--bronze)',
                textTransform: 'uppercase',
              }}
            >
              Danh mục
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/categories/${cat.id}`)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 5,
                      flexShrink: 0,
                      background: BG_TONE_COLORS['bronze'],
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-lora), serif',
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--bg-dark)',
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.name}
                    </div>
                    {(cat.productCount ?? 0) > 0 && (
                      <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        {cat.productCount} sản phẩm
                      </div>
                    )}
                  </div>
                </div>
                <IconChevron size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', margin: '16px 16px 0' }} />

          {/* Info links */}
          <div style={{ padding: '16px 0 0' }}>
            <div
              style={{
                padding: '0 16px 10px',
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'var(--bronze)',
                textTransform: 'uppercase',
              }}
            >
              Tìm hiểu thêm
            </div>
            {infoLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.href)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontSize: 13.5,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                </span>
                <IconChevron size={13} color="var(--text-muted)" />
              </button>
            ))}
          </div>

          {/* Contact block */}
          <div
            style={{
              margin: '16px 16px 24px',
              padding: 16,
              background: 'var(--bg-dark)',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 9.5,
                letterSpacing: '0.2em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Liên hệ trực tiếp
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
                marginBottom: 14,
              }}
            >
              {[IconZalo, IconMessenger, IconFacebook, IconTiktok].map((Ic, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1/1',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    minHeight: 40,
                  }}
                >
                  <Ic size={22} />
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--gold)',
              }}
            >
              {HOTLINE}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(244,237,224,0.55)', marginTop: 3 }}>
              {SHOP_ADDRESS}
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        style={{
          flex: 1,
          border: 'none',
          background: 'rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 280ms ease-out',
          cursor: 'default',
        }}
      />
    </div>
  )
}

// Inline icon components not yet in the icon index
function IconHomeInline({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

function IconCartInline({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconBoxInline({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
    </svg>
  )
}
