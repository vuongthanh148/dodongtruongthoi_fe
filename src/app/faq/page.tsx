'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'

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
    <div style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-card)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {q}
        </span>
        <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: open ? 'var(--accent)' : 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms' }}>
          <svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            fill="none"
            stroke={open ? 'white' : 'var(--text-secondary)'}
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
          >
            <path d="M5 1v8M1 5h8" />
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 16px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)'}}>
      <TopBar
        title="Câu Hỏi Thường Gặp"
       
        onMenu={() => setIsMenuOpen(true)}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hero card */}
      <div style={{ margin: '16px 16px 0', background: 'var(--bg-dark)', borderRadius: 14, padding: '20px 20px 22px', position: 'relative', overflow: 'hidden' }}>
        {/* Watermark */}
        <svg width={120} height={120} viewBox="0 0 120 120" style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05 }}>
          <circle cx={60} cy={60} r={55} fill="none" stroke="var(--gold)" strokeWidth={8} />
          <circle cx={60} cy={60} r={38} fill="none" stroke="var(--gold)" strokeWidth={3} />
        </svg>
        <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(201,169,97,0.7)', textTransform: 'uppercase', marginBottom: 10 }}>
          FAQ
        </div>
        <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontSize: 20, color: 'var(--text-on-dark)', lineHeight: 1.3, marginBottom: 8 }}>
          Giải đáp nhanh trước khi đặt hàng
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(244,237,224,0.6)', lineHeight: 1.55 }}>
          Nếu còn thắc mắc, gọi hotline <strong style={{ color: 'var(--gold)' }}>0899 · 012 · 288</strong>
        </div>
      </div>

      {/* FAQ accordion */}
      <div style={{ margin: '16px 16px 0', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {faqs.map((item, idx) => (
          <div key={item.q} style={{ borderTop: idx > 0 ? '1px solid var(--border)' : 'none' }}>
            <FaqItem q={item.q} a={item.a} />
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div style={{ margin: '16px 16px 0', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
          Câu hỏi chưa có trong danh sách?
        </div>
        <a
          href="tel:0899012288"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--accent)', borderRadius: 100, color: 'white', textDecoration: 'none', fontFamily: 'var(--font-be-vietnam), sans-serif', fontWeight: 500, fontSize: 13.5 }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Gọi ngay 0899 012 288
        </a>
      </div>

      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}
