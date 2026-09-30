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

export default function BuyGuidePage() {
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
      <TopBar title="Hướng Dẫn Mua Hàng" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Hướng dẫn mua hàng' }]} />

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
              Hướng dẫn mua hàng
            </h1>
            <div
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Năm bước để chọn đúng tác phẩm cho không gian của bạn.
            </div>
          </div>

          {/* Steps - flat numbered list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((step, idx) => (
              <div
                key={step.n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr',
                  gap: 24,
                  padding: '24px 0',
                  borderTop: idx > 0 ? '1px solid var(--border-soft)' : 'none',
                }}
              >
                {/* Large plain numeral */}
                <div
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontSize: 48,
                    fontWeight: 600,
                    color: 'var(--accent)',
                    lineHeight: 1,
                    paddingTop: 2,
                  }}
                >
                  {step.n}
                </div>
                {/* Content */}
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontWeight: 600,
                      fontSize: 20,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                      margin: 0,
                      marginBottom: step.subtitle ? 4 : 0,
                    }}
                  >
                    {step.title}
                  </h2>
                  {step.subtitle && (
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--bronze)',
                        marginBottom: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      {step.subtitle}
                    </div>
                  )}
                  {step.body && (
                    <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {step.body}
                    </div>
                  )}
                </div>
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
