'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { ArtPiece } from '@/components/ui/ArtPiece'
import { getSavedProducts, toggleSavedProduct, upsertCartItem } from '@/lib/storage'
import { fetchProduct } from '@/lib/storefront-api'
import type { Product, SavedProductVariant } from '@/lib/types'

export default function SavedPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
          return prod ? { ...prod, variant } : null
        })
      )
      if (cancelled) return
      setSavedProducts(
        products.filter((p): p is Product & { variant: SavedProductVariant } => p !== null)
      )
    })
    return () => { cancelled = true }
  }, [savedVariants])

  function variantHref(productId: string, variant: SavedProductVariant) {
    const params = new URLSearchParams()
    if (variant.sizeId) params.set('sizeId', variant.sizeId)
    const query = params.toString()
    return query ? `/products/${productId}?${query}` : `/products/${productId}`
  }

  const emptyState = (
    <div style={{ padding: '80px 30px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <svg width={72} height={72} viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <div style={{ fontFamily: 'var(--font-lora), serif', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
        Chưa có sản phẩm yêu thích
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
        Bấm vào biểu tượng trái tim ở trang sản phẩm để lưu tác phẩm.
      </div>
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, padding: '13px 24px', fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 14, cursor: 'pointer' }}
      >
        Khám phá sản phẩm
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)'}}>
      <DeskHeader />
      <TopBar
        title="Đã Lưu"
        onMenu={() => setIsMenuOpen(true)}

      />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm đã lưu' }]} />

      {savedProducts.length === 0 ? emptyState : (
        <div style={{ padding: '16px 16px 0' }}>
          {/* Count eyebrow */}
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'var(--bronze)', textTransform: 'uppercase' }}>
              {savedProducts.length} tác phẩm yêu thích
            </div>
            <button
              type="button"
              className="hidden md:inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white"
              style={{ background: 'var(--accent)', fontFamily: 'var(--font-be-vietnam), sans-serif' }}
              onClick={() => {
                savedProducts.forEach((product) => {
                  const selectedSize = product.sizes.find((s) => s.id === product.variant.sizeId) ?? product.sizes[0]
                  const price = selectedSize?.price ?? product.price
                  upsertCartItem({
                    productId: product.id,
                    productTitle: product.title,
                    sizeId: product.variant.sizeId,
                    sizeLabel: selectedSize?.name,
                    selectedAttrs: product.variant.attrs ?? {},
                    quantity: 1,
                    unitPrice: price,
                  })
                })
              }}
            >
              Thêm tất cả vào giỏ
            </button>
          </div>

          {/* Grid with border pattern */}
          <div style={{ display: 'grid', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }} className="grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {savedProducts.map((product, idx) => {
              const bg = ((product.variant.attrs?.['bg_tone']) ?? product.defaultVariant?.['bg_tone'] ?? 'gold') as 'gold' | 'red' | 'bronze' | 'dark'
              const frame = ((product.variant.attrs?.['frame']) ?? product.defaultVariant?.['frame'] ?? 'bronze') as 'bronze' | 'gold' | 'dark' | 'carved'
              const selectedSize = product.sizes.find((s) => s.id === product.variant.sizeId) ?? product.sizes[0]
              const price = selectedSize?.price ?? product.price

              return (
                <div
                  key={`${product.id}-${idx}`}
                  style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', background: 'var(--bg-card)' }}
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() =>
                      setSavedVariants(
                        toggleSavedProduct(
                          product.id,
                          product.variant.attrs,
                          product.variant.sizeId
                        )
                      )
                    }
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      color: 'white',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>

                  <Link href={variantHref(product.id, product.variant)} style={{ textDecoration: 'none', display: 'block' }}>
                    {/* Artwork */}
                    <div style={{ padding: 10, paddingBottom: 6 }}>
                      <ArtPiece
                        bg={bg}
                        frame={frame}
                        label=""
                        pad={6}
                        aspect="1/1"
                      />
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0 10px 12px' }}>
                      {/* Color swatches */}
                      {product.variant.attrs?.['bg_tone'] && (
                        <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                          {(['gold', 'red', 'bronze', 'dark'] as const).map((tone) => {
                            const swatchColors: Record<string, string> = {
                              gold: '#c9a961',
                              red: '#8b1e1e',
                              bronze: '#6b4423',
                              dark: '#2a1f1a',
                            }
                            const isActive = tone === product.variant.attrs?.['bg_tone']
                            return (
                              <div
                                key={tone}
                                style={{
                                  width: isActive ? 12 : 8,
                                  height: 8,
                                  borderRadius: 4,
                                  background: swatchColors[tone],
                                  opacity: isActive ? 1 : 0.35,
                                  transition: 'width 200ms',
                                }}
                              />
                            )
                          })}
                        </div>
                      )}

                      {/* Title — 2 lines max */}
                      <div style={{
                        fontFamily: 'var(--font-lora), serif',
                        fontWeight: 600,
                        fontSize: 13,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        marginBottom: 4,
                      }}>
                        {product.title}
                      </div>
                      {product.subtitle && (
                        <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--bronze)', marginTop: 2, lineHeight: 1.3 }}>
                          {product.subtitle}
                        </div>
                      )}

                      {/* Price */}
                      <div style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 13, color: 'var(--accent)' }}>
                        {price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  )
}
