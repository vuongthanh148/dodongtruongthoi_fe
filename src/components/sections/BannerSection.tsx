'use client'

import { DrumMark, IconChevron } from '@/components/icons'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Btn } from '@/components/ui/Btn'
import { Carousel } from '@/components/ui/Carousel'
import type { Banner } from '@/lib/storefront-api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BannerSectionProps {
  banners: Banner[]
}

const bannerThemes = [
  {
    background:
      'radial-gradient(circle at 18% 18%, rgba(255,220,140,0.16) 0, transparent 36%), linear-gradient(135deg, #2f2014 0%, #160f0a 100%)',
    artBg: 'bronze' as const,
    artFrame: 'bronze' as const,
  },
  {
    background:
      'radial-gradient(circle at 78% 22%, rgba(201,169,97,0.14) 0, transparent 34%), linear-gradient(135deg, #6b1f16 0%, #26110c 100%)',
    artBg: 'red' as const,
    artFrame: 'gold' as const,
  },
  {
    background:
      'radial-gradient(circle at 70% 18%, rgba(255,220,140,0.18) 0, transparent 34%), linear-gradient(135deg, #4a3018 0%, #15100b 100%)',
    artBg: 'gold' as const,
    artFrame: 'carved' as const,
  },
]

function SideTile({ banner, theme }: { banner: Banner; theme: (typeof bannerThemes)[number] }) {
  const router = useRouter()
  const href = banner.linkUrl?.trim()
  const clickable = !!href && href !== 'null' && href !== 'undefined'

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => router.push(href!) : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 12,
        minHeight: 170,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 24,
        cursor: clickable ? 'pointer' : 'default',
        background: banner.imageUrl ? 'var(--bg-dark)' : theme.background,
      }}
    >
      {banner.imageUrl ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(20,14,9,0.78) 0%, rgba(20,14,9,0.15) 65%)',
        }}
      />
      <div style={{ position: 'relative', color: 'var(--text-on-dark)' }}>
        {banner.title ? (
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: banner.subtitle ? 4 : 0,
              textWrap: 'balance',
            }}
          >
            {banner.title}
          </div>
        ) : null}
        {banner.subtitle ? (
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'rgba(244,237,224,0.78)' }}>{banner.subtitle}</div>
        ) : null}
      </div>
    </div>
  )
}

export function BannerSection({ banners }: BannerSectionProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasBanners = banners.length > 0
  const sideTiles = banners.slice(1, 3)
  const showSideTiles = sideTiles.length === 2

  const goTo = (idx: number) => {
    const next = ((idx % banners.length) + banners.length) % banners.length
    setCurrentIndex(next)
  }

  return (
    <div className="mx-auto w-full lg:max-w-[1344px] lg:px-8 lg:pt-7 mb-4 lg:mb-6">
    <div
      className={showSideTiles ? 'lg:grid lg:grid-cols-[2fr_1fr] lg:gap-5' : undefined}
    >
    <div
      className="hero-wrap lg:rounded-xl"
      style={{
        position: 'relative',
        minHeight: 320,
        height: hasBanners ? 400 : 320,
        overflow: 'hidden',
        background: 'var(--bg-dark)',
      }}
    >
      {/* Inject hover/focus CSS for arrow reveal; taller hero at wider breakpoints */}
      <style>{`
        .hero-wrap .hero-arrow { opacity: 0; transition: opacity 200ms ease; }
        .hero-wrap:hover .hero-arrow, .hero-wrap:focus-within .hero-arrow { opacity: 1; }
        @media (min-width: 768px) { .hero-wrap { height: 440px !important; } }
        @media (min-width: 1024px) { .hero-wrap { height: 460px !important; } }
        @media (min-width: 1280px) { .hero-wrap { height: 500px !important; } }
      `}</style>

      {hasBanners ? (
        <>
          <Carousel
            items={banners}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            autoScrollMs={7000}
            navColor="light"
            showNav={false}
            showDots={false}
            containerStyle={{ position: 'relative', height: '100%' }}
            scrollContainerStyle={{ height: '100%', touchAction: 'pan-y' }}
            renderItem={(banner, idx) => {
              const theme = bannerThemes[idx % bannerThemes.length]
              return (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    background: banner.imageUrl ? 'var(--bg-dark)' : theme.background,
                  }}
                >
                  {banner.imageUrl ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${banner.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  ) : null}
                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(20,14,9,0.18) 0%, rgba(20,14,9,0.16) 46%, rgba(20,14,9,0.84) 100%)',
                    }}
                  />
                  {/* DrumMark watermark */}
                  <div style={{ position: 'absolute', right: -40, top: -30, opacity: 0.06, pointerEvents: 'none', zIndex: 0 }}>
                    <DrumMark size={260} color="var(--gold)" />
                  </div>
                  {/* Art piece */}
                  <div
                    className="right-4 top-20 w-[170px] md:right-10 md:top-14 md:w-[220px] lg:right-14 lg:top-12 lg:w-[260px]"
                    style={{ position: 'absolute', pointerEvents: 'none', zIndex: 1 }}
                  >
                    <ArtPiece
                      bg={theme.artBg}
                      frame={theme.artFrame}
                      label={banner.title || 'Đồ đồng'}
                      pad={10}
                      aspect="4 / 5"
                    />
                  </div>
                  {/* Copy */}
                  <div
                    className="p-[20px_16px_28px] md:p-[32px_28px_36px] lg:p-[40px_40px_44px]"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      zIndex: 2,
                    }}
                  >
                    <div className="max-w-[220px] md:max-w-[340px] lg:max-w-[440px]" style={{ color: 'var(--text-on-dark)' }}>
                      <div style={{
                        marginBottom: 8,
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        fontSize: 15,
                        letterSpacing: '0.04em',
                        color: 'var(--gold)',
                      }}>
                        Tuyển chọn tinh hoa
                      </div>
                      {banner.title ? (
                        <div
                          className="text-[26px] md:text-[38px] lg:text-[46px]"
                          style={{
                            fontFamily: 'var(--font-lora), serif',
                            fontWeight: 500,
                            lineHeight: 1.05,
                            color: 'var(--text-on-dark)',
                            marginBottom: 8,
                            textWrap: 'balance',
                          }}
                        >
                          {banner.title}
                        </div>
                      ) : null}
                      {banner.subtitle ? (
                        <div
                          className="text-[11.5px] md:text-sm lg:text-base"
                          style={{
                            lineHeight: 1.55,
                            marginBottom: 16,
                            color: 'rgba(244,237,224,0.7)',
                          }}
                        >
                          {banner.subtitle}
                        </div>
                      ) : null}
                      {banner.linkUrl ? (
                        <button
                          type="button"
                          onClick={() => {
                            const nextHref = banner.linkUrl?.trim()
                            if (!nextHref || nextHref === 'null' || nextHref === 'undefined') return
                            router.push(nextHref)
                          }}
                          style={{
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.5)',
                            padding: '9px 16px',
                            borderRadius: 100,
                            fontFamily: 'var(--font-be-vietnam), sans-serif',
                            fontSize: 12,
                            letterSpacing: '0.03em',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          Khám phá ngay →
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            }}
          />

          {/* Dots — bottom-right */}
          {banners.length > 1 && (
            <div style={{ position: 'absolute', bottom: 14, right: 20, display: 'flex', gap: 5, zIndex: 5 }}>
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  style={{
                    width: i === currentIndex ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === currentIndex ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 300ms ease',
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Arrow buttons — visible on hero hover */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                className="hero-arrow"
                onClick={() => goTo(currentIndex - 1)}
                aria-label="Slide trước"
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.35)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 5,
                }}
              >
                <IconChevron dir="left" size={14} color="white" />
              </button>
              <button
                type="button"
                className="hero-arrow"
                onClick={() => goTo(currentIndex + 1)}
                aria-label="Slide tiếp"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.35)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 5,
                }}
              >
                <IconChevron dir="right" size={14} color="white" />
              </button>
            </>
          )}
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 24,
            background:
              'radial-gradient(circle at 72% 16%, rgba(201,169,97,0.14) 0, transparent 36%), linear-gradient(135deg, var(--bg-dark) 0%, var(--primitive-ink-950) 100%)',
          }}
        >
          <div style={{ opacity: 0.35 }}>
            <DrumMark size={56} color="var(--gold)" />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--text-on-dark)',
              textAlign: 'center',
            }}
          >
            Đồ Đồng Trường Thơi
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: 'rgba(244,237,224,0.6)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Tinh hoa làng nghề Việt
          </div>
          <Btn
            type="button"
            variant="ghost"
            size="md"
            onClick={() => router.push('/categories')}
            style={{
              color: 'var(--text-on-dark)',
              border: '1px solid rgba(244,237,224,0.32)',
              borderRadius: 999,
            }}
            icon={<IconChevron size={14} color="white" />}
          >
            Khám phá sản phẩm
          </Btn>
        </div>
      )}
    </div>

    {showSideTiles ? (
      <div className="hidden lg:grid lg:grid-rows-2 lg:gap-5">
        {sideTiles.map((banner, idx) => (
          <SideTile key={banner.id} banner={banner} theme={bannerThemes[(idx + 1) % bannerThemes.length]} />
        ))}
      </div>
    ) : null}
    </div>
    </div>
  )
}
