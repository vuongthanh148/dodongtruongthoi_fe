'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { ContentPageShell } from '@/components/content/ContentPageShell'
import { PostCard } from '@/components/content/PostCard'
import { BLOG_COPY, BLOG_POSTS, BLOG_TAGS, CONTENT_PAGE_META } from '@/lib/content-data'

export default function BlogListPage() {
  const [tag, setTag] = useState<string>(BLOG_COPY.allTag)

  const filtered = useMemo(
    () => (tag === BLOG_COPY.allTag ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.tag === tag)),
    [tag]
  )
  const [first, ...rest] = filtered.length > 0 ? filtered : BLOG_POSTS

  return (
    <ContentPageShell topTitle={CONTENT_PAGE_META.blog.topTitle} crumbs={CONTENT_PAGE_META.blog.crumbs}>
      <Container className="w-full pb-10 pt-4 md:pb-14 md:pt-6 lg:pb-16 xl:pb-[72px]">
        <div className="mb-5 md:mb-6 lg:mb-7 xl:mb-8">
          <h1
            className="text-[26px] md:text-[30px] lg:text-[34px] xl:text-[36px]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, lineHeight: 1.15, margin: 0, color: 'var(--text-primary)', textWrap: 'balance' }}
          >
            {BLOG_COPY.title}
          </h1>
          <p className="mt-1.5 text-sm md:text-[15px]" style={{ color: 'var(--text-muted)', margin: '6px 0 0' }}>
            {BLOG_COPY.sub}
          </p>
        </div>

        <div role="group" aria-label={BLOG_COPY.topicsLabel} className="noscroll -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-6 md:px-0 lg:mb-7 xl:mb-8">
          {BLOG_TAGS.map((t) => {
            const active = t === tag
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => setTag(t)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 18,
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0,
                  background: active ? 'var(--accent)' : 'var(--bg-card)',
                  color: active ? 'var(--primitive-white)' : 'var(--text-primary)',
                  border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                {t}
              </button>
            )
          })}
        </div>

        <div className="mb-10 md:mb-14 lg:mb-16 xl:mb-[72px]">
          <PostCard post={first} featured />
        </div>

        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </Container>
    </ContentPageShell>
  )
}
