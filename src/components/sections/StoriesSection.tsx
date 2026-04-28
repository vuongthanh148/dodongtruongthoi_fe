'use client'

import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { Label } from '@/components/ui/Label'
import { STORY_CARDS } from '@/lib/data'
import type { Banner, CustomerPhoto } from '@/lib/storefront-api'

interface StoriesSectionProps {
  banners: Banner[]
  customerPhotos: CustomerPhoto[]
}

export function StoriesSection({ banners, customerPhotos }: StoriesSectionProps) {
  const router = useRouter()

  return (
    <section
      style={{
        background: 'var(--bg-surface-alt)',
        padding: '24px 0 32px',
        margin: '32px 0 0',
      }}
    >
      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <Label style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>Câu chuyện</Label>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px', overflowX: 'auto' }} className="noscroll">
        {STORY_CARDS.map((story, idx) => {
          let imageUrl: string | undefined

          // Map story image source index to actual images from banners or customer photos
          if (story.eyebrow === 'ĐẾN ĐẬU TRANH') {
            imageUrl = customerPhotos[0]?.imageUrl || undefined
          } else if (story.eyebrow === 'LÀNG NGHỀ') {
            imageUrl = banners[0]?.imageUrl || undefined
          } else if (story.eyebrow === 'QUÁ TRÌNH SẢN XUẤT') {
            imageUrl = customerPhotos[1]?.imageUrl || undefined
          } else if (story.eyebrow === 'CHỨNG CHỈ QUỐC TẾ') {
            imageUrl = banners[1]?.imageUrl || undefined
          }

          const hasImage = !!imageUrl

          return (
            <div
              key={idx}
              onClick={() => router.push('/lang-nghe')}
              style={{
                position: 'relative',
                backgroundImage: hasImage ? `url(${imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: hasImage ? undefined : 'var(--bg-dark)',
                borderRadius: 10,
                overflow: 'hidden',
                aspectRatio: hasImage ? '3/4' : undefined,
                flex: hasImage ? '0 0 72%' : '0 0 82%',
                cursor: 'pointer',
                padding: hasImage ? undefined : '22px 18px',
                color: 'var(--text-on-dark)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: hasImage ? 'flex-end' : 'space-between',
              }}
            >
              {hasImage && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px 16px 16px',
                    background: 'linear-gradient(to top, rgba(20,14,9,0.92) 0%, rgba(20,14,9,0.6) 60%, transparent 100%)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      color: story.accent,
                      marginBottom: 6,
                    }}
                  >
                    {story.eyebrow}
                  </div>
                  <Heading
                    as="h3"
                    size="sm"
                    style={{
                      fontSize: 15,
                      color: 'var(--text-on-dark)',
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {story.title}
                  </Heading>
                  {story.body && (
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-on-dark-muted)',
                        marginTop: 6,
                        lineHeight: 1.4,
                      }}
                    >
                      {story.body}
                    </div>
                  )}
                </div>
              )}
              {!hasImage && (
                <>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      color: story.accent,
                      textTransform: 'uppercase',
                    }}
                  >
                    {story.eyebrow}
                  </div>
                  <div>
                    <Heading
                      as="h3"
                      size="sm"
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        marginBottom: 8,
                        color: 'var(--text-on-dark)',
                      }}
                    >
                      {story.title}
                    </Heading>
                    {story.body && (
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: 1.5,
                          color: 'var(--text-on-dark-muted)',
                        }}
                      >
                        {story.body}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
