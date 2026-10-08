'use client'

import Link from 'next/link'
import { IconFacebook, IconMessenger, IconTiktok, IconZalo } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/layout/Logo'
import { COMPANY_NAME, SITE_NAME, SOCIAL_LINKS } from '@/lib/constants'
import { MEGA_MENU_GROUPS } from '@/lib/desktop-nav'

const SUPPORT_LINKS = [
  { label: 'Tra cứu đơn hàng', href: '/orders' },
  { label: 'Hướng dẫn mua hàng', href: '/huong-dan-mua-hang' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
  { label: 'Cẩm nang', href: '/cam-nang' },
]

const POLICY_LABELS = ['Đổi trả', 'Vận chuyển & lắp đặt', 'Bảo hành', 'Thanh toán']

const SOCIALS = [
  { Icon: IconZalo, href: SOCIAL_LINKS.zalo, label: 'Zalo' },
  { Icon: IconMessenger, href: SOCIAL_LINKS.messenger, label: 'Messenger' },
  { Icon: IconFacebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { Icon: IconTiktok, href: SOCIAL_LINKS.tiktok, label: 'Tiktok' },
]

function ColHeading({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 font-body text-[13px] font-semibold text-[var(--gold)]">{children}</div>
}

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--bg-dark)] text-[var(--text-on-dark-muted)]">
      <Container className="pt-7 pb-6 md:pt-9 md:pb-8 lg:grid lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:items-start lg:gap-6 lg:pt-13 lg:pb-10 xl:gap-10">
        {/* Brand block: logo + socials (one row below md, stacked at lg). */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-on-dark)] pb-5 md:pb-6 lg:flex-col lg:items-start lg:gap-4 lg:border-b-0 lg:pb-0">
          <Logo size="lg" variant="gold" tagline="always" />
          <p className="hidden max-w-[320px] text-[13.5px] leading-[1.7] lg:block">
            Tranh đồng, trống đồng và đồ thờ chế tác thủ công bởi nghệ nhân làng Đại Bái.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-on-dark)] transition-colors hover:border-[var(--gold)]"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns: 2 across at sm, 3 at md, 4 with the brand column at lg. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 pt-7 md:grid-cols-3 md:gap-6 md:pt-7 lg:contents">
          <div className="flex flex-col gap-2.5 text-[13.5px] lg:text-sm">
            <ColHeading>Sản phẩm</ColHeading>
            {MEGA_MENU_GROUPS.map((g) => (
              <Link key={g.title} href={g.allHref} className="hover:text-[var(--gold)]">
                {g.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px] lg:text-sm">
            <ColHeading>Hỗ trợ</ColHeading>
            {SUPPORT_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[var(--gold)]">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px] lg:text-sm">
            <ColHeading>Chính sách</ColHeading>
            {POLICY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-[var(--border-on-dark)]">
        <Container className="flex flex-col gap-1.5 py-3.5 text-[12px] text-[var(--text-on-dark-subtle)] md:flex-row md:justify-between">
          <span>{COMPANY_NAME} · MST: Chưa cập nhật</span>
          <span>© 2026 {SITE_NAME}</span>
        </Container>
      </div>
    </footer>
  )
}
