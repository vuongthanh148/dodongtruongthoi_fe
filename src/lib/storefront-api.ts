import { API_BASE } from '@/lib/api-config'
import type { Category, Product } from '@/lib/types'

const apiFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, headers: { 'ngrok-skip-browser-warning': '1', ...init?.headers } })

type RawOrderItem = {
  product_id: string
  product_title: string
  product_subtitle?: string
  size_code?: string
  size_label?: string
  selected_attrs?: Record<string, string>
  quantity: number
  unit_price: number
  variant_image_url?: string
}

type RawOrder = {
  id: string
  phone: string
  customer_name?: string
  address?: string
  note?: string
  status?: 'pending_confirm' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  total_amount?: number
  items?: RawOrderItem[]
  created_at: string
  updated_at?: string
}

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

export type CustomerPhoto = {
  id: string
  imageUrl: string
  caption: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export type LabelOverrides = {
  bgTones: Record<string, string>
  frames: Record<string, string>
  placeLabels: Record<string, string>
  specLabels: Record<string, string>
}

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
  variant_options: import('@/lib/types').VariantOption[]
  default_variant: Record<string, string>
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
    image_id: string
    url: string
    name: string
    sort_order: number
    attrs: import('@/lib/types').VariantAttr[]
  }>
  skus: Array<{
    id: string
    product_id: string
    size_code: string | null
    attrs: Record<string, string>
    price: number
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
  product_count?: number
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

interface AdminCustomerPhotoItem {
  id: string
  image_url: string
  caption: string | null
  sort_order: number
  is_active: boolean
  created_at: string
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
    productCount: raw.product_count ?? 0,
    tone: normalizeTone(raw.tone),
    imageUrl: raw.image_url ?? undefined,
  }
}

function normalizeProduct(raw: AdminProduct): Product {
  const normalizedImages = (raw.images || [])
    .map((img) => {
      const normalizedUrl = normalizeNullableText(img.url)
      if (!normalizedUrl) return null
      return {
        id: img.id,
        product_id: img.product_id,
        image_id: img.image_id,
        url: normalizedUrl,
        name: img.name || '',
        sort_order: img.sort_order,
        attrs: img.attrs || [],
        created_at: '',
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
    price: raw.price ?? raw.base_price,
    discountPrice: raw.discount_price,
    variantOptions: raw.variant_options || [],
    defaultVariant: raw.default_variant || {},
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
      code: size.size_code,
      price: size.price,
    })),
    skus: (raw.skus || []).map((sku: { id: string; product_id: string; size_code: string | null; attrs: Record<string, string>; price: number; sort_order: number }) => ({
      id: sku.id,
      product_id: sku.product_id,
      size_code: sku.size_code ?? null,
      attrs: sku.attrs || {},
      price: sku.price,
      sort_order: sku.sort_order,
    })),
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await apiFetch(`${API_BASE}/categories`)
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
    const res = await apiFetch(`${API_BASE}/categories/${id}`)
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
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    if (params?.sort) qs.set('sort', params.sort)
    if (params?.limit) qs.set('limit', params.limit.toString())
    if (params?.offset) qs.set('offset', params.offset.toString())
    const suffix = qs.toString() ? `?${qs.toString()}` : ''

    const res = await apiFetch(`${API_BASE}/products${suffix}`)
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
    const res = await apiFetch(`${API_BASE}/products/${id}`)
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
    const res = await apiFetch(`${API_BASE}/products/${productId}/reviews`)
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
    const res = await apiFetch(`${API_BASE}/banners`)
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
    const res = await apiFetch(`${API_BASE}/campaigns`)
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

export async function fetchCustomerPhotos(): Promise<CustomerPhoto[]> {
  try {
    const res = await apiFetch(`${API_BASE}/customer-photos`)
    if (!res.ok) return []
    const data = (await res.json()) as { data?: AdminCustomerPhotoItem[] }
    const photos = data.data || []
    return photos.map((photo) => ({
      id: photo.id,
      imageUrl: photo.image_url,
      caption: photo.caption,
      sortOrder: photo.sort_order,
      isActive: photo.is_active,
      createdAt: photo.created_at,
    }))
  } catch {
    return []
  }
}

export async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const res = await apiFetch(`${API_BASE}/settings`)
    if (!res.ok) return {}
    const data = (await res.json()) as ApiDataEnvelope<Record<string, string>>
    const settings = unwrapData(data)
    if (!settings || typeof settings !== 'object') {
      return {}
    }
    return settings
  } catch {
    return {}
  }
}

export function parseLabelOverrides(settings: Record<string, string>): LabelOverrides {
  const parsed: LabelOverrides = {
    bgTones: {},
    frames: {},
    placeLabels: {},
    specLabels: {},
  }

  for (const [key, value] of Object.entries(settings)) {
    if (!value || !value.trim()) {
      continue
    }

    if (key.startsWith('bg_tone_label.')) {
      const id = key.slice('bg_tone_label.'.length)
      if (id) {
        parsed.bgTones[id] = value.trim()
      }
      continue
    }

    if (key.startsWith('frame_label.')) {
      const id = key.slice('frame_label.'.length)
      if (id) {
        parsed.frames[id] = value.trim()
      }
      continue
    }

    if (key.startsWith('place_label.')) {
      const id = key.slice('place_label.'.length)
      if (id) {
        parsed.placeLabels[id] = value.trim()
      }
      continue
    }

    if (key.startsWith('spec_label.')) {
      const id = key.slice('spec_label.'.length)
      if (id) {
        parsed.specLabels[id] = value.trim()
      }
    }
  }

  return parsed
}

// Order API functions
export async function createOrder(
  req: import('@/lib/types').CreateOrderRequest
): Promise<{ id: string } | null> {
  try {
    const res = await apiFetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: req.phone,
        customerName: req.customerName || null,
        address: req.address || null,
        note: req.note || null,
        items: (req.items || []).map((item) => ({
          productId: item.productId,
          productTitle: item.productTitle,
          sizeCode: item.sizeCode || null,
          sizeLabel: item.sizeLabel || null,
          selectedAttrs: item.selectedAttrs || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          variantImageUrl: item.variantImageUrl || null,
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
    const res = await apiFetch(`${API_BASE}/orders?phone=${encodeURIComponent(phone)}`)
    if (!res.ok) return []
    const data = (await res.json()) as { data?: RawOrder[] }
    const orders = data.data || []
    return orders.map(normalizeOrder)
  } catch {
    return []
  }
}

export async function getOrderById(id: string): Promise<import('@/lib/types').Order | null> {
  try {
    const res = await apiFetch(`${API_BASE}/orders/${id}`)
    if (!res.ok) return null
    const data = (await res.json()) as { data?: RawOrder }
    if (!data.data) return null
    return normalizeOrder(data.data)
  } catch {
    return null
  }
}

// Helper to normalize order from backend
function normalizeOrder(raw: RawOrder): import('@/lib/types').Order {
  return {
    id: raw.id,
    phone: raw.phone,
    customerName: raw.customer_name || undefined,
    address: raw.address || undefined,
    note: raw.note || undefined,
    status: raw.status || 'pending_confirm',
    totalAmount: raw.total_amount || 0,
    items: (raw.items || []).map((item: RawOrderItem) => ({
      productId: item.product_id,
      productTitle: item.product_title,
      productSubtitle: item.product_subtitle,
      sizeCode: item.size_code,
      sizeLabel: item.size_label,
      selectedAttrs: item.selected_attrs,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      variantImageUrl: item.variant_image_url,
    })),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}
