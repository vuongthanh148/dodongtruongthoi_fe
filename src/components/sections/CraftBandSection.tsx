import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { CRAFT_BAND_COPY } from '@/lib/content-data'

// "Làng nghề" band: dark warm band with the village story. Links to /lang-nghe.
export function CraftBandSection() {
  return (
    <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]" style={{ background: 'var(--bg-dark-warm)', color: 'var(--text-on-dark)' }}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-7 py-10 md:py-12 lg:grid-cols-2 lg:gap-16 xl:py-16">
          <div className="bronze-art dark relative aspect-[16/10] overflow-hidden rounded-[10px] lg:aspect-[4/5]" />
          <div className="flex flex-col gap-4 md:gap-5">
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>
              {CRAFT_BAND_COPY.eyebrow}
            </span>
            <h2
              className="font-heading text-[30px] font-medium leading-[1.08] md:text-[36px] lg:text-[40px] xl:text-[48px]"
              style={{ textWrap: 'balance' }}
            >
              {CRAFT_BAND_COPY.title}
            </h2>
            <p className="m-0 max-w-[520px] text-[16px] leading-[1.7] md:text-[17px]" style={{ color: 'var(--text-on-dark-muted)' }}>
              {CRAFT_BAND_COPY.body}
            </p>
            <Link
              href="/lang-nghe"
              className="mt-1 inline-flex h-[50px] w-fit items-center rounded-[6px] border px-[22px] text-[15px] font-semibold"
              style={{ color: 'var(--gold)', borderColor: 'rgba(201,169,97,0.5)', textDecoration: 'none' }}
            >
              {CRAFT_BAND_COPY.link}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
