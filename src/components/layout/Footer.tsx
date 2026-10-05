'use client'

import Link from 'next/link'
import { DrumMark, IconFacebook, IconMessenger, IconTiktok, IconZalo } from '@/components/icons'
import { Container } from '@/components/layout/Container'
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
  return <div className="label-mono mb-1 text-[10.5px] text-[var(--gold)]">{children}</div>
}

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--bg-dark)] text-[rgba(244,237,224,0.78)]">
      <Container className="py-8 lg:grid lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:items-start lg:gap-6 lg:py-13 xl:gap-10">
        {/* Brand block */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 lg:flex-col lg:items-start lg:gap-4 lg:border-b-0 lg:pb-0">
          <div className="flex items-center gap-3">
            <DrumMark size={36} color="var(--gold)" />
            <div>
              <div className="font-[family-name:var(--font-lora)] text-[17px] leading-none font-semibold text-[var(--gold)] lg:text-xl">
                {SITE_NAME}
              </div>
              <div className="mt-1 font-[family-name:var(--font-lora)] text-xs italic">tinh hoa làng nghề Việt</div>
            </div>
          </div>
          <p className="hidden max-w-[320px] text-[13.5px] leading-relaxed lg:block">
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
                className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.18] bg-white/[0.03] text-[var(--gold)]"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
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

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-1.5 py-3.5 text-xs text-[rgba(244,237,224,0.6)] md:flex-row md:justify-between">
          <span>
            {COMPANY_NAME} · MST: Chưa cập nhật
          </span>
          <span>© 2026 {SITE_NAME}</span>
        </Container>
      </div>
    </footer>
  )
}
