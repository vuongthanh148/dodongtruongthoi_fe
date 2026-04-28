export function formatVnd(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0
  return `${safeValue.toLocaleString('vi-VN')}đ`
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length !== 10) {
    return phone
  }
  return `${clean.slice(0, 4)}.${clean.slice(4, 7)}.${clean.slice(7)}`
}
