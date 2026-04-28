'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel } from '@/components/ui/Carousel'
import { Btn } from '@/components/ui/Btn'
import { Heading } from '@/components/ui/Heading'
import { IconChevron } from '@/components/icons'
import { BANNER_AUTO_SCROLL_MS } from '@/lib/constants'
import type { Banner } from '@/lib/storefront-api'

interface BannerSectionProps {
  banners: Banner[]
}

export function BannerSection({ banners }: BannerSectionProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div
      style={{
        position: 'relative',
        margin: '14px 16px 0',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--bg-dark)',
        aspectRatio: '4/5',
      }}
    >
      {banners.length > 0 ? (
        <Carousel
          items={banners}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          autoScrollMs={BANNER_AUTO_SCROLL_MS}
          navColor="light"
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
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${banner.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(20,14,9,0.25) 0%, transparent 40%, rgba(20,14,9,0.75) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '28px 22px',
                }}
              >
                <div />
                <div style={{ color: 'var(--text-on-dark)' }}>
                  {banner.title && (
                    <Heading
                      as="h2"
                      size="xl"
                      color="var(--text-on-dark)"
                      style={{ fontWeight: 500, marginBottom: 8, textWrap: 'balance', fontSize: 32 }}
                    >
                      {banner.title}
                    </Heading>
                  )}
                  {banner.subtitle && (
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        marginBottom: 16,
                        maxWidth: 280,
                        color: 'var(--text-on-dark-muted)',
                      }}
                    >
                      {banner.subtitle}
                    </div>
                  )}
                  {banner.linkUrl && (
                    <Btn
                      type="button"
                      size="lg"
                      onClick={() => {
                        const nextHref = banner.linkUrl?.trim()
                        if (!nextHref || nextHref === 'null' || nextHref === 'undefined') {
                          return
                        }
                        router.push(nextHref)
                      }}
                      style={{ padding: '11px 20px' }}
                      icon={<IconChevron size={14} color="white" />}
                    >
                      Xem chi tiết
                    </Btn>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      ) : null}
    </div>
  )
}
