import { API_BASE } from '@/lib/api-config'
import type { Category, Order, OrderStatus, OrderSummary, Product } from '@/lib/types'

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
  campaign_id?: string
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
  campaignId: raw.campaign_id,
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

/** Throws on network or HTTP failure, so SWR can show an error state. */
export async function loadCategories(): Promise<Category[]> {
  const res = await apiFetch(`${API_BASE}/categories`)
  if (!res.ok) throw new Error(`categories ${res.status}`)
  const data = (await res.json()) as { data?: AdminCategory[] } | AdminCategory[]
  const categories = Array.isArray(data) ? data : data.data || []
  return categories.map(normalizeCategory)
}

export async function fetchCategories(): Promise<Category[]> {
  return loadCategories().catch(() => [])
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

type ProductListParams = {
  category?: string
  sort?: string
  limit?: number
  offset?: number
}

/** Throws on network or HTTP failure, so SWR can show an error state. */
export async function loadProducts(params?: ProductListParams): Promise<Product[]> {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.sort) qs.set('sort', params.sort)
  if (params?.limit) qs.set('limit', params.limit.toString())
  if (params?.offset) qs.set('offset', params.offset.toString())
  const suffix = qs.toString() ? `?${qs.toString()}` : ''

  const res = await apiFetch(`${API_BASE}/products${suffix}`)
  if (!res.ok) throw new Error(`products ${res.status}`)
  const data = (await res.json()) as { data?: AdminProduct[] } | AdminProduct[]
  const products = Array.isArray(data) ? data : data.data || []
  return products.map(normalizeProduct)
}

export async function fetchProducts(params?: ProductListParams): Promise<Product[]> {
  return loadProducts(params).catch(() => [])
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

export type ReviewSubmission = {
  reviewerName: string
  rating: number
  body: string
}

// Returns true when the review was accepted. Accepted reviews are pending moderation.
export async function submitReview(
  productId: string,
  review: ReviewSubmission
): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: review.reviewerName,
        rating: review.rating,
        body: review.body,
      }),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

export type ContactMessageInput = {
  name: string
  phone: string
  message: string
}

export type ContactMessageResult =
  | { ok: true }
  | { ok: false; status: number; message?: string }

// Returns ok only on 2xx. On 400 the server's validation message is passed through.
export async function submitContactMessage(input: ContactMessageInput): Promise<ContactMessageResult> {
  try {
    const res = await apiFetch(`${API_BASE}/contacts/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
    })
    if (res.ok) {
      return { ok: true }
    }
    let message: string | undefined
    try {
      const body = (await res.json()) as { message?: string }
      message = body.message || undefined
    } catch {
      // non-JSON error body; no server message
    }
    return { ok: false, status: res.status, message }
  } catch {
    return { ok: false, status: 0 }
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

/** Throws on network or HTTP failure, so SWR can show an error state. */
export async function loadSettings(): Promise<Record<string, string>> {
  const res = await apiFetch(`${API_BASE}/settings`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`settings ${res.status}`)
  const data = (await res.json()) as ApiDataEnvelope<Record<string, string>>
  const settings = unwrapData(data)
  return settings && typeof settings === 'object' ? settings : {}
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
): Promise<{ id: string; lookup_code: string } | null> {
  try {
    const res = await apiFetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: req.phone,
        customerName: req.customerName || null,
        address: req.address || null,
        note: req.note || null,
        paymentMethod: req.paymentMethod || null,
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
    const data = (await res.json()) as { data?: { id: string; lookup_code: string } }
    return data.data || null
  } catch {
    return null
  }
}

type RawOrderSummary = {
  id: string
  status?: OrderStatus
  created_at: string
  total_amount?: number
  items?: Array<{ product_title: string; quantity: number }>
}

function normalizeOrderSummary(raw: RawOrderSummary): OrderSummary {
  return {
    id: raw.id,
    status: raw.status || 'pending_confirm',
    createdAt: raw.created_at,
    totalAmount: raw.total_amount || 0,
    items: (raw.items || []).map((item) => ({
      productTitle: item.product_title,
      quantity: item.quantity,
    })),
  }
}

export type OrderListResult =
  | { kind: 'ok'; orders: OrderSummary[] }
  | { kind: 'offline' }
  | { kind: 'error' }

// Summaries only (no address, name, note, phone or prices). Ids here are not secret
// by themselves; the detail still needs a verified token.
// 'offline' means the request never reached the server (network failure), so the page can
// offer a retry. An empty list is a real answer and is returned as kind 'ok'.
export async function getOrdersByPhone(phone: string): Promise<OrderListResult> {
  let res: Response
  try {
    res = await apiFetch(`${API_BASE}/orders?phone=${encodeURIComponent(phone)}`, {
      cache: 'no-store',
    })
  } catch {
    return { kind: 'offline' }
  }
  if (!res.ok) return { kind: 'error' }
  const data = (await res.json().catch(() => null)) as { data?: RawOrderSummary[] } | null
  if (!data) return { kind: 'error' }
  return { kind: 'ok', orders: (data.data || []).map(normalizeOrderSummary) }
}

// Timestamps may arrive as ISO strings or epoch numbers (seconds or ms).
function parseTimestamp(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

const DEFAULT_TOKEN_TTL_MS = 15 * 60 * 1000

export type VerifyOrderResult =
  | { kind: 'ok'; token: string; expiresAt: number; orderId: string }
  | { kind: 'invalid'; remainingAttempts: number | null }
  | { kind: 'locked'; lockedUntil: number | null }
  | { kind: 'offline' }
  | { kind: 'error' }

// Server decides everything: wrong code (401), lock (429) and success (200) all come from here.
export async function verifyOrderLookup(phone: string, code: string): Promise<VerifyOrderResult> {
  let res: Response
  try {
    res = await apiFetch(`${API_BASE}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
      cache: 'no-store',
    })
  } catch {
    return { kind: 'offline' }
  }
  try {
    const body = (await res.json().catch(() => null)) as { data?: Record<string, unknown> } | null
    const data = body?.data ?? {}

    if (res.status === 200) {
      if (typeof data.token !== 'string' || !data.token) return { kind: 'error' }
      if (typeof data.order_id !== 'string' || !data.order_id) return { kind: 'error' }
      return {
        kind: 'ok',
        token: data.token,
        expiresAt: parseTimestamp(data.expires_at) ?? Date.now() + DEFAULT_TOKEN_TTL_MS,
        // The token is bound to this order only; callers must use this id, not their own.
        orderId: data.order_id,
      }
    }
    if (res.status === 401) {
      const remaining = data.remaining_attempts
      return {
        kind: 'invalid',
        remainingAttempts: typeof remaining === 'number' ? remaining : null,
      }
    }
    if (res.status === 429) {
      return { kind: 'locked', lockedUntil: parseTimestamp(data.locked_until) }
    }
    return { kind: 'error' }
  } catch {
    return { kind: 'error' }
  }
}

export type OrderDetailResult =
  | { kind: 'ok'; order: Order }
  | { kind: 'unauthorized' }
  | { kind: 'offline' }
  | { kind: 'error' }

// Sends X-Order-Token. 401 means no token, an expired token, or a token for a different order.
export async function fetchOrderDetail(id: string, token: string): Promise<OrderDetailResult> {
  let res: Response
  try {
    res = await apiFetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      headers: { 'X-Order-Token': token },
      cache: 'no-store',
    })
  } catch {
    return { kind: 'offline' }
  }
  try {
    if (res.status === 401) return { kind: 'unauthorized' }
    if (!res.ok) return { kind: 'error' }
    const data = (await res.json()) as { data?: RawOrder }
    if (!data.data) return { kind: 'error' }
    return { kind: 'ok', order: normalizeOrder(data.data) }
  } catch {
    return { kind: 'error' }
  }
}

export class OrderApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'OrderApiError'
    this.status = status
  }
}

// Requires the token verified for this order. Throws OrderApiError on non-2xx so callers can
// branch on status (401 = token missing/invalid for this order, 409 = not cancellable).
export async function cancelOrder(id: string, token: string): Promise<import('@/lib/types').Order> {
  const res = await apiFetch(`${API_BASE}/orders/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    headers: { 'X-Order-Token': token },
    cache: 'no-store',
  })
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // non-JSON error body; keep default message
    }
    throw new OrderApiError(res.status, message)
  }
  const data = (await res.json()) as { data?: RawOrder }
  if (!data.data) {
    throw new OrderApiError(res.status, 'Empty order response')
  }
  return normalizeOrder(data.data)
}

// Helper to normalize order from backend
function normalizeOrder(raw: RawOrder): Order {
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
