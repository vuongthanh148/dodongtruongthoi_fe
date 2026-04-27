'use client'

import Link from 'next/link'
import {
  DrumMark,
  IconFacebook,
  IconMail,
  IconMapPin,
  IconMessenger,
  IconPhone,
  IconTiktok,
  IconZalo,
} from '@/components/icons'
import { Btn } from '@/components/ui/Btn'
import { HOTLINE, SHOP_ADDRESS, SITE_NAME, SHOP_EMAIL, COMPANY_NAME, GOOGLE_MAPS_URL, SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  return (
    <footer style={{ margin: '28px 0 0 0' }}>
      {/* ZONE 1: Brand Block (dark bg) */}
      <div
        style={{
          background: 'var(--bg-dark)',
          color: 'var(--text-on-dark)',
          padding: '28px 20px',
        }}
      >
        {/* Logo + brand side by side */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <DrumMark size={36} color="var(--gold)" />
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontStyle: 'italic',
                fontSize: 10.5,
                color: 'rgba(244, 237, 224, 0.7)',
                letterSpacing: '0.08em',
                marginTop: 2,
              }}
            >
              tinh hoa làng nghề Việt
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {[
            { Icon: IconZalo, href: SOCIAL_LINKS.zalo },
            { Icon: IconMessenger, href: SOCIAL_LINKS.messenger },
            { Icon: IconFacebook, href: SOCIAL_LINKS.facebook },
            { Icon: IconTiktok, href: SOCIAL_LINKS.tiktok },
          ].map(({ Icon, href }, idx) => (
            <Btn
              key={idx}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(href, '_blank')}
              style={{
                padding: 8,
                color: 'var(--gold)',
              }}
            >
              <Icon size={20} />
            </Btn>
          ))}
        </div>
      </div>

      {/* ZONE 2: Links Grid (page bg) */}
      <div
        style={{
          background: 'var(--bg-page)',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        {/* Left column: KHÁM PHÁ */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            Khám phá
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/" style={{ fontSize: 15, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <Link href="/saved" style={{ fontSize: 15, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Sản phẩm đã lưu
            </Link>
          </div>
        </div>

        {/* Right column: THÔNG TIN */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            Thông tin
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/lang-nghe" style={{ fontSize: 15, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Câu chuyện làng nghề →
            </Link>
            <Link href="/huong-dan-mua-hang" style={{ fontSize: 15, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Hướng dẫn mua hàng →
            </Link>
            <Link href="/faq" style={{ fontSize: 15, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Câu hỏi thường gặp →
            </Link>
          </div>
        </div>
      </div>

      {/* ZONE 3: Contact Strip */}
      <div
        style={{
          background: 'var(--bg-surface-alt)',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        {/* Contact top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IconPhone size={14} color="var(--accent)" />
            {HOTLINE}
          </div>
          <Btn
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(GOOGLE_MAPS_URL, '_blank')}
            style={{
              fontSize: 13,
              padding: '6px 12px',
            }}
          >
            Bản đồ →
          </Btn>
        </div>

        {/* Contact info */}
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconMail size={14} color="var(--text-muted)" />
          {SHOP_EMAIL}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconMapPin size={14} color="var(--text-muted)" />
          {SHOP_ADDRESS}
        </div>

        {/* Report issue link */}
        <button
          type="button"
          onClick={() => window.open(`https://zalo.me/${HOTLINE.replace(/\D/g, '')}?text=Tôi muốn báo cáo sự cố`, '_blank')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 13,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          Báo cáo sự cố
        </button>
      </div>

      {/* ZONE 4: Bottom Bar (dark bg) */}
      <div
        style={{
          background: 'var(--bg-dark)',
          color: 'var(--text-on-dark)',
          padding: '14px 20px',
          textAlign: 'center',
          fontSize: 12,
        }}
      >
        <div style={{ marginBottom: 4, opacity: 0.75 }}>
          {COMPANY_NAME} · MST: Chưa cập nhật
        </div>
        <div style={{ opacity: 0.75 }}>
          © 2025 {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export function FooterMinimal() {
  return (
    <footer style={{ marginTop: 'auto' }}>
      {/* Brand Block (dark bg) */}
      <div
        style={{
          background: 'var(--bg-dark)',
          color: 'var(--text-on-dark)',
          padding: '28px 20px',
        }}
      >
        {/* Logo + brand side by side */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <DrumMark size={36} color="var(--gold)" />
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontStyle: 'italic',
                fontSize: 10.5,
                color: 'rgba(244, 237, 224, 0.7)',
                letterSpacing: '0.08em',
                marginTop: 2,
              }}
            >
              tinh hoa làng nghề Việt
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {[
            { Icon: IconZalo, href: SOCIAL_LINKS.zalo },
            { Icon: IconMessenger, href: SOCIAL_LINKS.messenger },
            { Icon: IconFacebook, href: SOCIAL_LINKS.facebook },
            { Icon: IconTiktok, href: SOCIAL_LINKS.tiktok },
          ].map(({ Icon, href }, idx) => (
            <Btn
              key={idx}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(href, '_blank')}
              style={{
                color: 'var(--text-on-dark)',
                opacity: 0.8,
                padding: '8px',
                minWidth: 0,
              }}
            >
              <Icon size={20} color="var(--text-on-dark)" />
            </Btn>
          ))}
        </div>
      </div>
    </footer>
  )
}
