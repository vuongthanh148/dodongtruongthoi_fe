'use client'

import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'

const faqs = [
  {
    q: 'Sản phẩm có bảo hành không?',
    a: 'Có. Chúng tôi hỗ trợ bảo hành theo chính sách kỹ thuật cho từng dòng sản phẩm và hỗ trợ vệ sinh/bảo dưỡng định kỳ.',
  },
  {
    q: 'Giao hàng mất bao lâu?',
    a: 'Nội thành thường từ 1-3 ngày. Tỉnh thành khác từ 3-7 ngày tùy khu vực và lịch vận chuyển.',
  },
  {
    q: 'Có thể đặt hàng theo yêu cầu không?',
    a: 'Có. Bạn có thể đặt theo kích thước, tông nền, khung và nội dung khắc riêng theo nhu cầu.',
  },
  {
    q: 'Sản phẩm có phải đồng thật không?',
    a: 'Sản phẩm được chế tác từ đồng với quy trình thủ công tại làng nghề Đại Bái, có tư vấn chi tiết từng chất liệu khi đặt hàng.',
  },
  {
    q: 'Cách bảo quản đồ đồng?',
    a: 'Giữ nơi khô ráo, lau bằng khăn mềm, tránh hóa chất mạnh. Định kỳ đánh bóng theo hướng dẫn từ xưởng.',
  },
  {
    q: 'Cách thanh toán?',
    a: 'Bạn có thể chuyển khoản hoặc thanh toán theo hình thức được tư vấn khi xác nhận đơn hàng.',
  },
]

export default function FAQPage() {
  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar title="Câu hỏi thường gặp" onBack={() => window.history.back()} />

      <div style={{ padding: '14px 16px 90px', display: 'grid', gap: 10 }}>
        <Card style={{ padding: 14 }}>
          <Label>FAQ</Label>
          <Heading as="h1" size="lg" style={{ marginTop: 8 }}>
            Giải đáp nhanh trước khi đặt hàng
          </Heading>
        </Card>

        {faqs.map((item) => (
          <Card key={item.q} style={{ padding: 12 }}>
            <details>
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {item.q}
              </summary>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}
              >
                {item.a}
              </p>
            </details>
          </Card>
        ))}
      </div>
    </div>
  )
}
