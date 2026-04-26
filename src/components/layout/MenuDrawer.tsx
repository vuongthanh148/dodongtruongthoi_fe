'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DrumMark,
  IconChevron,
  IconClose,
  IconFacebook,
  IconMessenger,
  IconSearch,
  IconTiktok,
  IconZalo,
} from '@/components/icons'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { HOTLINE, SHOP_ADDRESS, SHOP_EMAIL, SITE_NAME } from '@/lib/constants'
import { fetchCategories } from '@/lib/storefront-api'
import { getSavedProducts } from '@/lib/storage'
import type { Category } from '@/lib/types'

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

const exploreLinks = [
  { id: 'home', href: '/', label: 'Trang chủ', hint: 'Bộ sưu tập nổi bật' },
]

const accountLinks = [
  { id: 'saved', href: '/saved', label: 'Sản phẩm đã lưu', hint: 'Mục yêu thích' },
  { id: 'cart', href: '/cart', label: 'Giỏ hàng', hint: 'Đặt hàng nhanh' },
  { id: 'orders', href: '/orders', label: 'Đơn hàng của tôi', hint: 'Tra cứu bằng số điện thoại' },
]

const infoLinks = [
  { id: 'craft', href: '/lang-nghe', label: 'Câu chuyện làng nghề' },
  { id: 'guide', href: '/huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { id: 'faq', href: '/faq', label: 'Câu hỏi thường gặp' },
  { id: 'shipping', href: '/huong-dan-mua-hang', label: 'Giao hàng & bảo hành' },
  { id: 'contact', href: `mailto:${SHOP_EMAIL}`, label: 'Liên hệ' },
]

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    setSavedCount(getSavedProducts().length)
    if (open) {
      fetchCategories().then(setCategories)
    }
  }, [open])

  const categoryLinks = categories.map((cat) => ({
    id: cat.id,
    href: `/categories/${cat.id}`,
    label: cat.name,
    hint: '',
  }))

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
        className="paper"
        style={{
          width: '86%',
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 40px rgba(0,0,0,0.25)',
          height: '100%',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: prefersReduced ? 'none' : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Fixed Header — does not scroll */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ padding: '16px 20px 16px', paddingTop: 'max(16px, env(safe-area-inset-top, 16px))', background: 'var(--bg-dark)', color: 'var(--text-on-dark)', position: 'relative' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-on-dark)',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <IconClose size={22} color="var(--text-on-dark)" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <DrumMark size={36} color="var(--gold)" />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 19,
                    fontWeight: 600,
                    color: 'var(--gold)',
                    lineHeight: 1.05,
                  }}
                >
                  {SITE_NAME}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontStyle: 'italic',
                    fontSize: 10.5,
                    color: 'rgba(244,237,224,0.7)',
                    letterSpacing: '0.08em',
                  }}
                >
                  tinh hoa làng nghề Việt
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 16px 8px', background: 'var(--bg-page)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 100,
                padding: '9px 14px',
              }}
            >
              <IconSearch size={15} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tìm tranh, định đồng...</span>
            </div>
          </div>
        </div>

        {/* Scrollable nav content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* KHÁM PHÁ Section */}
        <div style={{ padding: '14px 0 0', borderBottom: '1px solid var(--border-soft)' }}>
          <Label className="px-5 pb-2.5">Khám phá</Label>
          {exploreLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-soft)',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
              }}
            >
              <div>
                <Heading size="sm" style={{ color: 'var(--text-primary)' }}>{item.label}</Heading>
                <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 400 }}>
                  {item.hint}
                </div>
              </div>
              <IconChevron size={14} color="var(--bronze)" />
            </Link>
          ))}
        </div>

        {/* DANH MỤC Section */}
        <div style={{ padding: '20px 0 0', borderBottom: '1px solid var(--border-soft)' }}>
          <Label className="px-5 pb-2.5">Danh mục</Label>
          {categoryLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-soft)',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
              }}
            >
              <div>
                <Heading size="sm" style={{ color: 'var(--text-primary)' }}>{item.label}</Heading>
              </div>
              <IconChevron size={14} color="var(--bronze)" />
            </Link>
          ))}
        </div>

        {/* TÀI KHOẢN & ĐƠN HÀNG Section */}
        <div style={{ padding: '20px 0 0', borderBottom: '1px solid var(--border-soft)' }}>
          <Label className="px-5 pb-2.5">Tài khoản & Đơn hàng</Label>
          {accountLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-soft)',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
              }}
            >
              <div>
                <Heading size="sm" style={{ color: 'var(--text-primary)' }}>{item.label}</Heading>
                <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 400 }}>
                  {item.id === 'saved' ? `${savedCount} mục` : item.hint}
                </div>
              </div>
              <IconChevron size={14} color="var(--bronze)" />
            </Link>
          ))}
        </div>

        <div style={{ padding: '20px 0 0', borderBottom: '1px solid var(--border-soft)', flex: 1 }}>
          <Label className="px-5 pb-1.5">Thông tin</Label>
          {infoLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
              }}
            >
              <Heading as="div" size="sm" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 14, lineHeight: 1.3 }}>
                {item.label}
              </Heading>
              <IconChevron size={14} color="var(--bronze)" />
            </Link>
          ))}
        </div>

        <div style={{ margin: '16px 16px 20px', padding: '14px', background: 'var(--bg-surface-alt)', borderRadius: 8, marginTop: 'auto' }}>
          <Label className="mb-2">Chốt đơn trực tiếp</Label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            {[IconZalo, IconMessenger, IconFacebook, IconTiktok].map((Icon, index) => (
              <span
                key={index}
                style={{
                  flex: 1,
                  aspectRatio: '1/1',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon size={24} />
              </span>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 15, fontWeight: 600, color: 'var(--accent)', marginTop: 12, lineHeight: 1.3 }}>
            Hotline
            <br />
            <span style={{ fontSize: 15, fontWeight: 500 }}>{HOTLINE}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.4, fontWeight: 400 }}>
            Xưởng {SHOP_ADDRESS}
          </div>
        </div>
        </div>
      </aside>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        style={{
          flex: 1,
          border: 'none',
          background: 'rgba(20,14,9,0.55)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 280ms ease',
        }}
      />
    </div>
  )
}
