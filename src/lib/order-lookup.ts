// Helpers for the order lookup flow.
// Verification is enforced by the server: the lookup code is issued once at create time,
// POST /orders/verify issues a token bound to one order, and GET /orders/{id} requires it
// (X-Order-Token). Nothing in this file is a security boundary; it only formats display
// values and keeps the per-session token convenience for the order detail page.

export const LOOKUP_CODE_LENGTH = 6

export function maskOrderCode(id: string): string {
  if (id.length <= 6) return id
  return `${id.slice(0, 4)}•••${id.slice(-2)}`
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return phone
  return `${digits.slice(0, 4)} ••• ${digits.slice(-3)}`
}

export type StoredOrderToken = { token: string; expiresAt: number }

const TOKEN_KEY_PREFIX = 'ddtt_order_token_'

// In-session convenience only: the server still enforces the token. Every storage
// access is guarded so blocked or private storage never breaks the page.
export function readStoredOrderToken(orderId: string): StoredOrderToken | null {
  try {
    const key = TOKEN_KEY_PREFIX + orderId
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredOrderToken>
    if (typeof parsed.token !== 'string' || typeof parsed.expiresAt !== 'number') {
      window.sessionStorage.removeItem(key)
      return null
    }
    if (parsed.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(key)
      return null
    }
    return { token: parsed.token, expiresAt: parsed.expiresAt }
  } catch {
    return null
  }
}

export function writeStoredOrderToken(orderId: string, value: StoredOrderToken): void {
  try {
    window.sessionStorage.setItem(TOKEN_KEY_PREFIX + orderId, JSON.stringify(value))
  } catch {
    // storage unavailable; the page still works for this view
  }
}

export function clearStoredOrderToken(orderId: string): void {
  try {
    window.sessionStorage.removeItem(TOKEN_KEY_PREFIX + orderId)
  } catch {
    // storage unavailable
  }
}
