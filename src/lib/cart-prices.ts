import { fetchCampaigns, fetchProduct } from '@/lib/storefront-api'
import { resolveSKUPrice } from '@/lib/sku'
import { variantSale, type CampaignRule } from '@/lib/campaign-price'
import type { CartItem } from '@/lib/types'

export interface CartLinePrice {
  /** List price for the chosen size and options. */
  listPrice: number
  /** Price charged now: the live sale price, or the list price when no campaign applies. */
  price: number
  /** Live campaign that applies to this line, or null (expired or never on sale). */
  campaign: CampaignRule | null
  /** Discount badge without the sign, e.g. "15" or "5.88". Null without a campaign. */
  percent: string | null
}

// Resolves current prices for cart items from live product and campaign data, using the
// same rules as the product page. Keyed by cart index. Items whose product could not be
// fetched are omitted, so callers fall back to the stored unitPrice for them.
export async function fetchLivePrices(items: CartItem[]): Promise<Record<number, CartLinePrice>> {
  const uniqueIds = [...new Set(items.map((i) => i.productId))]
  const [products, campaigns] = await Promise.all([
    Promise.all(uniqueIds.map((id) => fetchProduct(id))),
    fetchCampaigns(),
  ])
  const map: Record<number, CartLinePrice> = {}
  items.forEach((item, idx) => {
    const product = products[uniqueIds.indexOf(item.productId)]
    if (!product) return
    const size = product.sizes.find((s) => s.id === item.sizeId)
    const sizeCode = size?.code ?? null
    const listPrice = resolveSKUPrice(product.skus, sizeCode, item.selectedAttrs ?? {}, size?.price ?? product.price)
    const view = variantSale(listPrice, product, campaigns)
    const fallbackPrice =
      !view.campaign && product.discountPrice && product.discountPrice > 0 && product.discountPrice < listPrice
        ? product.discountPrice
        : view.price
    map[idx] = { listPrice, price: fallbackPrice, campaign: view.campaign, percent: view.percent }
  })
  return map
}

/** Drops the price of a removed cart line and shifts the later indices down by one. */
export function dropLinePrice(
  prices: Record<number, CartLinePrice>,
  removedIndex: number
): Record<number, CartLinePrice> {
  const next: Record<number, CartLinePrice> = {}
  for (const [key, value] of Object.entries(prices)) {
    const index = Number(key)
    if (index === removedIndex) continue
    next[index > removedIndex ? index - 1 : index] = value
  }
  return next
}
