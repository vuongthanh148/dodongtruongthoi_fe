import { fetchProduct } from '@/lib/storefront-api'
import { resolveSKUPrice } from '@/lib/sku'
import type { CartItem } from '@/lib/types'

// Resolves current unit prices for cart items from live product data.
// Keyed by cart index. Items whose product could not be fetched are omitted,
// so callers should fall back to the stored unitPrice for them.
export async function fetchLivePrices(items: CartItem[]): Promise<Record<number, number>> {
  const uniqueIds = [...new Set(items.map((i) => i.productId))]
  const products = await Promise.all(uniqueIds.map((id) => fetchProduct(id)))
  const map: Record<number, number> = {}
  items.forEach((item, idx) => {
    const product = products[uniqueIds.indexOf(item.productId)]
    if (!product) return
    const size = product.sizes.find((s) => s.id === item.sizeId)
    const sizeCode = size?.code ?? null
    map[idx] = resolveSKUPrice(product.skus, sizeCode, item.selectedAttrs ?? {}, size?.price ?? product.discountPrice ?? product.price)
  })
  return map
}
