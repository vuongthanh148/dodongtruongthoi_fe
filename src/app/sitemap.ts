import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { fetchCategories, fetchProducts } from '@/lib/storefront-api'

const STATIC_ROUTES = ['', '/products', '/categories', '/lang-nghe', '/huong-dan-mua-hang', '/cam-nang', '/faq', '/lien-he']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.id}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...categoryEntries, ...productEntries]
}
