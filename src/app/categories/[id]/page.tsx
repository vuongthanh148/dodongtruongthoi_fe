import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { fetchCategories, fetchCategory, fetchProducts } from '@/lib/storefront-api'
import { CategoryPageClient } from './CategoryPageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const category = await fetchCategory(id)
  if (!category) return {}

  return {
    title: `${category.name} | ${SITE_NAME}`,
    description: `${category.name} — sản phẩm đồng thủ công Đại Bái từ làng nghề Đại Bái.`,
    alternates: { canonical: `${SITE_URL}/categories/${id}` },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [category, categories, products] = await Promise.all([
    fetchCategory(id),
    fetchCategories(),
    fetchProducts({ category: id }),
  ])
  if (!category) notFound()

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.name,
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
      <CategoryPageClient categoryId={id} initialCategories={categories} initialProducts={products} />
    </>
  )
}
