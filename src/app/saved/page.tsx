'use client'

import { DrumMark, IconHeart } from '@/components/icons'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { Btn } from '@/components/ui/Btn'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Price } from '@/components/ui/Price'
import { PRODUCTS } from '@/lib/data'
import { getSavedProducts, toggleSavedProduct } from '@/lib/storage'
import { fetchProduct } from '@/lib/storefront-api'
import type { Product, SavedProductVariant } from '@/lib/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SavedPage() {
  const [savedVariants, setSavedVariants] = useState<SavedProductVariant[]>(() =>
    getSavedProducts()
  )
  const [savedProducts, setSavedProducts] = useState<
    (Product & { variant: SavedProductVariant })[]
  >([])

  useEffect(() => {
    let cancelled = false

    queueMicrotask(async () => {
      const products = await Promise.all(
        savedVariants.map(async (variant) => {
          const prod = await fetchProduct(variant.productId)
          if (prod) {
            return { ...prod, variant }
          }

          const fallback = PRODUCTS.find((p) => p.id === variant.productId)
          return fallback ? { ...fallback, variant } : null
        })
      )

      if (cancelled) {
        return
      }

      setSavedProducts(
        products.filter((p): p is Product & { variant: SavedProductVariant } => p !== null)
      )
    })

    return () => {
      cancelled = true
    }
  }, [savedVariants])

  function variantHref(productId: string, variant: SavedProductVariant) {
    const params = new URLSearchParams()
    if (variant.bgTone) params.set('bgTone', variant.bgTone)
    if (variant.frame) params.set('frame', variant.frame)
    if (variant.sizeId) params.set('sizeId', variant.sizeId)
    const query = params.toString()
    return query ? `/products/${productId}?${query}` : `/products/${productId}`
  }

  return (
    <div className="paper" style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <TopBar title="Sản phẩm đã lưu" onBack={() => window.history.back()} />

      <div style={{ padding: '10px 16px 6px' }}>
        <Heading as="h1" size="xl">Đã lưu</Heading>
        <div
          style={{
            fontFamily: 'var(--font-lora), serif',
            fontStyle: 'italic',
            fontSize: 12,
            color: 'var(--bronze)',
          }}
        >
          {savedProducts.length} tác phẩm được yêu thích
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <DrumMark size={52} color="var(--bronze)" />
          <Heading size="md" style={{ marginTop: 14 }}>
            Chưa có sản phẩm nào
          </Heading>
          <div
            style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.55 }}
          >
            Bấm nút yêu thích ở trang chi tiết để lưu tác phẩm.
          </div>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: 16,
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Về trang chủ
          </Link>
        </div>
      ) : (
        <div
          style={{ padding: '14px 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {savedProducts.map((product) => {
            if (!product) {
              return null
            }

            const selectedSize =
              product.sizes.find((size) => size.id === product.variant.sizeId) ?? product.sizes[0]

            return (
              <Card
                key={`${product.id}-${product.variant.bgTone ?? 'default'}-${product.variant.frame ?? 'default'}-${product.variant.sizeId ?? 'default'}`}
                noPadding
                style={{ borderRadius: 8 }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: 10,
                    alignItems: 'flex-start',
                  }}
                >
                <div style={{ flexShrink: 0, width: 100 }}>
                  <Link href={variantHref(product.id, product.variant)}>
                    <ArtPiece
                      bg={
                        (product.variant.bgTone || product.defaultBg) as
                          | 'gold'
                          | 'red'
                          | 'bronze'
                          | 'dark'
                      }
                      frame={
                        (product.variant.frame || product.defaultFrame) as
                          | 'bronze'
                          | 'gold'
                          | 'dark'
                          | 'carved'
                      }
                      label={product.title}
                      pad={5}
                      aspect="1/1"
                    />
                  </Link>
                </div>
                <Link
                  href={variantHref(product.id, product.variant)}
                  style={{ textDecoration: 'none', minWidth: 0, flex: 1 }}
                >
                  <Heading as="div" size="sm" style={{ color: 'var(--text-primary)', fontSize: 13 }}>{product.title}</Heading>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                    {product.subtitle}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {selectedSize ? `Kích thước: ${selectedSize.name}` : 'Kích thước: mặc định'}
                  </div>
                  <div style={{ marginTop: 4 }}><Price amount={selectedSize?.price ?? product.discountPrice ?? product.price} size="sm" /></div>
                </Link>
                <Btn
                  type="button"
                  onClick={() =>
                    setSavedVariants(
                      toggleSavedProduct(
                        product.id,
                        product.variant.bgTone,
                        product.variant.frame,
                        product.variant.sizeId
                      )
                    )
                  }
                  variant="ghost"
                  size="sm"
                  style={{ color: 'var(--accent)', padding: 4, flexShrink: 0 }}
                >
                  <IconHeart size={18} color="var(--accent)" filled />
                </Btn>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
