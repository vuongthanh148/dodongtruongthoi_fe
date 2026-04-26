'use client'

import { TopBar } from '@/components/layout/TopBar'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { Card } from '@/components/ui/Card'

const steps = [
  'Chọn sản phẩm phù hợp theo kích thước và không gian.',
  'Liên hệ qua hotline/Zalo để được tư vấn biến thể nền - khung.',
  'Xác nhận đơn hàng, thông tin giao nhận và thời gian hoàn thiện.',
  'Thanh toán theo hướng dẫn từ nhân viên chăm sóc đơn hàng.',
  'Nhận hàng, kiểm tra và hỗ trợ lắp đặt/bảo hành nếu cần.',
]

export default function BuyGuidePage() {
  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar title="Hướng dẫn mua hàng" onBack={() => window.history.back()} />

      <div style={{ padding: '14px 16px 90px', display: 'grid', gap: 10 }}>
        <Card style={{ padding: 14 }}>
          <Label>1. Chọn kích thước</Label>
          <Heading as="h2" size="sm" style={{ marginTop: 6, marginBottom: 8 }}>
            Chọn tỷ lệ theo không gian trưng bày
          </Heading>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Với phòng khách nhỏ, ưu tiên khổ vừa để tạo điểm nhấn tinh tế. Với không gian lớn,
            bạn có thể chọn tác phẩm khổ lớn hoặc bộ đôi cân xứng.
          </p>
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>2. Chọn chất liệu - nền tranh</Label>
          <Heading as="h2" size="sm" style={{ marginTop: 6, marginBottom: 8 }}>
            Nền vàng, đỏ, nâu đồng hay đen cổ
          </Heading>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Nền vàng hợp không gian ấm, nền đỏ nổi bật cho phòng thờ/trang trọng, nền đen cổ tạo
            chiều sâu hiện đại. Nhân viên sẽ tư vấn theo ánh sáng và màu nội thất thực tế.
          </p>
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>3. Quy trình đặt hàng</Label>
          <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
            {steps.map((step, index) => (
              <div key={step} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div
                  style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    fontSize: 11,
                    display: 'grid',
                    placeItems: 'center',
                    marginTop: 1,
                  }}
                >
                  {index + 1}
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>4. Chính sách bảo hành</Label>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Sản phẩm được hỗ trợ bảo hành theo chính sách hiện hành. Nếu có lỗi kỹ thuật từ nhà sản xuất,
            đội ngũ sẽ hỗ trợ xử lý và bảo dưỡng định kỳ.
          </p>
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>5. Chính sách đổi trả</Label>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Hỗ trợ đổi trả trong trường hợp hư hại do vận chuyển hoặc lỗi sản xuất. Liên hệ hotline
            trong vòng 48 giờ kể từ khi nhận hàng để được hỗ trợ nhanh nhất.
          </p>
        </Card>
      </div>
    </div>
  )
}
