'use client'

import { notFound, useParams } from 'next/navigation'
import { IconZalo } from '@/components/icons'
import { Container } from '@/components/layout/Container'
import { ReadColumn } from '@/components/layout/ReadColumn'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { PostCard, PostMeta } from '@/components/content/PostCard'
import { SOCIAL_LINKS } from '@/lib/constants'
import { BLOG_COPY, BLOG_POSTS, CONTENT_PAGE_META } from '@/lib/content-data'

export default function BlogArticlePage() {
  const params = useParams<{ id: string }>()
  const post = BLOG_POSTS.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  const related = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3)
  const crumbs = [
    CONTENT_PAGE_META.article.crumbs[0],
    { label: 'Cẩm nang', href: '/cam-nang' },
    { label: post.tag },
  ]
  const infoRows = [
    { label: BLOG_COPY.infoCategory, value: post.tag },
    { label: BLOG_COPY.infoDate, value: post.date },
    { label: BLOG_COPY.infoReadTime, value: BLOG_COPY.readTime(post.readMinutes) },
    ...(post.table?.rows ?? []),
  ]

  return (
    <ContentPageShell
      topTitle={CONTENT_PAGE_META.article.topTitle}
      crumbs={crumbs}
      onBack={() => window.history.back()}
    >
      <Container className="w-full pb-10 pt-4 md:pb-14 md:pt-6 lg:pb-16 xl:pb-[72px]">
        <ReadColumn>
          <PostMeta post={post} size={13} />
          <h1
            className="mt-3 text-[27px] md:text-[34px] lg:text-[38px] xl:text-[42px]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.15, margin: '12px 0 0', color: 'var(--text-primary)', textWrap: 'balance' }}
          >
            {post.title}
          </h1>
        </ReadColumn>

        <div className="mt-5 md:mt-7" />
        <div
          className="bronze-art dark mx-auto mb-9 w-full rounded-lg md:rounded-xl"
          style={{ maxWidth: 1000, aspectRatio: '16/8' }}
        />

        <ReadColumn>
          <p className="text-base md:text-[17.5px]" style={{ lineHeight: 1.8, color: 'var(--text-primary)', margin: '0 0 20px', textWrap: 'pretty' }}>
            {post.body.intro}
          </p>
          {post.body.sections.map((section) => (
            <div key={section.heading}>
              <h2
                className="mt-9 mb-3 text-[21px] md:text-[25px]"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.2 }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((para, i) => (
                <p key={i} className="text-base md:text-[17.5px]" style={{ lineHeight: 1.8, color: 'var(--text-secondary)', margin: '0 0 20px', textWrap: 'pretty' }}>
                  {para}
                </p>
              ))}
            </div>
          ))}

          <section
            aria-label={post.table?.title ?? BLOG_COPY.infoTitle}
            className="my-7 rounded-[10px] p-4 md:p-[22px]"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h2 className="mb-2 text-base md:text-[17px]" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--bronze)' }}>
              {post.table?.title ?? BLOG_COPY.infoTitle}
            </h2>
            {infoRows.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className="flex items-baseline justify-between gap-3 py-2.5 text-[15px]"
                style={{ borderTop: '1px solid var(--border-soft)' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</span>
                <span style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </section>

          <div
            className="flex flex-col items-stretch gap-3 rounded-[10px] p-4 sm:flex-row sm:items-center sm:justify-between md:p-6"
            style={{ background: 'var(--bg-surface-alt)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                {BLOG_COPY.zaloTitle}
              </div>
              <div className="mt-1" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                {BLOG_COPY.zaloBody}
              </div>
            </div>
            <a
              href={SOCIAL_LINKS.zalo}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center justify-center gap-2"
              style={{ height: 50, padding: '0 22px', borderRadius: 6, background: 'var(--accent)', color: 'var(--primitive-white)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
            >
              <IconZalo size={18} /> {BLOG_COPY.zaloCta}
            </a>
          </div>
        </ReadColumn>

        {related.length > 0 ? (
          <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
            <div className="mb-5 md:mb-6 lg:mb-7 xl:mb-8">
              <div className="eyebrow" style={{ fontSize: 15 }}>
                {BLOG_COPY.relatedEyebrow}
              </div>
              <h2
                className="mt-2 text-[22px] md:text-[26px]"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.15, margin: '8px 0 0' }}
              >
                {BLOG_COPY.relatedTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6">
              {related.map((r) => (
                <PostCard key={r.id} post={r} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </ContentPageShell>
  )
}
