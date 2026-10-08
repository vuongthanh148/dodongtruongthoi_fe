import { adminGet, adminPutResult } from '@/lib/admin-api'
import { ADMIN_COPY } from '@/lib/content-data'
import type { AdminOrder, AdminOrderItem, OrderStatus } from '@/lib/types'

export const ORDER_STATUSES: OrderStatus[] = [
  'pending_confirm',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'cancelled',
]

// Forward path of the order lifecycle. The detail page offers only the next step.
export const ORDER_FLOW: OrderStatus[] = ['pending_confirm', 'confirmed', 'processing', 'shipped', 'completed']

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending_confirm: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'completed',
}

export const CANCELLABLE_STATUSES: OrderStatus[] = ['pending_confirm', 'confirmed']

export const ORDER_PAGE_SIZE = 20

// Badge colours come from the --admin-* tokens (same mapping as the CMS board).
export const ORDER_STATUS_TONE: Record<OrderStatus, { bg: string; fg: string }> = {
  pending_confirm: { bg: 'var(--admin-warn-bg)', fg: 'var(--admin-warn)' },
  confirmed: { bg: 'var(--admin-info-bg)', fg: 'var(--admin-info)' },
  processing: { bg: 'var(--admin-indigo-bg)', fg: 'var(--admin-indigo)' },
  shipped: { bg: 'var(--admin-violet-bg)', fg: 'var(--admin-violet)' },
  completed: { bg: 'var(--admin-ok-bg)', fg: 'var(--admin-ok)' },
  cancelled: { bg: 'var(--admin-neutral-bg)', fg: 'var(--admin-muted)' },
}

export function orderStatusLabel(status: OrderStatus): string {
  return ADMIN_COPY.orderStatus[status] ?? status
}

// Board shows "DH-2026-0151"; real ids are UUIDs, so the code is DH- plus the first 8 hex digits.
export function shortOrderCode(id: string): string {
  return `DH-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

export function orderDateLabel(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Local calendar day as YYYY-MM-DD, comparable with <input type="date"> values.
export function localDayKey(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function variantText(item: AdminOrderItem): string {
  return [item.size_label, ...Object.values(item.selected_attrs ?? {})].filter(Boolean).join(' · ')
}

export function firstItemTitle(items: AdminOrderItem[]): string {
  const first = items[0]
  return first ? first.product_title || 'Sản phẩm' : '—'
}

export function itemsSummary(items: AdminOrderItem[]): string {
  return items
    .map((item) => {
      const variant = variantText(item)
      return `${item.product_title || 'Sản phẩm'}${variant ? ` (${variant})` : ''} x${Number(item.quantity) || 0}`
    })
    .join('; ')
}

export function customerLabel(order: AdminOrder): string {
  return order.customer_name?.trim() || ADMIN_COPY.orders.customerFallback
}

// Legacy fallback: orders placed before the payment_method column was added encoded it as
// "Thanh toán: <hình thức> — <ghi chú khách>" in the note field. Prefer orderPaymentLabel() below.
export function parseOrderNote(note: string | null): { payment: string | null; customerNote: string } {
  const text = note?.trim() ?? ''
  const match = /^Thanh toán:\s*([^—]+?)\s*(?:—\s*([\s\S]*))?$/.exec(text)
  if (!match) return { payment: null, customerNote: text }
  return { payment: match[1].trim(), customerNote: (match[2] ?? '').trim() }
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Thanh toán khi nhận (COD)',
  transfer: 'Chuyển khoản',
  showroom: 'Tại showroom',
}

export function orderPaymentLabel(order: AdminOrder): string | null {
  if (order.payment_method) return PAYMENT_METHOD_LABELS[order.payment_method] ?? order.payment_method
  return parseOrderNote(order.note).payment
}

export function orderCustomerNote(order: AdminOrder): string {
  return order.payment_method ? (order.note ?? '').trim() : parseOrderNote(order.note).customerNote
}

export function matchesOrderSearch(order: AdminOrder, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const digits = q.replace(/\D/g, '')
  if (shortOrderCode(order.id).toLowerCase().includes(q) || order.id.toLowerCase().includes(q)) return true
  if (customerLabel(order).toLowerCase().includes(q)) return true
  return digits.length > 0 && order.phone.replace(/\D/g, '').includes(digits)
}

export interface OrderFilters {
  status: OrderStatus | ''
  from: string
  to: string
  query: string
}

// Newest first. Dates are inclusive, in the browser's local calendar.
export function filterOrders(orders: AdminOrder[], filters: OrderFilters): AdminOrder[] {
  return orders
    .filter((order) => {
      if (filters.status && order.status !== filters.status) return false
      const day = localDayKey(order.created_at)
      if (filters.from && day < filters.from) return false
      if (filters.to && day > filters.to) return false
      return matchesOrderSearch(order, filters.query)
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function countByStatus(orders: AdminOrder[]): Record<OrderStatus, number> {
  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>
  for (const order of orders) {
    if (order.status in counts) counts[order.status] += 1
  }
  return counts
}

function csvCell(value: string | number): string {
  let text = String(value)
  // Guard against spreadsheet formula injection from customer-entered text.
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function buildOrdersCsv(rows: AdminOrder[]): string {
  const header = [
    ADMIN_COPY.orders.columns.code,
    ADMIN_COPY.orders.columns.date,
    ADMIN_COPY.orders.columns.customer,
    ADMIN_COPY.orders.columns.phone,
    'Địa chỉ',
    ADMIN_COPY.orders.columns.items,
    `${ADMIN_COPY.orders.columns.total} (đ)`,
    ADMIN_COPY.orders.columns.status,
  ]
  const lines = rows.map((order) =>
    [
      shortOrderCode(order.id),
      orderDateLabel(order.created_at),
      customerLabel(order),
      order.phone,
      order.address ?? '',
      itemsSummary(order.items ?? []),
      order.total_amount,
      orderStatusLabel(order.status),
    ]
      .map(csvCell)
      .join(',')
  )
  // BOM so Excel reads Vietnamese diacritics correctly.
  return `\uFEFF${[header.map(csvCell).join(','), ...lines].join('\r\n')}\r\n`
}

export function csvFileName(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `orders-${y}${m}${d}.csv`
}

export function downloadTextFile(content: string, filename: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function fetchOrders(): Promise<AdminOrder[] | null> {
  const data = await adminGet<AdminOrder[]>('/orders')
  return Array.isArray(data) ? data : null
}

export async function fetchOrder(id: string): Promise<AdminOrder | null> {
  const data = await adminGet<AdminOrder>(`/orders/${id}`)
  return data && typeof data === 'object' && 'id' in data ? data : null
}

// The backend overwrites admin_note on every status write, so callers must always send the note they want kept.
export function saveOrderStatus(id: string, status: OrderStatus, adminNote: string) {
  return adminPutResult<AdminOrder>(`/orders/${id}/status`, { status, adminNote })
}

export function lineTotal(item: AdminOrderItem): number {
  return (Number(item.unit_price) || 0) * (Number(item.quantity) || 0)
}
