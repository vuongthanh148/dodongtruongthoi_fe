import type { ProductSKU } from '@/lib/types'

export function resolveSKUPrice(
  skus: ProductSKU[],
  sizeCode: string | null | undefined,
  selectedAttrs: Record<string, string>,
  fallback: number
): number {
  const code = sizeCode ?? null
  const attrEntries = Object.entries(selectedAttrs)

  // Exact match: size + all attrs
  const exact = skus.find(
    (s) =>
      s.size_code === code &&
      attrEntries.every(([k, v]) => s.attrs[k] === v)
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
