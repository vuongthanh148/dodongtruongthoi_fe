'use client'

import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { useState } from 'react'

const stories = [
  {
    label: 'Lịch sử',
    title: 'Trên 1000 năm nghề đúc đồng',
    body: 'Đại Bái là một trong những làng nghề đúc đồng lâu đời ở Bắc Ninh. Từ vật dụng thờ cúng đến tác phẩm nghệ thuật trang trí, mỗi sản phẩm đều là kết tinh của kinh nghiệm truyền đời và tinh thần gìn giữ nghề cổ.',
    bg: 'bronze' as const,
    frame: 'gold' as const,
  },
  {
    label: 'Nghề thủ công',
    title: 'Bàn tay nghệ nhân và lửa lò',
    body: 'Người thợ làm đồng trải qua nhiều công đoạn: tạo mẫu, nấu đồng, đổ khuôn, gò chạm, xử lý bề mặt và hoàn thiện. Mỗi đường nét đều đòi hỏi sự kiên nhẫn và đôi tay chắc nghề.',
    bg: 'gold' as const,
    frame: 'bronze' as const,
  },
  {
    label: 'Di sản',
    title: 'Mang văn hoá Việt vào không gian sống',
    body: 'Chúng tôi mong muốn mỗi tác phẩm không chỉ đẹp trong không gian sống, mà còn mang theo câu chuyện văn hóa Việt: sự bền bỉ, tinh tế và lòng tự hào với nghề truyền thống.',
    bg: 'dark' as const,
    frame: 'carved' as const,
  },
]

export default function CraftVillagePage() {
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
      <TopBar title="Làng Nghề" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Làng nghề' }]} />

      {/* Full-bleed hero image area */}
      <div
        style={{
          position: 'relative',
          height: 220,
          overflow: 'hidden',
          background: 'var(--bg-dark)',
          margin: '0 0 0 0',
        }}
      >
        <ArtPiece
          bg="bronze"
          frame="carved"
          label=""
          pad={0}
          aspect="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(42,31,26,0.2) 0%, rgba(42,31,26,0.7) 100%)',
          }}
        />
        {/* Text overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
          <div
            style={{
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'rgba(201,169,97,0.8)',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Làng Đại Bái · Bắc Ninh
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--text-on-dark)',
              lineHeight: 1.25,
            }}
          >
            Hành trình của lửa, búa và bàn tay người thợ
          </div>
        </div>
      </div>

      <Container>
        <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Story cards */}
          {stories.map((story, index) => (
            <div
              key={story.label}
              className={index % 2 === 1 ? 'md:grid md:grid-cols-2 md:items-stretch md:[direction:rtl]' : 'md:grid md:grid-cols-2 md:items-stretch'}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Mini artwork */}
              <div className={index % 2 === 1 ? 'md:[direction:ltr]' : ''} style={{ background: 'var(--bg-surface)', padding: 12 }}>
                <ArtPiece bg={story.bg} frame={story.frame} label="" pad={8} aspect="16/9" />
              </div>
              <div className={`${index % 2 === 1 ? 'md:[direction:ltr]' : ''} md:flex md:flex-col md:justify-center`} style={{ padding: '12px 14px 16px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: 'var(--bronze)',
                    textTransform: 'uppercase',
                    marginBottom: 5,
                  }}
                >
                  {story.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontWeight: 700,
                    fontSize: 15,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {story.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                  }}
                >
                  {story.body}
                </div>
              </div>
            </div>
          ))}

          {/* Artisan highlight card */}
          <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <ArtPiece bg="bronze" frame="dark" label="" pad={0} aspect="4/3" />
          <div style={{ padding: '14px 16px 18px' }}>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontStyle: 'italic',
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--bronze)',
                marginBottom: 3,
              }}
            >
              Nghệ nhân Nguyễn Văn Thành
            </div>
            <div
              style={{
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontSize: 12,
                color: 'var(--text-muted)',
                marginBottom: 12,
              }}
            >
              Nghệ nhân làng Đại Bái, Bắc Ninh
            </div>
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              &quot;Mỗi tác phẩm đồng là một câu chuyện được kể bằng lửa và đôi tay.&quot;
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 12,
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            Muốn tham quan xưởng sản xuất hoặc đặt hàng riêng?
          </div>
          <a
            href="tel:0899012288"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 22px',
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: 100,
              color: 'var(--accent)',
              textDecoration: 'none',
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 13,
            }}
          >
            Liên hệ ngay 0899 012 288
          </a>
          </div>
        </div>
      </Container>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
