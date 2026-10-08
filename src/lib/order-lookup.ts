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

// Verified detail only. The board masks house-number tokens in the first comma segment and keeps
// the street, ward, district and city: "12 ngõ 34 Láng Hạ, Đống Đa, Hà Nội" → "•• ngõ •• Láng Hạ, Đống Đa, Hà Nội".
export function maskAddress(address: string): string {
  const [first, ...rest] = address.split(',')
  const maskedFirst = first
    .split(/\s+/)
    .map((word) => (/\d/.test(word) ? '••' : word))
    .join(' ')
  return [maskedFirst, ...rest].join(',')
}

// Recipient name on the verified detail: "Nguyễn Văn An" → "N. V. An" (board rule).
export function maskName(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0] ? `${words[0][0]}.` : ''
  return words.map((w, i) => (i === words.length - 1 ? w : `${w[0]}.`)).join(' ')
}

// Lock is server-issued (429 locked_until). We keep that timestamp for this tab's session only, so a
// reload keeps showing the lock; the server still decides on the next attempt.
const LOCK_KEY_PREFIX = 'ddtt_lookup_lock_'

export function readStoredLock(phone: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(LOCK_KEY_PREFIX + phone)
    const until = raw ? Number(raw) : NaN
    if (!Number.isFinite(until) || until <= Date.now()) {
      window.sessionStorage.removeItem(LOCK_KEY_PREFIX + phone)
      return null
    }
    return until
  } catch {
    return null
  }
}

export function writeStoredLock(phone: string, lockedUntil: number): void {
  try {
    window.sessionStorage.setItem(LOCK_KEY_PREFIX + phone, String(lockedUntil))
  } catch {
    // storage unavailable; the server lock still applies
  }
}

export function clearStoredLock(phone: string): void {
  try {
    window.sessionStorage.removeItem(LOCK_KEY_PREFIX + phone)
  } catch {
    // storage unavailable
  }
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
