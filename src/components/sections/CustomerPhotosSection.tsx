import { Container } from '@/components/layout/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { CustomerPhoto } from '@/lib/storefront-api'

interface CustomerPhotosSectionProps {
  photos: CustomerPhoto[]
}

const TONES = ['dark', '', 'red', 'gold', ''] as const

// "Trong nhà khách hàng": a wall of customer photos — grid at md+, horizontal
// scroll on mobile — each a portrait card with a plain caption below.
export function CustomerPhotosSection({ photos }: CustomerPhotosSectionProps) {
  if (photos.length === 0) {
    return null
  }

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle eyebrow="Đến đâu tranh đến" title="Trong nhà khách hàng" />
        <div className="noscroll -mx-4 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-5 lg:gap-5">
          {photos.map((photo, i) => (
            <figure key={photo.id} className="m-0 flex w-[62%] shrink-0 flex-col gap-2.5 md:w-auto">
              <div
                className={`bronze-art relative aspect-[3/4] overflow-hidden rounded-[8px] ${TONES[i % TONES.length]}`}
                style={{
                  backgroundImage: `url(${photo.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <figcaption className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
                {photo.caption || 'Không gian thực tế của khách hàng'}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Container>
  )
}
