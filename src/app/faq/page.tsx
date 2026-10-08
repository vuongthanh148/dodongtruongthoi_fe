'use client'

import { Container } from '@/components/layout/Container'
import { ReadColumn } from '@/components/layout/ReadColumn'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { FaqAccordion } from '@/components/content/FaqAccordion'
import { CONTENT_PAGE_META, FAQ_COPY, FAQ_ITEMS } from '@/lib/content-data'

export default function FAQPage() {
  return (
    <ContentPageShell topTitle={CONTENT_PAGE_META.faq.topTitle} crumbs={CONTENT_PAGE_META.faq.crumbs}>
      <Container className="w-full pb-10 pt-4 md:pb-14 md:pt-6 lg:pb-16 xl:pb-[72px]">
        <ReadColumn>
          <div className="mb-5 md:mb-6 lg:mb-7 xl:mb-8">
            <h1
              className="text-[26px] md:text-[30px] lg:text-[34px] xl:text-[36px]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.15, margin: 0, color: 'var(--text-primary)', textWrap: 'balance' }}
            >
              {FAQ_COPY.title}
            </h1>
            <p className="mt-1.5 text-sm md:text-[15px]" style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: '6px 0 0' }}>
              {FAQ_COPY.sub}
            </p>
          </div>

          <FaqAccordion items={FAQ_ITEMS} />
        </ReadColumn>
      </Container>
    </ContentPageShell>
  )
}
