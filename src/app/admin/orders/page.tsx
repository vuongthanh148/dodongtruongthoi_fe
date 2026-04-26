'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminGet, adminPut } from '@/lib/admin-api'
import { formatPhone, formatVnd } from '@/lib/format'
import type { AdminOrder } from '@/lib/types'

const statuses = ['pending_confirm', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'] as const

const statusLabels: Record<(typeof statuses)[number], string> = {
  pending_confirm: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const statusConfig: Record<
  (typeof statuses)[number],
  { label: string; bg: string; color: string }
> = {
  pending_confirm: { label: 'Chờ xác nhận', bg: '#fef3c7', color: '#92400e' },
  confirmed: { label: 'Đã xác nhận', bg: '#dbeafe', color: '#1e40af' },
  processing: { label: 'Đang xử lý', bg: '#e0e7ff', color: '#3730a3' },
  shipped: { label: 'Đang giao', bg: '#ede9fe', color: '#5b21b6' },
  completed: { label: 'Hoàn thành', bg: '#dcfce7', color: '#166534' },
  cancelled: { label: 'Đã hủy', bg: '#f3f4f6', color: '#6b7280' },
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<(typeof statuses)[number] | ''>('')
  const [rows, setRows] = useState<AdminOrder[]>([])
  const [drafts, setDrafts] = useState<
    Record<string, { status: (typeof statuses)[number]; adminNote: string }>
  >({})
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const path = filter ? `/orders?status=${encodeURIComponent(filter)}` : '/orders'
      const data = await adminGet<AdminOrder[]>(path)
      const orders = Array.isArray(data) ? data : []
      setRows(orders)
      setDrafts(() => {
        const next: Record<string, { status: (typeof statuses)[number]; adminNote: string }> = {}
        for (const order of orders) {
          next[order.id] = { status: order.status, adminNote: order.admin_note ?? '' }
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    queueMicrotask(async () => {
      await loadOrders()
    })
  }, [loadOrders])

  async function updateOrder(id: string) {
    const draft = drafts[id]
    if (!draft) {
      return
    }

    const saved = await adminPut<AdminOrder>(`/orders/${id}/status`, { status: draft.status, adminNote: draft.adminNote })
    if (saved) {
      toast.success('Cập nhật đơn hàng thành công')
      await loadOrders()
    } else {
      toast.error('Không thể cập nhật đơn hàng')
    }
  }

  function hasChanges(row: AdminOrder): boolean {
    const draft = drafts[row.id]
    if (!draft) {
      return false
    }
    return draft.status !== row.status || draft.adminNote !== (row.admin_note ?? '')
  }

  async function copyPhone(phone: string) {
    try {
      await navigator.clipboard.writeText(phone)
      toast.success('Đã sao chép!')
    } catch {
      toast.error('Không thể sao chép số điện thoại')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Orders" subtitle="View and update order lifecycle status" mobileHideSidebar>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <FilterButton active={filter === ''} onClick={() => setFilter('')}>
              Tất cả
            </FilterButton>
            {statuses.map((status) => (
              <FilterButton key={status} active={filter === status} onClick={() => setFilter(status)}>
                {statusLabels[status]}
              </FilterButton>
            ))}
          </div>

          {loading ? (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, textAlign: 'center', color: '#6b7280' }}>
              Đang tải đơn hàng...
            </div>
          ) : rows.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, textAlign: 'center', color: '#6b7280' }}>
              Không tìm thấy đơn hàng.
            </div>
          ) : (
            rows.map((row) => (
              <article key={row.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                <div style={{ marginBottom: 12, display: 'grid', gap: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <strong style={{ fontSize: 14, color: '#111827' }}>
                      {row.customer_name?.trim() || 'Khách lẻ'}
                    </strong>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        background: statusConfig[row.status].bg,
                        color: statusConfig[row.status].color,
                        borderRadius: 999,
                        padding: '4px 10px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusConfig[row.status].label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#374151' }}>{formatPhone(row.phone)}</span>
                    <button
                      type="button"
                      onClick={() => copyPhone(row.phone)}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        padding: '2px 7px',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#374151',
                      }}
                      aria-label="Sao chép số điện thoại"
                    >
                      📋
                    </button>
                  </div>

                  {row.note?.trim() ? (
                    <div style={{ fontSize: 12, color: '#4b5563' }}>📝 Ghi chú KH: {row.note}</div>
                  ) : null}

                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {row.created_at ? new Date(row.created_at).toLocaleString('vi-VN') : 'N/A'} ·{' '}
                    <span style={{ fontWeight: 600, color: '#7f1d1d' }}>{formatVnd(row.total_amount)}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    borderTop: '1px solid #f3f4f6',
                    borderBottom: '1px solid #f3f4f6',
                    padding: '10px 0',
                    marginBottom: 10,
                  }}
                >
                  {(row.items ?? []).map((item, index) => {
                    const variantParts = [item.sizeLabel, item.bgToneLabel, item.frameLabel].filter(
                      Boolean
                    ) as string[]
                    const variantLine = variantParts.length > 0 ? `${variantParts.join(' · ')}  x${item.quantity}` : `x${item.quantity}`

                    return (
                      <div key={`${item.productId}-${index}`} style={{ display: 'grid', gap: 2 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: 12,
                          }}
                        >
                          <span style={{ fontSize: 13, color: '#111827' }}>{item.productTitle}</span>
                          <span style={{ fontSize: 13, color: '#7f1d1d', fontWeight: 600 }}>
                            {formatVnd(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{variantLine}</div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  <select
                    value={drafts[row.id]?.status ?? row.status}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [row.id]: {
                          status: event.target.value as (typeof statuses)[number],
                          adminNote: prev[row.id]?.adminNote ?? row.admin_note ?? '',
                        },
                      }))
                    }
                    style={inputStyle}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={drafts[row.id]?.adminNote ?? row.admin_note ?? ''}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [row.id]: {
                          status: prev[row.id]?.status ?? row.status,
                          adminNote: event.target.value,
                        },
                      }))
                    }
                    placeholder="Ghi chú nội bộ..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />

                  {hasChanges(row) ? (
                    <button type="button" onClick={() => updateOrder(row.id)} style={primaryBtn}>
                      Cập nhật ▶
                    </button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: '1px solid',
        borderColor: active ? '#7f1d1d' : '#d1d5db',
        background: active ? '#7f1d1d' : 'white',
        color: active ? 'white' : '#374151',
        borderRadius: 999,
        padding: '7px 12px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

const inputStyle: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 12px', fontSize: 14, width: '100%' }
const primaryBtn: React.CSSProperties = {
  border: 'none',
  background: '#7f1d1d',
  color: 'white',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
  width: '100%',
}
