'use client'

import { useRouter } from 'next/navigation'
import { Btn } from '@/components/ui/Btn'
import { DrumMark } from '@/components/icons'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Heading } from '@/components/ui/Heading'
import { STORY_CARDS } from '@/lib/data'
import type { Banner, CustomerPhoto } from '@/lib/storefront-api'

interface StoriesSectionProps {
  banners?: Banner[]
  customerPhotos?: CustomerPhoto[]
  coverImageUrl?: string
}

export function StoriesSection({ banners = [], customerPhotos = [], coverImageUrl }: StoriesSectionProps) {
  const router = useRouter()
  const story = STORY_CARDS[0]
  const resolvedCoverImageUrl =
    coverImageUrl ?? customerPhotos[0]?.imageUrl ?? banners[0]?.imageUrl ?? customerPhotos[1]?.imageUrl ?? banners[1]?.imageUrl

  return (
    <section
      style={{
        background: 'var(--bg-dark)',
        padding: '32px 22px 28px',
        margin: '32px 0 0',
        color: 'var(--text-on-dark)',
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: 9.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)' }}>Câu chuyện làng nghề</div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 14,
          padding: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(244,237,224,0.1)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <div style={{ aspectRatio: '16 / 9', position: 'relative', borderRadius: 6 }}>
            {resolvedCoverImageUrl ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${resolvedCoverImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, padding: 10 }}>
                <ArtPiece bg="dark" frame="carved" label={story.title} pad={10} aspect="16 / 9" />
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                right: -40,
                top: -28,
                opacity: 0.06,
                pointerEvents: 'none',
              }}
            >
              <DrumMark size={190} color="var(--gold)" />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(20,14,9,0.14) 0%, rgba(20,14,9,0.2) 50%, rgba(20,14,9,0.88) 100%)',
              }}
            />
          </div>

          <div style={{ padding: '18px 16px 16px' }}>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 8,
              }}
            >
              {story.eyebrow}
            </div>
            <Heading
              as="h3"
              size="md"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--text-on-dark)',
                marginBottom: 10,
              }}
            >
              {story.title}
            </Heading>
            {story.body ? (
              <div
                style={{
                  fontSize: 11.5,
                  lineHeight: 1.55,
                  color: 'rgba(244,237,224,0.65)',
                  marginBottom: 20,
                }}
              >
                {story.body}
              </div>
            ) : null}
            <Btn
              type="button"
              variant="ghost"
              size="md"
              onClick={() => router.push('/lang-nghe')}
              style={{
                color: 'var(--gold)',
                border: '1px solid rgba(201,169,97,0.5)',
                borderRadius: 2,
                background: 'transparent',
                padding: '10px 18px',
              }}
            >
              Đọc câu chuyện →
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}
