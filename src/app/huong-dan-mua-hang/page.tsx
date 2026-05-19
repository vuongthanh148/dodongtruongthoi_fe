'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FooterMinimal } from '@/components/layout/Footer'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'

const steps = [
  {
    n: 1,
    title: 'Chọn kích thước phù hợp',
    subtitle: 'Dựa trên diện tích tường và không gian',
    body: 'Với phòng khách nhỏ, ưu tiên khổ vừa để tạo điểm nhấn tinh tế. Với không gian lớn, bạn có thể chọn tác phẩm khổ lớn hoặc bộ đôi cân xứng.',
  },
  {
    n: 2,
    title: 'Chọn nền tranh và khung',
    subtitle: 'Tư vấn theo ánh sáng và màu nội thất',
    body: 'Nền vàng hợp không gian ấm, nền đỏ nổi bật cho phòng thờ/trang trọng, nền đen cổ tạo chiều sâu hiện đại. Nhân viên sẽ tư vấn theo ánh sáng và màu nội thất.',
  },
  {
    n: 3,
    title: 'Xác nhận đơn và thông tin giao nhận',
    subtitle: 'Qua hotline hoặc Zalo',
    body: 'Liên hệ qua hotline hoặc Zalo để xác nhận biến thể, giá, thời gian hoàn thiện và địa chỉ giao hàng. Đơn hàng được xác nhận qua điện thoại.',
  },
  {
    n: 4,
    title: 'Thanh toán',
    subtitle: 'Chuyển khoản hoặc theo tư vấn',
    body: 'Chuyển khoản hoặc theo hình thức được tư vấn. Không thu thêm phụ phí. Thông tin thanh toán được gửi sau khi xác nhận đơn.',
  },
  {
    n: 5,
    title: 'Nhận hàng và lắp đặt',
    subtitle: 'Hỗ trợ lắp đặt tận nơi',
    body: 'Kiểm tra kỹ khi nhận hàng. Đội ngũ hỗ trợ lắp đặt và bảo hành định kỳ. Liên hệ hotline trong 48 giờ nếu có vấn đề sau khi nhận.',
  },
]

const policies = [
  {
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--bronze)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Bảo hành 10 năm',
    body: 'Hỗ trợ bảo hành và bảo dưỡng định kỳ theo chính sách kỹ thuật cho từng dòng sản phẩm.',
  },
  {
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--bronze)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 4v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Giao lắp toàn quốc',
    body: 'Nội thành 1–3 ngày. Tỉnh thành 3–7 ngày. Hỗ trợ lắp đặt tại nhà.',
  },
  {
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--bronze)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14l-5-5 5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
      </svg>
    ),
    title: 'Đổi trả 7 ngày',
    body: 'Đổi trả trong 48 giờ kể từ khi nhận nếu có lỗi vận chuyển hoặc sản xuất.',
  },
]

export default function BuyGuidePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)'}}>
      <TopBar
        title="Hướng Dẫn Mua Hàng"
       
        onMenu={() => setIsMenuOpen(true)}
      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Hero */}
        <div style={{ background: 'var(--bg-dark)', borderRadius: 14, padding: '20px 20px 22px', position: 'relative', overflow: 'hidden' }}>
          <svg width={110} height={110} viewBox="0 0 110 110" style={{ position: 'absolute', right: -18, bottom: -18, opacity: 0.05 }}>
            <circle cx={55} cy={55} r={50} fill="none" stroke="var(--gold)" strokeWidth={7} />
            <circle cx={55} cy={55} r={34} fill="none" stroke="var(--gold)" strokeWidth={3} />
          </svg>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(201,169,97,0.7)', textTransform: 'uppercase', marginBottom: 10 }}>
            Hướng dẫn
          </div>
          <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontSize: 20, color: 'var(--text-on-dark)', lineHeight: 1.3, marginBottom: 8 }}>
            Quy trình đặt hàng đồ đồng mỹ nghệ
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(244,237,224,0.6)', lineHeight: 1.55 }}>
            5 bước đơn giản từ chọn sản phẩm đến nhận hàng tại nhà.
          </div>
        </div>

        {/* Steps with vertical timeline */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 16px', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 16 }}>
            Các bước thực hiện
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((step, idx) => (
              <div
                key={step.n}
                style={{ position: 'relative', display: 'grid', gridTemplateColumns: '32px 1fr', gap: 12, paddingBottom: idx < steps.length - 1 ? 20 : 0 }}
              >
                {/* Connector line (not for last step) */}
                {idx < steps.length - 1 && (
                  <div style={{ position: 'absolute', left: 16, top: 32, bottom: -8, width: 1, background: 'var(--border)' }} />
                )}
                {/* Badge */}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: 14, fontFamily: 'var(--font-lora), serif', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, position: 'relative' }}>
                  {step.n}
                </div>
                {/* Content */}
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 3 }}>
                    {step.title}
                  </div>
                  {step.subtitle && (
                    <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--bronze)', marginBottom: 6, lineHeight: 1.3 }}>
                      {step.subtitle}
                    </div>
                  )}
                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {step.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy grid */}
        <div>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase', marginBottom: 10 }}>
            Chính sách
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {policies.map((p) => (
              <div key={p.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(107,68,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', marginBottom: 3 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {p.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{ background: 'var(--bg-dark)', borderRadius: 12, padding: '16px 16px' }}>
          <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(201,169,97,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
            Tư vấn miễn phí
          </div>
          <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>
            0899 · 012 · 288
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href="tel:0899012288"
              style={{ flex: 1, padding: '11px 0', background: 'rgba(201,169,97,0.15)', border: '1px solid rgba(201,169,97,0.3)', borderRadius: 8, fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'var(--gold)', textAlign: 'center', textDecoration: 'none' }}
            >
              Gọi ngay
            </a>
            <a
              href="https://zalo.me/0899012288"
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, padding: '11px 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'rgba(244,237,224,0.8)', textAlign: 'center', textDecoration: 'none' }}
            >
              Zalo
            </a>
            <a
              href="https://m.me/dodongtruongthoi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, padding: '11px 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 13, color: 'rgba(244,237,224,0.8)', textAlign: 'center', textDecoration: 'none' }}
            >
              Messenger
            </a>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <FooterMinimal />
    </div>
  )
}
