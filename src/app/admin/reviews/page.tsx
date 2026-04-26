'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { adminDelete, adminGet, adminPut } from '@/lib/admin-api'
import type { AdminReview } from '@/lib/types'

type FilterMode = 'all' | 'pending' | 'approved'

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [rows, setRows] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [filter])

  async function loadReviews() {
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
  }

  async function handleApprove(id: string, isApproved: boolean) {
    const saved = await adminPut<AdminReview>(`/reviews/${id}`, { isApproved })
    if (saved) {
      toast.success(isApproved ? 'Review approved' : 'Review disapproved')
      await loadReviews()
    } else {
      toast.error('Failed to update review')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this review?')) {
      return
    }
    const ok = await adminDelete(`/reviews/${id}`)
    if (ok) {
      toast.success('Review deleted')
      await loadReviews()
    } else {
      toast.error('Failed to delete review')
    }
  }

  return (
    <AdminGuard>
      <AdminLayout title="Reviews" subtitle="Moderate customer product reviews before they appear on the storefront">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterButton>
          <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')}>
            Pending
          </FilterButton>
          <FilterButton active={filter === 'approved'} onClick={() => setFilter('approved')}>
            Approved
          </FilterButton>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 24, color: '#6b7280', fontSize: 14 }}>Loading reviews...</div>
          ) : rows.length === 0 ? (
            <div style={{ padding: 24, color: '#6b7280', fontSize: 14 }}>No reviews found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={th}>Reviewer</th>
                  <th style={th}>Product</th>
                  <th style={th}>Rating</th>
                  <th style={th}>Comment</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{row.reviewer_name}</td>
                    <td style={{ ...td, color: '#6b7280', fontSize: 12 }}>{row.product_id}</td>
                    <td style={td}>{renderStars(row.rating)}</td>
                    <td style={{ ...td, maxWidth: 280 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {row.body ?? <em style={{ color: '#9ca3af' }}>No comment</em>}
                      </span>
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          fontSize: 12,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: row.is_approved ? '#dcfce7' : '#fef3c7',
                          color: row.is_approved ? '#166534' : '#92400e',
                        }}
                      >
                        {row.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ ...td, fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {row.created_at.slice(0, 10)}
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {row.is_approved ? (
                          <button type="button" onClick={() => handleApprove(row.id, false)} style={actionBtn}>
                            Reject
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleApprove(row.id, true)} style={{ ...actionBtn, color: '#166534' }}>
                            Approve
                          </button>
                        )}
                        <button type="button" onClick={() => handleDelete(row.id)} style={actionBtn}>
                          Delete
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
    <span style={{ color: '#d97706', fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#374151' }
const td: React.CSSProperties = { padding: '10px 12px', borderTop: '1px solid #f3f4f6', fontSize: 14, verticalAlign: 'top' }
const actionBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: '#7f1d1d', cursor: 'pointer', padding: 0, fontSize: 14 }
