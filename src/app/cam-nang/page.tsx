'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { StoreLocationsSection } from '@/components/sections/StoreLocationsSection'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { BLOG_POSTS, BLOG_TAGS, type BlogPost } from '@/lib/content-data'

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-2.5" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
      <span style={{ color: 'var(--bronze)', fontWeight: 600 }}>{post.tag}</span>
      <span>{post.date}</span>
      <span>{post.readMinutes} phút đọc</span>
    </div>
  )
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/cam-nang/${post.id}`}
      className="mm-tile flex flex-col gap-5 lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-10"
    >
      <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: '16/10' }}>
        <div className="mm-img bronze-art dark h-full w-full" />
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <PostMeta post={post} />
        <div className="font-[family-name:var(--font-lora)] text-2xl font-semibold lg:text-[28px]" style={{ lineHeight: 1.25 }}>
          {post.title}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.excerpt}</div>
        <div className="mt-1 font-[family-name:var(--font-lora)] italic" style={{ color: 'var(--accent)', fontSize: 15 }}>
          Đọc bài →
        </div>
      </div>
    </Link>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/cam-nang/${post.id}`} className="mm-tile flex min-w-0 flex-col gap-3">
      <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: '4/3' }}>
        <div className="mm-img bronze-art dark h-full w-full" />
      </div>
      <PostMeta post={post} />
      <div className="font-[family-name:var(--font-lora)] text-lg font-semibold" style={{ lineHeight: 1.3 }}>
        {post.title}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.excerpt}</div>
    </Link>
  )
}

export default function BlogListPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tag, setTag] = useState<string>('Tất cả')

  const filtered = useMemo(
    () => (tag === 'Tất cả' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.tag === tag)),
    [tag]
  )
  const [first, ...rest] = filtered.length > 0 ? filtered : BLOG_POSTS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title="Cẩm nang" onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Cẩm nang' }]} />

      <Container className="w-full pb-16 pt-4 md:pt-6">
        <div className="mb-6 md:mb-8">
          <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 26, fontWeight: 600, color: 'var(--text-primary)' }} className="md:text-[32px]">
            Cẩm nang đồ đồng
          </div>
          <div className="mt-1.5" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Kiến thức chọn, bày và giữ gìn đồ đồng cho gia đình.
          </div>
        </div>

        <div className="noscroll mb-8 flex gap-2 overflow-x-auto md:mb-10">
          {BLOG_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              style={{
                padding: '8px 14px',
                borderRadius: 18,
                fontSize: 13.5,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                background: t === tag ? 'var(--accent)' : 'var(--bg-card)',
                color: t === tag ? 'white' : 'var(--text-primary)',
                border: t === tag ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mb-10 md:mb-14">
          <FeaturedPostCard post={first} />
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>

      <StoreLocationsSection />

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
