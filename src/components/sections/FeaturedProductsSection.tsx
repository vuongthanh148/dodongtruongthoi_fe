'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { SectionTitle } from '@/components/ui/SectionTitle'
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
    <section className="mt-10 md:mt-14 lg:mt-16 xl:mt-[72px]">
      <Container>
      <SectionTitle
        eyebrow={activeCategoryId === 'all' ? 'Nổi bật' : (categories.find((c) => c.id === activeCategoryId)?.name ?? 'Danh mục')}
        title={activeCategoryId === 'all' ? 'Sản phẩm được yêu thích' : 'Sản phẩm'}
        action={{
          label: 'Xem tất cả',
          href: activeCategoryId === 'all' ? '/categories' : `/categories/${activeCategoryId}`,
        }}
      />

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
