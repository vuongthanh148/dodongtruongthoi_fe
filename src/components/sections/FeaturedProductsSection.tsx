'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCardSkeleton, ProductCardV2 } from '@/components/ui/ProductCard'
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
    <section style={{ paddingBlock: '24px' }}>
      <div style={{ padding: '0 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
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
            {activeCategoryId === 'all' ? 'Được chọn nhiều nhất' : 'Sản phẩm'}
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


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
        {loading ? (
          Array(FEATURED_PRODUCTS_COUNT)
            .fill(null)
            .map((_, i) => <ProductCardSkeleton key={i} compact />)
        ) : (
          filteredProducts.map((product, idx) => (
            <ProductCardV2
              key={product.id}
              product={product}
              tall={idx % 2 === 0}
              onOpen={() => router.push(`/products/${product.id}`)}
            />
          ))
        )}
      </div>
    </section>
  )
}
