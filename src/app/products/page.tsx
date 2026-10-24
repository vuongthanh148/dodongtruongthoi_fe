import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { fetchCategories, loadProducts } from '@/lib/storefront-api'
import { ProductsPageClient } from './ProductsPageClient'

export const metadata: Metadata = {
  title: `Sản phẩm | ${SITE_NAME}`,
  description: 'Toàn bộ sản phẩm đồng thủ công Đại Bái: tranh đồng, trống đồng, đồ thờ cúng, quà tặng.',
  alternates: { canonical: `${SITE_URL}/products` },
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    loadProducts({ limit: 100 }).catch(() => []),
    fetchCategories(),
  ])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/products/${product.id}`,
      name: product.title,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <ProductsPageClient initialProducts={products} initialCategories={categories} />
    </>
  )
}
