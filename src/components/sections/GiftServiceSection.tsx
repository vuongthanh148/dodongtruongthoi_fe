import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { GIFT_SERVICE_COPY } from '@/lib/content-data'
import { HOTLINE, HOTLINE_TEL } from '@/lib/constants'

// "Dịch vụ quà biếu": gift packaging and delivery. Copy from content-data.ts.
export function GiftServiceSection() {
  return (
    <section
      className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]"
      style={{ background: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-7 py-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 xl:py-16">
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-[10px] lg:aspect-[5/6]"
            style={{ border: '1px dashed rgba(107,68,35,0.35)' }}
          >
            <div className="bronze-art absolute inset-0" />
          </div>
          <div className="flex flex-col gap-5 md:gap-6">
            <span className="eyebrow">{GIFT_SERVICE_COPY.eyebrow}</span>
            <h2 className="font-heading text-[30px] font-medium leading-[1.08] md:text-[36px] lg:text-[40px] xl:text-[46px]" style={{ textWrap: 'balance', color: 'var(--text-primary)' }}>
              {GIFT_SERVICE_COPY.title}
            </h2>
            <ol className="m-0 flex list-none flex-col p-0">
              {GIFT_SERVICE_COPY.items.map((item, i) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[36px_minmax(0,1fr)] gap-3.5 py-3.5"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span className="text-[20px] italic leading-[1.1]" style={{ fontFamily: 'var(--font-body)', color: 'var(--accent)' }}>
                    0{i + 1}
                  </span>
                  <div>
                    <div className="text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div className="mt-0.5 text-[16px] leading-[1.5]" style={{ color: 'var(--text-secondary)' }}>
                      {item.body}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/lien-he"
                className="inline-flex h-[50px] items-center justify-center rounded-[6px] px-[22px] text-[15px] font-semibold text-white"
                style={{ background: 'var(--accent)', textDecoration: 'none' }}
              >
                {GIFT_SERVICE_COPY.primaryCta}
              </Link>
              <a
                href={HOTLINE_TEL}
                className="inline-flex h-[50px] items-center justify-center rounded-[6px] border px-[22px] text-[15px] font-semibold"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)', textDecoration: 'none' }}
              >
                Gọi {HOTLINE}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
