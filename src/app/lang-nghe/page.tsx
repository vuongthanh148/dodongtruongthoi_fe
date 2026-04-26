'use client'

import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'

export default function CraftVillagePage() {
  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar title="Câu chuyện làng nghề" onBack={() => window.history.back()} />

      <div style={{ padding: '14px 16px 90px', display: 'grid', gap: 10 }}>
        <Card style={{ padding: 14 }}>
          <Label>Làng Đại Bái</Label>
          <Heading as="h1" size="lg" style={{ marginTop: 6 }}>
            Hành trình của lửa, búa và bàn tay người thợ
          </Heading>
        </Card>

        <Card style={{ padding: 12 }}>
          <ArtPiece bg="bronze" frame="gold" label="Làng nghề" pad={8} aspect="16/10" />
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>Lịch sử</Label>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
            Đại Bái là một trong những làng nghề đúc đồng lâu đời ở Bắc Ninh. Từ vật dụng thờ cúng
            đến tác phẩm nghệ thuật trang trí, mỗi sản phẩm đều là kết tinh của kinh nghiệm truyền
            đời và tinh thần gìn giữ nghề cổ.
          </p>
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>Nghệ nhân</Label>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
            Người thợ làm đồng làm việc qua nhiều công đoạn: tạo mẫu, nấu đồng, đổ khuôn, gò chạm,
            xử lý bề mặt và hoàn thiện. Mỗi đường nét đều đòi hỏi sự kiên nhẫn và đôi tay chắc nghề.
          </p>
        </Card>

        <Card style={{ padding: 14 }}>
          <Label>Di sản</Label>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
            Chúng tôi mong muốn mỗi tác phẩm không chỉ đẹp trong không gian sống, mà còn mang theo
            câu chuyện văn hóa Việt: sự bền bỉ, tinh tế và lòng tự hào với nghề truyền thống.
          </p>
        </Card>
      </div>
    </div>
  )
}
