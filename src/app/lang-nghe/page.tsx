'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { ArtPiece } from '@/components/ui/ArtPiece'
import {
  CONTENT_PAGE_META,
  CRAFT_DETAIL_COPY,
  CRAFT_PAGE_COPY,
  CRAFT_STEPS,
  CRAFT_STORIES,
} from '@/lib/content-data'

export default function CraftVillagePage() {
  return (
    <ContentPageShell topTitle={CONTENT_PAGE_META.craft.topTitle} crumbs={CONTENT_PAGE_META.craft.crumbs}>
      {/* Full-bleed hero */}
      <div className="relative w-full overflow-hidden h-[320px] md:h-[380px] lg:h-[420px] xl:h-[480px]" style={{ background: 'var(--bg-dark)' }}>
        <ArtPiece bg="bronze" frame="carved" label="" pad={0} aspect="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(20,14,9,0.9) 5%, rgba(20,14,9,0.1) 75%)' }}
        />
        <Container className="absolute inset-x-0 bottom-0 flex h-full items-end">
          <div className="max-w-[720px] pb-10 md:pb-14" style={{ color: 'var(--text-on-dark)' }}>
            <div className="eyebrow" style={{ color: 'var(--gold)', fontSize: 15 }}>
              {CRAFT_PAGE_COPY.eyebrow}
            </div>
            <h1
              className="mt-2.5 text-[28px] md:text-[40px] lg:text-[44px] xl:text-[52px]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.1, margin: '10px 0 0', textWrap: 'balance' }}
            >
              {CRAFT_PAGE_COPY.title}
            </h1>
          </div>
        </Container>
      </div>

      <Container className="flex w-full flex-col gap-12 pb-10 pt-10 md:gap-14 md:pb-14 md:pt-14 lg:gap-16 lg:pb-16 lg:pt-16 xl:gap-[72px] xl:pb-[72px] xl:pt-[72px]">
        {/* Story rows: image and text side by side at md+, alternating; stacked below md. */}
        {CRAFT_STORIES.map((story, index) => (
          <section key={story.label} className="flex flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
            <div
              className={index % 2 === 1 ? 'w-full md:order-2' : 'w-full'}
              style={{ background: 'var(--bg-surface)', borderRadius: 12, overflow: 'hidden' }}
            >
              <ArtPiece bg={story.bg} frame={story.frame} label="" pad={0} aspect="4/3" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="eyebrow">
                {String(index + 1).padStart(2, '0')} · {story.label}
              </div>
              <p
                className="mt-3 text-[17px] md:text-[19px] lg:text-[20px]"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 400, lineHeight: 1.7, color: 'var(--text-primary)', margin: '12px 0 0', textWrap: 'pretty' }}
              >
                {story.body}
              </p>
            </div>
          </section>
        ))}

        {/* Craft steps, list A */}
        <section>
          <div className="eyebrow">
            {CRAFT_DETAIL_COPY.eyebrow}
          </div>
          <h2
            className="mt-2 mb-5 text-[22px] md:mb-6 md:text-[26px] lg:mb-7"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.2, margin: '8px 0 20px' }}
          >
            {CRAFT_DETAIL_COPY.stepsTitle}
          </h2>
          <ol className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:gap-5" style={{ margin: 0 }}>
            {CRAFT_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-1.5 rounded-[10px] p-4 md:p-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <span className="text-gold" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15 }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {step.title}
                </span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.body}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Visit CTA */}
        <div className="flex flex-col items-center gap-4 pt-8 text-center md:gap-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 600, lineHeight: 1.2, marginTop: 8 }}>
            {CRAFT_PAGE_COPY.visitTitle}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{CRAFT_PAGE_COPY.visitMeta}</div>
          <Link
            href="/products"
            className="flex h-[50px] w-full items-center justify-center rounded-[6px] px-[22px] sm:w-auto"
            style={{ background: 'var(--accent)', color: 'var(--primitive-white)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
          >
            {CRAFT_PAGE_COPY.visitCta}
          </Link>
        </div>
      </Container>
    </ContentPageShell>
  )
}
