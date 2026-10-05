'use client'

import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
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
      <TopBar title="Giới thiệu" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Breadcrumb above hero on page background */}
      <Container>
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }]} />
      </Container>

      {/* Full-bleed hero image area */}
      <div
        style={{
          position: 'relative',
          height: 420,
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
              'linear-gradient(180deg, rgba(20,14,9,0.1) 0%, rgba(20,14,9,0.9) 100%)',
          }}
        />
        {/* Text overlay at bottom-left */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 40px 56px' }}>
          <div
            style={{
              fontFamily: 'var(--font-be-vietnam), sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Làng Đại Bái · Bắc Ninh
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontWeight: 600,
              fontSize: 44,
              color: 'var(--text-on-dark)',
              lineHeight: 1.1,
              maxWidth: 720,
            }}
          >
            Hành trình của lửa, búa và bàn tay người thợ
          </div>
        </div>
      </div>

      <Container>
        <div style={{ paddingTop: 56, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 72 }}>
          {/* Story sections - flat on page background */}
          {stories.map((story, index) => (
            <section
              key={story.label}
              className="flex flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-16"
            >
              {/* Artwork - stacked above text on mobile, alternating side at md+ */}
              <div
                className={index % 2 === 1 ? 'w-full md:order-2' : 'w-full'}
                style={{ background: 'var(--bg-surface)', borderRadius: 12, overflow: 'hidden' }}
              >
                <ArtPiece bg={story.bg} frame={story.frame} label="" pad={0} aspect="4/3" />
              </div>
              {/* Text content */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-be-vietnam), sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    color: 'var(--bronze)',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  {String(index + 1).padStart(2, '0')} · {story.label}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-lora), serif',
                    fontWeight: 600,
                    fontSize: 20,
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {story.body}
                </p>
              </div>
            </section>
          ))}

          {/* Divider and footer CTA */}
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              paddingTop: 24,
              borderTop: '1px solid var(--border-soft)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: 26,
                fontWeight: 600,
                marginTop: 16,
              }}
            >
              Ghé xưởng tại làng Đại Bái
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Làng Đại Bái, Bắc Ninh · Mở cửa hàng ngày
            </div>
            <a
              href="tel:0899012288"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 22px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 100,
                color: 'white',
                textDecoration: 'none',
                fontFamily: 'var(--font-be-vietnam), sans-serif',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              Xem sản phẩm
            </a>
          </div>
        </div>
      </Container>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
