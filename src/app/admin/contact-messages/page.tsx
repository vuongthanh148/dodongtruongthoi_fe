'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { adminGet, adminPut } from '@/lib/admin-api'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type ContactMessage = {
  id: string
  name: string
  phone: string
  message: string
  handled: boolean
  created_at: string
}

type FilterMode = 'all' | 'unhandled' | 'handled'

const FILTER_PATHS: Record<FilterMode, string> = {
  all: '/contact-messages',
  unhandled: '/contact-messages?handled=false',
  handled: '/contact-messages?handled=true',
}

export default function AdminContactMessagesPage() {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [rows, setRows] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGet<ContactMessage[]>(FILTER_PATHS[filter])
      setRows(data ?? [])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    (async () => {
      await loadMessages()
    })()
  }, [loadMessages])

  async function handleToggle(row: ContactMessage) {
    setBusyId(row.id)
    const saved = await adminPut<ContactMessage>(`/contact-messages/${row.id}`, {
      handled: !row.handled,
    })
    setBusyId(null)
    if (saved === null) {
      toast.error('Không cập nhật được trạng thái tin nhắn.')
      return
    }
    toast.success(row.handled ? 'Đã chuyển về chưa xử lý' : 'Đã đánh dấu đã xử lý')
    await loadMessages()
  }

  return (
    <AdminGuard>
      <AdminLayout
        title="Tin nhắn liên hệ"
        subtitle="Tin nhắn gửi từ form Liên hệ trên website"
        mobileHideSidebar
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            Tất cả
          </FilterButton>
          <FilterButton active={filter === 'unhandled'} onClick={() => setFilter('unhandled')}>
            Chưa xử lý
          </FilterButton>
          <FilterButton active={filter === 'handled'} onClick={() => setFilter('handled')}>
            Đã xử lý
          </FilterButton>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {loading ? (
            <div style={panelStyle}>
              <div style={{ color: '#6b7280', fontSize: 14 }}>Đang tải...</div>
            </div>
          ) : rows.length === 0 ? (
            <div style={panelStyle}>
              <div style={{ color: '#6b7280', fontSize: 14 }}>Chưa có tin nhắn nào.</div>
            </div>
          ) : (
            rows.map((row) => (
              <article
                key={row.id}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 14,
                  display: 'grid',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0, display: 'grid', gap: 2 }}>
                    <strong style={{ fontSize: 15, color: '#111827', overflowWrap: 'anywhere' }}>{row.name}</strong>
                    <span style={{ fontSize: 14, color: '#374151', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>
                      {row.phone}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: row.handled ? '#dcfce7' : '#fef3c7',
                      color: row.handled ? '#166534' : '#92400e',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.handled ? 'Đã xử lý' : 'Chưa xử lý'}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                  {row.message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{formatDateTime(row.created_at)}</span>
                  <button
                    type="button"
                    onClick={() => handleToggle(row)}
                    disabled={busyId === row.id}
                    style={{
                      border: '1px solid',
                      borderColor: row.handled ? '#d1d5db' : '#7f1d1d',
                      background: row.handled ? 'white' : '#7f1d1d',
                      color: row.handled ? '#374151' : 'white',
                      borderRadius: 6,
                      padding: '7px 12px',
                      fontSize: 13,
                      cursor: busyId === row.id ? 'not-allowed' : 'pointer',
                      opacity: busyId === row.id ? 0.6 : 1,
                    }}
                  >
                    {row.handled ? 'Hoàn tác' : 'Đánh dấu đã xử lý'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
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
        padding: '7px 14px',
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      {children}
    </button>
  )
}

const panelStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 24,
}
