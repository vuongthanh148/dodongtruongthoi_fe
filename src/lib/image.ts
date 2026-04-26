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
  bgTone: string,
  frame: string
): ProductImage | null {
  return (
    images.find((image) => image.bgTone === bgTone && image.frame === frame) ??
    images.find((image) => image.bgTone === bgTone && image.frame === null) ??
    images.find((image) => image.bgTone === null && image.frame === null) ??
    null
  )
}
