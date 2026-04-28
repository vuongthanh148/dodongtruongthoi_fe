'use client'

import Link from 'next/link'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FEATURED_PRODUCTS_COUNT } from '@/lib/constants'
import type { Product } from '@/lib/types'

interface FeaturedProductsSectionProps {
  products: Product[]
  loading: boolean
}

export function FeaturedProductsSection({ products, loading }: FeaturedProductsSectionProps) {
  const featuredProducts = products.slice(0, FEATURED_PRODUCTS_COUNT)

  return (
    <section style={{ paddingBlock: '24px' }}>
      <div style={{ padding: '0 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeading title="Nổi bật" />
        <Link href="/products" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>
          Xem tất cả →
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, padding: '0 16px' }}>
        {loading ? (
          Array(FEATURED_PRODUCTS_COUNT)
            .fill(null)
            .map((_, i) => <ProductCardSkeleton key={i} />)
        ) : featuredProducts.length > 0 ? (
          featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Chưa có sản phẩm nổi bật
          </p>
        )}
      </div>
    </section>
  )
}
