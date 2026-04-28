'use client'

import { useState } from 'react'
import { Carousel } from '@/components/ui/Carousel'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { CUSTOMER_PHOTO_AUTO_SCROLL_MS } from '@/lib/constants'
import type { CustomerPhoto } from '@/lib/storefront-api'

interface CustomerPhotosSectionProps {
  photos: CustomerPhoto[]
}

export function CustomerPhotosSection({ photos }: CustomerPhotosSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 0) {
    return null
  }

  return (
    <section
      style={{
        background: 'var(--bg-page)',
        color: 'var(--text-primary)',
        padding: '24px 0 30px',
        marginTop: 16,
        borderTop: '1px solid var(--border-soft)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <Label
          color="gold"
          style={{
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Khách hàng
        </Label>
        <Heading as="h2" size="md" color="var(--text-primary)">
          Tranh trong nhà khách hàng
        </Heading>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>
          Hình ảnh thực tế từ không gian sống của khách hàng trên toàn quốc.
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <Carousel
          items={photos}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          autoScrollMs={CUSTOMER_PHOTO_AUTO_SCROLL_MS}
          navColor="dark"
          showDots={false}
          containerStyle={{
            position: 'relative',
          }}
          scrollContainerStyle={{
            touchAction: 'pan-y',
          }}
          renderItem={(photo) => (
            <article
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--border-soft)',
                background: 'var(--primitive-ivory-300)',
                aspectRatio: '16 / 9',
                boxShadow: '0 10px 28px rgba(55, 34, 17, 0.16)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${photo.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04) 20%, rgba(25,16,10,0.48) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  bottom: 12,
                  fontSize: 13,
                  color: 'var(--text-on-dark)',
                  lineHeight: 1.5,
                  background: 'rgba(43, 24, 12, 0.45)',
                  border: '1px solid rgba(255, 238, 218, 0.25)',
                  borderRadius: 8,
                  padding: '7px 9px',
                  backdropFilter: 'blur(2px)',
                }}
              >
                {photo.caption || 'Không gian thực tế của khách hàng'}
              </div>
            </article>
          )}
        />
      </div>
    </section>
  )
}
