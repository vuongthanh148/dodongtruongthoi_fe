'use client'

import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'
import { IconZalo } from '@/components/icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { ReadColumn } from '@/components/layout/ReadColumn'
import { TopBar } from '@/components/layout/TopBar'
import { SOCIAL_LINKS } from '@/lib/constants'
import { BLOG_POSTS } from '@/lib/content-data'

export default function BlogArticlePage() {
  const params = useParams<{ id: string }>()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const post = BLOG_POSTS.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  const related = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title="Cẩm nang" onBack={() => window.history.back()} onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Cẩm nang', href: '/cam-nang' }, { label: post.tag }]} />

      <Container className="w-full pb-16 pt-4 md:pt-6">
        <ReadColumn>
          <div className="flex items-center gap-2.5" style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            <span style={{ color: 'var(--bronze)', fontWeight: 600 }}>{post.tag}</span>
            <span>{post.date}</span>
            <span>{post.readMinutes} phút đọc</span>
          </div>
          <h1
            className="text-[27px] md:text-[34px] lg:text-[42px]"
            style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, lineHeight: 1.15, margin: 0 }}
          >
            {post.title}
          </h1>
        </ReadColumn>

        <div className="h-5 md:h-7" />
        <div className="bronze-art dark mx-auto mb-9 rounded-lg md:rounded-xl" style={{ maxWidth: 1000, aspectRatio: '16/8' }} />

        <ReadColumn>
          <p className="text-[17px] md:text-[19px]" style={{ lineHeight: 1.8, color: 'var(--text-primary)', margin: '0 0 20px' }}>
            {post.body.intro}
          </p>
          {post.body.sections.map((section) => (
            <div key={section.heading}>
              <h2
                className="text-[21px] md:text-[25px]"
                style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 600, margin: '36px 0 12px' }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((para, i) => (
                <p key={i} className="text-base md:text-[17.5px]" style={{ lineHeight: 1.8, color: 'var(--text-secondary)', margin: '0 0 20px' }}>
                  {para}
                </p>
              ))}
            </div>
          ))}

          <div
            className="mt-9 flex flex-col items-stretch gap-3 rounded-[10px] p-4.5 sm:flex-row sm:items-center sm:justify-between md:p-6"
            style={{ background: 'var(--bg-surface-alt)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 18, fontWeight: 600 }}>Chưa chắc kích thước?</div>
              <div className="mt-1" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Gửi ảnh bức tường qua Zalo, nghệ nhân sẽ tư vấn miễn phí.
              </div>
            </div>
            <a
              href={SOCIAL_LINKS.zalo}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center justify-center gap-2"
              style={{ height: 50, padding: '0 22px', borderRadius: 6, background: 'var(--accent)', color: 'white', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
            >
              <IconZalo size={18} /> Nhắn Zalo
            </a>
          </div>
        </ReadColumn>

        {related.length > 0 && (
          <div className="mt-14 md:mt-16">
            <div className="mb-5">
              <div className="label-mono" style={{ color: 'var(--bronze)', fontSize: 11, marginBottom: 6 }}>
                Đọc tiếp
              </div>
              <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 22, fontWeight: 600 }}>Bài viết liên quan</div>
            </div>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/cam-nang/${r.id}`} className="mm-tile flex min-w-0 flex-col gap-3">
                  <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: '4/3' }}>
                    <div className="mm-img bronze-art h-full w-full" />
                  </div>
                  <div className="font-[family-name:var(--font-lora)] text-lg font-semibold" style={{ lineHeight: 1.3 }}>
                    {r.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
