'use client'

import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { adminDelete, adminGet, adminPut } from '@/lib/admin-api'
import type { AdminReview } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type FilterMode = 'all' | 'pending' | 'approved'

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [rows, setRows] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    try {
      const path =
        filter === 'pending'
          ? '/reviews?approved=false'
          : filter === 'approved'
            ? '/reviews?approved=true'
            : '/reviews'
      const data = await adminGet<AdminReview[]>(path)
      setRows(data ?? [])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    (async () => {
      await loadReviews()
    })()
  }, [loadReviews])

  async function handleApprove(id: string, isApproved: boolean) {
    const saved = await adminPut<AdminReview>(`/reviews/${id}`, { is_approved: isApproved })
    if (saved) {
      toast.success(isApproved ? 'Đã phê duyệt đánh giá' : 'Đã từ chối đánh giá')
      await loadReviews()
    } else {
      toast.error('Không thể cập nhật đánh giá')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Xóa đánh giá này?')) {
      return
    }
    const ok = await adminDelete(`/reviews/${id}`)
    if (ok) {
      toast.success('Đã xóa đánh giá')
      await loadReviews()
    } else {
      toast.error('Không thể xóa đánh giá')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout
        title="Đánh giá"
        subtitle="Kiểm duyệt các đánh giá sản phẩm của khách hàng trước khi chúng xuất hiện trên storefront"
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            Tất cả
          </FilterButton>
          <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')}>
            Chờ duyệt
          </FilterButton>
          <FilterButton active={filter === 'approved'} onClick={() => setFilter('approved')}>
            Đã phê duyệt
          </FilterButton>
        </div>

        <div
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: 24, color: 'var(--admin-muted)', fontSize: 14 }}>Đang tải đánh giá...</div>
          ) : rows.length === 0 ? (
            <div style={{ padding: 24, color: 'var(--admin-muted)', fontSize: 14 }}>Không tìm thấy đánh giá.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--admin-border-soft)' }}>
                  <th style={th}>Người dùng</th>
                  <th style={th}>Sản phẩm</th>
                  <th style={th}>Xếp hạng</th>
                  <th style={th}>Bình luận</th>
                  <th style={th}>Trạng thái</th>
                  <th style={th}>Ngày</th>
                  <th style={th}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{row.reviewer_name}</td>
                    <td style={{ ...td, color: 'var(--admin-muted)', fontSize: 12 }}>{row.product_id}</td>
                    <td style={td}>{renderStars(row.rating)}</td>
                    <td style={{ ...td, maxWidth: 280 }}>
                      <span
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {row.body ?? <em style={{ color: 'var(--admin-muted)' }}>Không có bình luận</em>}
                      </span>
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          fontSize: 12,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: row.is_approved ? 'var(--admin-ok-bg)' : 'var(--admin-warn-bg)',
                          color: row.is_approved ? 'var(--admin-ok)' : 'var(--admin-warn)',
                        }}
                      >
                        {row.is_approved ? 'Đã phê duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td style={{ ...td, fontSize: 12, color: 'var(--admin-muted)', whiteSpace: 'nowrap' }}>
                      {row.created_at.slice(0, 10)}
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {row.is_approved ? (
                          <button
                            type="button"
                            onClick={() => handleApprove(row.id, false)}
                            style={actionBtn}
                          >
                            Từ chối
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApprove(row.id, true)}
                            style={{ ...actionBtn, color: 'var(--admin-ok)' }}
                          >
                            Phê duyệt
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          style={actionBtn}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
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
        borderColor: active ? 'var(--admin-primary)' : 'var(--admin-border)',
        background: active ? 'var(--admin-primary)' : 'var(--admin-surface)',
        color: active ? 'white' : 'var(--admin-ink-2)',
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

function renderStars(rating: number) {
  return (
    <span style={{ color: 'var(--color-warning)', fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 12,
  color: 'var(--admin-ink-2)',
}
const td: React.CSSProperties = {
  padding: '10px 12px',
  borderTop: '1px solid var(--admin-border-soft)',
  fontSize: 14,
  verticalAlign: 'top',
}
const actionBtn: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--admin-primary)',
  cursor: 'pointer',
  padding: 0,
  fontSize: 14,
}
