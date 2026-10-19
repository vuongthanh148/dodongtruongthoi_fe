import { Container } from '@/components/layout/Container'
import { PostCard } from '@/components/content/PostCard'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { BLOG_POSTS } from '@/lib/content-data'

// Home's "Cẩm nang" teaser (HANDOFF.md:106, board home-*): the last content
// section before Showroom, linking out to the blog. Reuses PostCard — the
// one card component the blog list/article pages already use — so there is
// no second, Home-only card variant.
export function CamNangSection() {
  const posts = BLOG_POSTS.slice(0, 3)
  if (posts.length === 0) return null

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle eyebrow="Cẩm nang" title="Từ làng nghề Đại Bái" action={{ label: 'Xem tất cả', href: '/cam-nang' }} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:gap-5 xl:gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </Container>
  )
}
