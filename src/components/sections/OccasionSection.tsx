import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatVnd } from '@/lib/format'
import { HOME_OCCASIONS, OCCASIONS_COPY } from '@/lib/content-data'

// "Theo dịp": four occasion cards. Copy and prices come from content-data.ts.
export function OccasionSection() {
  if (HOME_OCCASIONS.length === 0) return null

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle
          eyebrow={OCCASIONS_COPY.eyebrow}
          title={OCCASIONS_COPY.title}
          action={{ label: OCCASIONS_COPY.action, href: '/lien-he' }}
        />
        <div className="noscroll -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {HOME_OCCASIONS.map((occasion) => {
            const dark = occasion.dark === true
            return (
              <Link
                key={occasion.id}
                href={occasion.href}
                className="flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-[10px] md:w-auto"
                style={{
                  textDecoration: 'none',
                  background: dark ? 'var(--bg-dark-warm)' : 'var(--bg-card)',
                  border: dark ? '1px solid rgba(201,169,97,0.45)' : '1px solid var(--border)',
                  color: dark ? 'var(--text-on-dark)' : 'var(--text-primary)',
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div
                    className={`bronze-art absolute inset-0 ${dark ? 'dark' : occasion.id === 'nha' ? 'red' : occasion.id === 'tangia' ? 'gold' : ''}`}
                  />
                  {occasion.tag ? (
                    <span
                      className="absolute left-3 top-3 rounded-[14px] px-2.5 py-1 text-[14px] font-semibold"
                      style={{ background: 'var(--gold)', color: 'var(--text-primary)' }}
                    >
                      {occasion.tag}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4 md:p-5">
                  <div className="text-[18px] font-semibold leading-[1.25] md:text-[20px]" style={{ fontFamily: 'var(--font-body)' }}>
                    {occasion.title}
                  </div>
                  <div className="text-[15px] leading-[1.5]" style={{ color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-secondary)' }}>
                    {occasion.subtitle}
                  </div>
                  <div className="mt-1 text-[14px]" style={{ color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted-strong)' }}>
                    Gợi ý: {occasion.picks}
                  </div>
                  <div
                    className="mt-auto flex items-baseline justify-between pt-3"
                    style={{ borderTop: `1px solid ${dark ? 'var(--border-gold)' : 'var(--border-soft)'}` }}
                  >
                    <span className="price-num text-[16px]" style={{ color: dark ? 'var(--gold)' : 'var(--accent)' }}>
                      từ {formatVnd(occasion.fromPrice)}
                    </span>
                    <span className="text-[15px] font-semibold" style={{ color: dark ? 'var(--gold)' : 'var(--accent)' }}>
                      Xem →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </Container>
  )
}
