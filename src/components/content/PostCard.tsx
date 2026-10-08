import Link from 'next/link'
import { BLOG_COPY, type BlogPost } from '@/lib/content-data'

export function PostMeta({ post, size = 12 }: { post: BlogPost; size?: 12 | 13 }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1" style={{ fontSize: size, color: 'var(--text-muted)' }}>
      <span style={{ color: 'var(--bronze)', fontWeight: 600 }}>{post.tag}</span>
      <span>{post.date}</span>
      <span>{BLOG_COPY.readTime(post.readMinutes)}</span>
    </div>
  )
}

// Blog card. Titles use the body font at 600 (HANDOFF: card titles are body font).
// The featured card puts the image and text side by side at lg+.
export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/cam-nang/${post.id}`}
      className={
        featured
          ? 'mm-tile flex min-w-0 flex-col gap-4 md:gap-5 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-10'
          : 'mm-tile flex min-w-0 flex-col gap-3'
      }
    >
      <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: featured ? '16/10' : '4/3' }}>
        <div className="mm-img bronze-art dark h-full w-full" />
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <PostMeta post={post} />
        <div
          className={featured ? 'text-[22px] lg:text-[28px]' : 'text-[18px]'}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            textWrap: 'balance',
          }}
        >
          {post.title}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.excerpt}</div>
        {featured ? (
          <div className="mt-1" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--accent)', fontSize: 15 }}>
            {BLOG_COPY.readMore}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
