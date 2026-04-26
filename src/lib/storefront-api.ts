import type { Category, Product } from '@/lib/types'

export type Banner = {
  id: string
  title: string | null
  subtitle: string | null
  imageUrl: string | null
  linkUrl: string | null
}

export type Campaign = {
  id: string
  name: string
  description: string | null
  discountType: 'percentage' | 'fixed_amount'
  discountValue: number
  startsAt: string
  endsAt: string
  isActive: boolean
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/v1`

interface AdminProduct {
  id: string
  title: string
  subtitle: string | null
  category_id: string
  badge: string | null
  base_price: number
  price?: number
  discount_price?: number
  description: string | null
  meaning: string | null
  default_bg: string
  default_frame: string
  bg_tones: string[]
  frames: string[]
  zodiac_ids: string[]
  purpose_place: string[]
  purpose_use: string[]
  purpose_avoid: string[]
  specs: Record<string, string> | null
  rating: number
  review_count: number
  sizes: Array<{
    id: string
    product_id: string
    size_label: string
    size_code: string
    price: number
    sort_order: number
  }>
  images: Array<{
    id: string
    product_id: string
    bg_tone: string | null
    frame: string | null
    url: string
    alt_text: string | null
    sort_order: number
  }>
}

interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string | null
  tone: string
  image_url: string | null
  sort_order: number
  is_active: boolean
}

interface AdminReviewItem {
  id: string
  reviewer_name: string
  rating: number
  body: string | null
  created_at: string
}

interface AdminBannerItem {
  id: string
  title: string | null
  subtitle: string | null
  image_url: string | null
  link_url: string | null
}

interface AdminCampaignItem {
  id: string
  name: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  starts_at: string
  ends_at: string
  is_active: boolean
}

type ApiDataEnvelope<T> = T | { data?: T }

function unwrapData<T>(payload: ApiDataEnvelope<T>): T | null {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data ?? null
  }
  return payload as T
}

function normalizeTone(tone: string | null | undefined): Category['tone'] {
  if (tone === 'gold' || tone === 'red' || tone === 'bronze' || tone === 'dark') {
    return tone
  }
  return 'bronze'
}

function normalizeNullableText(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }
  const normalized = value.trim()
  if (!normalized || normalized === 'null' || normalized === 'undefined') {
    return null
  }
  return normalized
}

function normalizeCategory(raw: AdminCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    productCount: 0,
    tone: normalizeTone(raw.tone),
  }
}

function normalizeProduct(raw: AdminProduct): Product {
  const normalizedImages = (raw.images || [])
    .map((img) => {
      const normalizedUrl = normalizeNullableText(img.url)
      if (!normalizedUrl) {
        return null
      }

      return {
        id: img.id,
        url: normalizedUrl,
        altText: normalizeNullableText(img.alt_text) || '',
        bgTone: img.bg_tone,
        frame: img.frame,
        sortOrder: img.sort_order,
      }
    })
    .filter((img): img is NonNullable<typeof img> => img !== null)

  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle || '',
    categoryId: raw.category_id,
    badge: (raw.badge || undefined) as 'best_seller' | 'new' | 'sale' | undefined,
    rating: raw.rating || 0,
    reviewCount: raw.review_count || 0,
    price: raw.base_price,
    discountPrice: raw.discount_price,
    defaultBg: raw.default_bg,
    defaultFrame: raw.default_frame,
    bgTones: raw.bg_tones || [],
    frames: raw.frames || [],
    description: raw.description || '',
    meaning: raw.meaning || '',
    specs: raw.specs || {},
    zodiacIds: raw.zodiac_ids || [],
    purpose: {
      place: raw.purpose_place || [],
      use: raw.purpose_use || [],
      avoid: raw.purpose_avoid || [],
    },
    images: normalizedImages,
    sizes: (raw.sizes || []).map((size) => ({
      id: size.id,
      name: size.size_label,
      code: size.size_code as 's' | 'm' | 'l' | 'xl',
      price: size.price,
    })),
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: AdminCategory[] } | AdminCategory[]
    const categories = Array.isArray(data) ? data : data.data || []
    return categories.map(normalizeCategory)
  } catch {
    return []
  }
}

export async function fetchCategory(id: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as ApiDataEnvelope<AdminCategory>
    const raw = unwrapData(data)
    if (!raw) {
      return null
    }
    return normalizeCategory(raw)
  } catch {
    return null
  }
}

export async function fetchProducts(params?: {
  category?: string
  sort?: string
  limit?: number
  offset?: number
}): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/products`)
    if (params?.category) url.searchParams.set('category', params.category)
    if (params?.sort) url.searchParams.set('sort', params.sort)
    if (params?.limit) url.searchParams.set('limit', params.limit.toString())
    if (params?.offset) url.searchParams.set('offset', params.offset.toString())

    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: AdminProduct[] } | AdminProduct[]
    const products = Array.isArray(data) ? data : data.data || []
    return products.map(normalizeProduct)
  } catch {
    return []
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as ApiDataEnvelope<AdminProduct>
    const raw = unwrapData(data)
    if (!raw) {
      return null
    }
    return normalizeProduct(raw)
  } catch {
    return null
  }
}

export type Review = {
  id: string
  reviewerName: string
  rating: number
  body: string
  date: string
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: AdminReviewItem[] }
    return (data.data || []).map((r) => ({
      id: r.id,
      reviewerName: r.reviewer_name,
      rating: r.rating,
      body: r.body || '',
      date: r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : '',
    }))
  } catch {
    return []
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE}/banners`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: AdminBannerItem[] }
    const banners = data.data || []
    return banners.map((b) => ({
      id: b.id,
      title: b.title || null,
      subtitle: b.subtitle || null,
      imageUrl: normalizeNullableText(b.image_url),
      linkUrl:
        b.link_url && b.link_url !== 'null' && b.link_url !== 'undefined'
          ? b.link_url
          : null,
    }))
  } catch {
    return []
  }
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${API_BASE}/campaigns`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: AdminCampaignItem[] }
    const campaigns = data.data || []
    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      discountType: campaign.discount_type,
      discountValue: campaign.discount_value,
      startsAt: campaign.starts_at,
      endsAt: campaign.ends_at,
      isActive: campaign.is_active,
    }))
  } catch {
    return []
  }
}

// Order API functions
export async function createOrder(
  req: import('@/lib/types').CreateOrderRequest
): Promise<{ id: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: req.phone,
        customer_name: req.customerName || null,
        address: req.address || null,
        note: req.note || null,
        items: (req.items || []).map((item) => ({
          product_id: item.productId,
          product_title: item.productTitle,
          size_code: item.sizeCode || null,
          size_label: item.sizeLabel || null,
          bg_tone: item.bgTone || null,
          bg_tone_label: item.bgToneLabel || null,
          frame: item.frame || null,
          frame_label: item.frameLabel || null,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          variant_image_url: item.variantImageUrl || null,
        })),
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { data?: { id: string } }
    return data.data || null
  } catch {
    return null
  }
}

export async function getOrdersByPhone(phone: string): Promise<import('@/lib/types').Order[]> {
  try {
    const url = new URL(`${API_BASE}/orders`)
    url.searchParams.set('phone', phone)
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: any[] }
    const orders = data.data || []
    return orders.map(normalizeOrder)
  } catch {
    return []
  }
}

export async function getOrderById(id: string): Promise<import('@/lib/types').Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as { data?: any }
    if (!data.data) return null
    return normalizeOrder(data.data)
  } catch {
    return null
  }
}

// Helper to normalize order from backend
function normalizeOrder(raw: any): import('@/lib/types').Order {
  return {
    id: raw.id,
    phone: raw.phone,
    customerName: raw.customer_name || undefined,
    address: raw.address || undefined,
    note: raw.note || undefined,
    status: raw.status || 'pending_confirm',
    totalAmount: raw.total_amount || 0,
    items: (raw.items || []).map((item: any) => ({
      productId: item.product_id,
      productTitle: item.product_title,
      productSubtitle: item.product_subtitle,
      sizeCode: item.size_code,
      sizeLabel: item.size_label,
      bgTone: item.bg_tone,
      bgToneLabel: item.bg_tone_label,
      frame: item.frame,
      frameLabel: item.frame_label,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      variantImageUrl: item.variant_image_url,
    })),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}
