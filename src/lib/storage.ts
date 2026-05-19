import type { CartItem, Order, SavedProductVariant } from '@/lib/types'

const SAVED_KEY = 'ddtt_saved'
const CART_KEY = 'ddtt_cart'
const LOCAL_ORDERS_KEY = 'ddtt_orders'
export const RECENTLY_VIEWED_KEY = 'ddtt_recently_viewed'

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getSavedProducts(): SavedProductVariant[] {
  return readJson<SavedProductVariant[]>(SAVED_KEY, [])
}

export function getSavedProductIds(): string[] {
  return getSavedProducts().map((p) => p.productId)
}

export function toggleSavedProduct(productId: string, attrs?: Record<string, string>, sizeId?: string): SavedProductVariant[] {
  const current = getSavedProducts()
  const index = current.findIndex((p) => p.productId === productId)

  if (index >= 0) {
    const next = current.filter((_, i) => i !== index)
    writeJson(SAVED_KEY, next)
    return next
  } else {
    const next = [{ productId, attrs, sizeId: sizeId || undefined }, ...current]
    writeJson(SAVED_KEY, next)
    return next
  }
}

export function setSavedProducts(variants: SavedProductVariant[]): void {
  writeJson(SAVED_KEY, variants)
}

export function getCartItems(): CartItem[] {
  return readJson<CartItem[]>(CART_KEY, [])
}

export function setCartItems(items: CartItem[]): void {
  writeJson(CART_KEY, items)
}

function attrsMatch(a?: Record<string, string>, b?: Record<string, string>): boolean {
  const aKeys = Object.keys(a || {}).sort()
  const bKeys = Object.keys(b || {}).sort()
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every((k) => (a || {})[k] === (b || {})[k])
}

export function upsertCartItem(item: CartItem): CartItem[] {
  const items = getCartItems()
  const index = items.findIndex(
    (entry) =>
      entry.productId === item.productId &&
      entry.sizeId === item.sizeId &&
      attrsMatch(entry.selectedAttrs, item.selectedAttrs)
  )

  if (index >= 0) {
    const existing = items[index]
    items[index] = { ...existing, quantity: existing.quantity + item.quantity }
  } else {
    items.push(item)
  }

  setCartItems(items)
  return items
}

export function removeCartItem(index: number): CartItem[] {
  const next = getCartItems().filter((_, itemIndex) => itemIndex !== index)
  setCartItems(next)
  return next
}

export function clearCart(): void {
  setCartItems([])
}

export function getLocalOrders(): Order[] {
  return readJson<Order[]>(LOCAL_ORDERS_KEY, [])
}

export function saveLocalOrder(order: Order): Order[] {
  const current = getLocalOrders()
  const next = [order, ...current]
  writeJson(LOCAL_ORDERS_KEY, next)
  return next
}

export function addRecentlyViewed(productId: string): void {
  const current = readJson<string[]>(RECENTLY_VIEWED_KEY, [])
  const filtered = current.filter((id) => id !== productId)
  const next = [productId, ...filtered].slice(0, 10)
  writeJson(RECENTLY_VIEWED_KEY, next)
}

export function getRecentlyViewedIds(): string[] {
  return readJson<string[]>(RECENTLY_VIEWED_KEY, [])
}
