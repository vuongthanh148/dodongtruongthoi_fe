'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { FEATURED_PRODUCTS_COUNT } from '@/lib/constants'
import type { Product, Category } from '@/lib/types'

interface FeaturedProductsSectionProps {
  products: Product[]
  loading: boolean
  activeCategoryId?: string
  categories?: Category[]
}

export function FeaturedProductsSection({
  products,
  loading,
  activeCategoryId = 'all',
  categories = [],
}: FeaturedProductsSectionProps) {
  const router = useRouter()
  const filteredProducts = useMemo(() => {
    const nextProducts = activeCategoryId === 'all' ? products : products.filter((product) => product.categoryId === activeCategoryId)
    return nextProducts.slice(0, FEATURED_PRODUCTS_COUNT)
  }, [activeCategoryId, products])

  if (!loading && filteredProducts.length === 0) {
    return null
  }

  return (
    <section className="mt-6 md:mt-10 lg:mt-14 xl:mt-[72px]" style={{ paddingBlock: '24px' }}>
      <Container>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'var(--bronze)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {activeCategoryId === 'all' ? 'Nổi bật' : categories.find((c) => c.id === activeCategoryId)?.name ?? 'Danh mục'}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-lora), serif',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {activeCategoryId === 'all' ? 'Sản phẩm được yêu thích' : 'Sản phẩm'}
          </div>
        </div>
        <Link
          href={activeCategoryId === 'all' ? '/categories' : `/categories/${activeCategoryId}`}
          style={{
            fontSize: 13,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontFamily: 'var(--font-lora), serif',
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
          }}
        >
          Xem tất cả →
        </Link>
      </div>


      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-6">
        {loading ? (
          Array(FEATURED_PRODUCTS_COUNT)
            .fill(null)
            .map((_, i) => <ProductCardSkeleton key={i} />)
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => router.push(`/products/${product.id}`)}
            />
          ))
        )}
      </div>
      </Container>
    </section>
  )
}
