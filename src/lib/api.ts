import type { Order, OrderStatus } from '@/lib/types'
import { API_BASE } from '@/lib/api-config'

interface CreateOrderPayload {
  phone: string
  customerName?: string
  note?: string
  items: Array<{
    productId: string
    sizeCode?: string
    sizeLabel?: string
    bgTone?: string
    bgToneLabel?: string
    frame?: string
    frameLabel?: string
    quantity: number
    unitPrice: number
    variantImageUrl?: string
  }>
}

function toStatus(value: string | undefined): OrderStatus {
  switch (value) {
    case 'confirmed':
    case 'processing':
    case 'shipped':
    case 'completed':
    case 'cancelled':
      return value
    default:
      return 'pending_confirm'
  }
}

function normalizeOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const data = raw as Record<string, unknown>
  if (typeof data.id !== 'string' || typeof data.phone !== 'string') {
    return null
  }

  const items: Order['items'] = Array.isArray(data.items)
    ? data.items.reduce<Order['items']>((acc, item) => {
        if (!item || typeof item !== 'object') {
          return acc
        }

        const row = item as Record<string, unknown>
        if (typeof row.product_id !== 'string') {
          return acc
        }

        acc.push({
          productId: row.product_id,
          productTitle: typeof row.product_title === 'string' ? row.product_title : 'Sản phẩm',
          productSubtitle: typeof row.product_subtitle === 'string' ? row.product_subtitle : undefined,
          sizeCode: typeof row.size_code === 'string' ? row.size_code : undefined,
          sizeLabel: typeof row.size_label === 'string' ? row.size_label : undefined,
          bgTone: typeof row.bg_tone === 'string' ? row.bg_tone : undefined,
          bgToneLabel: typeof row.bg_tone_label === 'string' ? row.bg_tone_label : undefined,
          frame: typeof row.frame === 'string' ? row.frame : undefined,
          frameLabel: typeof row.frame_label === 'string' ? row.frame_label : undefined,
          quantity: typeof row.quantity === 'number' ? row.quantity : 1,
          unitPrice: typeof row.unit_price === 'number' ? row.unit_price : 0,
          variantImageUrl: typeof row.variant_image_url === 'string' ? row.variant_image_url : undefined,
        })

        return acc
      }, [])
    : []

  return {
    id: data.id,
    phone: data.phone,
    customerName: typeof data.customer_name === 'string' ? data.customer_name : undefined,
    address: typeof data.address === 'string' ? data.address : undefined,
    note: typeof data.note === 'string' ? data.note : undefined,
    status: toStatus(typeof data.status === 'string' ? data.status : undefined),
    totalAmount: typeof data.total_amount === 'number' ? data.total_amount : 0,
    createdAt:
      typeof data.created_at === 'string'
        ? data.created_at
        : typeof data.createdAt === 'string'
          ? data.createdAt
          : new Date().toISOString(),
    updatedAt: typeof data.updated_at === 'string' ? data.updated_at : undefined,
    items,
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as Record<string, unknown>
    return normalizeOrder((json.data ?? json.order ?? json) as unknown)
  } catch {
    return null
  }
}

export async function getOrdersByPhone(phone: string): Promise<Order[] | null> {
  try {
    const response = await fetch(`${API_BASE}/orders?phone=${encodeURIComponent(phone)}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as Record<string, unknown>
    const data = json.data ?? json.orders ?? json
    if (!Array.isArray(data)) {
      return []
    }

    return data.map(normalizeOrder).filter((order): order is Order => Boolean(order))
  } catch {
    return null
  }
}
