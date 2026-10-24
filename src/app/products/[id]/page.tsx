import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { fetchProduct } from '@/lib/storefront-api'
import { ProductDetailClient } from './ProductDetailClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) return {}

  const image = product.images[0]?.url
  return {
    title: `${product.title} | ${SITE_NAME}`,
    description: product.description.slice(0, 160) || product.subtitle,
    alternates: { canonical: `${SITE_URL}/products/${id}` },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 200),
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) notFound()

  const price = product.discountPrice ?? product.price
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/products/${id}`,
    },
    ...(product.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient productId={id} initialProduct={product} />
    </>
  )
}
