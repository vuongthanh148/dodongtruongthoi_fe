'use client'

import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { ReadColumn } from '@/components/layout/ReadColumn'
import { TopBar } from '@/components/layout/TopBar'
import { useState } from 'react'

const faqs = [
  {
    q: 'Sản phẩm có bảo hành không?',
    a: 'Có. Chúng tôi hỗ trợ bảo hành theo chính sách kỹ thuật cho từng dòng sản phẩm và hỗ trợ vệ sinh/bảo dưỡng định kỳ.',
  },
  {
    q: 'Giao hàng mất bao lâu?',
    a: 'Nội thành thường từ 1–3 ngày. Tỉnh thành khác từ 3–7 ngày tùy khu vực và lịch vận chuyển.',
  },
  {
    q: 'Có thể đặt hàng theo yêu cầu không?',
    a: 'Có. Bạn có thể đặt theo kích thước, tông nền, khung và nội dung khắc riêng theo nhu cầu. Liên hệ hotline để được tư vấn chi tiết.',
  },
  {
    q: 'Sản phẩm có phải đồng thật không?',
    a: 'Sản phẩm được chế tác từ đồng với quy trình thủ công tại làng nghề Đại Bái, có tư vấn chi tiết từng chất liệu khi đặt hàng.',
  },
  {
    q: 'Cách bảo quản đồ đồng?',
    a: 'Giữ nơi khô ráo, lau bằng khăn mềm, tránh hóa chất mạnh. Định kỳ đánh bóng theo hướng dẫn từ xưởng để giữ độ sáng bóng.',
  },
  {
    q: 'Cách thanh toán?',
    a: 'Bạn có thể chuyển khoản hoặc thanh toán theo hình thức được tư vấn khi xác nhận đơn hàng. Không thu phí thêm.',
  },
  {
    q: 'Đổi trả như thế nào?',
    a: 'Hỗ trợ đổi trả trong trường hợp hư hại do vận chuyển hoặc lỗi sản xuất. Liên hệ hotline trong vòng 48 giờ kể từ khi nhận hàng.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '16px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-be-vietnam), sans-serif',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <div
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: open ? 'var(--accent)' : 'rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 200ms',
          }}
        >
          <svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            fill="none"
            stroke={open ? 'white' : 'var(--text-secondary)'}
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 200ms',
            }}
          >
            <path d="M5 1v8M1 5h8" />
          </svg>
        </div>
      </button>
      {open && (
        <div
          style={{
            padding: '0 16px 14px',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      <TopBar title="Câu Hỏi Thường Gặp" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Câu hỏi thường gặp' }]} />

      <Container>
        <ReadColumn className="flex flex-col gap-4 pt-4">
          {/* Title and subtitle */}
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontWeight: 600,
                fontSize: 32,
                margin: 0,
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              Câu hỏi thường gặp
            </h1>
            <div
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Chưa thấy câu trả lời? Gọi 0899 012 288 hoặc nhắn Zalo.
            </div>
          </div>

          {/* FAQ accordion - flat without card styling */}
          <div>
            {faqs.map((item) => (
              <div key={item.q} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <FaqItem q={item.q} a={item.a} />
              </div>
            ))}
          </div>
        </ReadColumn>
      </Container>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
