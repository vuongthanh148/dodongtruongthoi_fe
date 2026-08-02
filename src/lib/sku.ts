import type { ProductSKU } from '@/lib/types'

export function resolveSKUPrice(
  skus: ProductSKU[],
  sizeCode: string | null | undefined,
  selectedAttrs: Record<string, string>,
  fallback: number
): number {
  const code = sizeCode ?? null

  // Exact match: size + all SKU attrs present in selected attrs
  // SKU only stores price-affecting attrs — extra selected attrs (display-only) are ignored
  const exact = skus.find(
    (s) =>
      s.size_code === code &&
      Object.entries(s.attrs).every(([k, v]) => selectedAttrs[k] === v)
  )
  if (exact) return exact.price

  // Size-only match (ignore variant diff)
  const sizeMatch = skus.find((s) => s.size_code === code)
  if (sizeMatch) return sizeMatch.price

  return fallback
}

// Returns cheapest SKU price for a given size (for display in size selectors)
export function resolveSizeDisplayPrice(
  skus: ProductSKU[],
  sizeCode: string | null,
  fallback: number
): number {
  const matches = skus.filter((s) => s.size_code === sizeCode)
  if (matches.length === 0) return fallback
  return Math.min(...matches.map((s) => s.price))
}
