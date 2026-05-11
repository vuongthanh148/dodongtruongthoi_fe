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

export function BannerSection({ banners }: BannerSectionProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasBanners = banners.length > 0

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

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 320,
        height: hasBanners ? 400 : 320,
        overflow: 'hidden',
        background: 'var(--bg-dark)',
      }}
    >
      {hasBanners ? (
        <Carousel
          items={banners}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          autoScrollMs={7000}
          navColor="light"
          showNav={false}
          containerStyle={{
            position: 'relative',
            height: '100%',
          }}
          scrollContainerStyle={{
            height: '100%',
            touchAction: 'pan-y',
          }}
          renderItem={(banner) => (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: banner.imageUrl
                  ? 'var(--bg-dark)'
                  : bannerThemes[currentIndex % bannerThemes.length].background,
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
                  background:
                    'linear-gradient(180deg, rgba(20,14,9,0.18) 0%, rgba(20,14,9,0.16) 46%, rgba(20,14,9,0.84) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -40,
                  top: -30,
                  opacity: 0.06,
                  pointerEvents: 'none',
                }}
              >
                <DrumMark size={280} color="var(--gold)" />
              </div>

              <div
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 80,
                  width: 170,
                  pointerEvents: 'none',
                }}
              >
                <ArtPiece
                  bg={bannerThemes[currentIndex % bannerThemes.length].artBg}
                  frame={bannerThemes[currentIndex % bannerThemes.length].artFrame}
                  label={banner.title || 'Đồ đồng'}
                  pad={10}
                  aspect="4 / 5"
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '28px 20px',
                }}
              >
                <div style={{ maxWidth: 290, color: 'var(--text-on-dark)' }}>
                  <div
                    style={{
                      marginBottom: 8,
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: 9,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}
                  >
                    Tuyển chọn tinh hoa
                  </div>
                  {banner.title ? (
                    <div
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: 30,
                        fontWeight: 500,
                        lineHeight: 1.02,
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
                      style={{
                        fontSize: 11.5,
                        lineHeight: 1.55,
                        marginBottom: 16,
                        color: 'rgba(244,237,224,0.7)',
                      }}
                    >
                      {banner.subtitle}
                    </div>
                  ) : null}
                  {banner.linkUrl ? (
                    <Btn
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        const nextHref = banner.linkUrl?.trim()
                        if (!nextHref || nextHref === 'null' || nextHref === 'undefined') {
                          return
                        }
                        router.push(nextHref)
                      }}
                      style={{
                        color: 'var(--text-on-dark)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: 2,
                        background: 'transparent',
                        paddingInline: 14,
                      }}
                    >
                      Khám phá →
                    </Btn>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          showDots
        />
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
              fontFamily: 'var(--font-cormorant), serif',
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
  )
}
