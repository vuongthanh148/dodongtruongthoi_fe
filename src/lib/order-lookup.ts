// Client-side masking helpers for the order lookup flow.
// IMPORTANT: this is presentation-only masking. The API currently returns full
// order data (price, address, recipient name) from a phone number alone — see
// docs/BACKEND_TODO_order_lookup.md for the backend work required to enforce
// this for real. Do not treat this file as a security boundary.

export function maskOrderCode(id: string): string {
  if (id.length <= 6) return id
  return `${id.slice(0, 4)}•••${id.slice(-2)}`
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return phone
  return `${digits.slice(0, 4)} ••• ${digits.slice(-3)}`
}

export function maskName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return name
  return parts.map((word, i) => (i === parts.length - 1 ? word : `${word[0]}.`)).join(' ')
}

// Keeps only the last segment (city/province) and redacts the rest, e.g.
// "12 ngõ 34 Láng Hạ, Đống Đa, Hà Nội" -> "•• Láng Hạ, Đống Đa, Hà Nội"
export function maskAddress(address: string): string {
  const segments = address.split(',').map((s) => s.trim())
  if (segments.length === 0) return address
  const [first, ...rest] = segments
  const words = first.split(/\s+/)
  const maskedFirst = words.length > 2 ? `•• ${words.slice(-2).join(' ')}` : first
  return [maskedFirst, ...rest].join(', ')
}
