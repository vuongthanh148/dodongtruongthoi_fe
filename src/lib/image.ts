import type { ProductImage } from '@/lib/types'

export function imgUrl(
  baseUrl: string,
  opts: { w?: number; h?: number; q?: number } = {}
): string {
  const transforms = [
    'f_auto',
    `q_${opts.q ?? 'auto'}`,
    opts.w ? `w_${opts.w}` : '',
    opts.h ? `h_${opts.h},c_fill` : '',
  ]
    .filter(Boolean)
    .join(',')

  return baseUrl.replace('/upload/', `/upload/${transforms}/`)
}

export function pickVariantImage(
  images: ProductImage[],
  selectedAttrs: Record<string, string>
): ProductImage | null {
  const entries = Object.entries(selectedAttrs)
  if (entries.length === 0) return images[0] ?? null

  // Find image where all selectedAttrs match image attrs
  const full = images.find((img) =>
    entries.every(([k, v]) => img.attrs.some((a) => a.key === k && a.value === v))
  )
  if (full) return full

  // Partial match: at least one attr matches
  return images.find((img) =>
    entries.some(([k, v]) => img.attrs.some((a) => a.key === k && a.value === v))
  ) ?? images[0] ?? null
}
