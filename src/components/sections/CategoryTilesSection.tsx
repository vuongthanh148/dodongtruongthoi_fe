import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { Category } from '@/lib/types'

interface CategoryTilesSectionProps {
  categories: Category[]
}

// "Danh mục" on home: first category is the large tile, the next four are small tiles.
// Hidden when there are no categories.
export function CategoryTilesSection({ categories }: CategoryTilesSectionProps) {
  const tiles = categories.slice(0, 5)
  if (tiles.length === 0) return null

  return (
    <Container>
      <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
        <SectionTitle
          eyebrow="Danh mục"
          title="Mua theo danh mục"
          action={{ label: 'Tất cả danh mục', href: '/categories' }}
        />
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5 xl:gap-6">
          {tiles.map((category, index) => {
            const isLarge = index === 0
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={`relative block overflow-hidden rounded-[10px] text-white ${
                  isLarge
                    ? 'col-span-2 min-h-[220px] md:min-h-[300px] lg:col-span-1 lg:row-span-2 lg:min-h-[460px] xl:min-h-[520px]'
                    : 'min-h-[150px] md:min-h-[200px] lg:min-h-[222px] xl:min-h-[250px]'
                }`}
                style={{ textDecoration: 'none', color: 'var(--text-on-dark)' }}
              >
                <div
                  className={`bronze-art absolute inset-0 ${category.tone === 'bronze' ? '' : category.tone}`}
                  style={category.imageUrl ? { backgroundImage: `url(${category.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(0deg, rgba(20,14,9,0.82) 0%, rgba(20,14,9,0) 55%)' }}
                />
                <div className="absolute bottom-3 left-3.5 right-3.5 md:bottom-5 md:left-5 md:right-5">
                  <div
                    className={`font-semibold leading-[1.1] ${isLarge ? 'text-[22px] md:text-[26px] lg:text-[28px] xl:text-[30px]' : 'text-[18px] md:text-[20px]'}`}
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {category.name}
                  </div>
                  {category.productCount > 0 ? (
                    <div className="mt-1 text-[14px] md:text-[15px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                      {category.productCount} sản phẩm{isLarge ? ' · Xem tất cả →' : ''}
                    </div>
                  ) : null}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </Container>
  )
}
