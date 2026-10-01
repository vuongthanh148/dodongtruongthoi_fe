'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { Container } from '@/components/layout/Container'
import type { Category } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface CategoryStripSectionProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryChange: (id: string) => void
}

export function CategoryStripSection({ categories, activeCategoryId, onCategoryChange }: CategoryStripSectionProps) {
  const router = useRouter()
  const categoryTiles = [{ id: 'all', name: 'Tất cả', productCount: 0 }, ...categories]

  const handleActionClick = () => {
    router.push('/categories')
  }

  return (
    <Container>
      <section className="mt-6 md:mt-10 lg:mt-14 xl:mt-[72px]">
        {/* Section heading - visible at md and up */}
        <div className="hidden md:block">
          <SectionHeading
            eyebrow="Danh mục"
            title="Mua theo danh mục"
            action="Tất cả danh mục"
            onActionClick={handleActionClick}
          />
        </div>

        {/* Mobile horizontal scroll version */}
        <div
          className="flex md:hidden noscroll gap-2.5"
          style={{
            overflowX: 'auto',
            margin: '0 -16px',
            padding: '0 16px',
          }}
        >
          {categoryTiles.map((category) => {
            const isActive = activeCategoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                style={{
                  flex: '0 0 30%',
                  minWidth: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <div
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                    border: isActive ? '2px solid var(--accent)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--bronze)',
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {category.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {category.id === 'all' ? 'Tất cả' : `${category.productCount} sản phẩm`}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Desktop grid version */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {categoryTiles.map((category) => {
            const isActive = activeCategoryId === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                    border: isActive ? '2px solid var(--accent)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--bronze)',
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-lora), serif',
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {category.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {category.id === 'all' ? 'Tất cả' : `${category.productCount} sản phẩm`}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </Container>
  )
}
