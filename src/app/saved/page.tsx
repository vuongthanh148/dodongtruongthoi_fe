'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IconHeart } from '@/components/icons'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Footer } from '@/components/layout/Footer'
import { DeskHeader } from '@/components/layout/Header'
import { MenuDrawer } from '@/components/layout/MenuDrawer'
import { TopBar } from '@/components/layout/TopBar'
import { SavedSync } from '@/components/saved/SavedSync'
import { VisitBlock } from '@/components/sections/VisitBlock'
import { Container } from '@/components/layout/Container'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { SAVED_COPY } from '@/lib/content-data'
import { variantSale } from '@/lib/campaign-price'
import { productPath } from '@/lib/product-links'
import { resolveSKUPrice } from '@/lib/sku'
import { getSavedProducts, setSavedProducts, toggleSavedProduct, upsertCartItem } from '@/lib/storage'
import { fetchProduct } from '@/lib/storefront-api'
import { useCampaigns } from '@/lib/use-campaigns'
import type { Product, SavedProductVariant } from '@/lib/types'

type SavedEntry = { product: Product; variant: SavedProductVariant }

export default function SavedPage() {
  const router = useRouter()
  const { data: campaigns = [] } = useCampaigns()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [savedVariants, setSavedVariants] = useState<SavedProductVariant[]>([])
  const [entries, setEntries] = useState<SavedEntry[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  // Read the device list after mount so server and client render the same first frame.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedVariants(getSavedProducts())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    let cancelled = false
    queueMicrotask(async () => {
      const found = await Promise.all(
        savedVariants.map(async (variant) => {
          const product = await fetchProduct(variant.productId)
          return product ? { product, variant } : null
        })
      )
      if (cancelled) return
      setEntries(found.filter((e): e is SavedEntry => e !== null))
      setProductsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [savedVariants, loaded])

  function unitPrice({ product, variant }: SavedEntry): number {
    const size = product.sizes.find((s) => s.id === variant.sizeId) ?? product.sizes[0]
    const base = resolveSKUPrice(product.skus, size?.code, variant.attrs ?? {}, size?.price ?? product.price)
    return variantSale(base, product, campaigns).price
  }

  function addAllToCart() {
    entries.forEach((entry) => {
      const { product, variant } = entry
      const size = product.sizes.find((s) => s.id === variant.sizeId) ?? product.sizes[0]
      upsertCartItem({
        productId: product.id,
        productTitle: product.title,
        sizeId: variant.sizeId,
        sizeLabel: size?.name,
        selectedAttrs: variant.attrs ?? {},
        quantity: 1,
        unitPrice: unitPrice(entry),
      })
    })
  }

  function removeSaved(productId: string) {
    const current = savedVariants.find((v) => v.productId === productId)
    if (!current) return
    setSavedVariants(toggleSavedProduct(productId, current.attrs, current.sizeId))
  }

  const count = entries.length
  const showEmpty = loaded && !productsLoading && count === 0 && savedVariants.length === 0

  return (
    <div className="paper flex min-h-screen flex-col" style={{ background: 'var(--bg-page)' }}>
      <DeskHeader />
      <TopBar title={SAVED_COPY.title} onMenu={() => setIsMenuOpen(true)} />
      <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: SAVED_COPY.title }]} />

      <Container className="flex-1 pt-2 pb-12 md:pt-0 xl:pb-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="min-w-0">
            <h1 className="m-0 text-[26px] leading-[1.1] font-semibold md:text-[30px] lg:text-[34px] xl:text-[36px]">
              {SAVED_COPY.title}
            </h1>
            {loaded && (
              <p className="m-0 mt-1.5 text-[15px] text-[var(--text-muted-strong)]">
                {savedVariants.length} {SAVED_COPY.countSuffix} · {SAVED_COPY.deviceNote}
              </p>
            )}
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={addAllToCart}
              className="hidden h-[50px] shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent)] px-[22px] font-body text-[15px] font-semibold text-white md:inline-flex"
            >
              {SAVED_COPY.addAll}
            </button>
          )}
        </div>

        <div className="mt-5 md:mt-6 lg:mt-7 xl:mt-8">
          <SavedSync localVariants={savedVariants} onMerged={(list) => {
            setSavedProducts(list)
            setSavedVariants(list)
          }} />
        </div>

        <div className="mt-5 md:mt-6 lg:mt-7 xl:mt-8">
          {!loaded || productsLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : showEmpty ? (
            <div className="flex flex-col items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] px-6 py-12 text-center md:py-14">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--bg-surface-alt)] text-[var(--bronze)]">
                <IconHeart size={26} color="currentColor" />
              </span>
              <p className="m-0 font-heading text-[24px] leading-[1.2] font-semibold">{SAVED_COPY.emptyTitle}</p>
              <p className="m-0 max-w-[480px] text-[15px] leading-[1.6] text-[var(--text-secondary)]">{SAVED_COPY.emptyBody}</p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mt-2 h-[46px] rounded-[6px] bg-[var(--accent)] px-6 font-body text-[15px] font-semibold text-white"
              >
                {SAVED_COPY.emptyCta}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-6">
              {entries.map(({ product, variant }) => (
                <div key={product.id} className="relative">
                  <ProductCard
                    product={{ ...product, defaultVariant: { ...product.defaultVariant, ...(variant.attrs ?? {}) } }}
                    onOpen={() => router.push(productPath(product.id, { sizeId: variant.sizeId, attrs: variant.attrs }))}
                  />
                  <button
                    type="button"
                    onClick={() => removeSaved(product.id)}
                    aria-label={`${SAVED_COPY.remove} ${product.title}`}
                    className="absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--accent)]"
                  >
                    <IconHeart size={16} color="currentColor" filled />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      <VisitBlock />
      <Footer />
    </div>
  )
}
