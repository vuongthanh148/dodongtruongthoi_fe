import type { Order, OrderStatus } from '@/lib/types'

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/v1`

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

  return {
    id: data.id,
    phone: data.phone,
    status: toStatus(typeof data.status === 'string' ? data.status : undefined),
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
    items: Array.isArray(data.items) ? (data.items as Order['items']) : [],
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
