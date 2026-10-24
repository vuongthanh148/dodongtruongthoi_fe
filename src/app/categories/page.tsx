import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { fetchCategories } from '@/lib/storefront-api'
import CategoriesPageClient from './CategoriesPageClient'

export const metadata: Metadata = {
  title: `Danh mục sản phẩm | ${SITE_NAME}`,
  description: 'Danh mục sản phẩm đồng thủ công Đại Bái: tranh đồng, trống đồng, đồ thờ cúng, quà tặng.',
  alternates: { canonical: `${SITE_URL}/categories` },
}

export default async function CategoriesPage() {
  const categories = await fetchCategories()
  return <CategoriesPageClient initialCategories={categories} />
}
