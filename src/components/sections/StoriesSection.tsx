'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { DrumMark } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Heading } from '@/components/ui/Heading'
import { STORY_CARDS } from '@/lib/data'
import type { Banner, CustomerPhoto } from '@/lib/storefront-api'

interface StoriesSectionProps {
  banners?: Banner[]
  customerPhotos?: CustomerPhoto[]
  coverImageUrl?: string
}

export function StoriesSection({
  banners = [],
  customerPhotos = [],
  coverImageUrl,
}: StoriesSectionProps) {
  const router = useRouter()
  const story = STORY_CARDS[0]
  const resolvedCoverImageUrl =
    coverImageUrl ??
    customerPhotos[0]?.imageUrl ??
    banners[0]?.imageUrl ??
    customerPhotos[1]?.imageUrl ??
    banners[1]?.imageUrl

  const storiesForDesktop = STORY_CARDS.slice(0, 2)

  return (
    <>
    <section
      className="lg:hidden"
      style={{
        background: 'var(--bg-dark)',
        padding: '32px 22px 28px',
        margin: '32px 0 0',
        color: 'var(--text-on-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* DrumMark watermark bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: -40,
          bottom: -40,
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <DrumMark size={200} color="var(--gold)" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 9.5,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Câu chuyện làng nghề
        </div>
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
          <div
            style={{
              aspectRatio: '16 / 9',
              position: 'relative',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
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
                  'linear-gradient(180deg, rgba(20,14,9,0.14) 0%, rgba(20,14,9,0.2) 50%, rgba(20,14,9,0.55) 100%)',
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
                fontFamily: 'var(--font-lora), serif',
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
            <button
              type="button"
              onClick={() => router.push('/lang-nghe')}
              style={{
                background: 'transparent',
                color: 'var(--gold)',
                border: '1px solid var(--gold)',
                borderRadius: 100,
                fontSize: 13,
                padding: '10px 20px',
                cursor: 'pointer',
                fontFamily: 'var(--font-be-vietnam), sans-serif',
              }}
            >
              Đọc câu chuyện →
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Desktop: side-by-side story cards on an ivory surface */}
    <section className="hidden lg:block" style={{ margin: '64px 0' }}>
      <Container>
        <div
          className="label-mono mb-4"
          style={{ color: 'var(--bronze)', fontSize: 10 }}
        >
          Câu chuyện làng nghề
        </div>
        <div className="grid grid-cols-2 gap-6">
          {storiesForDesktop.map((s, i) => (
            <Link
              key={s.title}
              href="/lang-nghe"
              className="grid grid-cols-[150px_minmax(0,1fr)] overflow-hidden rounded-[10px] border xl:grid-cols-[220px_minmax(0,1fr)]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className={`bronze-art${i % 2 === 1 ? ' dark' : ''}`} style={{ minHeight: 180 }} />
              <div className="flex flex-col justify-center gap-2 p-7">
                <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 10 }}>
                  {s.eyebrow}
                </div>
                <div
                  className="font-[family-name:var(--font-lora)] text-[22px] font-semibold"
                  style={{ lineHeight: 1.25 }}
                >
                  {s.title}
                </div>
                <div className="font-[family-name:var(--font-lora)] text-sm italic" style={{ color: 'var(--accent)' }}>
                  Đọc câu chuyện →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
    </>
  )
}
