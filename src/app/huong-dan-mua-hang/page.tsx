'use client'

import { Container } from '@/components/layout/Container'
import { ReadColumn } from '@/components/layout/ReadColumn'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { CONTENT_PAGE_META, GUIDE_COPY, GUIDE_STEPS } from '@/lib/content-data'

export default function BuyGuidePage() {
  return (
    <ContentPageShell topTitle={CONTENT_PAGE_META.guide.topTitle} crumbs={CONTENT_PAGE_META.guide.crumbs}>
      <Container className="w-full pb-10 pt-4 md:pb-14 md:pt-6 lg:pb-16 xl:pb-[72px]">
        <ReadColumn>
          <div className="mb-5 md:mb-6 lg:mb-7 xl:mb-8">
            <h1
              className="text-[26px] md:text-[30px] lg:text-[34px] xl:text-[36px]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.15, margin: 0, color: 'var(--text-primary)', textWrap: 'balance' }}
            >
              {GUIDE_COPY.title}
            </h1>
            <p className="mt-1.5 text-sm md:text-[15px]" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: '6px 0 0' }}>
              {GUIDE_COPY.sub}
            </p>
          </div>

          <ol className="m-0 flex list-none flex-col p-0">
            {GUIDE_STEPS.map((step, index) => (
              <li
                key={step.n}
                className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 py-5 md:grid-cols-[56px_minmax(0,1fr)] md:gap-5 md:py-7"
                style={{ borderTop: index > 0 ? '1px solid var(--border)' : 'none' }}
              >
                <span
                  className="text-gold text-[28px] md:text-[36px]"
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 600, lineHeight: 1 }}
                >
                  {step.n}
                </span>
                <div style={{ minWidth: 0 }}>
                  <h2
                    className="text-[19px] md:text-[22px]"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 600, lineHeight: 1.3, margin: 0, color: 'var(--text-primary)' }}
                  >
                    {step.title}
                  </h2>
                  {step.subtitle ? (
                    <div className="mt-1" style={{ fontSize: 14, color: 'var(--bronze)', lineHeight: 1.4 }}>
                      {step.subtitle}
                    </div>
                  ) : null}
                  {step.body ? (
                    <p className="mb-0 mt-2.5 text-[15px] md:text-base" style={{ lineHeight: 1.75, color: 'var(--text-secondary)', textWrap: 'pretty' }}>
                      {step.body}
                    </p>
                  ) : null}
                  {step.steps && step.steps.length > 0 ? (
                    <ol
                      className="m-0 mt-3 flex flex-col gap-2 pl-5 text-[15px] md:text-base"
                      style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}
                    >
                      {step.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </ReadColumn>
      </Container>
    </ContentPageShell>
  )
}
